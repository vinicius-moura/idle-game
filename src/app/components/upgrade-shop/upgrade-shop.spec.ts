import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeShop } from './upgrade-shop';
import { GameService } from '../../services/game.service';
import { signal } from '@angular/core';

describe('UpgradeShop', () => {
  let component: UpgradeShop;
  let fixture: ComponentFixture<UpgradeShop>;
  let mockGameService: any;

  beforeEach(async () => {
    mockGameService = {
      state: signal({
        reputation: 100,
        upgrades: {
          'test_1': { level: 2, cost: 50 }
        }
      }),
      buyUpgrade: jasmine.createSpy('buyUpgrade')
    };

    await TestBed.configureTestingModule({
      imports: [UpgradeShop],
      providers: [
        { provide: GameService, useValue: mockGameService }
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
    const firstUpgrade = component.upgradesData[0];
    const state = component.getUpgradeState(firstUpgrade.id);
    
    expect(state.level).toBe(0);
    expect(state.cost).toBe(firstUpgrade.baseCost);
  });
});