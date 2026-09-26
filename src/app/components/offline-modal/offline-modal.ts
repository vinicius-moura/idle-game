import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Modal } from '../modal/modal';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-offline-modal',
  standalone: true,
  imports: [CommonModule, Modal, FormatNumberPipe, TranslatePipe],
  templateUrl: './offline-modal.html'
})
export class OfflineModal {
  public gameService = inject(GameService);
}
