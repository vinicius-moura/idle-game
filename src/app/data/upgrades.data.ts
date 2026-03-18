import { Upgrade } from '../models/game.model';

export const UPGRADES: Upgrade[] = [
  // Click Upgrades
  { id: 'bigger_sails', name: 'Bigger Paper Sail', description: "Bigger numbers = better pirate. It's science.", type: 'click', baseCost: 10, effect: 1 },
  { id: 'wax_coating', name: 'Wax Coating', description: 'Makes your boat... less immediately soggy. Impressive!', type: 'click', baseCost: 120, effect: 4 },
  { id: 'origami_crows_nest', name: "Origami Crow's Nest", description: 'You can see the whole puddle from up here.', type: 'click', baseCost: 1500, effect: 20 },
  { id: 'jolly_roger_flag', name: 'Jolly Roger Flag', description: 'Nothing says authority like a flag made of construction paper.', type: 'click', baseCost: 15000, effect: 150 },
  { id: 'cannon_keyboard', name: 'Cannon Keyboard', description: 'Every keystroke fires a tiny cannonball. OSHA is concerned.', type: 'click', baseCost: 200000, effect: 800 },
  { id: 'kraken_handshake', name: 'Kraken Handshake', description: "Networking event went sideways. Very sideways.", type: 'click', baseCost: 3000000, effect: 5000 },
  { id: 'void_compass', name: 'Void Compass', description: "Points toward treasure. Or oblivion. Honestly same thing.", type: 'click', baseCost: 50000000, effect: 30000 },

  // Idle Upgrades
  { id: 'imaginary_friend', name: 'Imaginary Friend', description: 'Works for free, but his looting is also imaginary.', type: 'idle', baseCost: 50, effect: 1 },
  { id: 'eyepatch_goldfish', name: 'Eyepatch Goldfish', description: "He's seen things. Mostly the inside of a plastic bag.", type: 'idle', baseCost: 600, effect: 8 },
  { id: 'garden_gnome', name: 'Kidnapped Garden Gnome', description: 'Surprisingly loyal once you show him your treasure.', type: 'idle', baseCost: 8000, effect: 40 },
  { id: 'ghost_pirates', name: 'Ghost Pirate Crew', description: "They work for 'boos' and have great dental plans.", type: 'idle', baseCost: 80000, effect: 300 },
  { id: 'cursed_compass', name: 'Cursed Compass', description: "Always points to more loot. Cursed how, exactly?", type: 'idle', baseCost: 600000, effect: 2000 },
  { id: 'wormhole_cannon', name: 'Wormhole Cannon', description: 'Loot other dimensions. Mostly just finds socks.', type: 'idle', baseCost: 5000000, effect: 12000 },
  { id: 'bermuda_butler', name: 'Bermuda Butler', description: 'Impeccably dressed. Arrived from nowhere. Asks no questions.', type: 'idle', baseCost: 40000000, effect: 80000 },
  { id: 'star_kraken', name: 'Star Kraken', description: 'Tentacles in every dimension. Payroll is a nightmare.', type: 'idle', baseCost: 400000000, effect: 500000 },

  // Ship Upgrades
  { id: 'ship_toy_boat', name: 'Toy Boat', description: "Try saying that three times fast. Now try sailing it.", type: 'ship', baseCost: 10000, targetShip: 'toy_boat' },
  { id: 'ship_huckle_raft', name: 'Huckle Raft', description: "Lighting out for the territory. The territory is the high seas.", type: 'ship', baseCost: 75000, targetShip: 'huckle_raft' },
  { id: 'ship_old_man_skiff', name: 'Old Man Skiff', description: "He went 84 days without a ship upgrade. Not you.", type: 'ship', baseCost: 400000, targetShip: 'old_man_skiff' },
  { id: 'ship_wind_waker', name: 'Wind Waker', description: "The seas are yours. Also there's a baton somewhere.", type: 'ship', baseCost: 2000000, targetShip: 'wind_waker' },
  { id: 'ship_black_pearl', name: 'Black Pearl Cutter', description: "You know the code. The code is 'go faster'.", type: 'ship', baseCost: 8000000, targetShip: 'black_pearl_cutter' },
  { id: 'ship_going_merry', name: 'Going Merry', description: "She'll take you anywhere. Even the Grand Line.", type: 'ship', baseCost: 40000000, targetShip: 'going_merry' },
  { id: 'ship_thousand_galleon', name: 'Thousand Galleon', description: "Sunny side up, sails out. The dream.", type: 'ship', baseCost: 200000000, targetShip: 'thousand_galleon' },
  { id: 'ship_leviathan', name: 'Leviathan Frigate', description: "Cancel the apocalypse. You have a bigger boat.", type: 'ship', baseCost: 1000000000, targetShip: 'leviathan_frigate' },
  { id: 'ship_dread_nautilus', name: 'Dread Nautilus', description: "Twenty thousand leagues and counting.", type: 'ship', baseCost: 6000000000, targetShip: 'dread_nautilus' },
  { id: 'ship_flying_dutchman', name: 'Flying Dutchman', description: "Doomed to sail forever. Sick benefits package though.", type: 'ship', baseCost: 30000000000, targetShip: 'flying_dutchman' },
  { id: 'ship_heart_of_gold', name: 'Heart of Gold', description: "Powered by the Infinite Improbability Drive. Anything can happen.", type: 'ship', baseCost: 150000000000, targetShip: 'heart_of_gold' },
];