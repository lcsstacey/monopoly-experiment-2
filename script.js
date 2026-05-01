/* ═══════════════════════════════════════════════════════
   MONOPOLY — Family Edition (Premium Enhanced UI)
   ═══════════════════════════════════════════════════════ */

// ─── BOARD DATA ───
const BOARD = [
  { name: 'GO', type: 'corner' },
  { name: 'Mediterranean', type: 'property', price: 60, rent: 8, color: '#8b5a2b' },
  { name: 'Community', type: 'card', deck: 'community' },
  { name: 'Baltic', type: 'property', price: 60, rent: 12, color: '#8b5a2b' },
  { name: 'Income Tax', type: 'tax', amount: 100 },
  { name: 'Reading RR', type: 'railroad', price: 200, rent: 25 },
  { name: 'Oriental', type: 'property', price: 100, rent: 16, color: '#87ceeb' },
  { name: 'Chance', type: 'card', deck: 'chance' },
  { name: 'Vermont', type: 'property', price: 100, rent: 16, color: '#87ceeb' },
  { name: 'Connecticut', type: 'property', price: 120, rent: 20, color: '#87ceeb' },
  { name: 'Jail', type: 'corner' },
  { name: 'St Charles', type: 'property', price: 140, rent: 24, color: '#d946a7' },
  { name: 'Electric Co', type: 'utility', price: 150, rent: 20 },
  { name: 'States', type: 'property', price: 140, rent: 24, color: '#d946a7' },
  { name: 'Virginia', type: 'property', price: 160, rent: 28, color: '#d946a7' },
  { name: 'Penn RR', type: 'railroad', price: 200, rent: 25 },
  { name: 'St James', type: 'property', price: 180, rent: 32, color: '#f97316' },
  { name: 'Community', type: 'card', deck: 'community' },
  { name: 'Tennessee', type: 'property', price: 180, rent: 32, color: '#f97316' },
  { name: 'New York', type: 'property', price: 200, rent: 36, color: '#f97316' },
  { name: 'Free Parking', type: 'corner' },
  { name: 'Kentucky', type: 'property', price: 220, rent: 40, color: '#ef4444' },
  { name: 'Chance', type: 'card', deck: 'chance' },
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
  { name: 'Community', type: 'card', deck: 'community' },
  { name: 'Pennsylvania', type: 'property', price: 320, rent: 60, color: '#22c55e' },
  { name: 'Short Line', type: 'railroad', price: 200, rent: 25 },
  { name: 'Chance', type: 'card', deck: 'chance' },
  { name: 'Park Place', type: 'property', price: 350, rent: 70, color: '#1d4ed8' },
  { name: 'Luxury Tax', type: 'tax', amount: 100 },
  { name: 'Boardwalk', type: 'property', price: 400, rent: 80, color: '#1d4ed8' },
];

const JAIL_POS = 10;

// Card schema:
//   text         — flavor text shown to the player
//   cash         — flat cash delta (positive collect / negative pay)
//   move         — absolute target position (collects $200 if forward past GO)
//   delta        — relative move (no GO bonus, e.g. "go back 3")
//   moveType     — 'nearestRR' | 'nearestUtility' (auto-finds target)
//   resolveLanding — after movement, run the normal landing logic (buy/rent)
//   rentMult     — when resolving landing on owned space, multiply rent
//   utilityRoll  — when on owned utility, charge dice × this multiplier instead
//   toJail       — send straight to Jail (no $200, no movement)
//   getOut       — grant a Get Out of Jail Free card
//   payEachPlayer    — pay this much to every other live player
//   collectEachPlayer — collect this much from every other live player
//   repairsPerProp   — pay this for each property owned
const CHANCE = [
  { text: 'Advance to GO. Collect $200.', move: 0 },
  { text: 'Advance to Boardwalk.', move: 39, resolveLanding: true },
  { text: 'Advance to Illinois Avenue. Collect $200 if you pass GO.', move: 25, resolveLanding: true },
  { text: 'Advance to St Charles Place. Collect $200 if you pass GO.', move: 11, resolveLanding: true },
  { text: 'Advance to the nearest Railroad. Pay double rent if owned.', moveType: 'nearestRR', resolveLanding: true, rentMult: 2 },
  { text: 'Advance to the nearest Utility. Pay 10× the dice if owned.', moveType: 'nearestUtility', resolveLanding: true, utilityRoll: 10 },
  { text: 'Bank pays you a dividend of $50.', cash: 50 },
  { text: 'Get Out of Jail Free. Keep this card.', getOut: true },
  { text: 'Go back 3 spaces.', delta: -3, resolveLanding: true },
  { text: 'Go directly to Jail. Do not pass GO.', toJail: true },
  { text: 'Make general repairs on your properties: pay $25 each.', repairsPerProp: 25 },
  { text: 'Speeding fine. Pay $15.', cash: -15 },
  { text: 'Take a trip to Reading Railroad.', move: 5, resolveLanding: true },
  { text: 'Pay each player $50 — chairman fee.', payEachPlayer: 50 },
  { text: 'Your building loan matures. Collect $150.', cash: 150 },
  { text: 'Crossword competition. Collect $100.', cash: 100 },
];

const COMMUNITY = [
  { text: 'Advance to GO. Collect $200.', move: 0 },
  { text: 'Bank error in your favor. Collect $200.', cash: 200 },
  { text: "Doctor's fee. Pay $50.", cash: -50 },
  { text: 'From sale of stock you collect $50.', cash: 50 },
  { text: 'Get Out of Jail Free. Keep this card.', getOut: true },
  { text: 'Go directly to Jail. Do not pass GO.', toJail: true },
  { text: 'Grand Opera Night — collect $50 from every player.', collectEachPlayer: 50 },
  { text: 'Holiday fund matures. Collect $100.', cash: 100 },
  { text: 'Income tax refund. Collect $20.', cash: 20 },
  { text: "It's your birthday — each player gives you $10.", collectEachPlayer: 10 },
  { text: 'Life insurance matures. Collect $100.', cash: 100 },
  { text: 'Hospital fees. Pay $100.', cash: -100 },
  { text: 'School fees. Pay $50.', cash: -50 },
  { text: 'Receive consultancy fee of $25.', cash: 25 },
  { text: 'You have won second prize in a beauty contest. Collect $10.', cash: 10 },
  { text: 'You inherit $100.', cash: 100 },
];

const START_CASH = 1500;
const SAVE_KEY = 'monopoly-family-edition-save';
const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a78bfa', '#fb7185'];

