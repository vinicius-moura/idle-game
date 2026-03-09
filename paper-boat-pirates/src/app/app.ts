import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { FormatNumberPipe } from './pipes/format-number-pipe';
import { UPGRADES } from './data/upgrades.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormatNumberPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // Injetamos o serviço que criamos antes
  public gameService = inject(GameService);
  
  // Tornamos a lista de upgrades disponível para o HTML
  public upgradesData = UPGRADES;

  // Atalho para o estado (Signal)
  state = this.gameService.state;

  // Mapeamento das imagens dos barcos (substituindo o shipSVGs do ui.js)
  shipImages: { [key: string]: string } = {
    paper_boat: 'ships/ship_1.png',
    bathtub_barque: 'ships/ship_2.png',
    steampunk_airship: 'ships/ship_3.png',
    cosmic_clipper: 'ships/ship_4.png',
  };

  onBtnClick() {
    this.gameService.click();
    // A lógica de "floating text" (showFloatingText) 
    // será implementada em um passo futuro para manter este simples.
  }

  buy(id: string) {
    this.gameService.buyUpgrade(id);
  }

  // Helper para verificar se o jogador tem dinheiro para o upgrade
  canAfford(cost: number): boolean {
    return this.state().reputation >= cost;
  }

  // Helper para pegar o estado atual de um upgrade (nível e custo)
  getUpgradeState(id: string) {
    return this.state().upgrades[id] || { level: 0, cost: UPGRADES.find(u => u.id === id)?.baseCost || 0 };
  }
}