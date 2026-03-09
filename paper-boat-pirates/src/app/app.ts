import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { FormatNumberPipe } from './pipes/format-number-pipe';
import { UPGRADES } from './data/upgrades.data';

// Interface para controlar os textos que sobem na tela ao clicar
interface FloatingText {
  id: number;
  x: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormatNumberPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // Injetamos o serviço que controla a lógica do jogo
  public gameService = inject(GameService);
  
  // Lista de dados estáticos dos upgrades
  public upgradesData = UPGRADES;

  // Atalho reativo para o estado do jogo (Signal)
  state = this.gameService.state;

  // Gerenciamento de textos flutuantes
  public floatingTexts: FloatingText[] = [];
  private nextFloatId = 0;

  // Mapeamento das imagens dos barcos (caminhos para a pasta public)
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
    
    // Formata o texto: se for inteiro mostra +1, se for decimal mostra +1.5
    const formattedText = amount >= 1 ? amount.toFixed(0) : amount.toFixed(1);

    const newText: FloatingText = {
      id,
      x: Math.random() * 40 + 30, // Posição horizontal aleatória (30% a 70%)
      text: `+${formattedText}`
    };

    this.floatingTexts.push(newText);

    // Remove o texto da tela após 1 segundo (tempo da animação CSS)
    setTimeout(() => {
      this.floatingTexts = this.floatingTexts.filter(t => t.id !== id);
    }, 1000);
  }

  buy(id: string) {
    this.gameService.buyUpgrade(id);
  }

  // Verifica se o jogador tem reputação suficiente para comprar
  canAfford(cost: number): boolean {
    return this.state().reputation >= cost;
  }

  // Busca o nível e custo atual de um upgrade específico no estado salvo
  getUpgradeState(id: string) {
    const upgradeRecord = this.state().upgrades[id];
    if (upgradeRecord) {
      return upgradeRecord;
    }
    
    // Se o upgrade nunca foi comprado, busca o custo base da lista de dados
    const base = this.upgradesData.find(u => u.id === id);
    return { level: 0, cost: base?.baseCost || 0 };
  }
}