// ─── 3D DICE CONFIG ───
const FACE_ROTATIONS = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 },
};

const PIP_LAYOUTS = {
  1: [[2,2]],
  2: [[1,3],[3,1]],
  3: [[1,3],[2,2],[3,1]],
  4: [[1,1],[1,3],[3,1],[3,3]],
  5: [[1,1],[1,3],[2,2],[3,1],[3,3]],
  6: [[1,1],[1,3],[2,1],[2,3],[3,1],[3,3]],
};

// ─── STATE ───
const state = {
  players: [],
  current: 0,
  turnNumber: 1,
  rolled: false,
  gameOver: false,
  processingTurn: false,
  lastRoll: null,
  freeParkingPot: 0,
  musicOn: false,
  motionOn: true,
  dice: [1, 1],
  doublesThisTurn: 0,
};

let inspectedIdx = null;

// ─── HELPERS ───
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

// ─── DOM REFS ───
const el = {
  board: document.getElementById('board'),
  boardPanel: document.getElementById('boardPanel'),
  log: document.getElementById('log'),
  playersPanel: document.getElementById('playersPanel'),
  turnInfo: document.getElementById('turnInfo'),
  turnPill: document.getElementById('turnPill'),
  rollBtn: document.getElementById('rollBtn'),
  endBtn: document.getElementById('endBtn'),
  setupPanel: document.getElementById('setupPanel'),
  gameLayout: document.getElementById('gameLayout'),
  playerCount: document.getElementById('playerCount'),
  nameInputs: document.getElementById('nameInputs'),
  startBtn: document.getElementById('startBtn'),
  restartBtn: document.getElementById('restartBtn'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),
  saveBtn: document.getElementById('saveBtn'),
  clearLogBtn: document.getElementById('clearLogBtn'),
  motionBtn: document.getElementById('motionBtn'),
  musicBtn: document.getElementById('musicBtn'),
  rulesBtn: document.getElementById('rulesBtn'),
  rulesModal: document.getElementById('rulesModal'),
  rulesClose: document.getElementById('rulesClose'),
  modal: document.getElementById('decisionModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalText: document.getElementById('modalText'),
  modalYes: document.getElementById('modalYes'),
  modalNo: document.getElementById('modalNo'),
  fxCanvas: document.getElementById('fxCanvas'),
  confettiCanvas: document.getElementById('confettiCanvas'),
  diceTray: document.getElementById('diceTray'),
  dieOne: null,
  dieTwo: null,
  rollTotal: document.getElementById('rollTotal'),
  turnCountLabel: document.getElementById('turnCountLabel'),
  activePlayersLabel: document.getElementById('activePlayersLabel'),
  potLabel: document.getElementById('potLabel'),
  toastContainer: document.getElementById('toastContainer'),
  spaceInspector: document.getElementById('spaceInspector'),
};

// ─── AUDIO ───
let audioCtx;
let jazzTimer;
let ambientNodes = null;

function ensureAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  }
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  try {
    audioCtx = new Ctor();
  } catch (_) {
    audioCtx = null;
  }
  return audioCtx;
}

// ─── 3D DICE BUILDER ───
function createDieCube(id) {
  const scene = document.createElement('div');
  scene.className = 'die-scene';
  const cube = document.createElement('div');
  cube.className = 'die-cube';
  cube.id = id;

  for (let v = 1; v <= 6; v += 1) {
    const face = document.createElement('div');
    face.className = `die-face die-f${v}`;
    PIP_LAYOUTS[v].forEach(([r, c]) => {
      const pip = document.createElement('span');
      pip.className = 'pip';
      pip.style.gridRow = r;
      pip.style.gridColumn = c;
      face.appendChild(pip);
    });
    cube.appendChild(face);
  }

  scene.appendChild(cube);
  return scene;
}

function initDice() {
  el.diceTray.insertBefore(createDieCube('dieOne'), el.rollTotal);
  el.diceTray.insertBefore(createDieCube('dieTwo'), el.rollTotal);
  el.dieOne = document.getElementById('dieOne');
  el.dieTwo = document.getElementById('dieTwo');
}

function getDieTransform(value) {
  const r = FACE_ROTATIONS[value];
  return `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
}

// ─── SETUP ───
function initNameInputs() {
  const count = Number(el.playerCount.value);
  el.nameInputs.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const row = document.createElement('div');
    row.className = 'name-input-row';
    const dot = document.createElement('div');
    dot.className = 'color-dot';
    dot.style.background = COLORS[i];
    const input = document.createElement('input');
    input.value = `Player ${i + 1}`;
    input.placeholder = `Player ${i + 1}`;
    row.appendChild(dot);
    row.appendChild(input);
    el.nameInputs.appendChild(row);
  }
}

// ─── BOARD HELPERS ───
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
  return state.players.find((p) => !p.bankrupt && p.properties.includes(spaceIdx));
}

function countByType(player, type) {
  return player.properties.filter((idx) => BOARD[idx].type === type).length;
}

function isMonopoly(owner, space) {
  if (!space.color) return false;
  const colorGroup = BOARD.map((sp, idx) => ({ sp, idx }))
    .filter(({ sp }) => sp.color === space.color)
    .map(({ idx }) => idx);
  return colorGroup.length > 1 && colorGroup.every((idx) => owner.properties.includes(idx));
}

function rentFor(space, owner, roll) {
  if (space.type === 'railroad') return 25 * countByType(owner, 'railroad');
  if (space.type === 'utility') return roll * (countByType(owner, 'utility') === 2 ? 10 : 4);
  if (space.type === 'property') return isMonopoly(owner, space) ? space.rent * 2 : space.rent;
  return 0;
}

function netWorth(player) {
  const assets = player.properties.reduce((sum, idx) => sum + (BOARD[idx].price || 0), 0);
  return player.cash + assets;
}

// ─── TOAST SYSTEM ───
function showToast(message, type) {
  const colors = { success: '#34d399', danger: '#f87171', info: '#60a5fa', gold: '#c9a84c' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  const accent = document.createElement('div');
  accent.className = 'toast-accent';
  accent.style.background = colors[type] || colors.info;
  const span = document.createElement('span');
  span.textContent = message;
  toast.appendChild(accent);
  toast.appendChild(span);
  el.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('exit');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ─── CONFETTI ───
let confettiRaf = null;
function launchConfetti() {
  const canvas = el.confettiCanvas;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (confettiRaf) cancelAnimationFrame(confettiRaf);

  const pieces = [];
  const palette = ['#c9a84c', '#e0c56c', '#3b82f6', '#ef4444', '#22c55e', '#a78bfa', '#fbbf24', '#fb7185'];

  for (let i = 0; i < 160; i += 1) {
    pieces.push({
      x: Math.random() * w,
      y: Math.random() * h * -1.2,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 3 + 2.5,
      size: Math.random() * 7 + 3,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 10,
      life: 1,
    });
  }

  let frame = 0;
  const maxFrames = 200;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    frame += 1;
    let alive = 0;

    pieces.forEach((p) => {
      if (p.life <= 0) return;
      alive += 1;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.rot += p.rotV;
      if (frame > maxFrames * 0.55) p.life -= 0.015;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (alive > 0 && frame < maxFrames + 120) {
      confettiRaf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, w, h);
      confettiRaf = null;
    }
  }

  confettiRaf = requestAnimationFrame(draw);
}

// ─── WIN OVERLAY ───
function showWinOverlay(winner) {
  const existing = document.querySelector('.win-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'win-overlay';
  overlay.innerHTML = `
    <div class="win-card">
      <div class="win-trophy">&#127942;</div>
      <div class="win-title">${escapeHtml(winner.name)} Wins!</div>
      <div class="win-subtitle">Net Worth: $${netWorth(winner)}</div>
      <button class="btn primary" style="width:100%">Continue</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('.btn').addEventListener('click', () => overlay.remove());
}

