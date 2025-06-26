import { showOfflineModal } from './ui.js'; // ou onde estiver essa função

export let gameState = {
    reputation: 0,
    reputationPerSecond: 0,
    clickPower: 1,
    prestige: {
        level: 0,
        permanentBonus: 1,
    },
    upgrades: {},
    currentShip: 'paper_boat'
};

export const PRESTIGE_COST_BASE = 1e9;
export const PRESTIGE_BONUS_PER_LEVEL = 0.05;

export const init = (isReset = false) => {
    console.log("init");
    gameState = {
        reputation: 0,
        reputationPerSecond: 0,
        clickPower: 1,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: {},
        currentShip: 'paper_boat'
    };
    if (!isReset) {
        console.log("not reset");
        loadGame();
    }
};

export const saveGame = () => {
    try {
        localStorage.setItem('paperPiratesSave', JSON.stringify(gameState));
        localStorage.setItem('paperPiratesLastSaveTime', Date.now());
        console.log('SALVO');
    } catch (e) {
        console.error("Could not save game state:", e);
    }
};

export const loadGame = () => {
    console.log('LOAD');
    const savedGame = localStorage.getItem('paperPiratesSave');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            gameState = Object.assign({}, gameState, loadedState);
            gameState.prestige = Object.assign({}, { level: 0, permanentBonus: 1 }, loadedState.prestige);
            offlineTime();
        } catch (e) {
            console.error("Could not load saved game state:", e);
            init(true);
        }
    }
};

const offlineTime = () => {
    console.log("offlineTime() chamada");
    const lastTime = parseInt(localStorage.getItem('paperPiratesLastSaveTime'));
    if (!isNaN(lastTime)) {
        const now = Date.now();
        const secondsPassed = Math.floor((now - lastTime) / 1000);
        const reputationGained = gameState.reputationPerSecond * secondsPassed;

        gameState.reputation += reputationGained;

        // Troque o alert pelo modal
        showOfflineModal(secondsPassed, reputationGained);
    }
}
