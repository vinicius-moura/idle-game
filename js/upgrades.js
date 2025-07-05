import { gameState } from './gameState.js';
import { updateUpgradeElement } from './ui.js';
import { updateUI } from './ui.js';

export const upgrades = [
    // Click Upgrades
    { id: 'bigger_sails', name: 'Bigger Paper Sail', description: 'Bigger numbers = better pirate. It\'s science.', type: 'click', baseCost: 10, effect: 1 },
    { id: 'wax_coating', name: 'Wax Coating', description: 'Makes your boat... less immediately soggy. Impressive!', type: 'click', baseCost: 100, effect: 5 },
    { id: 'origami_crows_nest', name: 'Origami Crow\'s Nest', description: 'You can see the whole puddle from up here.', type: 'click', baseCost: 1100, effect: 25 },
    { id: 'cosmic_mouse_pointer', name: 'Cosmic Mouse Pointer', description: 'Break the 4th wall. Click with cosmic intent.', type: 'click', baseCost: 150000, effect: 1000 },

    // Idle Upgrades
    { id: 'imaginary_friend', name: 'Imaginary Friend', description: 'Works for free, but his looting is also imaginary.', type: 'idle', baseCost: 50, effect: 1 },
    { id: 'eyepatch_goldfish', name: 'Eyepatch Goldfish', description: 'He\'s seen things. Mostly the inside of a plastic bag.', type: 'idle', baseCost: 500, effect: 10 },
    { id: 'garden_gnome', name: 'Kidnapped Garden Gnome', description: 'Surprisingly loyal once you show him your treasure.', type: 'idle', baseCost: 7500, effect: 50 },
    { id: 'ghost_pirates', name: 'Ghost Pirate Crew', description: 'They work for \'boos\' and have great dental plans.', type: 'idle', baseCost: 100000, effect: 400 },
    { id: 'wormhole_cannon', name: 'Wormhole Cannon', description: 'Loot other dimensions. Mostly just finds socks.', type: 'idle', baseCost: 5000000, effect: 10000 },

    // Ship Upgrades (special)
    { id: 'ship_bathtub', name: 'Bathtub Barque', description: 'Graduate from the puddle to the tub! Unlocks new upgrades.', type: 'ship', baseCost: 50000, targetShip: 'bathtub_barque' },
    { id: 'ship_steampunk', name: 'Steampunk Airship', description: 'Who needs water? The sky\'s the limit!', type: 'ship', baseCost: 1e7, targetShip: 'steampunk_airship' },
    { id: 'ship_cosmic', name: 'Cosmic Clipper', description: 'Plunder the stars themselves for... stardust?', type: 'ship', baseCost: 5e8, targetShip: 'cosmic_clipper' },
];

export const buyUpgrade = (id) => {
    const upgrade = upgrades.find(u => u.id === id);

    if (!upgrade) {return;}

    const state = gameState.upgrades[id] || { level: 0, cost: upgrade.baseCost };

    if (gameState.reputation >= state.cost) {
        gameState.reputation -= state.cost;
        state.level++;

        if (upgrade.type === 'ship') {
            gameState.currentShip = upgrade.targetShip;
            state.cost = Infinity;
        } else {
            state.cost = Math.ceil(upgrade.baseCost * Math.pow(1.15, state.level));
        }

        gameState.upgrades[id] = state;
        updateUpgradeElement(id);
        recalculateStats();
        updateUI();
    }
};

export const recalculateStats = () => {
    let newClickPower = 1;
    let newRPS = 0;

    for (const upgrade of upgrades) {
        const level = gameState.upgrades[upgrade.id]?.level || 0;

        if (level > 0) {
            if (upgrade.type === 'click') {
                newClickPower += upgrade.effect * level;
            } else if (upgrade.type === 'idle') {
                newRPS += upgrade.effect * level;
            }
        }
    }

    gameState.clickPower = newClickPower * gameState.prestige.permanentBonus;
    gameState.reputationPerSecond = newRPS * gameState.prestige.permanentBonus;
};