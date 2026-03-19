import { CrewMember } from '../models/game.model';

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    description: 'The future King of the Pirates. Inspires the whole crew.',
    slotType: 'captain',
    rarity: 'legendary',
    unlocked: true
  },
  {
    id: 'zoro',
    name: 'Roronoa Zoro',
    description: 'The world\'s greatest swordsman. Or will be.',
    slotType: 'combatant',
    rarity: 'epic',
    unlocked: true
  },
  {
    id: 'nami',
    name: 'Nami',
    description: 'The best navigator on the seas. Also watches your wallet.',
    slotType: 'navigator',
    rarity: 'rare',
    unlocked: true
  },
  {
    id: 'usopp',
    name: 'Usopp',
    description: 'A great warrior of the sea. Probably.',
    slotType: 'sniper',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'sanji',
    name: 'Sanji',
    description: 'Only cook in the world who can kick you into next week.',
    slotType: 'cook',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'chopper',
    name: 'Tony Tony Chopper',
    description: 'A reindeer who ate a Devil Fruit. Excellent doctor.',
    slotType: 'medic',
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'robin',
    name: 'Nico Robin',
    description: 'Can read Poneglyphs. Also sprouts arms everywhere.',
    slotType: 'archaeologist',
    rarity: 'epic',
    unlocked: false
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
    description: 'Yohohoho! He\'s dead but still plays a mean violin.',
    slotType: 'musician',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'jinbe',
    name: 'Jinbe',
    description: 'Master of Fish-Man Karate. Steersman of the Straw Hats.',
    slotType: 'helmsman',
    rarity: 'legendary',
    unlocked: false
  }
];