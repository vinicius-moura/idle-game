import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';

@Component({
  selector: 'app-upgrade-item',
  standalone: true,
  imports: [CommonModule, FormatNumberPipe],
  templateUrl: './upgrade-item.html',
  styleUrl: './upgrade-item.scss'
})
export class UpgradeItem {
  @Input({ required: true }) upgrade: any;
  @Input({ required: true }) level: number = 0;
  @Input({ required: true }) cost: number = 0;
  @Input({ required: true }) canAfford: boolean = false;

  @Output() buy = new EventEmitter<string>();

  onBuy() {
    this.buy.emit(this.upgrade.id);
  }
}