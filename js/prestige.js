import { gameState, PRESTIGE_COST_BASE, PRESTIGE_BONUS_PER_LEVEL, init, saveGame } from './gameState.js';
import { renderUpgrades, updateUI } from './ui.js';
import { recalculateStats } from './upgrades.js';

export const handlePrestige = () => {
    const prestigeCost = PRESTIGE_COST_BASE * Math.pow(10, gameState.prestige.level);

    if (gameState.reputation >= prestigeCost) {
        if (confirm('Are you sure you want to start over? You\'ll gain a permanent bonus to all Reputation gains, but lose your current progress (except Legendary Level).')) {
            const newLevel = gameState.prestige.level + 1;
            const newBonus = 1 + (newLevel * PRESTIGE_BONUS_PER_LEVEL);

            const prestigeData = { level: newLevel, permanentBonus: newBonus };

            init(true);
            gameState.prestige = prestigeData;

            saveGame();
            recalculateStats();
            renderUpgrades();
            updateUI();
        }
    }
};
