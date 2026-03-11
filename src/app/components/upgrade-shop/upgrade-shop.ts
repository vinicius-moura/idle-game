import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { UPGRADES } from '../../data/upgrades.data';
import { UpgradeItem } from '../upgrade-item/upgrade-item';

@Component({
  selector: 'app-upgrade-shop',
  standalone: true,
  imports: [CommonModule, UpgradeItem],
  templateUrl: './upgrade-shop.html'
})
export class UpgradeShop {
  private gameService = inject(GameService);
  public upgradesData = UPGRADES;
  
  state = this.gameService.state;

  buy(id: string) {
    this.gameService.buyUpgrade(id);
  }

  canAfford(cost: number): boolean {
    return this.state().reputation >= cost;
  }

  getUpgradeState(id: string) {
    const upgradeRecord = this.state().upgrades[id];
    if (upgradeRecord) {
      return upgradeRecord;
    }
    const base = this.upgradesData.find(u => u.id === id);
    return { level: 0, cost: base?.baseCost || 0 };
  }
}