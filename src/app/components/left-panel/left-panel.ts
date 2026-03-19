import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Crew } from '../crew/crew';
import { Prestige } from '../prestige/prestige';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, Crew, Prestige],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.scss'
})
export class LeftPanel {
  private gameService = inject(GameService);
  state = this.gameService.state;

  crewOpen = signal(false);
  prestigeOpen = signal(false);

  get hasCrewSlots(): boolean {
    return this.state().crew.slots.length > 0;
  }
}