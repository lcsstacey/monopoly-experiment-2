const BOARD = [
  { name: 'GO', type: 'corner' },
  { name: 'Mediterranean', type: 'property', price: 60, rent: 8, color: '#8b5a2b' },
  { name: 'Community', type: 'card' },
  { name: 'Baltic', type: 'property', price: 60, rent: 12, color: '#8b5a2b' },
  { name: 'Income Tax', type: 'tax', amount: 100 },
  { name: 'Reading RR', type: 'railroad', price: 200, rent: 25 },
  { name: 'Oriental', type: 'property', price: 100, rent: 16, color: '#87ceeb' },
  { name: 'Chance', type: 'card' },
  { name: 'Vermont', type: 'property', price: 100, rent: 16, color: '#87ceeb' },
  { name: 'Connecticut', type: 'property', price: 120, rent: 20, color: '#87ceeb' },
  { name: 'Jail', type: 'corner' },
  { name: 'St Charles', type: 'property', price: 140, rent: 24, color: '#d946a7' },
  { name: 'Electric Co', type: 'utility', price: 150, rent: 20 },
  { name: 'States', type: 'property', price: 140, rent: 24, color: '#d946a7' },
  { name: 'Virginia', type: 'property', price: 160, rent: 28, color: '#d946a7' },
  { name: 'Penn RR', type: 'railroad', price: 200, rent: 25 },
  { name: 'St James', type: 'property', price: 180, rent: 32, color: '#f97316' },
  { name: 'Community', type: 'card' },
  { name: 'Tennessee', type: 'property', price: 180, rent: 32, color: '#f97316' },
  { name: 'New York', type: 'property', price: 200, rent: 36, color: '#f97316' },
  { name: 'Free Parking', type: 'corner' },
  { name: 'Kentucky', type: 'property', price: 220, rent: 40, color: '#ef4444' },
  { name: 'Chance', type: 'card' },
  { name: 'Indiana', type: 'property', price: 220, rent: 40, color: '#ef4444' },
  { name: 'Illinois', type: 'property', price: 240, rent: 44, color: '#ef4444' },
  { name: 'B&O RR', type: 'railroad', price: 200, rent: 25 },
  { name: 'Atlantic', type: 'property', price: 260, rent: 48, color: '#facc15' },
  { name: 'Ventnor', type: 'property', price: 260, rent: 48, color: '#facc15' },
  { name: 'Water Works', type: 'utility', price: 150, rent: 20 },
  { name: 'Marvin', type: 'property', price: 280, rent: 52, color: '#facc15' },
  { name: 'Go To Jail', type: 'gotojail' },
  { name: 'Pacific', type: 'property', price: 300, rent: 56, color: '#22c55e' },
  { name: 'North Carolina', type: 'property', price: 300, rent: 56, color: '#22c55e' },
  { name: 'Community', type: 'card' },
  { name: 'Pennsylvania', type: 'property', price: 320, rent: 60, color: '#22c55e' },
  { name: 'Short Line', type: 'railroad', price: 200, rent: 25 },
  { name: 'Chance', type: 'card' },
  { name: 'Park Place', type: 'property', price: 350, rent: 70, color: '#1d4ed8' },
  { name: 'Luxury Tax', type: 'tax', amount: 100 },
  { name: 'Boardwalk', type: 'property', price: 400, rent: 80, color: '#1d4ed8' },
];

const CHANCE = [
  { text: 'Advance to GO. Collect $200.', fn: (p) => { p.pos = 0; p.cash += 200; } },
  { text: 'Pay poor planning tax: -$100.', fn: (p) => { p.cash -= 100; } },
  { text: 'Great quarter at work. +$150.', fn: (p) => { p.cash += 150; } },
  { text: 'Move back 3 spaces.', fn: (p) => { p.pos = (p.pos + 37) % 40; } },
  { text: 'Collect birthday money +$80.', fn: (p) => { p.cash += 80; } },
];

const START_CASH = 1500;
const COLORS = ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#fb7185'];

const state = {
  players: [],
  current: 0,
  rolled: false,
  gameOver: false,
};

const el = {
  board: document.getElementById('board'),
  log: document.getElementById('log'),
  playersPanel: document.getElementById('playersPanel'),
  turnInfo: document.getElementById('turnInfo'),
  rollBtn: document.getElementById('rollBtn'),
  endBtn: document.getElementById('endBtn'),
  setupPanel: document.getElementById('setupPanel'),
  gameLayout: document.getElementById('gameLayout'),
  playerCount: document.getElementById('playerCount'),
  nameInputs: document.getElementById('nameInputs'),
  startBtn: document.getElementById('startBtn'),
  restartBtn: document.getElementById('restartBtn'),
  modal: document.getElementById('decisionModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalText: document.getElementById('modalText'),
  modalYes: document.getElementById('modalYes'),
  modalNo: document.getElementById('modalNo'),
};

function initNameInputs() {
  const count = Number(el.playerCount.value);
  el.nameInputs.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const input = document.createElement('input');
    input.placeholder = `Player ${i + 1} name`;
    input.value = `Player ${i + 1}`;
    input.dataset.index = i;
    el.nameInputs.appendChild(input);
  }
}

