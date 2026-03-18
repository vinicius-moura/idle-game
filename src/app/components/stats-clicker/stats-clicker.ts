import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { TourService } from '../../services/tour.service';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';
import { ShipId } from '../../models/game.model';

interface FloatingText {
  id: number;
  x: number;
  text: string;
}

@Component({
  selector: 'app-stats-clicker',
  standalone: true,
  imports: [CommonModule, FormatNumberPipe],
  templateUrl: './stats-clicker.html',
  styleUrl: './stats-clicker.scss'
})
export class StatsClicker implements OnInit {
  public gameService = inject(GameService);
  private tourService = inject(TourService);
  state = this.gameService.state;

  public floatingTexts: FloatingText[] = [];
  private nextFloatId = 0;

  shipImages: { [key in ShipId]: string } = {
    paper_boat: 'ships/ship_1.png',
    toy_boat: 'ships/ship_2.png',
    huckle_raft: 'ships/ship_3.png',
    old_man_skiff: 'ships/ship_4.png',
    wind_waker: 'ships/ship_5.png',
    black_pearl_cutter: 'ships/ship_6.png',
    going_merry: 'ships/ship_7.png',
    thousand_galleon: 'ships/ship_8.png',
    leviathan_frigate: 'ships/ship_9.png',
    dread_nautilus: 'ships/ship_10.png',
    flying_dutchman: 'ships/ship_11.png',
    heart_of_gold: 'ships/ship_12.png',
  };

  ngOnInit(): void {
    setTimeout(() => this.tourService.startClickTour(), 300);
  }

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