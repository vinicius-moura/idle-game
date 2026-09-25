import { CrewMember } from '../models/game.model';

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    description: 'The future King of the Pirates. +10% Reputation from all sources.',
    slotType: 'captain',
    rarity: 'legendary',
    unlocked: true,
    buffs: { reputationBonus: 0.1 }
  },
  {
    id: 'zoro',
    name: 'Roronoa Zoro',
    description: 'The world\'s greatest swordsman. 5% chance for a critical click worth double.',
    slotType: 'combatant',
    rarity: 'epic',
    unlocked: true,
    buffs: { criticalChance: 0.05, criticalDamageBonus: 1 }
  },
  {
    id: 'nami',
    name: 'Nami',
    description: 'The best navigator on the seas. +25% Reputation from offline progress.',
    slotType: 'navigator',
    rarity: 'rare',
    unlocked: true,
    buffs: { offlineBonus: 0.25 }
  },
  {
    id: 'usopp',
    name: 'Usopp',
    description: 'A great warrior of the sea. Probably. +25% click power.',
    slotType: 'sniper',
    rarity: 'common',
    unlocked: false,
    buffs: { clickPowerBonus: 0.25 }
  },
  {
    id: 'sanji',
    name: 'Sanji',
    description: 'Only cook in the world who can kick you into next week. Upgrade costs -10%.',
    slotType: 'cook',
    rarity: 'rare',
    unlocked: false,
    buffs: { upgradeCostReduction: 0.1 }
  },
  {
    id: 'chopper',
    name: 'Tony Tony Chopper',
    description: 'A reindeer who ate a Devil Fruit. +15% Reputation from offline progress.',
    slotType: 'medic',
    rarity: 'common',
    unlocked: false,
    buffs: { offlineBonus: 0.15 }
  },
  {
    id: 'robin',
    name: 'Nico Robin',
    description: 'Can read Poneglyphs. Also sprouts arms everywhere. +20% Prestige gains.',
    slotType: 'archaeologist',
    rarity: 'epic',
    unlocked: false,
    buffs: { prestigeBonus: 0.2 }
  },
  {
    id: 'franky',
    name: 'Franky',
    description: 'SUPER shipwright. Built the Thousand Sunny.',
    slotType: 'carpenter',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'brook',
    name: 'Brook',
    description: 'Yohohoho! He\'s dead but still plays a mean violin. +20% strength to other crew buffs.',
    slotType: 'musician',
    rarity: 'rare',
    unlocked: false,
    buffs: { crewBuffBonus: 0.2 }
  },
  {
    id: 'jinbe',
    name: 'Jinbe',
    description: 'Master of Fish-Man Karate. With Nami, boosts her offline bonus by 50%.',
    slotType: 'helmsman',
    rarity: 'legendary',
    unlocked: false,
    buffs: { namiOfflineSynergy: 0.5 }
  }
];
