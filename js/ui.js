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
    const template = document.getElementById('upgrade-template');

    for (const upgrade of upgrades) {
        const state = gameState.upgrades[upgrade.id] || { level: 0, cost: upgrade.baseCost };

        // Skip 'ship' upgrades already bought
        if (upgrade.type === 'ship' && state.level > 0) {
            continue;
        }

        // Clone the template content
        const clone = template.content.cloneNode(true);

        // Select the root upgrade div inside the clone
        const el = clone.querySelector('.upgrade');
        
        el.dataset.upgradeId = upgrade.id;
        
        // Fill in upgrade
        el.querySelector('h3').textContent = upgrade.name;
        el.querySelector('p').textContent = upgrade.description;
        el.querySelector('.upgrade-stats > div:first-child').textContent = `Level: ${state.level}`;
        el.querySelector('.upgrade-cost').textContent = `Cost: ${formatNumber(state.cost)}`;
        
        const button = el.querySelector('.buy-btn');
        
        button.dataset.upgradeId = upgrade.id;
        button.dataset.cost = state.cost;

        // Append to container
        upgradesContainer.appendChild(clone);
    }
};

export const updateUpgradeElement = (id) => {
    const upgrade = upgrades.find(u => u.id === id);
    const state = gameState.upgrades[id] || { level: 0, cost: upgrade.baseCost };
    const el = upgradesContainer.querySelector(`.upgrade[data-upgrade-id="${id}"]`);

    const levelDiv = el.querySelector('.upgrade-stats > div:first-child');
    const costDiv = el.querySelector('.upgrade-cost');
    const button = el.querySelector('.buy-btn');
    
    levelDiv.textContent = `Level: ${state.level}`;
    costDiv.textContent = `Cost: ${formatNumber(state.cost)}`;
    button.dataset.cost = state.cost;

    // Add flash effect
    el.classList.add('flash');
    setTimeout(() => {
        el.classList.remove('flash');
    }, 500);
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

    message.textContent = `While you went out for ${formatDuration(secondsPassed)}, you earned ${formatNumber(reputationGained)} reputation!`;

    modal.style.display = 'flex';

    const closeModal = () => {
        modal.style.display = 'none';
        closeBtn.removeEventListener('click', closeModal);
        okBtn.removeEventListener('click', closeModal);
    };

    closeBtn.addEventListener('click', closeModal);
    okBtn.addEventListener('click', closeModal);
};

function formatDuration(seconds) {
    const days = Math.floor(seconds / (24 * 3600));

    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);

    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    const parts = [];

    if (days > 0) { parts.push(`${days} day${days !== 1 ? 's' : ''}`); }
    if (hours > 0) { parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`); }
    if (minutes > 0) { parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`); }

    if (parts.length === 1) {
        return parts[0];
    }

    if (parts.length === 2) {
        return parts.join(' and ');
    }

    const last = parts.pop();

    return parts.join(', ') + ' and ' + last;
}
