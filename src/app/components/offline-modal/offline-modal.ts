import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Modal } from '../modal/modal';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';

@Component({
  selector: 'app-offline-modal',
  standalone: true,
  imports: [CommonModule, Modal, FormatNumberPipe],
  templateUrl: './offline-modal.html'
})
export class OfflineModal {
  public gameService = inject(GameService);
}