import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html'
})
export class Modal {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}