function boardPos(i) {
  if (i === 0) return { r: 11, c: 11 };
  if (i <= 9) return { r: 11, c: 11 - i };
  if (i === 10) return { r: 11, c: 1 };
  if (i <= 19) return { r: 11 - (i - 10), c: 1 };
  if (i === 20) return { r: 1, c: 1 };
  if (i <= 29) return { r: 1, c: (i - 20) + 1 };
  if (i === 30) return { r: 1, c: 11 };
  return { r: (i - 30) + 1, c: 11 };
}

function ownerOf(spaceIdx) {
  return state.players.find((p) => p.properties.includes(spaceIdx));
}

function railroadCount(player) {
  return player.properties.filter((idx) => BOARD[idx].type === 'railroad').length;
}

function utilityCount(player) {
  return player.properties.filter((idx) => BOARD[idx].type === 'utility').length;
}

function rentFor(space, owner, roll) {
  if (space.type === 'railroad') return 25 * Math.max(1, railroadCount(owner));
  if (space.type === 'utility') return roll * (utilityCount(owner) > 1 ? 10 : 4);
  return space.rent || 0;
}

function netWorth(player) {
  const assetValue = player.properties.reduce((sum, idx) => sum + (BOARD[idx].price || 0), 0);
  return player.cash + assetValue;
}

function log(message) {
  const line = document.createElement('p');
  line.textContent = message;
  el.log.prepend(line);
}

function renderBoard() {
  el.board.innerHTML = '';
  BOARD.forEach((space, idx) => {
    const node = document.createElement('div');
    const pos = boardPos(idx);
    node.className = `cell ${space.type === 'property' || space.type === 'railroad' || space.type === 'utility' ? 'property' : ''} ${space.type === 'corner' || space.type === 'gotojail' ? 'corner' : ''}`;
    node.style.gridRow = pos.r;
    node.style.gridColumn = pos.c;
    node.innerHTML = `<div class="name">${space.name}</div>${space.price ? `<div class="price">$${space.price}</div>` : ''}`;

    if (space.color) {
      const stripe = document.createElement('div');
      stripe.style.position = 'absolute';
      stripe.style.top = '0';
      stripe.style.left = '0';
      stripe.style.right = '0';
      stripe.style.height = '4px';
      stripe.style.background = space.color;
      node.appendChild(stripe);
    }

    const owner = ownerOf(idx);
    if (owner) {
      const badge = document.createElement('div');
      badge.className = 'owner-badge';
      badge.style.background = owner.color;
      node.appendChild(badge);
    }

    const tokens = document.createElement('div');
    tokens.className = 'tokens';
    state.players.filter((p) => p.pos === idx).forEach((p) => {
      const t = document.createElement('div');
      t.className = 'token';
      t.style.background = p.color;
      tokens.appendChild(t);
    });
    node.appendChild(tokens);
    el.board.appendChild(node);
  });

  const center = document.createElement('div');
  center.className = 'board-center';
  center.innerHTML = '<strong>MONOPOLY</strong><small>Local Multiplayer</small>';
  el.board.appendChild(center);
}

function renderPlayers() {
  const alive = state.players.filter((p) => !p.bankrupt);
  if (alive.length === 1 && !state.gameOver) {
    state.gameOver = true;
    log(`🏆 ${alive[0].name} wins the match!`);
  }

  el.playersPanel.innerHTML = '';
  const sorted = [...state.players].sort((a, b) => netWorth(b) - netWorth(a));
  sorted.forEach((p) => {
    const card = document.createElement('div');
    card.className = `player-card ${p.id === state.current && !state.gameOver ? 'active' : ''}`;
    card.innerHTML = `
      <div class="player-title">
        <strong>${p.name} ${p.bankrupt ? '(Out)' : ''}</strong>
        <span style="color:${p.color};font-weight:700">●</span>
      </div>
      <div class="player-meta">Cash: $${p.cash} · Properties: ${p.properties.length} · NW: $${netWorth(p)}</div>
    `;
    el.playersPanel.appendChild(card);
  });
}

function renderTurnInfo(lastRoll) {
  if (state.gameOver) {
    el.turnInfo.innerHTML = '<strong>Game over.</strong> Restart to play again.';
    el.rollBtn.disabled = true;
    el.endBtn.disabled = true;
    return;
  }

  const p = state.players[state.current];
  el.turnInfo.innerHTML = `
    <strong>${p.name}'s turn</strong><br>
    Position: ${BOARD[p.pos].name}<br>
    ${lastRoll ? `Last roll: ${lastRoll}` : 'Roll to start your turn.'}
  `;
}

function refresh(lastRoll = null) {
  renderBoard();
  renderPlayers();
  renderTurnInfo(lastRoll);
}

