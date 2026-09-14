const vocabulary = [
  { word: 'bag', picture: '🎒' },
  { word: 'pencil', picture: '✏️' },
  { word: 'chair', picture: '🪑' },
  { word: 'book', picture: '📘' }
];

const characters = [
  { name: 'Polly', animal: 'parrot', picture: '🦜' },
  { name: 'Leo', animal: 'lion', picture: '🦁' },
  { name: 'Gina', animal: 'giraffe', picture: '🦒' },
  { name: 'Mike', animal: 'monkey', picture: '🐒' }
];

const game = document.getElementById('give-game');
const instruction = document.getElementById('give-instruction');
const objectCard = document.getElementById('game-object');
const objectPicture = document.getElementById('game-object-picture');
const objectWord = document.getElementById('game-object-word');
const charactersGrid = document.getElementById('characters-grid');
const feedback = document.getElementById('give-feedback');
const nextButton = document.getElementById('next-give-round');
const roundLabel = document.getElementById('round-label');
const roundStars = document.getElementById('round-stars');
const speechStatus = document.getElementById('speech-status');

let rounds = [];
let roundIndex = 0;
let selected = false;
let locked = false;
let preferredVoice = null;
let dragState = null;
let suppressObjectClick = false;

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function chooseVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices().filter(voice => /^en/i.test(voice.lang));
  const score = voice => {
    let points = 0;
    if (/^en-GB/i.test(voice.lang)) points += 12;
    else if (/^en/i.test(voice.lang)) points += 5;
    if (/natural|neural|sonia|libby|serena|susan|google uk/i.test(voice.name)) points += 9;
    if (voice.default) points += 2;
    return points;
  };
  preferredVoice = [...voices].sort((a, b) => score(b) - score(a))[0] || null;
}

