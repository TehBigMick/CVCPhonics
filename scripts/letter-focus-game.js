import { ALPHABET, letterSpeech, speak } from './alphabet-data.js';
import { shuffle } from './utils.js';

const EXTRA_PICTURES = {
  A: [['Ant', '🐜'], ['Axe', '🪓']], B: [['Bag', '🎒'], ['Book', '📖']],
  C: [['Car', '🚗'], ['Cup', '🥤']], D: [['Duck', '🦆'], ['Drum', '🥁']],
  E: [['Elf', '🧝'], ['Elephant', '🐘']], F: [['Fan', '🪭'], ['Frog', '🐸']],
  G: [['Gift', '🎁'], ['Gum', '🫧']], H: [['Hen', '🐔'], ['House', '🏠']],
  I: [['Ink', '🖋️'], ['Insect', '🐞']], J: [['Jam', '🍓'], ['Jet', '✈️']],
  K: [['Key', '🔑'], ['King', '🤴']], L: [['Lamp', '🪔'], ['Leaf', '🍃']],
  M: [['Map', '🗺️'], ['Mouse', '🐭']], N: [['Net', '🥅'], ['Nose', '👃']],
  O: [['Octopus', '🐙'], ['Ox', '🐂']], P: [['Pen', '🖊️'], ['Pan', '🍳']],
  Q: [['Quail', '🐦'], ['Quiz', '❓']], R: [['Ring', '💍'], ['Robot', '🤖']],
  S: [['Sock', '🧦'], ['Snake', '🐍']], T: [['Tent', '⛺'], ['Train', '🚂']],
  U: [['Up', '⬆️'], ['Under', '👇']], V: [['Vase', '🏺'], ['Violin', '🎻']],
  W: [['Web', '🕸️'], ['Watch', '⌚']], X: [['X-ray', '🩻'], ['Xerus', '🐿️']],
  Y: [['Yak', '🐂'], ['Yacht', '⛵']], Z: [['Zoo', '🦁'], ['Zip', '🤐']]
};

const requested = (new URLSearchParams(window.location.search).get('letter') || 'A').toUpperCase();
const target = ALPHABET.find(item => item.upper === requested) || ALPHABET[0];
const gameOrder = ['pairs', 'bubbles', 'pictures'];
const gameMeta = {
  pairs: {
    kicker: 'Matching game', title: 'Letter Partners',
    instruction: 'Turn two cards. Match each capital with its small letter.'
  },
  bubbles: {
    kicker: 'Find the letter', title: 'Sound Bubbles',
    instruction: `Pop every ${target.upper} and ${target.lower} bubble. Other letters can stay.`
  },
  pictures: {
    kicker: 'Picture game', title: 'Picture Picnic',
    instruction: `Listen and find the picture that begins with letter ${target.upper}.`
  }
};

const menu = document.getElementById('letter-menu');
const stage = document.getElementById('letter-stage');
const area = document.getElementById('letter-game-area');
const feedback = document.getElementById('letter-game-feedback');
const miniProgress = document.getElementById('letter-mini-progress');
const completed = new Set();
let currentGame = '';
let currentInstruction = '';
let pairCards = [];
let openCards = [];
let pairsLocked = false;
let matchedPairs = 0;
let bubbleRemaining = 0;
let pictureRound = 0;
let pictureExamples = [];

document.title = `Letter ${target.upper} Playground | Michael's Phonics Hub`;
document.getElementById('letter-play-title').textContent = `${target.upper} playground`;
document.getElementById('focus-letter-pair').textContent = `${target.upper}${target.lower}`;
document.getElementById('focus-picture-emoji').textContent = target.emoji;
document.getElementById('focus-picture-word').textContent = target.word;
document.getElementById('focus-picture').addEventListener('click', () => speak(target.word));
document.getElementById('hear-focus-letter').addEventListener('click', () => speak(letterSpeech(target)));
document.getElementById('back-to-letter-menu').addEventListener('click', showMenu);
document.getElementById('repeat-letter-instruction').addEventListener('click', () => speak(currentInstruction));
document.querySelectorAll('[data-letter-game]').forEach(button => {
  button.addEventListener('click', () => startGame(button.dataset.letterGame));
});
area.addEventListener('click', handleGameClick);

function startGame(game) {
  currentGame = game;
  const meta = gameMeta[game];
  currentInstruction = meta.instruction;
  menu.hidden = true;
  stage.hidden = false;
  document.getElementById('letter-stage-kicker').textContent = meta.kicker;
  document.getElementById('letter-stage-title').textContent = meta.title;
  document.getElementById('letter-stage-instruction').textContent = meta.instruction;
  document.getElementById('letter-stage-progress').textContent = `Game ${gameOrder.indexOf(game) + 1} of 3`;
  feedback.textContent = '';
  feedback.className = 'game-feedback';
  miniProgress.style.width = '0%';
  if (game === 'pairs') renderPairs();
  if (game === 'bubbles') renderBubbles();
  if (game === 'pictures') startPictures();
  window.setTimeout(() => speak(currentInstruction), 160);
}

