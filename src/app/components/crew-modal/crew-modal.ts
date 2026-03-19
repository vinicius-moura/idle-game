import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../modal/modal';
import { Crew } from '../crew/crew';

@Component({
  selector: 'app-crew-modal',
  standalone: true,
  imports: [CommonModule, Modal, Crew],
  templateUrl: './crew-modal.html'
})
export class CrewModal {
  isOpen = signal(false);

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }
}