function speak(text, statusTarget = speechStatus) {
  if (statusTarget) statusTarget.textContent = `Listen: “${text}”`;
  if (!('speechSynthesis' in window)) {
    if (statusTarget) statusTarget.textContent = `Say together: “${text}”`;
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.84;
  utterance.pitch = 1.02;
  if (preferredVoice) utterance.voice = preferredVoice;
  window.speechSynthesis.speak(utterance);
}

function createRounds() {
  const result = [];
  for (let cycle = 0; cycle < 2; cycle += 1) {
    const objectsForCycle = shuffle(vocabulary);
    const friendsForCycle = shuffle(characters);
    objectsForCycle.forEach((object, index) => result.push({ object, character: friendsForCycle[index] }));
  }
  return result;
}

function currentRound() {
  return rounds[roundIndex];
}

function instructionText() {
  const round = currentRound();
  return round ? `Give the ${round.object.word} to ${round.character.name}.` : '';
}

function renderStars(completed = roundIndex) {
  roundStars.innerHTML = Array.from({ length: 8 }, (_, index) => `<span class="${index < completed ? 'complete' : ''}" aria-hidden="true">★</span>`).join('');
  roundStars.setAttribute('aria-label', `${completed} completed ${completed === 1 ? 'round' : 'rounds'}`);
}

function characterCard(character) {
  return `<button class="character-card" type="button" data-character="${character.name}">
    <span class="character-portrait" aria-hidden="true">${character.picture}</span>
    <strong>${character.name}</strong><small>${character.animal}</small>
  </button>`;
}

function attachCharacterEvents() {
  document.querySelectorAll('[data-character]').forEach(card => {
    card.addEventListener('click', () => {
      if (!locked) tryGiving(card.dataset.character, card);
    });
    card.addEventListener('dragover', event => {
      if (locked) return;
      event.preventDefault();
      card.classList.add('drop-ready');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drop-ready'));
    card.addEventListener('drop', event => {
      event.preventDefault();
      card.classList.remove('drop-ready');
      selected = true;
      objectCard.classList.add('selected');
      tryGiving(card.dataset.character, card);
    });
  });
}

function renderRound(announce = false) {
  const round = currentRound();
  if (!round) return showFinish();
  selected = false;
  locked = false;
  game.classList.remove('game-complete');
  roundLabel.textContent = `Round ${roundIndex + 1} of 8`;
  instruction.textContent = instructionText();
  objectPicture.textContent = round.object.picture;
  objectWord.textContent = round.object.word;
  objectCard.dataset.object = round.object.word;
  objectCard.classList.remove('selected', 'delivered');
  objectCard.setAttribute('aria-pressed', 'false');
  objectCard.hidden = false;
  charactersGrid.innerHTML = shuffle(characters).map(characterCard).join('');
  feedback.textContent = 'Who needs the object?';
  nextButton.hidden = true;
  nextButton.innerHTML = 'Next round <span aria-hidden="true">→</span>';
  renderStars();
  attachCharacterEvents();
  if (announce) speak(instructionText(), null);
}

function selectObject(announce = true) {
  if (locked) return;
  selected = true;
  objectCard.classList.add('selected');
  objectCard.setAttribute('aria-pressed', 'true');
  feedback.textContent = `${currentRound().object.word[0].toUpperCase()}${currentRound().object.word.slice(1)} is ready. Choose a friend.`;
  if (announce) speak(currentRound().object.word, null);
}

function tryGiving(characterName, card) {
  if (locked) return;
  if (!selected) {
    feedback.textContent = 'Choose or drag the object first.';
    speak(`Choose the ${currentRound().object.word} first.`, null);
    return;
  }
  const round = currentRound();
  if (characterName !== round.character.name) {
    card.classList.remove('gentle-try');
    void card.offsetWidth;
    card.classList.add('gentle-try');
    feedback.textContent = `Good try. ${round.character.name} is waiting for the ${round.object.word}.`;
    speak(`Try again. ${instructionText()}`, null);
    return;
  }
  locked = true;
  card.classList.add('received');
  card.insertAdjacentHTML('beforeend', `<span class="gift-badge" aria-hidden="true">${round.object.picture}</span>`);
  objectCard.classList.add('delivered');
  feedback.textContent = `Well done! You gave the ${round.object.word} to ${round.character.name}.`;
  speak(feedback.textContent, null);
  renderStars(roundIndex + 1);
  nextButton.hidden = false;
  if (roundIndex === rounds.length - 1) nextButton.innerHTML = 'Finish the game <span aria-hidden="true">★</span>';
}

function showFinish() {
  roundIndex = rounds.length;
  locked = true;
  game.classList.add('game-complete');
  roundLabel.textContent = 'All 8 rounds complete';
  instruction.textContent = 'Brilliant sharing!';
  feedback.textContent = 'You listened, found every object and helped every friend.';
  nextButton.hidden = false;
  nextButton.innerHTML = 'Play again <span aria-hidden="true">↻</span>';
  renderStars();
  speak('Brilliant sharing! You helped every friend.', null);
}

function startGame() {
  rounds = createRounds();
  roundIndex = 0;
  renderRound(false);
}

function cleanDrag() {
  if (dragState?.ghost) dragState.ghost.remove();
  document.querySelectorAll('[data-character]').forEach(card => card.classList.remove('drop-ready'));
  dragState = null;
}

document.querySelectorAll('[data-vocabulary]').forEach(card => {
  card.addEventListener('click', () => {
    const word = card.dataset.vocabulary;
    card.classList.add('is-speaking');
    window.setTimeout(() => card.classList.remove('is-speaking'), 260);
    speak(word);
  });
});

document.getElementById('hear-all-words').addEventListener('click', () => speak('Bag. Pencil. Chair. Book.'));
document.getElementById('repeat-give-instruction').addEventListener('click', () => speak(instructionText() || 'Brilliant sharing!', null));
document.getElementById('shuffle-characters').addEventListener('click', () => {
  if (locked) return;
  charactersGrid.innerHTML = shuffle(characters).map(characterCard).join('');
  attachCharacterEvents();
  feedback.textContent = 'The friends have moved. Listen again!';
  speak(instructionText(), null);
});
document.getElementById('hear-real-prompt').addEventListener('click', () => speak('Find a classroom object. Give it to a friend. Say, here you are.'));

objectCard.addEventListener('click', () => {
  if (suppressObjectClick) return;
  selectObject();
});
objectCard.addEventListener('dragstart', event => {
  if (locked) return event.preventDefault();
  selectObject(false);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', currentRound().object.word);
});

objectCard.addEventListener('pointerdown', event => {
  if (locked || event.pointerType === 'mouse') return;
  dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, ghost: null, moved: false };
  objectCard.setPointerCapture(event.pointerId);
});
objectCard.addEventListener('pointermove', event => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
  if (distance < 8 && !dragState.moved) return;
  event.preventDefault();
  dragState.moved = true;
  if (!dragState.ghost) {
    dragState.ghost = objectCard.cloneNode(true);
    dragState.ghost.removeAttribute('id');
    dragState.ghost.className = 'game-object drag-ghost';
    document.body.append(dragState.ghost);
    selectObject(false);
  }
  dragState.ghost.style.left = `${event.clientX}px`;
  dragState.ghost.style.top = `${event.clientY}px`;
  document.querySelectorAll('[data-character]').forEach(card => {
    const rect = card.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    card.classList.toggle('drop-ready', inside);
  });
});
objectCard.addEventListener('pointerup', event => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const wasMoved = dragState.moved;
  if (wasMoved) {
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-character]');
    if (target) tryGiving(target.dataset.character, target);
    else feedback.textContent = 'Move the object onto a friend, or tap a friend.';
    suppressObjectClick = true;
    window.setTimeout(() => { suppressObjectClick = false; }, 0);
  }
  cleanDrag();
});
objectCard.addEventListener('pointercancel', cleanDrag);

nextButton.addEventListener('click', () => {
  if (roundIndex >= rounds.length) return startGame();
  roundIndex += 1;
  renderRound(true);
});

if ('speechSynthesis' in window) {
  chooseVoice();
  window.speechSynthesis.addEventListener?.('voiceschanged', chooseVoice);
}

startGame();
