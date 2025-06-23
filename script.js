// --- DOM ELEMENTS ---
const reputationDisplay = document.getElementById('reputation-display');
const rpsDisplay = document.getElementById('rps-display');
const clickerBtn = document.getElementById('clicker-btn');
const clickerArea = document.getElementById('clicker-area');
const upgradesContainer = document.getElementById('upgrades-container');
const prestigeBtn = document.getElementById('prestige-btn');
const legendLevelDisplay = document.getElementById('legend-level');
const legendBonusDisplay = document.getElementById('legend-bonus');

// --- GAME STATE ---
let gameState = {
    reputation: 0,
    reputationPerSecond: 0,
    clickPower: 1,
    prestige: {
        level: 0,
        permanentBonus: 1, // Multiplier
    },
    upgrades: {},
    currentShip: 'paper_boat'
};

const PRESTIGE_COST_BASE = 1e9; // 1 Billion reputation to prestige
const PRESTIGE_BONUS_PER_LEVEL = 0.05; // 5% bonus per prestige level

// --- "DATABASE" DEFINITIONS ---

// This is the "database" of our game. Easy to add more!
const upgrades = [
    // Click Upgrades
    { id: 'bigger_sails', name: "Bigger Paper Sail", description: "Bigger numbers = better pirate. It's science.", type: 'click', baseCost: 10, effect: 1 },
    { id: 'wax_coating', name: "Wax Coating", description: "Makes your boat... less immediately soggy. Impressive!", type: 'click', baseCost: 100, effect: 5 },
    { id: 'origami_crows_nest', name: "Origami Crow's Nest", description: "You can see the whole puddle from up here.", type: 'click', baseCost: 1100, effect: 25 },
    { id: 'cosmic_mouse_pointer', name: "Cosmic Mouse Pointer", description: "Break the 4th wall. Click with cosmic intent.", type: 'click', baseCost: 150000, effect: 1000 },
    
    // Idle Upgrades
    { id: 'imaginary_friend', name: "Imaginary Friend", description: "Works for free, but his looting is also imaginary.", type: 'idle', baseCost: 50, effect: 1 },
    { id: 'eyepatch_goldfish', name: "Eyepatch Goldfish", description: "He's seen things. Mostly the inside of a plastic bag.", type: 'idle', baseCost: 500, effect: 10 },
    { id: 'garden_gnome', name: "Kidnapped Garden Gnome", description: "Surprisingly loyal once you show him your treasure.", type: 'idle', baseCost: 7500, effect: 50 },
    { id: 'ghost_pirates', name: "Ghost Pirate Crew", description: "They work for 'boos' and have great dental plans.", type: 'idle', baseCost: 100000, effect: 400 },
    { id: 'wormhole_cannon', name: "Wormhole Cannon", description: "Loot other dimensions. Mostly just finds socks.", type: 'idle', baseCost: 5000000, effect: 10000 },

    // Ship Upgrades (special)
    { id: 'ship_bathtub', name: "Bathtub Barque", description: "Graduate from the puddle to the tub! Unlocks new upgrades.", type: 'ship', baseCost: 50000, targetShip: 'bathtub_barque' },
    { id: 'ship_steampunk', name: "Steampunk Airship", description: "Who needs water? The sky's the limit!", type: 'ship', baseCost: 1e7, targetShip: 'steampunk_airship' },
    { id: 'ship_cosmic', name: "Cosmic Clipper", description: "Plunder the stars themselves for... stardust?", type: 'ship', baseCost: 5e8, targetShip: 'cosmic_clipper' },
];

const shipSVGs = {
    paper_boat: '<img class="ship-img" src="assets/ships/paper-boat.svg" alt="Paper Boat">',
    bathtub_barque: '<img class="ship-img" src="assets/ships/paper-boat.svg" alt="Paper Boat">',
    steampunk_airship: '<img class="ship-img" src="assets/ships/paper-boat.svg" alt="Paper Boat">',
    cosmic_clipper: '<img class="ship-img" src="assets/ships/paper-boat.svg" alt="Paper Boat">',
};

// --- GAME LOGIC FUNCTIONS ---

const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(0);
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    const i = Math.floor(Math.log10(num) / 3);
    return (num / Math.pow(1000, i)).toFixed(2) + suffixes[i];
};

const showFloatingText = (text) => {
    const floatie = document.createElement('div');
    floatie.className = 'floating-text';
    floatie.textContent = text;
    floatie.style.left = `${Math.random() * 40 + 30}%`;
    clickerArea.appendChild(floatie);
    
    setTimeout(() => {
        floatie.remove();
    }, 1000);
};

