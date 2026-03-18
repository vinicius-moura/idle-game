import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeShop } from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { Prestige } from './components/prestige/prestige';
import { OfflineModal } from './components/offline-modal/offline-modal';
import { DevTools } from './components/dev-tools/dev-tools';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, Prestige, OfflineModal, DevTools],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  environment = environment;
}