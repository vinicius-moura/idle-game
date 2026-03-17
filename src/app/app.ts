import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeShop } from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { Prestige } from './components/prestige/prestige';
import { OfflineModal } from './components/offline-modal/offline-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, Prestige, OfflineModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
}