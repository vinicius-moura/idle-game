import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-prestige',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prestige.html',
  styleUrl: './prestige.scss'
})
export class Prestige {
  private gameService = inject(GameService);
  state = this.gameService.state;

  // TODO: prestige funcion
  prestige() {
    // this.gameService.performPrestige();
  }
}