export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: 'click' | 'idle' | 'ship';
  baseCost: number;
  effect?: number;       // Valor fixo (ex: +1 clique, +10 RPS)
  multiplier?: number;   // NOVO: Para efeitos percentuais (ex: 1.2 para +20%)
  targetShip?: string;   // Para troca visual de barco
}

export interface UpgradeState {
  level: number;
  cost: number;
}

export interface GameState {
  reputation: number;
  reputationPerSecond: number;
  clickPower: number;
  prestige: {
    level: number;
    permanentBonus: number;
  };
  upgrades: { [id: string]: UpgradeState };
  currentShip: string;
}