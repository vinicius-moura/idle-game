import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { UPGRADES } from '../data/upgrades.data';
import { CREW_MEMBERS } from '../data/crew.data';

describe('GameService', () => {
  let service: GameService;
  let intervals: Record<number, Function> = {};

  const activateCrew = (...crewIds: string[]) => {
    const slots = crewIds.map(id => {
      const member = CREW_MEMBERS.find(candidate => candidate.id === id)!;
      return { slotType: member.slotType, crewMemberId: member.id };
    });
    service.state.update(state => ({ ...state, crew: { ...state.crew, slots } }));
  };

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

  it('should ignore unknown upgrades', () => {
    service.buyUpgrade('missing-upgrade');
    expect(service.state().reputation).toBe(0);
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
      currentShip: 'paper_boat',
      crew: { unlocked: [], slots: [] }
    };
    localStorage.setItem('paperPiratesSave', JSON.stringify(savedState));
    const freshService = new GameService();
    expect(freshService.state().reputation).toBe(1234);
  });

  it('should clear saves created with an older version', () => {
    localStorage.setItem('old-key', 'old-value');
    localStorage.setItem('paperPiratesSaveVersion', '1');
    new GameService();
    expect(localStorage.getItem('old-key')).toBeNull();
    expect(localStorage.getItem('paperPiratesSaveVersion')).toBe('2');
  });

  it('should recalculate click and idle stats from levels and prestige bonus', () => {
    const click = UPGRADES.find(upgrade => upgrade.type === 'click')!;
    const idle = UPGRADES.find(upgrade => upgrade.type === 'idle')!;
    service.state.update(state => ({
      ...state,
      prestige: { level: 2, permanentBonus: 1.5 },
      upgrades: { [click.id]: { level: 2, cost: 0 }, [idle.id]: { level: 3, cost: 0 } }
    }));
    service.recalculateStats();
    expect(service.state().clickPower).toBe((1 + click.effect! * 2) * 1.5);
    expect(service.state().reputationPerSecond).toBe(idle.effect! * 3 * 1.5);
  });

  it('should assign crew, move an assigned member, and remove them from a slot', () => {
    const ship = UPGRADES.find(upgrade => upgrade.id === 'ship_toy_boat')!;
    service.state.update(state => ({ ...state, reputation: ship.baseCost }));
    service.buyUpgrade(ship.id);
    expect(service.state().crew.slots).toEqual([{ slotType: 'captain', crewMemberId: null }]);
    service.assignCrew('luffy', 'captain');
    expect(service.state().crew.slots[0].crewMemberId).toBe('luffy');
    service.removeCrew('captain');
    expect(service.state().crew.slots[0].crewMemberId).toBeNull();
  });

  it('should preserve existing crew assignments when a ship adds slots', () => {
    service.state.update(state => ({ ...state, currentShip: 'toy_boat', reputation: 75000,
      crew: { ...state.crew, slots: [{ slotType: 'captain', crewMemberId: 'luffy' }] } }));
    service.buyUpgrade('ship_huckle_raft');
    expect(service.state().crew.slots).toEqual([
      { slotType: 'captain', crewMemberId: 'luffy' },
      { slotType: 'combatant', crewMemberId: null }
    ]);
  });

  it('should report all crew slots as locked before unlocking ships', () => {
    expect(service.lockedSlotTypes).toEqual(service.allSlotTypes);
    expect(service.allSlotTypes.length).toBe(10);
  });

  it('maximizes the account with every upgrade at level 100 and all crew equipped', () => {
    service.offlineGains.set(500);
    service.maximizeAccount();
    const state = service.state();

    expect(state.reputation).toBe(Number.MAX_SAFE_INTEGER);
    expect(state.currentShip).toBe('heart_of_gold');
    expect(Object.keys(state.upgrades)).toEqual(UPGRADES.map(upgrade => upgrade.id));
    expect(Object.values(state.upgrades).every(upgrade => upgrade.level === 100)).toBeTrue();
    expect(state.crew.unlocked).toEqual(CREW_MEMBERS.map(member => member.id));
    expect(state.crew.slots.map(slot => slot.crewMemberId)).toEqual(CREW_MEMBERS.map(member => member.id));
    expect(state.crew.slots).toHaveSize(10);
    expect(service.offlineGains()).toBeNull();
    expect(state.clickPower).toBeGreaterThan(1);
    expect(state.reputationPerSecond).toBeGreaterThan(0);
  });

  it('applies Luffy, Usopp, and Zoro buffs to click and passive income', () => {
    activateCrew('luffy', 'usopp', 'zoro');
    service.state.update(state => ({ ...state, reputationPerSecond: 100 }));
    spyOn(Math, 'random').and.returnValues(0.9, 0);

    expect(service.getClickPowerWithCrew()).toBeCloseTo(1.375);
    expect(service.getReputationPerSecondWithCrew()).toBeCloseTo(110);
    expect(service.click()).toBeCloseTo(1.375);
    expect(service.click()).toBeCloseTo(2.75);
    expect(service.state().reputation).toBeCloseTo(4.125);
  });

  it('applies Chopper offline gains and the Nami plus Jinbe synergy', () => {
    activateCrew('chopper');
    expect(service.getOfflineGainMultiplier()).toBeCloseTo(1.15);
    activateCrew('nami');
    expect(service.getOfflineGainMultiplier()).toBeCloseTo(1.25);
    activateCrew('jinbe');
    expect(service.getOfflineGainMultiplier()).toBe(1);
    activateCrew('nami', 'jinbe');
    expect(service.getOfflineGainMultiplier()).toBeCloseTo(1.375);
  });

  it('lets Brook strengthen other crew buffs and Robin increase prestige gains', () => {
    activateCrew('robin');
    expect(service.getPrestigeGainMultiplier()).toBeCloseTo(1.2);
    activateCrew('brook', 'robin', 'luffy');
    expect(service.getPrestigeGainMultiplier()).toBeCloseTo(1.24);
    expect(service.getReputationPerSecondWithCrew()).toBe(0);
    activateCrew('brook');
    expect(service.getPrestigeGainMultiplier()).toBe(1);
  });

  it('applies Sanji discount to the displayed and charged upgrade cost', () => {
    activateCrew('sanji');
    expect(service.getUpgradeCost('bigger_sails')).toBe(9);
    service.state.update(state => ({ ...state, reputation: 9 }));
    service.buyUpgrade('bigger_sails');
    expect(service.state().reputation).toBe(0);
    expect(service.getUpgradeCost('bigger_sails')).toBe(10);
    expect(service.getUpgradeCost('not-an-upgrade')).toBe(0);
  });

  it('ignores stale or incorrectly slotted crew assignments', () => {
    service.state.update(state => ({ ...state, crew: { ...state.crew, slots: [
      { slotType: 'captain', crewMemberId: null },
      { slotType: 'captain', crewMemberId: 'missing-member' },
      { slotType: 'combatant', crewMemberId: 'usopp' }
    ] } }));
    expect(service.getClickPowerWithCrew()).toBe(1);
  });

  it('defaults Jinbe synergy to zero if an older crew record has no buff data', () => {
    const jinbe = CREW_MEMBERS.find(member => member.id === 'jinbe')!;
    const originalBuffs = jinbe.buffs;
    jinbe.buffs = {};
    try {
      activateCrew('nami', 'jinbe');
      expect(service.getOfflineGainMultiplier()).toBeCloseTo(1.25);
    } finally {
      jinbe.buffs = originalBuffs;
    }
  });

  it('should move crew between slots and clear a crew member when reassigned to the same slot', () => {
    service.state.update(state => ({ ...state, crew: { ...state.crew, slots: [
      { slotType: 'captain', crewMemberId: 'luffy' },
      { slotType: 'combatant', crewMemberId: 'zoro' },
      { slotType: 'navigator', crewMemberId: null }
    ] } }));
    service.assignCrew('zoro', 'captain');
    expect(service.state().crew.slots.map(slot => slot.crewMemberId)).toEqual(['zoro', null, null]);
    service.assignCrew('zoro', 'captain');
    expect(service.state().crew.slots[0].crewMemberId).toBeNull();
    expect(service.lockedSlotTypes).toEqual(['sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman']);
  });

  it('should leave unrelated slots unchanged when removing crew', () => {
    service.state.update(state => ({ ...state, crew: { ...state.crew, slots: [
      { slotType: 'captain', crewMemberId: 'luffy' },
      { slotType: 'combatant', crewMemberId: 'zoro' }
    ] } }));
    service.removeCrew('captain');
    expect(service.state().crew.slots.map(slot => slot.crewMemberId)).toEqual([null, 'zoro']);
  });

  it('uses the current ship when a ship upgrade has no target and defaults missing effects to zero', () => {
    const fallbackShip = { id: 'test_ship_fallback', name: 'Test Ship', description: '', type: 'ship' as const, baseCost: 1 };
    const noEffectClick = { id: 'test_click_no_effect', name: 'Test Click', description: '', type: 'click' as const, baseCost: 1 };
    const noEffectIdle = { id: 'test_idle_no_effect', name: 'Test Idle', description: '', type: 'idle' as const, baseCost: 1 };
    UPGRADES.push(fallbackShip, noEffectClick, noEffectIdle);
    try {
      service.state.update(state => ({ ...state, reputation: 3, upgrades: {
        [noEffectClick.id]: { level: 1, cost: 0 },
        [noEffectIdle.id]: { level: 1, cost: 0 }
      } }));
      service.buyUpgrade(fallbackShip.id);
      expect(service.state().currentShip).toBe('paper_boat');
      service.recalculateStats();
      expect(service.state().clickPower).toBe(1);
      expect(service.state().reputationPerSecond).toBe(0);
    } finally {
      UPGRADES.splice(UPGRADES.indexOf(fallbackShip), 1);
      UPGRADES.splice(UPGRADES.indexOf(noEffectClick), 1);
      UPGRADES.splice(UPGRADES.indexOf(noEffectIdle), 1);
    }
  });

  it('should update ship and set cost to Infinity on ship upgrade', () => {
    const shipUpgrade = UPGRADES.find(u => u.type === 'ship');
    if (shipUpgrade) {
      service.state.update(s => ({ ...s, reputation: shipUpgrade.baseCost }));
      service.buyUpgrade(shipUpgrade.id);
      const upState = service.state().upgrades[shipUpgrade.id];
      expect(service.state().currentShip).toBe('toy_boat');
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
        currentShip: 'paper_boat',
        crew: { unlocked: [], slots: [] }
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

    it('applies active crew bonuses to reputation collected while away', () => {
      const idleUpgrade = UPGRADES.find(upgrade => upgrade.id === 'imaginary_friend')!;
      const crew = ['luffy', 'nami', 'jinbe', 'chopper', 'brook'].map(id => {
        const member = CREW_MEMBERS.find(candidate => candidate.id === id)!;
        return { slotType: member.slotType, crewMemberId: member.id };
      });
      const savedState = {
        reputation: 0,
        reputationPerSecond: 100,
        clickPower: 1,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: { [idleUpgrade.id]: { level: 100, cost: idleUpgrade.baseCost } },
        currentShip: 'heart_of_gold',
        crew: { unlocked: crew.map(slot => slot.crewMemberId), slots: crew }
      };
      localStorage.setItem('paperPiratesSaveVersion', '2');
      localStorage.setItem('paperPiratesSave', JSON.stringify(savedState));
      localStorage.setItem('paperPiratesLastSaveTime', (Date.now() - 20000).toString());

      const loadedService = new GameService();
      expect(loadedService.offlineGains()).toBeCloseTo(100 * 1.12 * 1.66 * 20, 0);
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

    it('should not calculate gains when there is no last save time or no passive income', () => {
      service['loadGame']();
      expect(service.offlineGains()).toBeNull();
      localStorage.setItem('paperPiratesLastSaveTime', (Date.now() - 20000).toString());
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
