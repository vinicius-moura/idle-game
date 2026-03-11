import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { UpgradeShop} from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { Prestige } from './components/prestige/prestige';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, Prestige], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
}