// ─── LOGGING ───
function log(message) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  let dotColor = 'var(--text-muted)';
  if (message.includes('bought') || message.includes('collected') || message.includes('Collect') || message.includes('$200')) {
    dotColor = 'var(--green)';
  } else if (message.includes('paid') || message.includes('Pay') || message.includes('bankrupt') || message.includes('Jail')) {
    dotColor = 'var(--red)';
  } else if (message.includes('rolled') || message.includes('landed')) {
    dotColor = 'var(--blue)';
  } else if (message.includes('wins') || message.includes('Free Parking')) {
    dotColor = 'var(--gold)';
  }

  const dot = document.createElement('div');
  dot.className = 'log-dot';
  dot.style.background = dotColor;
  const span = document.createElement('span');
  span.textContent = message;
  entry.appendChild(dot);
  entry.appendChild(span);
  el.log.prepend(entry);
}

function setTurnPill(text, color) {
  color = color || '#475569';
  el.turnPill.textContent = text;
  el.turnPill.style.borderColor = color;
  el.turnPill.style.boxShadow = `0 0 0 1px ${color}44`;
}

// ─── RENDERING ───
function renderBoard() {
  el.board.innerHTML = '';
  BOARD.forEach((space, idx) => {
    const node = document.createElement('div');
    const pos = boardPos(idx);
    const isOwnable = ['property', 'railroad', 'utility'].includes(space.type);
    const isCorner = ['corner', 'gotojail'].includes(space.type);

    node.className = `cell${isOwnable ? ' property' : ''}${isCorner ? ' corner' : ''}`;

    if (idx >= 1 && idx <= 9) node.classList.add('side-bottom');
    else if (idx >= 11 && idx <= 19) node.classList.add('side-left');
    else if (idx >= 21 && idx <= 29) node.classList.add('side-top');
    else if (idx >= 31 && idx <= 39) node.classList.add('side-right');

    if (!state.gameOver && state.players[state.current] && state.players[state.current].pos === idx) {
      node.classList.add('current-space');
    }
    if (inspectedIdx === idx) {
      node.classList.add('inspected');
    }

    node.style.gridRow = pos.r;
    node.style.gridColumn = pos.c;

    if (space.color) {
      node.style.background = `linear-gradient(150deg, ${space.color}14, transparent 55%), linear-gradient(150deg, #13131f, #0b0b14)`;
    }

    node.innerHTML = `<div class="name">${space.name}</div>${space.price ? `<div class="price">$${space.price}</div>` : ''}`;

    if (space.color) {
      const stripe = document.createElement('div');
      stripe.className = 'color-stripe';
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
    const currentPlayer = state.players[state.current];
    state.players.filter((p) => !p.bankrupt && p.pos === idx).forEach((p) => {
      const token = document.createElement('div');
      token.className = `token${currentPlayer && p.id === currentPlayer.id ? ' active-player' : ''}`;
      token.style.background = p.color;
      tokens.appendChild(token);
    });
    node.appendChild(tokens);

    node.addEventListener('click', () => inspectSpace(idx));
    el.board.appendChild(node);
  });

  const center = document.createElement('div');
  center.className = 'board-center';
  center.innerHTML = `
    <div class="board-logo">MONOPOLY</div>
    <div class="board-tag">Family Edition</div>
    ${state.freeParkingPot > 0 ? `<div class="board-pot">Free Parking: $${state.freeParkingPot}</div>` : ''}
  `;
  el.board.appendChild(center);
}

function renderPlayers() {
  const alive = state.players.filter((p) => !p.bankrupt);
  if (alive.length <= 1 && state.players.length > 1 && !state.gameOver) {
    state.gameOver = true;
    const winner = alive[0];
    if (winner) {
      log(`${winner.name} wins with net worth $${netWorth(winner)}.`);
      setTurnPill('Game Over', winner.color);
      showWinOverlay(winner);
      launchConfetti();
      playSfx('win');
    }
  }

  const sorted = [...state.players].sort((a, b) => netWorth(b) - netWorth(a));
  const maxNW = Math.max(...sorted.map((p) => netWorth(p)), 1);
  const activeId = state.players[state.current] ? state.players[state.current].id : -1;

  el.playersPanel.innerHTML = '';
  sorted.forEach((p, rank) => {
    const nw = netWorth(p);
    const pct = ((nw / maxNW) * 100).toFixed(1);
    const initial = escapeHtml(p.name.charAt(0).toUpperCase() || '?');
    const isActive = p.id === activeId && !state.gameOver;

    const ownedColors = [...new Set(p.properties.map((idx) => BOARD[idx].color).filter(Boolean))];
    const colorDots = ownedColors.map((c) => `<span class="prop-dot" style="background:${c}"></span>`).join('');
    const safeName = escapeHtml(p.name);
    const safeColor = escapeHtml(p.color);
    const badges = [];
    if (p.jailTurns > 0) badges.push(`<span class="player-badge jail">Jail ${p.jailTurns}/3</span>`);
    if (p.getOutCards > 0) badges.push(`<span class="player-badge gooj">Get Out ×${p.getOutCards}</span>`);

    const card = document.createElement('div');
    card.className = `player-card${isActive ? ' active' : ''}${p.bankrupt ? ' bankrupt' : ''}`;
    card.innerHTML = `
      <div class="player-header">
        <div class="player-avatar" style="background:${safeColor}">${initial}</div>
        <div class="player-info">
          <div class="player-name">${safeName}${p.bankrupt ? ' (Out)' : ''}</div>
          <div class="player-stats">
            <span><span class="stat-label">Cash</span> $${p.cash}</span>
            <span><span class="stat-label">Net</span> $${nw}</span>
          </div>
          ${badges.length ? `<div class="player-badges">${badges.join('')}</div>` : ''}
          ${colorDots ? `<div class="prop-dots">${colorDots}</div>` : ''}
        </div>
        <div class="player-rank" style="${isActive ? 'color:var(--gold)' : ''}">#${rank + 1}</div>
      </div>
      ${!p.bankrupt ? `<div class="nw-bar"><div class="nw-fill" style="--nw-pct:${pct}%;${isActive ? `background:linear-gradient(90deg,${safeColor}88,${safeColor})` : ''}"></div></div>` : ''}
    `;
    el.playersPanel.appendChild(card);
  });
}

function renderTurnInfo() {
  if (state.gameOver) {
    el.turnInfo.innerHTML = '<strong>Game finished.</strong> Restart or load a saved session.';
    el.rollBtn.disabled = true;
    el.endBtn.disabled = true;
    return;
  }

  const p = state.players[state.current];
  setTurnPill(`${p.name}'s turn`, p.color);
  const status = [];
  status.push(`Position: ${escapeHtml(BOARD[p.pos].name)}`);
  if (p.jailTurns > 0) status.push(`<span style="color:var(--red)">In Jail (turn ${p.jailTurns}/3)</span>`);
  if (state.doublesThisTurn > 0 && p.jailTurns === 0) status.push(`<span style="color:var(--gold)">Doubles ×${state.doublesThisTurn} — roll again</span>`);
  status.push(state.lastRoll ? `Last roll: ${escapeHtml(state.lastRoll)}` : 'Roll the dice.');
  el.turnInfo.innerHTML = `<strong style="color:${escapeHtml(p.color)}">${escapeHtml(p.name)}</strong><br>${status.join('<br>')}`;
}

function renderDice() {
  const [d1, d2] = state.dice;
  if (el.dieOne) el.dieOne.style.transform = getDieTransform(d1);
  if (el.dieTwo) el.dieTwo.style.transform = getDieTransform(d2);
  el.rollTotal.textContent = state.lastRoll ? `${d1} + ${d2} = ${d1 + d2}` : '--';
}

function renderHud() {
  const activePlayers = state.players.filter((p) => !p.bankrupt).length;
  el.turnCountLabel.textContent = String(state.turnNumber);
  el.activePlayersLabel.textContent = String(activePlayers);
  el.potLabel.textContent = `$${state.freeParkingPot}`;
}

function refresh() {
  renderBoard();
  renderPlayers();
  renderTurnInfo();
  renderDice();
  renderHud();
  refreshInspector();
}

// ─── GAME LOGIC ───
function nextActivePlayer() {
  let idx = state.current;
  for (let i = 0; i < state.players.length; i += 1) {
    idx = (idx + 1) % state.players.length;
    if (!state.players[idx].bankrupt) return idx;
  }
  return idx;
}

function showChoice({ title, text, choices }) {
  return new Promise((resolve) => {
    if (el.modal.open) el.modal.close();
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;

    const actions = el.modal.querySelector('.modal-actions');
    actions.innerHTML = '';

    let resolved = false;
    const closeWith = (value) => {
      if (resolved) return;
      resolved = true;
      el.modal.oncancel = null;
      el.modal.onclose = null;
      if (el.modal.open) el.modal.close();
      resolve(value);
    };

    choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn ${c.primary ? 'primary' : 'subtle'}`;
      btn.textContent = c.label;
      btn.addEventListener('click', () => closeWith(c.value));
      actions.appendChild(btn);
    });

    const cancelChoice = choices.find((c) => c.cancel);
    const cancelValue = cancelChoice ? cancelChoice.value : null;
    el.modal.oncancel = () => closeWith(cancelValue);
    el.modal.onclose = () => closeWith(cancelValue);

    el.modal.showModal();
  });
}

function showDecision({ title, text, yesLabel, noLabel }) {
  return showChoice({
    title,
    text,
    choices: [
      { label: noLabel || 'Skip', value: false, cancel: true },
      { label: yesLabel || 'Buy', value: true, primary: true },
    ],
  });
}

function bankruptIfNeeded(player) {
  if (player.cash >= 0) return;

  // Liquidate properties at half value (bank buyback) until debt is covered.
  const liquidated = [];
  while (player.cash < 0 && player.properties.length > 0) {
    const idx = player.properties.shift();
    const value = Math.floor((BOARD[idx].price || 0) / 2);
    player.cash += value;
    liquidated.push({ name: BOARD[idx].name, value });
  }
  if (liquidated.length) {
    const total = liquidated.reduce((s, l) => s + l.value, 0);
    log(`${player.name} sold ${liquidated.length} property to the bank for $${total} to cover debts.`);
    showToast(`${player.name} sold ${liquidated.length} for $${total}`, 'info');
  }

  if (player.cash < 0) {
    player.bankrupt = true;
    player.cash = 0;
    player.properties = [];
    player.getOutCards = 0;
    log(`${player.name} is bankrupt and out of the game.`);
    showToast(`${player.name} is bankrupt!`, 'danger');
  }
}

function nearestPositionOfType(fromPos, type) {
  for (let step = 1; step <= 40; step += 1) {
    const idx = (fromPos + step) % 40;
    if (BOARD[idx].type === type) return idx;
  }
  return fromPos;
}

function moveTo(player, target, { collectGo = true, log: logMove = true } = {}) {
  const oldPos = player.pos;
  player.pos = ((target % 40) + 40) % 40;
  // Pass GO if absolute target wrapped around (target >= 40) or new pos is behind old
  // (a forward move that ended at a smaller index means we crossed GO).
  if (collectGo && (target >= 40 || player.pos < oldPos)) {
    player.cash += 200;
    log(`${player.name} passed GO and collected $200.`);
  }
  if (logMove) log(`${player.name} advanced to ${BOARD[player.pos].name}.`);
}

function sendToJail(player) {
  player.pos = JAIL_POS;
  player.jailTurns = 1;
  log(`${player.name} was sent to Jail.`);
  showToast(`${player.name} sent to Jail!`, 'danger');
}

async function applyCard(player, card, lastRoll) {
  log(`${player.name}: ${card.text}`);

  if (typeof card.cash === 'number') {
    player.cash += card.cash;
    if (card.cash > 0) showToast(`${player.name}: +$${card.cash}`, 'success');
    else showToast(`${player.name}: -$${Math.abs(card.cash)}`, 'danger');
    playSfx(card.cash > 0 ? 'buy' : 'pay');
  }

  if (card.repairsPerProp) {
    const total = player.properties.length * card.repairsPerProp;
    if (total > 0) {
      player.cash -= total;
      log(`${player.name} paid $${total} for repairs (${player.properties.length} properties).`);
      showToast(`-$${total} repairs`, 'danger');
      playSfx('pay');
    }
  }

  if (card.payEachPlayer) {
    state.players.filter((p) => !p.bankrupt && p.id !== player.id).forEach((other) => {
      const amt = card.payEachPlayer;
      player.cash -= amt;
      other.cash += amt;
      log(`${player.name} paid $${amt} to ${other.name}.`);
    });
  }

  if (card.collectEachPlayer) {
    state.players.filter((p) => !p.bankrupt && p.id !== player.id).forEach((other) => {
      const amt = card.collectEachPlayer;
      other.cash -= amt;
      player.cash += amt;
      log(`${player.name} collected $${amt} from ${other.name}.`);
      bankruptIfNeeded(other);
    });
  }

  if (card.getOut) {
    player.getOutCards = (player.getOutCards || 0) + 1;
    showToast('Get Out of Jail Free!', 'gold');
  }

  if (card.toJail) {
    sendToJail(player);
    bankruptIfNeeded(player);
    return;
  }

  let movedTo = null;
  if (typeof card.move === 'number') {
    movedTo = card.move;
    moveTo(player, card.move);
  } else if (typeof card.delta === 'number') {
    movedTo = ((player.pos + card.delta) % 40 + 40) % 40;
    moveTo(player, movedTo, { collectGo: false });
  } else if (card.moveType === 'nearestRR') {
    movedTo = nearestPositionOfType(player.pos, 'railroad');
    moveTo(player, movedTo);
  } else if (card.moveType === 'nearestUtility') {
    movedTo = nearestPositionOfType(player.pos, 'utility');
    moveTo(player, movedTo);
  }

  bankruptIfNeeded(player);
  if (player.bankrupt) return;

  if (movedTo != null && card.resolveLanding) {
    await resolveLanding(player, lastRoll, {
      rentMult: card.rentMult,
      utilityRoll: card.utilityRoll,
    });
  }
}

function drawCard(deck) {
  const cards = deck === 'community' ? COMMUNITY : CHANCE;
  return cards[Math.floor(Math.random() * cards.length)];
}

async function resolveLanding(player, roll, opts = {}) {
  const space = BOARD[player.pos];
  const owner = ownerOf(player.pos);

  if (['property', 'railroad', 'utility'].includes(space.type)) {
    if (!owner) {
      if (player.cash >= space.price) {
        const buy = await showDecision({
          title: `Buy ${space.name}?`,
          text: `Price: $${space.price} · Rent: $${space.rent || 0} · ${player.name}'s cash: $${player.cash}`,
        });
        if (buy) {
          player.cash -= space.price;
          player.properties.push(player.pos);
          log(`${player.name} bought ${space.name} for $${space.price}.`);
          showToast(`${player.name} bought ${space.name}!`, 'success');
          playSfx('buy');
        } else {
          log(`${player.name} skipped ${space.name}.`);
        }
      } else {
        log(`${player.name} cannot afford ${space.name}.`);
      }
      return;
    }

    if (owner.id !== player.id) {
      let rent;
      if (opts.utilityRoll && space.type === 'utility') {
        const r1 = 1 + Math.floor(Math.random() * 6);
        const r2 = 1 + Math.floor(Math.random() * 6);
        rent = (r1 + r2) * opts.utilityRoll;
        log(`${player.name} rolled ${r1}+${r2} for utility rent (×${opts.utilityRoll}).`);
      } else {
        rent = rentFor(space, owner, roll);
        if (opts.rentMult) rent *= opts.rentMult;
      }
      player.cash -= rent;
      owner.cash += rent;
      log(`${player.name} paid $${rent} rent to ${owner.name} (${space.name}).`);
      showToast(`-$${rent} rent to ${owner.name}`, 'danger');
      playSfx('pay');
      bankruptIfNeeded(player);
    } else {
      log(`${player.name} landed on their own ${space.name}.`);
    }
    return;
  }

  if (space.type === 'tax') {
    player.cash -= space.amount;
    state.freeParkingPot += space.amount;
    log(`${player.name} paid ${space.name} ($${space.amount}). Added to Free Parking pot.`);
    playSfx('pay');
    bankruptIfNeeded(player);
    return;
  }

  if (space.type === 'card') {
    const card = drawCard(space.deck);
    await applyCard(player, card, roll);
    return;
  }

  if (space.type === 'gotojail') {
    sendToJail(player);
    return;
  }

  if (space.name === 'Free Parking' && state.freeParkingPot > 0) {
    player.cash += state.freeParkingPot;
    log(`${player.name} collected Free Parking pot: $${state.freeParkingPot}.`);
    showToast(`+$${state.freeParkingPot} from Free Parking!`, 'gold');
    state.freeParkingPot = 0;
    return;
  }

  if (space.name === 'GO') log(`${player.name} landed on GO.`);
}

