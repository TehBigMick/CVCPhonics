const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pictureData = {
  weather: {
    sunny: '☀️', cloudy: '☁️', rainy: '🌧️', windy: '💨', stormy: '⛈️', snowy: '🌨️', hot: '🥵', cold: '🥶'
  },
  feeling: {
    happy: '😊', excited: '🤩', calm: '😌', tired: '😴', sad: '😢', worried: '😟'
  },
  season: { spring: '🌷', summer: '🏖️', autumn: '🍂', winter: '⛄' }
};

const movements = [
  ['🙆', 'Reach up high, then touch your toes.'],
  ['👏', 'Clap slowly five times together.'],
  ['🐻', 'Stomp gently like a big bear.'],
  ['🐦', 'Flap your arms like a little bird.'],
  ['🌳', 'Stand tall and sway like a tree.'],
  ['🫧', 'Take one slow breath in and blow it out.'],
  ['🧍', 'Turn around once and sit down softly.']
];

const state = {
  yesterday: '',
  today: '',
  tomorrow: '',
  date: '',
  month: '',
  weather: '',
  feeling: '',
  season: '',
  activeDaySlot: 'today',
  savedFor: localDateKey(new Date())
};

const storageKey = 'phonicsHubCircleTime';
const message = document.getElementById('audio-message');
const sentencePreview = document.getElementById('sentence-preview');

function localDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function titleCase(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function ordinal(number) {
  const value = Number(number);
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function speak(text) {
  if (!text) return;
  message.textContent = `Listen: “${text}”`;
  if (!('speechSynthesis' in window)) {
    message.textContent = 'Spoken audio is not available in this browser. Please say the words together.';
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.82;
  utterance.pitch = 1.04;
  window.speechSynthesis.speak(utterance);
}

function slotSpeech(slot) {
  const value = state[slot];
  if (!value) return 'Choose a card for this space.';
  if (slot === 'yesterday') return `Yesterday was ${value}.`;
  if (slot === 'today') return `Today is ${value}.`;
  if (slot === 'tomorrow') return `Tomorrow will be ${value}.`;
  if (slot === 'date') return `The date is the ${ordinal(value)}.`;
  if (slot === 'month') return `The month is ${value}.`;
  if (slot === 'weather') return `It is ${value} today.`;
  if (slot === 'feeling') return `I feel ${value} today.`;
  if (slot === 'season') return `It is ${value}.`;
  return value;
}

function buildSentence() {
  const parts = [];
  if (state.today) parts.push(`Today is ${state.today}.`);
  if (state.date && state.month) parts.push(`The date is the ${ordinal(state.date)} of ${state.month}.`);
  else if (state.date) parts.push(`The date is the ${ordinal(state.date)}.`);
  else if (state.month) parts.push(`The month is ${state.month}.`);
  if (state.weather) parts.push(`It is ${state.weather} today.`);
  if (state.season) parts.push(`It is ${state.season}.`);
  if (state.feeling) parts.push(`I feel ${state.feeling}.`);
  return parts.join(' ');
}

function saveState() {
  state.savedFor = localDateKey(new Date());
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* The board still works without local storage. */ }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved?.savedFor === localDateKey(new Date())) Object.assign(state, saved);
  } catch { /* Ignore blocked or malformed local storage. */ }
}

function renderSlot(slot) {
  const valueElement = document.querySelector(`[data-slot-value="${slot}"]`);
  const slotElement = document.querySelector(`[data-slot="${slot}"]`);
  if (!valueElement || !slotElement) return;
  const value = state[slot];
  const emptyLabels = {
    yesterday: 'Choose a day', today: 'Choose a day', tomorrow: 'Choose a day', date: '?', month: 'Choose',
    weather: 'Choose the weather', feeling: 'Choose a feeling', season: 'Choose a season'
  };
  valueElement.textContent = slot === 'date' && value ? ordinal(value) : titleCase(value) || emptyLabels[slot];
  slotElement.classList.toggle('has-value', Boolean(value));
  if (pictureData[slot]) {
    const picture = slotElement.querySelector('.empty-picture');
    picture.textContent = value ? pictureData[slot][value] : '?';
  }
}

function renderChosenPieces() {
  document.querySelectorAll('.move-piece').forEach(piece => {
    const { type, value } = piece.dataset;
    const chosen = type === 'day'
      ? [state.yesterday, state.today, state.tomorrow].includes(value)
      : state[type] === value;
    piece.classList.toggle('is-chosen', chosen);
    piece.setAttribute('aria-pressed', String(chosen));
  });
}