function renderPairs() {
  const companions = shuffle(ALPHABET.filter(item => item.upper !== target.upper)).slice(0, 2);
  pairCards = shuffle([target, ...companions].flatMap(item => [
    { pair: item.upper, label: item.upper, speech: `Capital ${item.upper}`, matched: false },
    { pair: item.upper, label: item.lower, speech: `Small ${item.lower}`, matched: false }
  ]));
  openCards = [];
  pairsLocked = false;
  matchedPairs = 0;
  area.innerHTML = `<div class="memory-grid" role="group" aria-label="Capital and small letter matching cards">
    ${pairCards.map((card, index) => `<button class="memory-card" type="button" data-game-action="memory" data-index="${index}" aria-label="Hidden letter card"><span class="card-front" aria-hidden="true">?</span><span class="card-back">${card.label}</span></button>`).join('')}
  </div>`;
}

function chooseMemory(button) {
  if (pairsLocked || button.classList.contains('revealed') || button.classList.contains('matched')) return;
  const index = Number(button.dataset.index);
  const card = pairCards[index];
  button.classList.add('revealed');
  button.setAttribute('aria-label', card.speech);
  openCards.push({ button, card });
  speak(card.speech);
  if (openCards.length < 2) return;

  const [first, second] = openCards;
  if (first.card.pair === second.card.pair) {
    first.button.classList.remove('revealed');
    second.button.classList.remove('revealed');
    first.button.classList.add('matched');
    second.button.classList.add('matched');
    first.card.matched = true;
    second.card.matched = true;
    matchedPairs += 1;
    openCards = [];
    feedback.textContent = `A capital and small ${first.card.pair} are partners!`;
    miniProgress.style.width = `${(matchedPairs / 3) * 100}%`;
    speak(`${first.card.pair} and ${first.card.pair.toLowerCase()} are partners.`);
    if (matchedPairs === 3) window.setTimeout(finishGame, 650);
    return;
  }

  pairsLocked = true;
  feedback.textContent = 'Nearly. Turn two more cards and look for partners.';
  window.setTimeout(() => {
    first.button.classList.remove('revealed');
    second.button.classList.remove('revealed');
    first.button.setAttribute('aria-label', 'Hidden letter card');
    second.button.setAttribute('aria-label', 'Hidden letter card');
    openCards = [];
    pairsLocked = false;
  }, 850);
}

function renderBubbles() {
  const distractors = shuffle(ALPHABET.filter(item => item.upper !== target.upper)).slice(0, 4);
  const targetBubbles = Array.from({ length: 6 }, (_, index) => ({
    label: index % 2 ? target.lower : target.upper,
    target: true
  }));
  const otherBubbles = distractors.map((item, index) => ({
    label: index % 2 ? item.lower : item.upper,
    target: false
  }));
  bubbleRemaining = targetBubbles.length;
  area.innerHTML = `<div class="bubble-field" role="group" aria-label="Letter bubbles">
    ${shuffle([...targetBubbles, ...otherBubbles]).map((bubble, index) => `<button class="sound-bubble" type="button" data-game-action="bubble" data-target="${bubble.target}" data-label="${bubble.label}" aria-label="Letter ${bubble.label}, bubble ${index + 1}">${bubble.label}</button>`).join('')}
  </div>`;
}

function chooseBubble(button) {
  const isTarget = button.dataset.target === 'true';
  speak(`Letter ${button.dataset.label}`);
  if (!isTarget) {
    button.classList.remove('bubble-wobble');
    void button.offsetWidth;
    button.classList.add('bubble-wobble');
    feedback.textContent = `That is ${button.dataset.label}. Keep looking for ${target.upper} and ${target.lower}.`;
    return;
  }
  button.classList.add('popped');
  button.disabled = true;
  bubbleRemaining -= 1;
  const popped = 6 - bubbleRemaining;
  miniProgress.style.width = `${(popped / 6) * 100}%`;
  feedback.textContent = `Pop! You found ${target.upper}.`;
  if (bubbleRemaining === 0) window.setTimeout(finishGame, 500);
}

function startPictures() {
  pictureRound = 0;
  pictureExamples = shuffle([
    { letter: target.upper, word: target.word, emoji: target.emoji },
    ...EXTRA_PICTURES[target.upper].map(([word, emoji]) => ({ letter: target.upper, word, emoji }))
  ]);
  renderPictureRound();
}

