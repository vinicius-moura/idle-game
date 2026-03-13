import { GameState, Upgrade, UpgradeState } from './game.model';

describe('Game Models', () => {
  it('should create a valid Upgrade object', () => {
    const upgrade: Upgrade = {
      id: 'click_1',
      name: 'Better Oars',
      description: 'Increases click power',
      type: 'click',
      baseCost: 10,
      effect: 1,
      multiplier: 1.2,
      targetShip: 'basic_boat'
    };

    expect(upgrade.id).toBeDefined();
    expect(upgrade.type).toBe('click');
  });

  it('should create a valid UpgradeState object', () => {
    const upgradeState: UpgradeState = {
      level: 5,
      cost: 150
    };

    expect(upgradeState.level).toBe(5);
    expect(upgradeState.cost).toBe(150);
  });

  it('should create a valid GameState object', () => {
    const gameState: GameState = {
      reputation: 1000,
      reputationPerSecond: 10,
      clickPower: 5,
      prestige: {
        level: 1,
        permanentBonus: 1.05
      },
      upgrades: {
        'up_1': { level: 1, cost: 100 }
      },
      currentShip: 'paper_boat'
    };

    expect(gameState.reputation).toBe(1000);
    expect(gameState.prestige.permanentBonus).toBe(1.05);
    expect(gameState.upgrades['up_1'].level).toBe(1);
  });
});