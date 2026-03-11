import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { UpgradeShop} from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  public gameService = inject(GameService);
  state = this.gameService.state;
}