const recalculateStats = () => {
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

const updateUI = () => {
    reputationDisplay.textContent = formatNumber(gameState.reputation);
    rpsDisplay.textContent = `earning ${formatNumber(gameState.reputationPerSecond)} per second`;
    
    // Update upgrade buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        const cost = parseFloat(btn.dataset.cost);
        btn.disabled = gameState.reputation < cost;
    });

    document.querySelectorAll('.upgrade').forEach(el => {
        const cost = parseFloat(el.dataset.cost);
         if (gameState.reputation < cost) {
            el.classList.add('disabled');
        } else {
            el.classList.remove('disabled');
        }
    });

    // Update prestige button
    const prestigeCost = PRESTIGE_COST_BASE * Math.pow(10, gameState.prestige.level);
    prestigeBtn.disabled = gameState.reputation < prestigeCost;
    prestigeBtn.dataset.tooltip = `Requires ${formatNumber(prestigeCost)} Reputation to reset for a permanent bonus.`;
    legendLevelDisplay.textContent = gameState.prestige.level;
    legendBonusDisplay.textContent = ((gameState.prestige.permanentBonus - 1) * 100).toFixed(0);

    // Update ship SVG
    if (clickerBtn.dataset.ship !== gameState.currentShip) {
        clickerBtn.innerHTML = shipSVGs[gameState.currentShip];
        clickerBtn.dataset.ship = gameState.currentShip;
    }
};

const buyUpgrade = (id) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;

    const state = gameState.upgrades[id] || { level: 0, cost: upgrade.baseCost };
    
    if (gameState.reputation >= state.cost) {
        gameState.reputation -= state.cost;
        state.level++;

        // Special handling for ship upgrades
        if(upgrade.type === 'ship') {
            gameState.currentShip = upgrade.targetShip;
            // Make ship upgrades one-time purchases for simplicity
            state.cost = Infinity;
        } else {
            state.cost = Math.ceil(upgrade.baseCost * Math.pow(1.15, state.level));
        }
        
        gameState.upgrades[id] = state;
        
        renderUpgrades();
        recalculateStats();
        updateUI();
    }
};

const renderUpgrades = () => {
    // Clear upgrade container
    upgradesContainer.innerHTML = '';
    for (const upgrade of upgrades) {
        const state = gameState.upgrades[upgrade.id] || { level: 0, cost: upgrade.baseCost };

        // Don't render purchased one-time ship upgrades
        if (upgrade.type === 'ship' && state.level > 0) continue;

        const el = document.createElement('div');
        el.className = 'upgrade';
        el.dataset.cost = state.cost;

        el.innerHTML = `
            <div class="upgrade-info">
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
            </div>
            <div class="upgrade-stats">
                <div>Level: ${state.level}</div>
                <div class="upgrade-cost">Cost: ${formatNumber(state.cost)}</div>
            </div>
            <button class="buy-btn" data-upgrade-id="${upgrade.id}" data-cost="${state.cost}">Buy</button>
        `;
        upgradesContainer.appendChild(el);
    }
};

// --- EVENT HANDLERS ---

clickerBtn.addEventListener('click', () => {
    const amount = gameState.clickPower;
    gameState.reputation += amount;
    showFloatingText(`+${formatNumber(amount)}`);
    updateUI();
});

upgradesContainer.addEventListener('click', (e) => {
    if (e.target.matches('.buy-btn')) {
        buyUpgrade(e.target.dataset.upgradeId);
    }
});

prestigeBtn.addEventListener('click', () => {
    const prestigeCost = PRESTIGE_COST_BASE * Math.pow(10, gameState.prestige.level);
    if (gameState.reputation >= prestigeCost) {
        if(confirm("Are you sure you want to start over? You'll gain a permanent bonus to all Reputation gains, but lose your current progress (except Legendary Level).")) {
            // Calculate new prestige stats
            const newLevel = gameState.prestige.level + 1;
            const newBonus = 1 + (newLevel * PRESTIGE_BONUS_PER_LEVEL);

            // Reset game state, but keep prestige
            const prestigeData = { level: newLevel, permanentBonus: newBonus };
            init(true); // Hard reset
            gameState.prestige = prestigeData;

            saveGame();
            recalculateStats();
            renderUpgrades();
            updateUI();
        }
    }
});

// --- GAME LOOP & PERSISTENCE ---

const saveGame = () => {
    try {
        localStorage.setItem('paperPiratesSave', JSON.stringify(gameState));
    } catch (e) {
        console.error("Could not save game state:", e);
    }
};

const loadGame = () => {
    const savedGame = localStorage.getItem('paperPiratesSave');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            // Merge saved state with default to handle new upgrades in updates
            gameState = Object.assign({}, gameState, loadedState);
            gameState.prestige = Object.assign({}, {level: 0, permanentBonus: 1}, loadedState.prestige);
        } catch (e) {
            console.error("Could not load saved game state:", e);
            init(true); // If save is corrupt, start fresh
        }
    }
};

const init = (isReset = false) => {
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

// --- INITIALIZE GAME ---

init();
renderUpgrades();
recalculateStats();

// Main game loop for idle income
setInterval(() => {
    gameState.reputation += gameState.reputationPerSecond / 10; // Update 10 times per second for smoothness
}, 100);

// UI update loop
setInterval(() => {
    updateUI();
}, 250); // Less frequent UI updates are better for performance

// Autosave loop
setInterval(() => {
    saveGame();
}, 5000); // Save every 5 seconds