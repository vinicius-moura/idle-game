import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeShop } from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { Prestige } from './components/prestige/prestige';
import { OfflineModal } from './components/offline-modal/offline-modal';
import { GameService } from './services/game.service'; // DEV TOOL

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, Prestige, OfflineModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor() {
    (window as any)['gameService'] = inject(GameService); //DEV TOOL
  }
}