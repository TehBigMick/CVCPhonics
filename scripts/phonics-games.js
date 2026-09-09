import { speak } from './alphabet-data.js';
import { shuffle } from './utils.js';

const WORD_SETS = {
  first: [
    ['cat', '🐱'], ['dog', '🐶'], ['pig', '🐷'], ['sun', '☀️'], ['hat', '🎩'],
    ['pan', '🍳'], ['pen', '🖊️'], ['cup', '🥤'], ['bag', '🎒'], ['bus', '🚌']
  ],
  more: [
    ['fox', '🦊'], ['hen', '🐔'], ['van', '🚐'], ['box', '📦'], ['rug', '🧶'],
    ['web', '🕸️'], ['tub', '🛁'], ['mug', '☕'], ['bun', '🍞'], ['log', '🪵']
  ]
};

const RHYMES = {
  first: [
    rhyme('cat', '🐱', 'hat', '🎩', [['dog', '🐶'], ['sun', '☀️']]),
    rhyme('dog', '🐶', 'log', '🪵', [['pen', '🖊️'], ['cup', '🥤']]),
    rhyme('sun', '☀️', 'bun', '🍞', [['cat', '🐱'], ['hen', '🐔']]),
    rhyme('hen', '🐔', 'pen', '🖊️', [['pig', '🐷'], ['bus', '🚌']])
  ],
  more: [
    rhyme('map', '🗺️', 'cap', '🧢', [['fox', '🦊'], ['web', '🕸️']]),
    rhyme('mug', '☕', 'rug', '🧶', [['van', '🚐'], ['box', '📦']]),
    rhyme('fox', '🦊', 'box', '📦', [['tub', '🛁'], ['log', '🪵']]),
    rhyme('pig', '🐷', 'wig', '💇', [['bun', '🍞'], ['cat', '🐱']])
  ]
};

const gameMeta = {
  spell: { kicker: 'Tap to spell', title: 'Build the Word' },
  read: { kicker: 'Read and match', title: 'Picture Match' },
  rhyme: { kicker: 'Hear the pattern', title: 'Rhyme Train' }
};

const menu = document.getElementById('phonics-menu');
const stage = document.getElementById('phonics-stage');
const area = document.getElementById('phonics-game-area');
const feedback = document.getElementById('phonics-game-feedback');
const progress = document.getElementById('phonics-game-progress');
const roundText = document.getElementById('phonics-round');
const starsText = document.getElementById('phonics-stars');
const wordSetSelect = document.getElementById('phonics-word-set');

let currentGame = '';
let currentInstruction = '';
let rounds = [];
let roundIndex = 0;
let stars = 0;
let buildIndex = 0;
let cluesVisible = true;
let trainWords = [];
const completedGames = new Set();

document.querySelectorAll('[data-phonics-game]').forEach(button => {
  button.addEventListener('click', () => startGame(button.dataset.phonicsGame));
});
document.getElementById('back-to-phonics-menu').addEventListener('click', showMenu);
document.getElementById('repeat-phonics-instruction').addEventListener('click', repeatCurrent);
wordSetSelect.addEventListener('change', () => { if (currentGame) startGame(currentGame); });
area.addEventListener('click', handleGameClick);

const requestedGame = new URLSearchParams(window.location.search).get('game');
if (gameMeta[requestedGame]) startGame(requestedGame);

function rhyme(target, targetEmoji, answer, answerEmoji, distractors) {
  return {
    target: { word: target, emoji: targetEmoji },
    answer: { word: answer, emoji: answerEmoji },
    choices: [[answer, answerEmoji], ...distractors].map(([word, emoji]) => ({ word, emoji }))
  };
}

function startGame(game) {
  currentGame = game;
  roundIndex = 0;
  stars = 0;
  trainWords = [];
  const selected = wordSetSelect.value;
  if (game === 'rhyme') {
    rounds = shuffle(selected === 'mixed' ? [...RHYMES.first, ...RHYMES.more] : RHYMES[selected]);
  } else {
    const words = selected === 'mixed' ? [...WORD_SETS.first, ...WORD_SETS.more] : WORD_SETS[selected];
    rounds = shuffle(words).slice(0, 8).map(([word, emoji]) => ({ word, emoji }));
  }
  menu.hidden = true;
  stage.hidden = false;
  document.getElementById('phonics-stage-kicker').textContent = gameMeta[game].kicker;
  document.getElementById('phonics-stage-title').textContent = gameMeta[game].title;
  renderRound();
}

function renderRound() {
  feedback.textContent = '';
  feedback.className = 'game-feedback';
  progress.style.width = ((roundIndex / rounds.length) * 100) + '%';
  roundText.textContent = 'Round ' + (roundIndex + 1) + ' of ' + rounds.length;
  starsText.textContent = stars + (stars === 1 ? ' star' : ' stars');
  if (currentGame === 'spell') renderSpelling();
  if (currentGame === 'read') renderReading();
  if (currentGame === 'rhyme') renderRhyme();
  document.getElementById('phonics-stage-instruction').textContent = currentInstruction;
  window.setTimeout(repeatCurrent, 160);
}