// ─── AUDIO FX ───
function playRollFx(total) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180 + total * 28, now);
  osc.frequency.exponentialRampToValueAtTime(120 + total * 14, now + 0.14);
  gain.gain.value = 0.0001;
  gain.gain.exponentialRampToValueAtTime(0.025, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

function playSfx(type) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  if (type === 'win') {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + i * 0.12);
      g.gain.exponentialRampToValueAtTime(0.03, now + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.4);
      o.connect(g).connect(audioCtx.destination);
      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.45);
    });
    return;
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain).connect(audioCtx.destination);

  if (type === 'buy') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, now);
    osc.frequency.exponentialRampToValueAtTime(784, now + 0.1);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === 'pay') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

function toggleMusic() {
  if (!ensureAudio()) return;
  state.musicOn = !state.musicOn;

  if (!state.musicOn) {
    if (ambientNodes) {
      const now = audioCtx.currentTime;
      ambientNodes.gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
      const nodes = ambientNodes;
      ambientNodes = null;
      setTimeout(() => {
        try { nodes.osc1.stop(); nodes.osc2.stop(); nodes.osc3.stop(); nodes.lfo.stop(); } catch (_) {}
      }, 1600);
    }
    if (jazzTimer) { clearInterval(jazzTimer); jazzTimer = null; }
    el.musicBtn.textContent = 'Ambient On';
    return;
  }

  audioCtx.resume();

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const osc3 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc3.type = 'sine';
  osc1.frequency.value = 65.41;
  osc2.frequency.value = 65.8;
  osc3.frequency.value = 98.0;

  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 0.5;

  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 2);

  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();

  ambientNodes = { osc1, osc2, osc3, gain, lfo, filter };

  const noteFreqs = [261.63, 329.63, 392, 523.25, 659.25, 783.99];
  jazzTimer = setInterval(() => {
    if (!state.musicOn || !audioCtx) return;
    const freq = noteFreqs[Math.floor(Math.random() * noteFreqs.length)];
    const noteOsc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    const noteFilter = audioCtx.createBiquadFilter();
    noteOsc.type = 'sine';
    noteOsc.frequency.value = freq;
    noteFilter.type = 'lowpass';
    noteFilter.frequency.value = 2000;
    noteGain.gain.value = 0;
    const n = audioCtx.currentTime;
    noteGain.gain.linearRampToValueAtTime(0.018, n + 0.3);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, n + 3);
    noteOsc.connect(noteFilter);
    noteFilter.connect(noteGain);
    noteGain.connect(audioCtx.destination);
    noteOsc.start(n);
    noteOsc.stop(n + 3.2);
  }, 2500);

  el.musicBtn.textContent = 'Ambient Off';
}

