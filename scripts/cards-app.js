import { FRY_LEVELS } from './data.js';
import { shuffle } from './utils.js';

const CARD_COUNT = 10;
let level = 'Pre-Primer';
let words = [];
let index = 0;
let knownWords = [];
let focusWords = [];

const container = document.getElementById('cards-container');
const result = document.getElementById('cards-result');
const levelSelect = document.getElementById('level-select');
const counter = document.getElementById('cards-counter');
const score = document.getElementById('cards-score');
const progress = document.getElementById('cards-progress');
const word = document.getElementById('card-word');
const hearButton = document.getElementById('hear-word');
const againButton = document.getElementById('again-btn');
const gotButton = document.getElementById('got-btn');

levelSelect.addEventListener('change', () => start(levelSelect.value));
hearButton.addEventListener('click', speakWord);
againButton.addEventListener('click', () => sortCard(false));
gotButton.addEventListener('click', () => sortCard(true));

start(level);

function start(selectedLevel, selectedWords = null) {
  level = selectedLevel;
  words = selectedWords || shuffle(FRY_LEVELS[level]).slice(0, CARD_COUNT);
  index = 0;
  knownWords = [];
  focusWords = [];
  container.hidden = false;
  result.hidden = true;
  render();
}

function render() {
  counter.textContent = `Card ${index + 1} of ${words.length}`;
  score.textContent = `${knownWords.length} in the “Got it” pile`;
  progress.style.width = `${(index / words.length) * 100}%`;
  word.textContent = words[index];
  word.classList.remove('word-enter');
  requestAnimationFrame(() => word.classList.add('word-enter'));
}

function sortCard(gotIt) {
  (gotIt ? knownWords : focusWords).push(words[index]);
  index += 1;
  if (index < words.length) render();
  else showResult();
}

function speakWord() {
  if (!('speechSynthesis' in window)) {
    hearButton.textContent = 'Audio is unavailable';
    hearButton.disabled = true;
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(words[index]);
  utterance.lang = 'en-GB';
  utterance.rate = 0.72;
  speechSynthesis.speak(utterance);
}

function showResult() {
  container.hidden = true;
  result.hidden = false;
  result.innerHTML = `
    <div class="result-celebration" aria-hidden="true">★</div>
    <p class="kicker">Cards sorted</p>
    <h1>${focusWords.length === 0 ? 'You knew every word!' : 'Your focus pile is ready.'}</h1>
    <p class="result-summary">You read <strong>${knownWords.length} of ${words.length}</strong> words independently.</p>
    ${focusWords.length
      ? `<div class="review-panel"><h2>Practise these again</h2><p>A second short look can make a big difference.</p><div class="review-words">${focusWords.map(item => `<span>${item}</span>`).join('')}</div></div>`
      : ''}
    <div class="result-actions" id="card-result-actions"></div>
  `;

  const actions = document.getElementById('card-result-actions');
  if (focusWords.length) {
    const focusButton = document.createElement('button');
    focusButton.type = 'button';
    focusButton.className = 'button button-primary';
    focusButton.textContent = 'Review my focus pile';
    focusButton.addEventListener('click', () => start(level, shuffle(focusWords)));
    actions.append(focusButton);
  }

  const newCards = document.createElement('button');
  newCards.type = 'button';
  newCards.className = `button ${focusWords.length ? 'button-secondary' : 'button-primary'}`;
  newCards.textContent = 'Try ten new cards';
  newCards.addEventListener('click', () => start(level));
  actions.append(newCards);

  const stagesLink = document.createElement('a');
  stagesLink.className = 'button button-secondary';
  stagesLink.href = 'index.html';
  stagesLink.textContent = 'Choose another stage';
  actions.append(stagesLink);
}