function renderSpelling() {
  const item = rounds[roundIndex];
  buildIndex = 0;
  currentInstruction = item.word + '. Tap the letters in order to spell ' + item.word + '.';
  const extraLetters = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(letter => !item.word.includes(letter))).slice(0, 1);
  const letters = shuffle([...item.word, ...extraLetters]);
  const slots = item.word.split('').map(letter =>
    '<span class="spelling-slot' + (cluesVisible ? ' hinted' : '') + '" data-hint="' + letter + '"></span>'
  ).join('');
  const bank = letters.map((letter, index) =>
    '<button class="bank-letter" type="button" data-phonics-action="spell-letter" data-letter="' + letter + '" data-tile="' + index + '">' + letter + '</button>'
  ).join('');
  area.innerHTML =
    '<button class="word-picture" type="button" data-phonics-action="hear-word" aria-label="Hear ' + item.word + '"><span aria-hidden="true">' + item.emoji + '</span><strong>Tap to hear</strong></button>' +
    '<div class="spelling-slots" id="spelling-slots" aria-label="Three spelling spaces">' + slots + '</div>' +
    '<div class="letter-bank" role="group" aria-label="Letters to choose">' + bank + '</div>' +
    '<div class="game-tools" id="spell-tools">' +
      '<button class="button button-secondary" type="button" data-phonics-action="hear-word">🔊 Hear word</button>' +
      '<button class="button button-secondary" type="button" data-phonics-action="toggle-clues">' + (cluesVisible ? 'Hide' : 'Show') + ' letter clues</button>' +
      '<button class="button button-secondary" type="button" data-phonics-action="clear-word">↻ Clear letters</button>' +
    '</div>';
}

function chooseSpellingLetter(button) {
  const item = rounds[roundIndex];
  const expected = item.word[buildIndex];
  const chosen = button.dataset.letter;
  speak('Letter ' + chosen);
  if (chosen !== expected) {
    button.classList.remove('letter-nudge');
    void button.offsetWidth;
    button.classList.add('letter-nudge');
    feedback.textContent = 'That is ' + chosen + '. Look for the next letter in ' + item.word + '.';
    return;
  }
  const slot = document.querySelectorAll('.spelling-slot')[buildIndex];
  slot.textContent = chosen;
  slot.classList.add('filled');
  button.classList.add('used');
  button.disabled = true;
  buildIndex += 1;
  feedback.textContent = buildIndex < item.word.length ? 'Good building. Choose the next letter.' : 'You built ' + item.word + '!';
  if (buildIndex === item.word.length) completeRound('You built ' + item.word + '! ' + item.word + '.');
}

function clearWord() {
  buildIndex = 0;
  document.querySelectorAll('.spelling-slot').forEach(slot => { slot.textContent = ''; slot.classList.remove('filled'); });
  document.querySelectorAll('.bank-letter').forEach(button => { button.disabled = false; button.classList.remove('used', 'letter-nudge'); });
  feedback.textContent = 'All clear. Listen and build it again.';
  repeatCurrent();
}

function toggleClues() {
  cluesVisible = !cluesVisible;
  document.querySelectorAll('.spelling-slot').forEach(slot => slot.classList.toggle('hinted', cluesVisible));
  const button = area.querySelector('[data-phonics-action="toggle-clues"]');
  button.textContent = (cluesVisible ? 'Hide' : 'Show') + ' letter clues';
}

function renderReading() {
  const item = rounds[roundIndex];
  const pool = wordSetSelect.value === 'mixed' ? [...WORD_SETS.first, ...WORD_SETS.more] : WORD_SETS[wordSetSelect.value];
  const distractors = shuffle(pool.filter(([word]) => word !== item.word)).slice(0, 2).map(([word, emoji]) => ({ word, emoji }));
  currentInstruction = 'Blend the word ' + item.word + '. Then find its picture.';
  const choices = shuffle([item, ...distractors]).map(choice =>
    '<button class="picture-match-card" type="button" data-phonics-action="read-picture" data-word="' + choice.word + '" aria-label="' + choice.word + '">' +
      '<span aria-hidden="true">' + choice.emoji + '</span><strong hidden>' + choice.word + '</strong><small>tap picture</small></button>'
  ).join('');
  area.innerHTML =
    '<div class="read-word-card" aria-label="Word to read"><strong>' + item.word + '</strong></div>' +
    '<div class="sound-dots" aria-label="Three sounds"><span></span><span></span><span></span></div>' +
    '<div class="read-choice-grid" role="group" aria-label="Choose the matching picture">' + choices + '</div>' +
    '<div class="game-tools"><button class="button button-secondary" type="button" data-phonics-action="hear-word">🔊 Hear and blend</button></div>';
}

