import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { TourService } from '../../services/tour.service';
import { UPGRADES } from '../../data/upgrades.data';
import { UpgradeItem } from '../upgrade-item/upgrade-item';

type ShopTab = 'upgrades' | 'ship';

@Component({
  selector: 'app-upgrade-shop',
  standalone: true,
  imports: [CommonModule, UpgradeItem],
  templateUrl: './upgrade-shop.html',
  styleUrl: './upgrade-shop.scss'
})
export class UpgradeShop {
  private gameService = inject(GameService);
  private tourService = inject(TourService);

  readonly SHIP_UNLOCK_THRESHOLD = 15000;

  public clickIdleUpgrades = UPGRADES.filter(u => u.type !== 'ship');
  public shipUpgrades = UPGRADES.filter(u => u.type === 'ship');

  activeTab = signal<ShopTab>('upgrades');
  state = this.gameService.state;
  private shipTourTriggered = false;

  constructor() {
    effect(() => {
      const unlocked = this.shipsUnlocked;
      if (unlocked && !this.shipTourTriggered && !this.tourService.hasSeenTour()) {
        this.shipTourTriggered = true;
        setTimeout(() => this.tourService.startShipTour(), 300);
      }
    });
  }

  get shipsUnlocked(): boolean {
    return this.state().reputation >= this.SHIP_UNLOCK_THRESHOLD ||
      this.shipUpgrades.some(u => (this.state().upgrades[u.id]?.level || 0) > 0);
  }

  setTab(tab: ShopTab) {
    this.activeTab.set(tab);
  }

  buy(id: string) {
    this.gameService.buyUpgrade(id);
  }

  canAfford(cost: number): boolean {
    return this.state().reputation >= cost;
  }

  getUpgradeState(id: string) {
    const upgradeRecord = this.state().upgrades[id];
    if (upgradeRecord) return upgradeRecord;
    const base = UPGRADES.find(u => u.id === id);
    return { level: 0, cost: base?.baseCost || 0 };
  }

  isShipAvailable(id: string): boolean {
    const index = this.shipUpgrades.findIndex(u => u.id === id);
    if (index === 0) return true;
    const previousShip = this.shipUpgrades[index - 1];
    return (this.state().upgrades[previousShip.id]?.level || 0) > 0;
  }
}