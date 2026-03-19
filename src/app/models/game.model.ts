export interface Upgrade {
  id: string;
  name: string;
  description: string;
  type: 'click' | 'idle' | 'ship';
  baseCost: number;
  effect?: number;
  multiplier?: number;
  targetShip?: string;
}

export interface UpgradeState {
  level: number;
  cost: number;
}

export type ShipId =
  | 'paper_boat'
  | 'toy_boat'
  | 'huckle_raft'
  | 'old_man_skiff'
  | 'wind_waker'
  | 'black_pearl_cutter'
  | 'going_merry'
  | 'thousand_galleon'
  | 'leviathan_frigate'
  | 'dread_nautilus'
  | 'flying_dutchman'
  | 'heart_of_gold';

export type SlotType =
  | 'captain'
  | 'combatant'
  | 'navigator'
  | 'sniper'
  | 'cook'
  | 'medic'
  | 'archaeologist'
  | 'carpenter'
  | 'musician'
  | 'helmsman';

export type CrewRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CrewMember {
  id: string;
  name: string;
  description: string;
  slotType: SlotType;
  rarity: CrewRarity;
  unlocked: boolean;
  // buffs virão depois
}

export interface ShipSlot {
  slotType: SlotType;
  crewMemberId: string | null; // null = slot vazio
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
  currentShip: ShipId;
  crew: {
    unlocked: string[]; // ids dos tripulantes desbloqueados
    slots: ShipSlot[];  // slots ativos do navio atual
  };
}