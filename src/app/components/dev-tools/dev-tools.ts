import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  templateUrl: './dev-tools.html',
  styleUrl: './dev-tools.scss'
})
export class DevTools {
  private gameService = inject(GameService);

  addReputation() {
    this.gameService.state.update(s => ({ ...s, reputation: s.reputation + 100000 }));
  }

  resetGame() {
    localStorage.clear();
    location.reload();
  }
}