function nextActivePlayer() {
  let idx = state.current;
  for (let i = 0; i < state.players.length; i += 1) {
    idx = (idx + 1) % state.players.length;
    if (!state.players[idx].bankrupt) return idx;
  }
  return idx;
}

function showDecision({ title, text, yesLabel = 'Yes', noLabel = 'No' }) {
  return new Promise((resolve) => {
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;
    el.modalYes.textContent = yesLabel;
    el.modalNo.textContent = noLabel;

    const cleanup = () => {
      el.modalYes.onclick = null;
      el.modalNo.onclick = null;
    };

    el.modalYes.onclick = () => { cleanup(); el.modal.close(); resolve(true); };
    el.modalNo.onclick = () => { cleanup(); el.modal.close(); resolve(false); };
    el.modal.showModal();
  });
}

function bankruptIfNeeded(player) {
  if (player.cash >= 0) return;
  player.bankrupt = true;
  player.cash = 0;
  player.properties = [];
  log(`💥 ${player.name} is bankrupt and eliminated.`);
}

async function resolveLanding(player, roll) {
  const space = BOARD[player.pos];
  const owner = ownerOf(player.pos);

  if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
    if (!owner) {
      if (player.cash >= space.price) {
        const buy = await showDecision({
          title: `Buy ${space.name}?`,
          text: `Price: $${space.price}. ${player.name}, do you want to buy this property?`,
          yesLabel: 'Buy',
          noLabel: 'Skip',
        });
        if (buy) {
          player.cash -= space.price;
          player.properties.push(player.pos);
          log(`${player.name} bought ${space.name} for $${space.price}.`);
        } else {
          log(`${player.name} skipped buying ${space.name}.`);
        }
      } else {
        log(`${player.name} cannot afford ${space.name}.`);
      }
      return;
    }

    if (owner.id !== player.id) {
      const rent = rentFor(space, owner, roll);
      player.cash -= rent;
      owner.cash += rent;
      log(`${player.name} paid $${rent} rent to ${owner.name} on ${space.name}.`);
      bankruptIfNeeded(player);
    } else {
      log(`${player.name} landed on their own property.`);
    }
    return;
  }

  if (space.type === 'tax') {
    player.cash -= space.amount;
    log(`${player.name} paid ${space.name}: $${space.amount}.`);
    bankruptIfNeeded(player);
    return;
  }

  if (space.type === 'card') {
    const card = CHANCE[Math.floor(Math.random() * CHANCE.length)];
    card.fn(player);
    log(`🎴 ${player.name}: ${card.text}`);
    bankruptIfNeeded(player);
    return;
  }

  if (space.type === 'gotojail') {
    player.pos = 10;
    log(`🚓 ${player.name} goes to Jail.`);
    return;
  }

  if (space.name === 'GO') {
    log(`${player.name} is on GO.`);
  }
}

async function takeTurn() {
  if (state.gameOver) return;
  const player = state.players[state.current];
  if (player.bankrupt) {
    state.current = nextActivePlayer();
    refresh();
    return;
  }

  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  const roll = d1 + d2;
  state.rolled = true;

  const oldPos = player.pos;
  player.pos = (player.pos + roll) % 40;
  if (oldPos + roll >= 40) {
    player.cash += 200;
    log(`${player.name} passed GO and collected $200.`);
  }

  log(`🎲 ${player.name} rolled ${d1} + ${d2} = ${roll}.`);
  await resolveLanding(player, roll);

  refresh(`${d1} + ${d2} = ${roll}`);
  el.rollBtn.disabled = true;
  el.endBtn.disabled = false;
}

function endTurn() {
  if (!state.rolled || state.gameOver) return;
  state.rolled = false;
  el.rollBtn.disabled = false;
  el.endBtn.disabled = true;
  state.current = nextActivePlayer();
  refresh();
}

function startGame() {
  const names = [...el.nameInputs.querySelectorAll('input')].map((i, idx) => i.value.trim() || `Player ${idx + 1}`);
  state.players = names.map((name, idx) => ({
    id: idx,
    name,
    color: COLORS[idx % COLORS.length],
    cash: START_CASH,
    pos: 0,
    properties: [],
    bankrupt: false,
  }));
  state.current = 0;
  state.rolled = false;
  state.gameOver = false;

  el.log.innerHTML = '';
  log('Game started. Hot-seat multiplayer active.');

  el.setupPanel.classList.add('hidden');
  el.gameLayout.classList.remove('hidden');
  el.rollBtn.disabled = false;
  el.endBtn.disabled = true;
  refresh();
}

function restart() {
  el.setupPanel.classList.remove('hidden');
  el.gameLayout.classList.add('hidden');
  initNameInputs();
}

el.playerCount.addEventListener('change', initNameInputs);
el.startBtn.addEventListener('click', startGame);
el.rollBtn.addEventListener('click', takeTurn);
el.endBtn.addEventListener('click', endTurn);
el.restartBtn.addEventListener('click', restart);

initNameInputs();