// ─── DICE ANIMATION (3D) ───
function animateDice(finalD1, finalD2) {
  return new Promise((resolve) => {
    const cube1 = el.dieOne;
    const cube2 = el.dieTwo;
    if (!cube1 || !cube2) {
      state.dice = [finalD1, finalD2];
      renderDice();
      resolve();
      return;
    }

    let startTime;
    const duration = 900;

    const spins1 = { x: (2 + Math.random() * 2) * 360, y: (2 + Math.random() * 2) * 360 };
    const spins2 = { x: (2 + Math.random() * 2) * 360, y: (2 + Math.random() * 2) * 360 };
    const final1 = FACE_ROTATIONS[finalD1];
    const final2 = FACE_ROTATIONS[finalD2];

    function animate(time) {
      if (!startTime) startTime = time;
      const t = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);

      cube1.style.transform = `rotateX(${ease * (spins1.x + final1.x)}deg) rotateY(${ease * (spins1.y + final1.y)}deg)`;
      cube2.style.transform = `rotateX(${ease * (spins2.x + final2.x)}deg) rotateY(${ease * (spins2.y + final2.y)}deg)`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        state.dice = [finalD1, finalD2];
        renderDice();
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

// ─── TURN MANAGEMENT ───
async function rollAndAnimate() {
  const d1 = 1 + Math.floor(Math.random() * 6);
  const d2 = 1 + Math.floor(Math.random() * 6);
  await animateDice(d1, d2);
  playRollFx(d1 + d2);
  state.dice = [d1, d2];
  state.lastRoll = `${d1} + ${d2} = ${d1 + d2}`;
  return { d1, d2, roll: d1 + d2, doubles: d1 === d2 };
}

async function chooseJailAction(player) {
  const choices = [];
  if (player.cash >= 50) {
    choices.push({ label: 'Pay $50 bail', value: 'pay' });
  }
  if (player.getOutCards > 0) {
    choices.push({ label: `Use Get Out card (${player.getOutCards})`, value: 'card' });
  }
  choices.push({ label: 'Roll for doubles', value: 'roll', primary: true });
  return showChoice({
    title: `${player.name} is in Jail`,
    text: `Turn ${player.jailTurns} of 3. Doubles to escape, or pay $50 bail. Failing the 3rd attempt forces $50.`,
    choices,
  });
}

async function takeTurn() {
  if (state.gameOver || state.processingTurn || !state.players.length) return;
  const player = state.players[state.current];
  if (!player || player.bankrupt) {
    state.current = nextActivePlayer();
    refresh();
    return;
  }

  state.processingTurn = true;
  el.rollBtn.disabled = true;
  el.endBtn.disabled = true;

  try {
    let endsTurn = true;
    let movedAndResolved = false;

    if (player.jailTurns > 0) {
      const action = await chooseJailAction(player);
      if (action === 'pay') {
        player.cash -= 50;
        state.freeParkingPot += 50;
        player.jailTurns = 0;
        log(`${player.name} paid $50 bail.`);
        playSfx('pay');
      } else if (action === 'card') {
        player.getOutCards -= 1;
        player.jailTurns = 0;
        log(`${player.name} used a Get Out of Jail Free card.`);
      } else {
        // roll for doubles
        const r = await rollAndAnimate();
        state.rolled = true;
        log(`${player.name} (jail attempt ${player.jailTurns}/3) rolled ${state.lastRoll}.`);
        if (r.doubles) {
          player.jailTurns = 0;
          log(`${player.name} rolled doubles and walked free!`);
          showToast(`${player.name} broke out!`, 'success');
          moveTo(player, player.pos + r.roll, { log: false });
          await resolveLanding(player, r.roll);
          // doubles out of jail does NOT grant another roll
          movedAndResolved = true;
        } else if (player.jailTurns >= 3) {
          // forced bail on the 3rd failed attempt
          player.cash -= 50;
          state.freeParkingPot += 50;
          player.jailTurns = 0;
          log(`${player.name} served their time and paid $50.`);
          playSfx('pay');
          bankruptIfNeeded(player);
          if (!player.bankrupt) {
            moveTo(player, player.pos + r.roll, { log: false });
            await resolveLanding(player, r.roll);
          }
          movedAndResolved = true;
        } else {
          player.jailTurns += 1;
          showToast(`${player.name} stays in Jail`, 'info');
          // turn ends, didn't escape
          state.rolled = true;
          refresh();
          autoSave();
          endTurn();
          return;
        }
      }
    }

    if (!movedAndResolved) {
      const r = await rollAndAnimate();
      state.rolled = true;
      if (r.doubles) state.doublesThisTurn += 1;
      log(`${player.name} rolled ${state.lastRoll}${r.doubles ? ' (doubles!)' : ''}.`);

      if (r.doubles && state.doublesThisTurn === 3) {
        log(`${player.name} rolled three doubles in a row — straight to Jail!`);
        showToast('Three doubles → Jail!', 'danger');
        sendToJail(player);
        state.doublesThisTurn = 0;
        refresh();
        autoSave();
        endTurn();
        return;
      }

      moveTo(player, player.pos + r.roll, { log: false });
      await resolveLanding(player, r.roll);

      // Doubles → another roll (unless bankrupted, sent to jail, or game over)
      if (r.doubles && !state.gameOver && !player.bankrupt && player.jailTurns === 0) {
        endsTurn = false;
      }
    }

    refresh();
    autoSave();

    if (endsTurn) {
      el.rollBtn.disabled = true;
      el.endBtn.disabled = state.gameOver;
    } else {
      // doubles re-roll
      el.rollBtn.disabled = state.gameOver;
      el.endBtn.disabled = true;
    }
  } finally {
    state.processingTurn = false;
  }
}

function endTurn() {
  if (state.gameOver) return;
  state.rolled = false;
  state.doublesThisTurn = 0;
  state.current = nextActivePlayer();
  state.turnNumber += 1;
  el.rollBtn.disabled = false;
  el.endBtn.disabled = true;
  refresh();
  autoSave();
}

function startGame() {
  const names = [...el.nameInputs.querySelectorAll('input')].map((node, idx) => node.value.trim() || `Player ${idx + 1}`);
  state.players = names.map((name, idx) => ({
    id: idx,
    name,
    color: COLORS[idx % COLORS.length],
    cash: START_CASH,
    pos: 0,
    properties: [],
    bankrupt: false,
    jailTurns: 0,
    getOutCards: 0,
  }));

  Object.assign(state, {
    current: 0,
    turnNumber: 1,
    rolled: false,
    gameOver: false,
    processingTurn: false,
    lastRoll: null,
    freeParkingPot: 0,
    dice: [1, 1],
    doublesThisTurn: 0,
  });
  inspectedIdx = null;
  el.log.innerHTML = '';
  log('Welcome to Monopoly Family Edition.');
  el.setupPanel.classList.add('hidden');
  el.gameLayout.classList.remove('hidden');
  el.rollBtn.disabled = false;
  el.endBtn.disabled = true;
  refresh();
  autoSave();
}

function restart() {
  state.players = [];
  Object.assign(state, {
    current: 0,
    turnNumber: 1,
    rolled: false,
    gameOver: false,
    processingTurn: false,
    lastRoll: null,
    freeParkingPot: 0,
    dice: [1, 1],
    doublesThisTurn: 0,
  });
  inspectedIdx = null;
  el.setupPanel.classList.remove('hidden');
  el.gameLayout.classList.add('hidden');
  el.log.innerHTML = '';
  if (el.modal.open) el.modal.close();
  if (el.rulesModal.open) el.rulesModal.close();
  el.rollBtn.disabled = true;
  el.endBtn.disabled = true;
  setTurnPill('Setup', '#64748b');
  initNameInputs();
  localStorage.removeItem(SAVE_KEY);

  const overlay = document.querySelector('.win-overlay');
  if (overlay) overlay.remove();
}

// ─── SAVE / LOAD ───
function serializeState() {
  return JSON.stringify({
    players: state.players,
    current: state.current,
    turnNumber: state.turnNumber,
    rolled: state.rolled,
    gameOver: state.gameOver,
    lastRoll: state.lastRoll,
    freeParkingPot: state.freeParkingPot,
    dice: state.dice,
    doublesThisTurn: state.doublesThisTurn,
  });
}

function autoSave() {
  if (!state.players.length) return;
  localStorage.setItem(SAVE_KEY, serializeState());
}

function loadSavedGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.players) || parsed.players.length < 2) return false;
    state.players = parsed.players
      .filter((p) => p && typeof p === 'object')
      .map((p, idx) => ({
        id: Number.isInteger(p.id) ? p.id : idx,
        name: (typeof p.name === 'string' && p.name.trim()) ? p.name : `Player ${idx + 1}`,
        color: typeof p.color === 'string' ? p.color : COLORS[idx % COLORS.length],
        cash: Number.isFinite(p.cash) ? p.cash : START_CASH,
        pos: Number.isFinite(p.pos) ? ((Math.floor(p.pos) % 40) + 40) % 40 : 0,
        properties: Array.isArray(p.properties)
          ? [...new Set(p.properties.filter((space) => Number.isInteger(space) && space >= 0 && space < BOARD.length))]
          : [],
        bankrupt: Boolean(p.bankrupt),
        jailTurns: Number.isInteger(p.jailTurns) ? Math.min(Math.max(p.jailTurns, 0), 3) : 0,
        getOutCards: Number.isInteger(p.getOutCards) ? Math.max(p.getOutCards, 0) : 0,
      }));
    if (state.players.length < 2) return false;
    state.current = Math.min(Math.max(Number(parsed.current) || 0, 0), state.players.length - 1);
    state.turnNumber = Math.max(Number(parsed.turnNumber) || 1, 1);
    state.rolled = Boolean(parsed.rolled);
    state.gameOver = Boolean(parsed.gameOver);
    state.processingTurn = false;
    state.lastRoll = parsed.lastRoll || null;
    state.freeParkingPot = Number(parsed.freeParkingPot) || 0;
    state.doublesThisTurn = Math.min(Math.max(Number(parsed.doublesThisTurn) || 0, 0), 2);
    const parsedDice = Array.isArray(parsed.dice) ? parsed.dice : [1, 1];
    const safeD1 = Number.isFinite(parsedDice[0]) ? Math.min(Math.max(Math.floor(parsedDice[0]), 1), 6) : 1;
    const safeD2 = Number.isFinite(parsedDice[1]) ? Math.min(Math.max(Math.floor(parsedDice[1]), 1), 6) : 1;
    state.dice = [safeD1, safeD2];

    if (state.players.every((p) => p.bankrupt)) {
      state.players[0].bankrupt = false;
    }
    if (state.players[state.current].bankrupt) {
      state.current = nextActivePlayer();
    }

    el.setupPanel.classList.add('hidden');
    el.gameLayout.classList.remove('hidden');
    el.rollBtn.disabled = state.rolled;
    el.endBtn.disabled = !state.rolled;
    refresh();
    log('Loaded autosaved session.');
    return true;
  } catch {
    return false;
  }
}

