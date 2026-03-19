import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Prestige } from '../prestige/prestige';
import { Crew } from '../crew/crew';

type LeftTab = 'crew' | 'prestige';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, Prestige, Crew],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.scss'
})
export class LeftPanel {
  private gameService = inject(GameService);
  state = this.gameService.state;

  activeTab = signal<LeftTab>('crew');

  get hasCrewSlots(): boolean {
    return this.state().crew.slots.length > 0;
  }

  setTab(tab: LeftTab) {
    this.activeTab.set(tab);
  }
}