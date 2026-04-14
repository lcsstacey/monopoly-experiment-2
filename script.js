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
  { text: 'Street repairs. Pay $120.', fn: (p) => { p.cash -= 120; } },
  { text: 'Dividend payout. Collect $100.', fn: (p) => { p.cash += 100; } },
  { text: 'Move back 3 spaces.', fn: (p) => { p.pos = (p.pos + 37) % 40; } },
  { text: 'Birthday gifts. Collect $60.', fn: (p) => { p.cash += 60; } },
  { text: 'Car maintenance. Pay $50.', fn: (p) => { p.cash -= 50; } },
];

const START_CASH = 1500;
const SAVE_KEY = 'monopoly-family-edition-save';
const COLORS = ['#60a5fa', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#fb7185'];

const state = {
  players: [],
  current: 0,
  rolled: false,
  gameOver: false,
  lastRoll: null,
  freeParkingPot: 0,
  musicOn: false,
  motionOn: true,
};

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
};

let audioCtx;
let jazzTimer;

function initNameInputs() {
  const count = Number(el.playerCount.value);
  el.nameInputs.innerHTML = '';
  for (let i = 0; i < count; i += 1) {
    const input = document.createElement('input');
    input.value = `Player ${i + 1}`;
    input.placeholder = `Player ${i + 1}`;
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

function log(message) {
  const line = document.createElement('p');
  line.textContent = message;
  el.log.prepend(line);
}

function setTurnPill(text, color = '#475569') {
  el.turnPill.textContent = text;
  el.turnPill.style.borderColor = color;
  el.turnPill.style.boxShadow = `0 0 0 1px ${color}44`;
}

function renderBoard() {
  el.board.innerHTML = '';
  BOARD.forEach((space, idx) => {
    const node = document.createElement('div');
    const pos = boardPos(idx);
    node.className = `cell ${['property', 'railroad', 'utility'].includes(space.type) ? 'property' : ''} ${['corner', 'gotojail'].includes(space.type) ? 'corner' : ''}`;
    node.style.gridRow = pos.r;
    node.style.gridColumn = pos.c;
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
    state.players.filter((p) => !p.bankrupt && p.pos === idx).forEach((p) => {
      const token = document.createElement('div');
      token.className = 'token';
      token.style.background = p.color;
      tokens.appendChild(token);
    });
    node.appendChild(tokens);
    el.board.appendChild(node);
  });

  const center = document.createElement('div');
  center.className = 'board-center';
  center.innerHTML = `<div class="board-logo">MONOPOLY</div><div class="board-tag">Family Edition • Free Parking Pot: $${state.freeParkingPot}</div>`;
  el.board.appendChild(center);
}

function renderPlayers() {
  const alive = state.players.filter((p) => !p.bankrupt);
  if (alive.length <= 1 && state.players.length > 1 && !state.gameOver) {
    state.gameOver = true;
    const winner = alive[0];
    if (winner) {
      log(`🏆 ${winner.name} wins with net worth $${netWorth(winner)}.`);
      setTurnPill('Game Over', winner.color);
    }
  }

  const sorted = [...state.players].sort((a, b) => netWorth(b) - netWorth(a));
  el.playersPanel.innerHTML = '';
  sorted.forEach((p) => {
    const card = document.createElement('div');
    card.className = `player-card ${p.id === state.current && !state.gameOver ? 'active' : ''}`;
    card.innerHTML = `
      <div class="player-title">
        <strong>${p.name}${p.bankrupt ? ' (Out)' : ''}</strong>
        <span style="color:${p.color};font-weight:700">●</span>
      </div>
      <div class="player-meta">Cash: $${p.cash} · Props: ${p.properties.length} · Net Worth: $${netWorth(p)}</div>
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
  el.turnInfo.innerHTML = `<strong>${p.name}</strong><br>Position: ${BOARD[p.pos].name}<br>${state.lastRoll ? `Last roll: ${state.lastRoll}` : 'Roll the dice.'}`;
}

function refresh() {
  renderBoard();
  renderPlayers();
  renderTurnInfo();
}

function nextActivePlayer() {
  let idx = state.current;
  for (let i = 0; i < state.players.length; i += 1) {
    idx = (idx + 1) % state.players.length;
    if (!state.players[idx].bankrupt) return idx;
  }
  return idx;
}

function showDecision({ title, text, yesLabel = 'Buy', noLabel = 'Skip' }) {
  return new Promise((resolve) => {
    el.modalTitle.textContent = title;
    el.modalText.textContent = text;
    el.modalYes.textContent = yesLabel;
    el.modalNo.textContent = noLabel;

    const cleanup = () => {
      el.modalYes.onclick = null;
      el.modalNo.onclick = null;
    };

    el.modalYes.onclick = () => {
      cleanup();
      el.modal.close();
      resolve(true);
    };
    el.modalNo.onclick = () => {
      cleanup();
      el.modal.close();
      resolve(false);
    };

    el.modal.showModal();
  });
}

function bankruptIfNeeded(player) {
  if (player.cash >= 0) return;
  player.bankrupt = true;
  player.cash = 0;
  player.properties = [];
  log(`💥 ${player.name} is bankrupt and removed from the game.`);
}

function handleCard(player) {
  const card = CHANCE[Math.floor(Math.random() * CHANCE.length)];
  card.fn(player);
  log(`🎴 ${player.name}: ${card.text}`);
  bankruptIfNeeded(player);
}

async function resolveLanding(player, roll) {
  const space = BOARD[player.pos];
  const owner = ownerOf(player.pos);

  if (['property', 'railroad', 'utility'].includes(space.type)) {
    if (!owner) {
      if (player.cash >= space.price) {
        const buy = await showDecision({ title: `Buy ${space.name}?`, text: `Price $${space.price}. ${player.name}, purchase this property?` });
        if (buy) {
          player.cash -= space.price;
          player.properties.push(player.pos);
          log(`${player.name} bought ${space.name} for $${space.price}.`);
        } else {
          log(`${player.name} skipped ${space.name}.`);
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
      log(`${player.name} paid $${rent} rent to ${owner.name} (${space.name}).`);
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
    bankruptIfNeeded(player);
    return;
  }

  if (space.type === 'card') {
    handleCard(player);
    return;
  }

  if (space.type === 'gotojail') {
    player.pos = 10;
    log(`🚓 ${player.name} sent to Jail.`);
    return;
  }

  if (space.name === 'Free Parking' && state.freeParkingPot > 0) {
    player.cash += state.freeParkingPot;
    log(`🎁 ${player.name} collected Free Parking pot: $${state.freeParkingPot}.`);
    state.freeParkingPot = 0;
    return;
  }

  if (space.name === 'GO') log(`${player.name} landed on GO.`);
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
  state.lastRoll = `${d1} + ${d2} = ${roll}`;
  state.rolled = true;

  const oldPos = player.pos;
  player.pos = (oldPos + roll) % 40;
  if (oldPos + roll >= 40) {
    player.cash += 200;
    log(`${player.name} passed GO and collected $200.`);
  }

  log(`🎲 ${player.name} rolled ${state.lastRoll}.`);
  await resolveLanding(player, roll);

  el.rollBtn.disabled = true;
  el.endBtn.disabled = false;
  refresh();
  autoSave();
}

function endTurn() {
  if (!state.rolled || state.gameOver) return;
  state.rolled = false;
  state.current = nextActivePlayer();
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
  }));

  Object.assign(state, { current: 0, rolled: false, gameOver: false, lastRoll: null, freeParkingPot: 0 });
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
  Object.assign(state, { current: 0, rolled: false, gameOver: false, lastRoll: null, freeParkingPot: 0 });
  el.setupPanel.classList.remove('hidden');
  el.gameLayout.classList.add('hidden');
  el.log.innerHTML = '';
  initNameInputs();
  localStorage.removeItem(SAVE_KEY);
}

function serializeState() {
  return JSON.stringify({
    players: state.players,
    current: state.current,
    rolled: state.rolled,
    gameOver: state.gameOver,
    lastRoll: state.lastRoll,
    freeParkingPot: state.freeParkingPot,
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
    state.players = parsed.players;
    state.current = Number(parsed.current) || 0;
    state.rolled = Boolean(parsed.rolled);
    state.gameOver = Boolean(parsed.gameOver);
    state.lastRoll = parsed.lastRoll || null;
    state.freeParkingPot = Number(parsed.freeParkingPot) || 0;

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
  log('💾 Game saved.');
}

function clearLog() {
  el.log.innerHTML = '';
  log('Log cleared.');
}

function toggleMusic() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  state.musicOn = !state.musicOn;

  if (!state.musicOn) {
    if (jazzTimer) clearInterval(jazzTimer);
    jazzTimer = null;
    el.musicBtn.textContent = '🎷 Jazz On';
    return;
  }

  const playNote = (freq, dur = 0.2, gainValue = 0.02, type = 'triangle') => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  };

  const progression = [
    [261.63, 329.63, 392.0],
    [293.66, 369.99, 440.0],
    [329.63, 415.3, 493.88],
    [246.94, 311.13, 392.0],
  ];

  let step = 0;
  jazzTimer = setInterval(() => {
    const chord = progression[step % progression.length];
    playNote(chord[0], 0.3, 0.014, 'sine');
    playNote(chord[1], 0.24, 0.011, 'triangle');
    playNote(chord[2], 0.18, 0.01, 'square');
    if (step % 2 === 0) playNote(chord[0] / 2, 0.14, 0.013, 'sawtooth');
    step += 1;
  }, 480);

  el.musicBtn.textContent = '🎷 Jazz Off';
}

function bindSpatialMotion() {
  const cards = [...document.querySelectorAll('.parallax-card')];

  window.addEventListener('pointermove', (event) => {
    if (!state.motionOn) return;
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;
    el.boardPanel.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;

    cards.forEach((card, i) => {
      const depth = 8 + (i * 2);
      card.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${(y * depth).toFixed(2)}px, 0)`;
    });
  });

  window.addEventListener('pointerleave', () => {
    el.boardPanel.style.transform = 'none';
    cards.forEach((card) => { card.style.transform = 'none'; });
  });
}

