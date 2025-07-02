import { gameState, PRESTIGE_COST_BASE } from './gameState.js';
import { upgrades } from './upgrades.js';
import { formatNumber } from './utils.js';

const reputationDisplay = document.getElementById('reputation-display');
const rpsDisplay = document.getElementById('rps-display');
const clickerBtn = document.getElementById('clicker-btn');
const upgradesContainer = document.getElementById('upgrades-container');
const prestigeBtn = document.getElementById('prestige-btn');
const legendLevelDisplay = document.getElementById('legend-level');
const legendBonusDisplay = document.getElementById('legend-bonus');
const clickerArea = document.getElementById('clicker-area');

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

export const updateUI = () => {
    reputationDisplay.textContent = formatNumber(gameState.reputation);
    rpsDisplay.textContent = `${formatNumber(gameState.reputationPerSecond)}`;

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

    const prestigeCost = PRESTIGE_COST_BASE * Math.pow(10, gameState.prestige.level);
    prestigeBtn.disabled = gameState.reputation < prestigeCost;
    prestigeBtn.dataset.tooltip = `Requires ${formatNumber(prestigeCost)} Reputation to reset for a permanent bonus.`;
    legendLevelDisplay.textContent = gameState.prestige.level;
    legendBonusDisplay.textContent = ((gameState.prestige.permanentBonus - 1) * 100).toFixed(0);

    if (clickerBtn.dataset.ship !== gameState.currentShip) {
        clickerBtn.innerHTML = shipSVGs[gameState.currentShip];
        clickerBtn.dataset.ship = gameState.currentShip;
    }
};

export const renderUpgrades = () => {
    upgradesContainer.innerHTML = '';
    for (const upgrade of upgrades) {
        const state = gameState.upgrades[upgrade.id] || { level: 0, cost: upgrade.baseCost };
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

const shipSVGs = {
    paper_boat: '<img class="ship-img" src="assets/ships/ship_1.png" alt="Paper Boat">',
    bathtub_barque: '<img class="ship-img" src="assets/ships/ship_2.png" alt="Paper Boat">',
    steampunk_airship: '<img class="ship-img" src="assets/ships/ship_3.png" alt="Paper Boat">',
    cosmic_clipper: '<img class="ship-img" src="assets/ships/ship_4.png" alt="Paper Boat">',
};

export const showFloatingText = (text) => {
    const formatedNumber = Number(text.toFixed(3));
    const floatie = document.createElement('div');
    floatie.className = 'floating-text';
    if (Number.isInteger(formatedNumber)) {
        floatie.textContent = `+${text}`;
    } else {
        floatie.textContent = `+${formatedNumber}`;
    }
    floatie.style.left = `${Math.random() * 40 + 30}%`;
    clickerArea.appendChild(floatie);

    setTimeout(() => {
        floatie.remove();
    }, 1000);
};

export const showOfflineModal = (secondsPassed, reputationGained) => {
    const modal = document.getElementById('offline-modal');
    const message = document.getElementById('offline-modal-message');
    const closeBtn = document.getElementById('offline-modal-close');
    const okBtn = document.getElementById('offline-modal-ok');

    message.textContent = `While you went out for ${secondsPassed} seconds, you earned ${formatNumber(reputationGained)} reputation!`;

    modal.style.display = 'flex';

    const closeModal = () => {
        modal.style.display = 'none';
        closeBtn.removeEventListener('click', closeModal);
        okBtn.removeEventListener('click', closeModal);
    };

    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
};
