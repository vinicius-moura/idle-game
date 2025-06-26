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
    gameState = {
        reputation: 0,
        reputationPerSecond: 0,
        clickPower: 1,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: {},
        currentShip: 'paper_boat'
    };
    if (!isReset) {
        loadGame();
    }
};

export const saveGame = () => {
    try {
        localStorage.setItem('paperPiratesSave', JSON.stringify(gameState));
    } catch (e) {
        console.error("Could not save game state:", e);
    }
};

export const loadGame = () => {
    const savedGame = localStorage.getItem('paperPiratesSave');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            gameState = Object.assign({}, gameState, loadedState);
            gameState.prestige = Object.assign({}, {level: 0, permanentBonus: 1}, loadedState.prestige);
        } catch (e) {
            console.error("Could not load saved game state:", e);
            init(true);
        }
    }
};
