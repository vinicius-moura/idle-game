import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { UPGRADES } from '../data/upgrades.data';

describe('GameService', () => {
  let service: GameService;
  let intervals: Record<number, Function> = {};

  beforeEach(() => {
    localStorage.clear();
    intervals = {};

    spyOn(window, 'setInterval').and.callFake((handler: any, timeout?: any): any => {
      if (typeof handler === 'function') {
        intervals[timeout] = handler;
      }
      return timeout;
    });

    TestBed.configureTestingModule({
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created with initial state', () => {
    expect(service).toBeTruthy();
    expect(service.state().reputation).toBe(0);
  });

  it('should increase reputation when click is called', () => {
    const initialPower = service.state().clickPower;
    service.click();
    expect(service.state().reputation).toBe(initialPower);
  });

  it('should increase reputation over time (passive income)', () => {
    service.state.update(s => ({ ...s, reputation: 0, reputationPerSecond: 100 }));
    if (intervals[100]) intervals[100]();
    expect(service.state().reputation).toBe(10);
  });

  it('should save game state to localStorage', () => {
    const spy = spyOn(localStorage, 'setItem');
    if (intervals[5000]) intervals[5000]();
    expect(spy).toHaveBeenCalledWith('paperPiratesSave', jasmine.any(String));
  });

  it('should not buy upgrade if reputation is insufficient', () => {
    const upgrade = UPGRADES[0];
    service.state.update(s => ({ ...s, reputation: 0 }));
    service.buyUpgrade(upgrade.id);
    expect(service.state().upgrades[upgrade.id]).toBeUndefined();
  });

  it('should buy upgrade and deduct reputation when balance is sufficient', () => {
    const upgrade = UPGRADES[0];
    service.state.update(s => ({ ...s, reputation: upgrade.baseCost }));
    service.buyUpgrade(upgrade.id);
    expect(service.state().upgrades[upgrade.id].level).toBe(1);
    expect(service.state().reputation).toBe(0);
  });

  it('should load game state from localStorage on initialization', () => {
    const savedState = {
      reputation: 1234,
      reputationPerSecond: 0,
      clickPower: 1,
      prestige: { level: 0, permanentBonus: 1 },
      upgrades: {},
      currentShip: 'paper_boat'
    };
    localStorage.setItem('paperPiratesSave', JSON.stringify(savedState));
    const freshService = new GameService();
    expect(freshService.state().reputation).toBe(1234);
  });

  it('should update ship and set cost to Infinity on ship upgrade', () => {
    const shipUpgrade = UPGRADES.find(u => u.type === 'ship');
    if (shipUpgrade) {
      service.state.update(s => ({ ...s, reputation: shipUpgrade.baseCost }));
      service.buyUpgrade(shipUpgrade.id);
      const upState = service.state().upgrades[shipUpgrade.id];
      expect(service.state().currentShip).toBe(shipUpgrade.targetShip!);
      expect(upState.cost).toBe(Infinity);
    }
  });

  describe('offline progress', () => {
    it('should calculate offline gains on load', () => {
      const secondsOffline = 60;

      const idleUpgrade = UPGRADES.find(u => u.type === 'idle')!;
      const savedState = {
        reputation: 0,
        reputationPerSecond: 0,
        clickPower: 1,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: { [idleUpgrade.id]: { level: 1, cost: idleUpgrade.baseCost } },
        currentShip: 'paper_boat'
      };

      localStorage.setItem(
        'paperPiratesLastSaveTime',
        (Date.now() - secondsOffline * 1000).toString()
      );
      localStorage.setItem('paperPiratesSave', JSON.stringify(savedState));

      const freshService = new GameService();
      const expectedGains = (idleUpgrade.effect || 0) * secondsOffline;

      expect(freshService.offlineGains()).toBeCloseTo(expectedGains, 0);
    });

    it('should cap offline gains at 8 hours', () => {
      const rps = 10;
      const hoursOffline = 24;
      localStorage.setItem(
        'paperPiratesLastSaveTime',
        (Date.now() - hoursOffline * 3600 * 1000).toString()
      );
      localStorage.setItem(
        'paperPiratesSave',
        JSON.stringify({ ...service.state(), reputationPerSecond: rps })
      );

      service['loadGame']();

      expect(service.offlineGains()).toBeLessThanOrEqual(rps * 8 * 3600);
    });

    it('should not set offlineGains if offline less than 10 seconds', () => {
      localStorage.setItem(
        'paperPiratesLastSaveTime',
        (Date.now() - 5000).toString()
      );
      service['loadGame']();
      expect(service.offlineGains()).toBeNull();
    });

    it('should dismiss offline gains', () => {
      service.offlineGains.set(500);
      service.dismissOfflineGains();
      expect(service.offlineGains()).toBeNull();
    });
  });
});