function saveNow() {
  if (!state.players.length) return;
  autoSave();
  log('Game saved.');
  showToast('Game saved successfully', 'success');
}

function clearLog() {
  el.log.innerHTML = '';
  log('Log cleared.');
}

// ─── SPACE INSPECTOR ───
function renderInspector() {
  if (inspectedIdx == null) return;
  const idx = inspectedIdx;
  const space = BOARD[idx];
  const owner = ownerOf(idx);

  let html = `<h3 style="${space.color ? `color:${space.color}` : ''}">${space.name}</h3>`;
  html += '<div class="meta">';
  html += `Type: ${space.type.charAt(0).toUpperCase() + space.type.slice(1)}<br>`;
  html += `Position: #${idx}`;
  if (space.price) html += `<br>Price: $${space.price}`;
  if (space.rent) html += `<br>Base Rent: $${space.rent}`;
  if (space.color) {
    const monopolyOwner = state.players.find((p) => !p.bankrupt && isMonopoly(p, space));
    if (monopolyOwner) {
      html += `<br><span style="color:var(--gold)">Monopoly (${escapeHtml(monopolyOwner.name)}) — Rent: $${space.rent * 2}</span>`;
    }
  }
  if (space.type === 'railroad' && owner) {
    html += `<br>Current Rent: $${25 * countByType(owner, 'railroad')}`;
  }
  html += '</div>';

  if (owner) {
    html += `<div class="owner"><div class="owner-dot" style="background:${escapeHtml(owner.color)}"></div>${escapeHtml(owner.name)}</div>`;
  } else if (['property', 'railroad', 'utility'].includes(space.type)) {
    html += '<div class="owner" style="color:var(--text-muted)">Unowned</div>';
  }

  const playersHere = state.players.filter((p) => !p.bankrupt && p.pos === idx);
  if (playersHere.length > 0) {
    html += '<div style="margin-top:0.3rem;font-size:0.75rem;color:var(--text-secondary)">';
    html += `Players here: ${playersHere.map((p) => `<span style="color:${escapeHtml(p.color)}">${escapeHtml(p.name)}</span>`).join(', ')}`;
    html += '</div>';
  }

  el.spaceInspector.innerHTML = html;
}

