import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './modal.html'
})
export class Modal {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
