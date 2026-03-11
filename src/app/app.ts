import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { FormatNumberPipe } from './pipes/format-number-pipe';
import { UpgradeShop} from './components/upgrade-shop/upgrade-shop'; 

interface FloatingText {
  id: number;
  x: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormatNumberPipe, UpgradeShop], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  public gameService = inject(GameService);
  state = this.gameService.state;

  public floatingTexts: FloatingText[] = [];
  private nextFloatId = 0;

  shipImages: { [key: string]: string } = {
    paper_boat: 'ships/ship_1.png',
    bathtub_barque: 'ships/ship_2.png',
    steampunk_airship: 'ships/ship_3.png',
    cosmic_clipper: 'ships/ship_4.png',
  };

  onBtnClick() {
    const power = this.state().clickPower;
    this.gameService.click();
    this.showFloatingText(power);
  }

  showFloatingText(amount: number) {
    const id = this.nextFloatId++;
    const formattedText = amount >= 1 ? amount.toFixed(0) : amount.toFixed(1);

    const newText: FloatingText = {
      id,
      x: Math.random() * 40 + 30,
      text: `+${formattedText}`
    };

    this.floatingTexts.push(newText);
    setTimeout(() => {
      this.floatingTexts = this.floatingTexts.filter(t => t.id !== id);
    }, 1000);
  }
}