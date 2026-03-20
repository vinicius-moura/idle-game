import { Injectable, signal } from '@angular/core';
import { GameState, ShipId, ShipSlot, SlotType } from '../models/game.model';
import { UPGRADES } from '../data/upgrades.data';
import { CREW_MEMBERS } from '../data/crew.data';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly PRESTIGE_COST_BASE = 1e9;
  private readonly PRESTIGE_BONUS_PER_LEVEL = 0.05;
  private readonly SAVE_VERSION = 2; // sould be removed later

  private readonly SHIP_SLOTS: Record<ShipId, SlotType[]> = {
    paper_boat:        [],
    toy_boat:          ['captain'],
    huckle_raft:       ['captain', 'combatant'],
    old_man_skiff:     ['captain', 'combatant', 'navigator'],
    wind_waker:        ['captain', 'combatant', 'navigator', 'sniper'],
    black_pearl_cutter:['captain', 'combatant', 'navigator', 'sniper', 'cook'],
    going_merry:       ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic'],
    thousand_galleon:  ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist'],
    leviathan_frigate: ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter'],
    dread_nautilus:    ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician'],
    flying_dutchman:   ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'],
    heart_of_gold:     ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'],
  };

  state = signal<GameState>({
    reputation: 0,
    reputationPerSecond: 0,
    clickPower: 1,
    prestige: { level: 0, permanentBonus: 1 },
    upgrades: {},
    currentShip: 'paper_boat' as ShipId,
    crew: {
      unlocked: CREW_MEMBERS.filter(c => c.unlocked).map(c => c.id),
      slots: []
    }
  });

  offlineGains = signal<number | null>(null);

  constructor() {
    this.loadGame();

    setInterval(() => {
      this.state.update(s => ({
        ...s,
        reputation: s.reputation + (s.reputationPerSecond / 10)
      }));
    }, 100);

    setInterval(() => this.saveGame(), 5000);
  }

  click() {
    this.state.update(s => ({ ...s, reputation: s.reputation + s.clickPower }));
  }

  buyUpgrade(id: string) {
    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return;

    const currentUpgradeState = this.state().upgrades[id] || { level: 0, cost: upgrade.baseCost };

    if (this.state().reputation >= currentUpgradeState.cost) {
      this.state.update(s => {
        const newReputation = s.reputation - currentUpgradeState.cost;
        const newLevel = currentUpgradeState.level + 1;
        let newCost = 0;

        if (upgrade.type === 'ship') {
          newCost = Infinity;
          const newShip = (upgrade.targetShip || s.currentShip) as ShipId;
          const newSlots = this.buildSlotsForShip(newShip, s.crew.slots);
          return {
            ...s,
            reputation: newReputation,
            currentShip: newShip,
            upgrades: { ...s.upgrades, [id]: { level: newLevel, cost: newCost } },
            crew: { ...s.crew, slots: newSlots }
          };
        }

        newCost = Math.ceil(upgrade.baseCost * Math.pow(1.15, newLevel));
        return {
          ...s,
          reputation: newReputation,
          upgrades: { ...s.upgrades, [id]: { level: newLevel, cost: newCost } }
        };
      });

      this.recalculateStats();
    }
  }

  assignCrew(crewMemberId: string, slotType: SlotType) {
    this.state.update(s => {
      const slots = s.crew.slots.map(slot => {
        // Remove o tripulante de qualquer slot onde já esteja
        if (slot.crewMemberId === crewMemberId) {
          return { ...slot, crewMemberId: null };
        }
        // Coloca no slot correto
        if (slot.slotType === slotType) {
          return { ...slot, crewMemberId };
        }
        return slot;
      });
      return { ...s, crew: { ...s.crew, slots } };
    });
  }

  removeCrew(slotType: SlotType) {
    this.state.update(s => {
      const slots = s.crew.slots.map(slot =>
        slot.slotType === slotType ? { ...slot, crewMemberId: null } : slot
      );
      return { ...s, crew: { ...s.crew, slots } };
    });
  }

  get allSlotTypes(): SlotType[] {
    return ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'];
  }

  get lockedSlotTypes(): SlotType[] {
    const activeSlots = this.state().crew.slots.map(s => s.slotType);
    return this.allSlotTypes.filter(s => !activeSlots.includes(s));
  }

  recalculateStats() {
    let newClickPower = 1;
    let newRPS = 0;

    for (const upgrade of UPGRADES) {
      const level = this.state().upgrades[upgrade.id]?.level || 0;
      if (level > 0) {
        if (upgrade.type === 'click') newClickPower += (upgrade.effect || 0) * level;
        else if (upgrade.type === 'idle') newRPS += (upgrade.effect || 0) * level;
      }
    }

    const bonus = this.state().prestige.permanentBonus;
    this.state.update(s => ({
      ...s,
      clickPower: newClickPower * bonus,
      reputationPerSecond: newRPS * bonus
    }));
  }

  dismissOfflineGains() {
    this.offlineGains.set(null);
  }

  private buildSlotsForShip(shipId: ShipId, currentSlots: ShipSlot[]): ShipSlot[] {
    return this.SHIP_SLOTS[shipId].map(slotType => {
      const existing = currentSlots.find(s => s.slotType === slotType);
      return existing ?? { slotType, crewMemberId: null };
    });
  }

  private saveGame() {
    localStorage.setItem('paperPiratesSave', JSON.stringify(this.state()));
    localStorage.setItem('paperPiratesLastSaveTime', Date.now().toString());
    localStorage.setItem('paperPiratesSaveVersion', this.SAVE_VERSION.toString()); // sould be removed later
  }

  private loadGame() {
    const saved = localStorage.getItem('paperPiratesSave');

    // sould be removed later
    const savedVersion = parseInt(localStorage.getItem('paperPiratesSaveVersion') || '1');

    if (savedVersion < this.SAVE_VERSION) {
      localStorage.clear();
      localStorage.setItem('paperPiratesSaveVersion', this.SAVE_VERSION.toString());
      return;
    }

    const lastSaveTime = localStorage.getItem('paperPiratesLastSaveTime');

    if (saved) {
      this.state.set(JSON.parse(saved));
      this.recalculateStats();
    }

    if (lastSaveTime) {
      const secondsOffline = Math.min(
        (Date.now() - parseInt(lastSaveTime)) / 1000,
        8 * 60 * 60
      );

      if (secondsOffline > 10) {
        const gained = this.state().reputationPerSecond * secondsOffline;
        if (gained > 0) {
          this.state.update(s => ({ ...s, reputation: s.reputation + gained }));
          this.offlineGains.set(gained);
        }
      }
    }
  }
}