function render() {
  ['yesterday', 'today', 'tomorrow', 'date', 'month', 'weather', 'feeling', 'season'].forEach(renderSlot);
  document.querySelectorAll('.day-slot').forEach(slot => {
    const active = slot.dataset.slot === state.activeDaySlot;
    slot.classList.toggle('active-slot', active);
    slot.setAttribute('aria-pressed', String(active));
  });
  renderChosenPieces();
  const sentence = buildSentence();
  sentencePreview.textContent = sentence || 'Build the board to make today’s sentence.';
}

function placePiece(type, value, targetSlot = '') {
  let slot = targetSlot;
  if (type === 'day') slot = slot || state.activeDaySlot;
  if (!slot) slot = type;
  if (!Object.hasOwn(state, slot)) return;
  state[slot] = value;
  saveState();
  render();
  speak(slotSpeech(slot));
}

function setToday() {
  const now = new Date();
  const yesterday = new Date(now);
  const tomorrow = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  tomorrow.setDate(now.getDate() + 1);
  state.yesterday = dayNames[yesterday.getDay()];
  state.today = dayNames[now.getDay()];
  state.tomorrow = dayNames[tomorrow.getDay()];
  state.date = String(now.getDate());
  state.month = monthNames[now.getMonth()];
  saveState();
  render();
  speak(`Today is ${state.today}, the ${ordinal(state.date)} of ${state.month}.`);
}

function clearBoard() {
  ['yesterday', 'today', 'tomorrow', 'date', 'month', 'weather', 'feeling', 'season'].forEach(key => { state[key] = ''; });
  state.activeDaySlot = 'today';
  try { localStorage.removeItem(storageKey); } catch { /* No action needed. */ }
  render();
  message.textContent = 'The board is clear and ready for a new circle time.';
}

function makeDatePieces() {
  const numberTray = document.querySelector('[data-piece-tray="date"]');
  for (let number = 1; number <= 31; number += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'move-piece';
    button.draggable = true;
    button.dataset.type = 'date';
    button.dataset.value = String(number);
    button.innerHTML = `<span>${number}</span><strong class="visually-hidden">${ordinal(number)}</strong>`;
    numberTray.append(button);
  }
  const monthTray = document.querySelector('[data-piece-tray="month"]');
  monthNames.forEach(month => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'move-piece';
    button.draggable = true;
    button.dataset.type = 'month';
    button.dataset.value = month;
    button.innerHTML = `<span aria-hidden="true"></span><strong>${month}</strong>`;
    monthTray.append(button);
  });
}

function attachPieceEvents() {
  document.querySelectorAll('.move-piece').forEach(piece => {
    piece.addEventListener('click', () => placePiece(piece.dataset.type, piece.dataset.value));
    piece.addEventListener('dragstart', event => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({ type: piece.dataset.type, value: piece.dataset.value }));
    });
  });
}

document.querySelectorAll('.board-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    if (slot.dataset.accepts === 'day') {
      state.activeDaySlot = slot.dataset.slot;
      render();
      const dayPrompts = { yesterday: 'Yesterday was…', today: 'Today is…', tomorrow: 'Tomorrow will be…' };
      message.textContent = `Now choose a day for “${dayPrompts[slot.dataset.slot]}”`;
    } else {
      speak(slotSpeech(slot.dataset.slot));
    }
  });
  slot.addEventListener('dragover', event => {
    event.preventDefault();
    slot.classList.add('drop-ready');
  });
  slot.addEventListener('dragleave', () => slot.classList.remove('drop-ready'));
  slot.addEventListener('drop', event => {
    event.preventDefault();
    slot.classList.remove('drop-ready');
    try {
      const piece = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (piece.type === slot.dataset.accepts) placePiece(piece.type, piece.value, slot.dataset.slot);
    } catch { message.textContent = 'That card could not be moved. Tap it instead.'; }
  });
});

document.querySelectorAll('[data-say]').forEach(button => button.addEventListener('click', () => speak(button.dataset.say)));
document.getElementById('use-today').addEventListener('click', setToday);
document.getElementById('speak-board').addEventListener('click', () => speak(buildSentence() || 'Let’s build today’s board together.'));
document.getElementById('say-sentence').addEventListener('click', () => speak(buildSentence() || 'Let’s build today’s board together.'));
document.getElementById('reset-board').addEventListener('click', clearBoard);

document.getElementById('new-movement').addEventListener('click', () => {
  const currentText = document.getElementById('movement-text').textContent;
  const choices = movements.filter(([, text]) => text !== currentText);
  const [emoji, text] = choices[Math.floor(Math.random() * choices.length)];
  document.getElementById('movement-emoji').textContent = emoji;
  document.getElementById('movement-text').textContent = text;
  speak(text);
});

const infoDialog = document.getElementById('circle-info-dialog');
document.getElementById('open-circle-info').addEventListener('click', () => infoDialog.showModal());
infoDialog.addEventListener('click', event => {
  if (event.target === infoDialog) infoDialog.close();
});

makeDatePieces();
loadState();
attachPieceEvents();
render();
