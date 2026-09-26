import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeShop } from './components/upgrade-shop/upgrade-shop';
import { StatsClicker } from './components/stats-clicker/stats-clicker';
import { LeftPanel } from './components/left-panel/left-panel';
import { OfflineModal } from './components/offline-modal/offline-modal';
import { DevTools } from './components/dev-tools/dev-tools';
import { Modal } from './components/modal/modal';
import { TranslatePipe } from './pipes/translate.pipe';
import { I18nService } from './services/i18n.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UpgradeShop, StatsClicker, LeftPanel, OfflineModal, DevTools, Modal, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  environment = environment;
  i18n = inject(I18nService);
  isSettingsMenuOpen = false;
  isLanguageModalOpen = false;

  toggleSettingsMenu(): void {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
  }

  openLanguageSettings(): void {
    this.isSettingsMenuOpen = false;
    this.isLanguageModalOpen = true;
  }

  closeLanguageSettings(): void {
    this.isLanguageModalOpen = false;
  }
}
