import { Component, inject, InjectionToken } from '@angular/core';
import { GameService } from '../../services/game.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

export const WINDOW_REF = new InjectionToken<Window>('WINDOW_REF', {
  providedIn: 'root',
  factory: () => window
});

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './dev-tools.html',
  styleUrl: './dev-tools.scss'
})
export class DevTools {
  private gameService = inject(GameService);
  private windowRef = inject(WINDOW_REF);

  addReputation() {
    this.gameService.state.update(s => ({ ...s, reputation: s.reputation + 100000 }));
  }

  maximizeAccount() {
    this.gameService.maximizeAccount();
  }

  resetGame() {
    localStorage.clear();
    this.windowRef.location.reload();
  }
}
