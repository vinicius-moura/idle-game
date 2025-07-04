// main.js

import { gameState, init, saveGame } from './gameState.js';
import { renderUpgrades, updateUI, showFloatingText } from './ui.js';
import { buyUpgrade, recalculateStats } from './upgrades.js';
import { handlePrestige } from './prestige.js';

const clickerBtn = document.getElementById('clicker-btn');
const upgradesContainer = document.getElementById('upgrades-container');
const prestigeBtn = document.getElementById('prestige-btn');

// --- EVENT HANDLERS ---

clickerBtn.addEventListener('click', () => {
    const amount = gameState.clickPower;

    gameState.reputation += amount;
    showFloatingText(amount);
    updateUI();
});

upgradesContainer.addEventListener('click', (e) => {
    if (e.target.matches('.buy-btn')) {
        buyUpgrade(e.target.dataset.upgradeId);
    }
});

prestigeBtn.addEventListener('click', handlePrestige);

// --- INITIALIZE GAME ---

init();
renderUpgrades();
recalculateStats();

// Main game loop for idle income
setInterval(() => {
    gameState.reputation += gameState.reputationPerSecond / 10;
}, 100);

// UI update loop
setInterval(() => {
    updateUI();
}, 250);

// Autosave loop
setInterval(() => {
    saveGame();
}, 5000);