function renderPictureRound() {
  const answer = pictureExamples[pictureRound];
  const distractors = shuffle(ALPHABET.filter(item => item.upper !== target.upper)).slice(0, 2).map(item => {
    const extras = EXTRA_PICTURES[item.upper];
    const choice = Math.random() > 0.5 ? [item.word, item.emoji] : extras[Math.floor(Math.random() * extras.length)];
    return { letter: item.upper, word: choice[0], emoji: choice[1] };
  });
  currentInstruction = `${answer.word}. Which picture starts with letter ${target.upper}?`;
  document.getElementById('letter-stage-instruction').textContent = currentInstruction;
  feedback.textContent = '';
  area.innerHTML = `
    <button class="picture-round-cue" type="button" data-game-action="hear-picture-word"><span aria-hidden="true">🔊</span> Hear the word</button>
    <div class="picture-choice-grid" role="group" aria-label="Choose the picture for letter ${target.upper}">
      ${shuffle([answer, ...distractors]).map(item => `<button class="picture-match-card" type="button" data-game-action="picture" data-letter="${item.letter}" data-word="${item.word}"><span aria-hidden="true">${item.emoji}</span><strong>${item.word}</strong></button>`).join('')}
    </div>`;
  miniProgress.style.width = `${(pictureRound / pictureExamples.length) * 100}%`;
  speak(currentInstruction);
}

function choosePicture(button) {
  const correct = button.dataset.letter === target.upper;
  speak(button.dataset.word);
  area.querySelectorAll('.try-pick').forEach(item => item.classList.remove('try-pick'));
  if (!correct) {
    button.classList.add('try-pick');
    feedback.textContent = `${button.dataset.word} starts with ${button.dataset.letter}. Listen and look once more.`;
    return;
  }
  button.classList.add('correct-pick');
  area.querySelectorAll('button').forEach(item => { item.disabled = true; });
  feedback.textContent = `Yes! ${button.dataset.word} starts with ${target.upper}.`;
  miniProgress.style.width = `${((pictureRound + 1) / pictureExamples.length) * 100}%`;
  speak(`Yes. ${button.dataset.word} starts with ${target.upper}.`);
  if (pictureRound === pictureExamples.length - 1) {
    window.setTimeout(finishGame, 650);
    return;
  }
  const controls = document.createElement('div');
  controls.className = 'game-tools';
  controls.innerHTML = '<button class="button button-primary" type="button" data-game-action="next-picture">Next picnic picture →</button>';
  area.append(controls);
}

function handleGameClick(event) {
  const button = event.target.closest('button');
  if (!button || !area.contains(button)) return;
  const action = button.dataset.gameAction;
  if (action === 'memory') chooseMemory(button);
  if (action === 'bubble') chooseBubble(button);
  if (action === 'picture') choosePicture(button);
  if (action === 'hear-picture-word') speak(currentInstruction.split('.')[0]);
  if (action === 'next-picture') {
    pictureRound += 1;
    renderPictureRound();
  }
}

function finishGame() {
  completed.add(currentGame);
  miniProgress.style.width = '100%';
  const nextIndex = gameOrder.indexOf(currentGame) + 1;
  const nextGame = nextIndex < gameOrder.length ? gameOrder[nextIndex] : '';
  area.innerHTML = `<div class="mini-finish"><div>
    <span class="finish-symbol" aria-hidden="true">★</span>
    <h2>Lovely ${target.upper} work!</h2>
    <p>You explored ${gameMeta[currentGame].title} and found more ways to recognise ${target.upper} and ${target.lower}.</p>
    <div class="mini-finish-actions">
      <button class="button button-primary" id="replay-letter-game" type="button">Play again</button>
      ${nextGame ? '<button class="button button-secondary" id="next-letter-game" type="button">Next game →</button>' : ''}
      <button class="button button-secondary" id="return-letter-menu" type="button">Game menu</button>
    </div>
  </div></div>`;
  feedback.textContent = '';
  document.getElementById('replay-letter-game').addEventListener('click', () => startGame(currentGame));
  document.getElementById('return-letter-menu').addEventListener('click', showMenu);
  if (nextGame) document.getElementById('next-letter-game').addEventListener('click', () => startGame(nextGame));
  speak(`Lovely ${target.upper} work!`);
}

function showMenu() {
  stage.hidden = true;
  menu.hidden = false;
  document.getElementById('letter-play-progress').textContent = `${completed.size} of 3 games explored`;
  document.querySelectorAll('[data-letter-game]').forEach(button => {
    button.classList.toggle('is-complete', completed.has(button.dataset.letterGame));
  });
  menu.focus?.();
}