function chooseReadingPicture(button) {
  const item = rounds[roundIndex];
  speak(button.dataset.word);
  area.querySelectorAll('.try-pick').forEach(choice => choice.classList.remove('try-pick'));
  if (button.dataset.word !== item.word) {
    button.classList.add('try-pick');
    feedback.textContent = 'That picture is ' + button.dataset.word + '. Blend the word once more.';
    return;
  }
  button.classList.add('correct-pick');
  button.querySelector('strong').hidden = false;
  completeRound('Yes. The word ' + item.word + ' matches the picture.');
}

function renderRhyme() {
  const challenge = rounds[roundIndex];
  currentInstruction = 'Which word rhymes with ' + challenge.target.word + '? Listen: ' + challenge.target.word + '.';
  const choices = shuffle(challenge.choices).map(choice =>
    '<button class="picture-match-card" type="button" data-phonics-action="rhyme-choice" data-word="' + choice.word + '">' +
      '<span aria-hidden="true">' + choice.emoji + '</span><strong>' + choice.word + '</strong></button>'
  ).join('');
  const train = trainWords.map(word => '<span>' + word + '</span>').join('');
  area.innerHTML =
    '<div class="rhyme-engine">' +
      '<button class="rhyme-target" type="button" data-phonics-action="hear-rhyme-target"><span aria-hidden="true">' + challenge.target.emoji + '</span><strong>' + challenge.target.word + '</strong><small>Tap to hear</small></button>' +
      '<div class="rhyme-choices" role="group" aria-label="Choose the rhyming word">' + choices + '</div>' +
    '</div>' +
    '<div class="rhyme-train" id="rhyme-train" aria-label="Rhyming words added to the train">' + train + '</div>';
}

function chooseRhyme(button) {
  const challenge = rounds[roundIndex];
  speak(button.dataset.word);
  area.querySelectorAll('.try-pick').forEach(choice => choice.classList.remove('try-pick'));
  if (button.dataset.word !== challenge.answer.word) {
    button.classList.add('try-pick');
    feedback.textContent = button.dataset.word + ' has a different ending. Listen for the same ending sound.';
    return;
  }
  button.classList.add('correct-pick');
  trainWords.push(button.dataset.word);
  document.getElementById('rhyme-train').innerHTML = trainWords.map(word => '<span>' + word + '</span>').join('');
  completeRound(challenge.target.word + ' and ' + challenge.answer.word + ' rhyme. They have the same ending sound.');
}

function completeRound(message) {
  stars += 1;
  starsText.textContent = stars + (stars === 1 ? ' star' : ' stars');
  progress.style.width = (((roundIndex + 1) / rounds.length) * 100) + '%';
  feedback.textContent = message;
  area.querySelectorAll('button').forEach(button => { button.disabled = true; });
  const controls = document.createElement('div');
  controls.className = 'game-tools';
  controls.innerHTML = '<button class="button button-primary" type="button" data-phonics-action="next-round">' +
    (roundIndex === rounds.length - 1 ? 'See my result' : 'Next word') + ' →</button>';
  area.append(controls);
  speak(message);
}

function nextRound() {
  roundIndex += 1;
  if (roundIndex < rounds.length) renderRound();
  else finishGame();
}

function finishGame() {
  completedGames.add(currentGame);
  currentInstruction = 'Brilliant phonics play!';
  progress.style.width = '100%';
  roundText.textContent = 'Game complete';
  area.innerHTML =
    '<div class="mini-finish"><div><span class="finish-symbol" aria-hidden="true">★</span>' +
    '<h2>Brilliant phonics play!</h2>' +
    '<p>You completed ' + stars + ' picture-supported words. Replay whenever you want—practice makes the sounds feel familiar.</p>' +
    '<div class="mini-finish-actions"><button class="button button-primary" id="replay-phonics-game" type="button">Play again</button>' +
    '<button class="button button-secondary" id="return-phonics-menu" type="button">Choose a game</button></div></div></div>';
  feedback.textContent = '';
  document.getElementById('replay-phonics-game').addEventListener('click', () => startGame(currentGame));
  document.getElementById('return-phonics-menu').addEventListener('click', showMenu);
  speak('Brilliant phonics play!');
}

function handleGameClick(event) {
  const button = event.target.closest('button');
  if (!button || !area.contains(button)) return;
  const action = button.dataset.phonicsAction;
  if (action === 'hear-word') speak(rounds[roundIndex].word);
  if (action === 'spell-letter') chooseSpellingLetter(button);
  if (action === 'clear-word') clearWord();
  if (action === 'toggle-clues') toggleClues();
  if (action === 'read-picture') chooseReadingPicture(button);
  if (action === 'hear-rhyme-target') speak(rounds[roundIndex].target.word);
  if (action === 'rhyme-choice') chooseRhyme(button);
  if (action === 'next-round') nextRound();
}

function repeatCurrent() {
  if ((currentGame === 'spell' || currentGame === 'read') && rounds[roundIndex]) speak(rounds[roundIndex].word);
  else speak(currentInstruction);
}

function showMenu() {
  stage.hidden = true;
  menu.hidden = false;
  document.querySelectorAll('[data-phonics-game]').forEach(button => {
    button.classList.toggle('is-complete', completedGames.has(button.dataset.phonicsGame));
  });
}