function inspectSpace(idx) {
  inspectedIdx = idx;
  renderInspector();
  renderBoard();
}

function refreshInspector() {
  renderInspector();
}

// ─── MOTION & FX ───
function toggleMotion() {
  state.motionOn = !state.motionOn;
  document.body.classList.toggle('motion-off', !state.motionOn);
  el.motionBtn.textContent = state.motionOn ? 'Motion On' : 'Motion Off';
  if (!state.motionOn) {
    el.boardPanel.style.transform = 'none';
    [...document.querySelectorAll('.parallax-card')].forEach((card) => { card.style.transform = 'none'; });
  }
}

function toggleFullscreen() {
  const root = document.documentElement;
  const enter = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (!enter || !exit) {
    showToast('Fullscreen not supported on this device', 'info');
    return;
  }
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    enter.call(root).catch(() => {});
  } else {
    exit.call(document).catch(() => {});
  }
}

function bindSpatialMotion() {
  const cards = [...document.querySelectorAll('.parallax-card')];

  window.addEventListener('pointermove', (event) => {
    if (!state.motionOn) return;
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;
    el.boardPanel.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;

    cards.forEach((card, i) => {
      const depth = 6 + (i * 1.5);
      card.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${(y * depth).toFixed(2)}px, 0)`;
    });
  });

  window.addEventListener('pointerleave', () => {
    el.boardPanel.style.transform = 'none';
    cards.forEach((card) => { card.style.transform = 'none'; });
  });
}

function startFxScene() {
  const canvas = el.fxCanvas;
  const ctx = canvas.getContext('2d');
  const points = [];
  let w = 0;
  let h = 0;
  let pointer = { x: 0.5, y: 0.5 };

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const init = () => {
    points.length = 0;
    for (let i = 0; i < 60; i += 1) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    points.forEach((p) => {
      p.x += p.vx + (pointer.x - 0.5) * 0.06;
      p.y += p.vy + (pointer.y - 0.5) * 0.06;
      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;
      if (p.y < -40) p.y = h + 40;
      if (p.y > h + 40) p.y = -40;
    });

    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(180,168,140,${(1 - dist / 160) * 0.14})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    points.forEach((p) => {
      ctx.fillStyle = 'rgba(200,188,160,0.38)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX / w, y: event.clientY / h };
  });

  resize();
  init();
  draw();
}

// ─── EVENT LISTENERS ───
el.playerCount.addEventListener('change', initNameInputs);
el.startBtn.addEventListener('click', startGame);
el.rollBtn.addEventListener('click', takeTurn);
el.endBtn.addEventListener('click', endTurn);
el.restartBtn.addEventListener('click', restart);
el.fullscreenBtn.addEventListener('click', toggleFullscreen);
el.saveBtn.addEventListener('click', saveNow);
el.clearLogBtn.addEventListener('click', clearLog);
el.motionBtn.addEventListener('click', toggleMotion);
el.musicBtn.addEventListener('click', toggleMusic);
el.rulesBtn.addEventListener('click', () => el.rulesModal.showModal());
el.rulesClose.addEventListener('click', () => el.rulesModal.close());

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
  if (target instanceof HTMLElement && target.isContentEditable) return;
  if (el.modal.open || el.rulesModal.open) return;
  const key = event.key.toLowerCase();
  if (key === 'r' && !el.rollBtn.disabled) { event.preventDefault(); takeTurn(); }
  else if (key === 'e' && !el.endBtn.disabled) { event.preventDefault(); endTurn(); }
});

const onFullscreenChange = () => {
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  el.fullscreenBtn.textContent = isFs ? 'Exit Fullscreen' : 'Fullscreen';
};
document.addEventListener('fullscreenchange', onFullscreenChange);
document.addEventListener('webkitfullscreenchange', onFullscreenChange);

// ─── INIT ───
initNameInputs();
initDice();
bindSpatialMotion();
startFxScene();
renderHud();
if (!loadSavedGame()) setTurnPill('Setup', '#64748b');

// Initialize AudioContext on first user gesture so SFX work without toggling ambient.
const primeAudio = () => {
  ensureAudio();
  window.removeEventListener('pointerdown', primeAudio);
  window.removeEventListener('keydown', primeAudio);
};
window.addEventListener('pointerdown', primeAudio, { once: true });
window.addEventListener('keydown', primeAudio, { once: true });
