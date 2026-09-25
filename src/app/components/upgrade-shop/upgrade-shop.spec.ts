import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpgradeShop } from './upgrade-shop';
import { GameService } from '../../services/game.service';
import { TourService } from '../../services/tour.service';
import { signal } from '@angular/core';
import { UPGRADES } from '../../data/upgrades.data';

describe('UpgradeShop', () => {
  let component: UpgradeShop;
  let fixture: ComponentFixture<UpgradeShop>;
  let mockGameService: any;
  let mockTourService: any;

  beforeEach(async () => {
    mockGameService = {
      state: signal({
        reputation: 100,
        upgrades: {
          'test_1': { level: 2, cost: 50 }
        }
      }),
      buyUpgrade: jasmine.createSpy('buyUpgrade'),
      getUpgradeCost: jasmine.createSpy('getUpgradeCost').and.callFake((id: string) =>
        mockGameService.state().upgrades[id]?.cost ?? UPGRADES.find(upgrade => upgrade.id === id)?.baseCost ?? 0
      )
    };

    mockTourService = {
      hasSeenTour: jasmine.createSpy('hasSeenTour').and.returnValue(true),
      startShipTour: jasmine.createSpy('startShipTour')
    };

    await TestBed.configureTestingModule({
      imports: [UpgradeShop],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: TourService, useValue: mockTourService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeShop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.buyUpgrade when buy is executed', () => {
    const upgradeId = 'speed_1';
    component.buy(upgradeId);
    expect(mockGameService.buyUpgrade).toHaveBeenCalledWith(upgradeId);
  });

  it('should return true if player can afford the cost', () => {
    expect(component.canAfford(50)).toBeTrue();
    expect(component.canAfford(150)).toBeFalse();
  });

  it('should get upgrade state from game state if it exists', () => {
    const state = component.getUpgradeState('test_1');
    expect(state.level).toBe(2);
    expect(state.cost).toBe(50);
  });

  it('should return base cost for an upgrade not yet purchased', () => {
    const firstUpgrade = component.clickIdleUpgrades[0];
    const state = component.getUpgradeState(firstUpgrade.id);
    expect(state.level).toBe(0);
    expect(state.cost).toBe(firstUpgrade.baseCost);
  });

  it('should default to upgrades tab', () => {
    expect(component.activeTab()).toBe('upgrades');
  });

  it('should switch to ship tab', () => {
    component.setTab('ship');
    expect(component.activeTab()).toBe('ship');
  });

  it('should not unlock ships below threshold', () => {
    expect(component.shipsUnlocked).toBeFalse();
  });

  it('should unlock ships above threshold', () => {
    mockGameService.state.update((s: any) => ({ ...s, reputation: 20000 }));
    expect(component.shipsUnlocked).toBeTrue();
  });

  it('falls back to its stored price if the service has no effective price', () => {
    mockGameService.getUpgradeCost.and.returnValue(undefined);
    expect(component.getUpgradeState('test_1')).toEqual({ level: 2, cost: 50 });
    expect(component.getUpgradeState('wax_coating')).toEqual({ level: 0, cost: 120 });
    expect(component.getUpgradeState('not-an-upgrade')).toEqual({ level: 0, cost: 0 });
  });

  it('defaults an unknown upgrade to level and cost zero', () => {
    expect(component.getUpgradeState('not-an-upgrade')).toEqual({ level: 0, cost: 0 });
  });

  it('triggers the ship tour once when reputation unlocks ships', fakeAsync(() => {
    mockTourService.hasSeenTour.and.returnValue(false);
    mockGameService.state.update((s: any) => ({ ...s, reputation: 20000 }));
    fixture.detectChanges();
    tick(300);
    expect(mockTourService.startShipTour).toHaveBeenCalledTimes(1);
    mockGameService.state.update((s: any) => ({ ...s, reputation: 25000 }));
    fixture.detectChanges();
    tick(300);
    expect(mockTourService.startShipTour).toHaveBeenCalledTimes(1);
  }));

  it('allows the first ship and requires the previous ship for later ships', () => {
    expect(component.isShipAvailable('ship_toy_boat')).toBeTrue();
    expect(component.isShipAvailable('ship_huckle_raft')).toBeFalse();
    mockGameService.state.update((s: any) => ({ ...s, upgrades: { ship_toy_boat: { level: 1, cost: Infinity } } }));
    expect(component.isShipAvailable('ship_huckle_raft')).toBeTrue();
  });
});
