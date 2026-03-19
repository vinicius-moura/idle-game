import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeShop } from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { LeftPanel } from './components/left-panel/left-panel';
import { OfflineModal } from './components/offline-modal/offline-modal';
import { DevTools } from './components/dev-tools/dev-tools';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, LeftPanel, OfflineModal, DevTools],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  environment = environment;
}