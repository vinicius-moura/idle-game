import { Injectable, signal } from '@angular/core';
import { CrewBuffs, CrewMember, GameState, ShipId, ShipSlot, SlotType } from '../models/game.model';
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
        reputation: s.reputation + (this.getReputationPerSecondWithCrew() / 10)
      }));
    }, 100);

    setInterval(() => this.saveGame(), 5000);
  }

  click() {
    const crew = this.getActiveCrewMembers();
    const crewPower = this.getCrewBuffPowerMultiplier(crew);
    const clickPowerBonus = this.sumBuff(crew, 'clickPowerBonus') * crewPower;
    const criticalChance = this.sumBuff(crew, 'criticalChance') * crewPower;
    const criticalDamage = this.sumBuff(crew, 'criticalDamageBonus') * crewPower;
    const criticalMultiplier = Math.random() < criticalChance ? 1 + criticalDamage : 1;
    const gained = this.state().clickPower * (1 + clickPowerBonus)
      * this.getGlobalReputationMultiplier(crew, crewPower) * criticalMultiplier;

    this.state.update(s => ({ ...s, reputation: s.reputation + gained }));
    return gained;
  }

  buyUpgrade(id: string) {
    const upgrade = UPGRADES.find(u => u.id === id);
    if (!upgrade) return;

    const currentUpgradeState = this.state().upgrades[id] || { level: 0, cost: upgrade.baseCost };
    const purchaseCost = this.getUpgradeCost(id);

    if (this.state().reputation >= purchaseCost) {
      this.state.update(s => {
        const newReputation = s.reputation - purchaseCost;
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

  maximizeAccount() {
    const upgrades: GameState['upgrades'] = {};
    for (const upgrade of UPGRADES) {
      upgrades[upgrade.id] = {
        level: 100,
        cost: upgrade.type === 'ship'
          ? Number.MAX_VALUE
          : Math.ceil(upgrade.baseCost * Math.pow(1.15, 100))
      };
    }

    const crewSlots = CREW_MEMBERS.map(member => ({
      slotType: member.slotType,
      crewMemberId: member.id
    }));

    this.state.update(state => ({
      ...state,
      reputation: Number.MAX_SAFE_INTEGER,
      currentShip: 'heart_of_gold',
      upgrades,
      crew: {
        unlocked: CREW_MEMBERS.map(member => member.id),
        slots: crewSlots
      }
    }));
    this.recalculateStats();
    this.offlineGains.set(null);
  }

  get allSlotTypes(): SlotType[] {
    return ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'];
  }

  get lockedSlotTypes(): SlotType[] {
    const activeSlots = this.state().crew.slots.map(s => s.slotType);
    return this.allSlotTypes.filter(s => !activeSlots.includes(s));
  }

  getReputationPerSecondWithCrew(): number {
    const crew = this.getActiveCrewMembers();
    return this.state().reputationPerSecond * this.getGlobalReputationMultiplier(
      crew,
      this.getCrewBuffPowerMultiplier(crew)
    );
  }

  getClickPowerWithCrew(): number {
    const crew = this.getActiveCrewMembers();
    const crewPower = this.getCrewBuffPowerMultiplier(crew);
    return this.state().clickPower
      * (1 + this.sumBuff(crew, 'clickPowerBonus') * crewPower)
      * this.getGlobalReputationMultiplier(crew, crewPower);
  }

  getOfflineGainMultiplier(): number {
    const crew = this.getActiveCrewMembers();
    const crewPower = this.getCrewBuffPowerMultiplier(crew);
    const nami = crew.find(member => member.id === 'nami');
    const jinbe = crew.find(member => member.id === 'jinbe');
    const offlineBonus = this.sumBuff(crew, 'offlineBonus');
    const namiBonus = nami?.buffs?.offlineBonus ?? 0;
    const jinbeSynergy = nami && jinbe
      ? 1 + (jinbe.buffs?.namiOfflineSynergy ?? 0) * crewPower
      : 1;
    const adjustedOfflineBonus = (offlineBonus - namiBonus) + namiBonus * jinbeSynergy;
    return 1 + adjustedOfflineBonus * crewPower;
  }

  getUpgradeCost(id: string): number {
    const upgrade = UPGRADES.find(item => item.id === id);
    if (!upgrade) return 0;

    const rawCost = this.state().upgrades[id]?.cost ?? upgrade.baseCost;
    const crew = this.getActiveCrewMembers();
    const discount = this.sumBuff(crew, 'upgradeCostReduction') * this.getCrewBuffPowerMultiplier(crew);
    return Math.max(1, Math.floor(rawCost * (1 - discount)));
  }

  getPrestigeGainMultiplier(): number {
    const crew = this.getActiveCrewMembers();
    return 1 + this.sumBuff(crew, 'prestigeBonus') * this.getCrewBuffPowerMultiplier(crew);
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

  private getActiveCrewMembers(): CrewMember[] {
    return this.state().crew.slots.flatMap(slot => {
      if (!slot.crewMemberId) return [];
      const member = CREW_MEMBERS.find(candidate => candidate.id === slot.crewMemberId);
      return member?.slotType === slot.slotType ? [member] : [];
    });
  }

  private sumBuff(crew: CrewMember[], buff: keyof CrewBuffs): number {
    return crew.reduce((sum, member) => sum + (member.buffs?.[buff] ?? 0), 0);
  }

  private getCrewBuffPowerMultiplier(crew: CrewMember[]): number {
    const brookBonus = crew.find(member => member.id === 'brook')?.buffs?.crewBuffBonus ?? 0;
    return 1 + brookBonus;
  }

  private getGlobalReputationMultiplier(crew: CrewMember[], crewPower: number): number {
    return 1 + this.sumBuff(crew, 'reputationBonus') * crewPower;
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
        const gained = this.getReputationPerSecondWithCrew()
          * secondsOffline
          * this.getOfflineGainMultiplier();
        if (gained > 0) {
          this.state.update(s => ({ ...s, reputation: s.reputation + gained }));
          this.offlineGains.set(gained);
        }
      }
    }
  }
}
