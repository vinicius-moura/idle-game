import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-prestige',
  standalone: true,
  imports: [CommonModule, Modal],
  templateUrl: './prestige.html',
  styleUrl: './prestige.scss'
})
export class Prestige {
  private gameService = inject(GameService);
  state = this.gameService.state;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  prestige() {
    // this.gameService.performPrestige();
  }
}