function toggleMotion() {
  state.motionOn = !state.motionOn;
  document.body.classList.toggle('motion-off', !state.motionOn);
  el.motionBtn.textContent = state.motionOn ? 'Motion On' : 'Motion Off';
  if (!state.motionOn) {
    el.boardPanel.style.transform = 'none';
    [...document.querySelectorAll('.parallax-card')].forEach((card) => { card.style.transform = 'none'; });
  }
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
    for (let i = 0; i < 52; i += 1) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    points.forEach((p) => {
      p.x += p.vx + (pointer.x - 0.5) * 0.08;
      p.y += p.vy + (pointer.y - 0.5) * 0.08;
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
        if (dist < 140) {
          ctx.strokeStyle = `rgba(148,163,184,${(1 - dist / 140) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    points.forEach((p) => {
      ctx.fillStyle = 'rgba(226,232,240,0.52)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
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

el.playerCount.addEventListener('change', initNameInputs);
el.startBtn.addEventListener('click', startGame);
el.rollBtn.addEventListener('click', takeTurn);
el.endBtn.addEventListener('click', endTurn);
el.restartBtn.addEventListener('click', restart);
el.saveBtn.addEventListener('click', saveNow);
el.clearLogBtn.addEventListener('click', clearLog);
el.motionBtn.addEventListener('click', toggleMotion);
el.musicBtn.addEventListener('click', toggleMusic);
el.rulesBtn.addEventListener('click', () => el.rulesModal.showModal());
el.rulesClose.addEventListener('click', () => el.rulesModal.close());

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r' && !el.rollBtn.disabled) takeTurn();
  if (event.key.toLowerCase() === 'e' && !el.endBtn.disabled) endTurn();
});

initNameInputs();
bindSpatialMotion();
startFxScene();
if (!loadSavedGame()) setTurnPill('Setup', '#64748b');
