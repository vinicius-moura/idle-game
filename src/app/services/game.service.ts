import { Injectable, signal } from '@angular/core';
import { GameState, UpgradeState } from '../models/game.model';
import { UPGRADES } from '../data/upgrades.data';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly PRESTIGE_COST_BASE = 1e9;
  private readonly PRESTIGE_BONUS_PER_LEVEL = 0.05;

  state = signal<GameState>({
    reputation: 0,
    reputationPerSecond: 0,
    clickPower: 1,
    prestige: { level: 0, permanentBonus: 1 },
    upgrades: {},
    currentShip: 'paper_boat'
  });

  constructor() {
    this.loadGame();
    
    setInterval(() => {
      this.state.update(s => ({
        ...s,
        reputation: s.reputation + (s.reputationPerSecond / 10)
      }));
    }, 100);

    setInterval(() => this.saveGame(), 5000);
  }

  click() {
    this.state.update(s => ({ ...s, reputation: s.reputation + s.clickPower }));
  }

  buyUpgrade(id: string) {
    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return;

    const currentUpgradeState = this.state().upgrades[id] || { level: 0, cost: upgrade.baseCost };

    if (this.state().reputation >= currentUpgradeState.cost) {
      this.state.update(s => {
        const newReputation = s.reputation - currentUpgradeState.cost;
        const newLevel = currentUpgradeState.level + 1;
        let newCost = 0;

        if (upgrade.type === 'ship') {
          newCost = Infinity;
          s.currentShip = upgrade.targetShip || s.currentShip;
        } else {
          newCost = Math.ceil(upgrade.baseCost * Math.pow(1.15, newLevel));
        }

        return { 
          ...s, 
          reputation: newReputation, 
          upgrades: { ...s.upgrades, [id]: { level: newLevel, cost: newCost } } 
        };
      });

      this.recalculateStats();
    }
  }

  recalculateStats() {
    let newClickPower = 1;
    let newRPS = 0;

    for (const upgrade of UPGRADES) {
      const level = this.state().upgrades[upgrade.id]?.level || 0;
      if (level > 0) {
        if (upgrade.type === 'click') newClickPower += (upgrade.effect || 0) * level;
        else if (upgrade.type === 'idle') newRPS += (upgrade.effect || 0) * level;
      }
    }

    const bonus = this.state().prestige.permanentBonus;
    this.state.update(s => ({
      ...s,
      clickPower: newClickPower * bonus,
      reputationPerSecond: newRPS * bonus
    }));
  }

  private saveGame() {
    localStorage.setItem('paperPiratesSave', JSON.stringify(this.state()));
    localStorage.setItem('paperPiratesLastSaveTime', Date.now().toString());
  }

  private loadGame() {
    const saved = localStorage.getItem('paperPiratesSave');
    if (saved) {
      this.state.set(JSON.parse(saved));
      this.recalculateStats();
    }
  }
}