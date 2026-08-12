import { CVC_LEVELS } from './data.js';
import { shuffle } from './utils.js';

const ROUND_COUNT = 10;
const vowels = ['a', 'e', 'i', 'o', 'u'];
let level = 'Level A';
let words = [];
let index = 0;
let score = 0;
let missedCurrent = false;
let currentWord = '';

const container = document.getElementById('builder-container');
const result = document.getElementById('builder-result');
const levelSelect = document.getElementById('level-select');
const counter = document.getElementById('builder-counter');
const scoreText = document.getElementById('builder-score');
const progress = document.getElementById('builder-progress');
const slots = document.getElementById('word-slots');
const options = document.getElementById('vowel-options');
const hearButton = document.getElementById('hear-word');
const clueButton = document.getElementById('clue-button');
const clue = document.getElementById('clue');
const feedback = document.getElementById('builder-feedback');
const nextButton = document.getElementById('next-word');

levelSelect.addEventListener('change', () => start(levelSelect.value));
hearButton.addEventListener('click', speakCurrentWord);
clueButton.addEventListener('click', showClue);
nextButton.addEventListener('click', next);

start(level);

function start(selectedLevel) {
  level = selectedLevel;
  words = shuffle(CVC_LEVELS[level]).slice(0, ROUND_COUNT);
  index = 0;
  score = 0;
  container.hidden = false;
  result.hidden = true;
  render();
}

function render() {
  currentWord = words[index];
  missedCurrent = false;
  counter.textContent = `Round ${index + 1} of ${words.length}`;
  scoreText.textContent = `${score} correct`;
  progress.style.width = `${(index / words.length) * 100}%`;
  slots.innerHTML = `<span>${currentWord[0]}</span><span class="missing-slot">?</span><span>${currentWord[2]}</span>`;
  feedback.textContent = '';
  feedback.className = 'game-feedback';
  clue.hidden = true;
  nextButton.hidden = true;
  hearButton.disabled = false;
  buildOptions();
}

function buildOptions() {
  const answer = currentWord[1];
  const choices = shuffle([answer, ...shuffle(vowels.filter(vowel => vowel !== answer)).slice(0, 2)]);
  options.replaceChildren();

  choices.forEach(vowel => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vowel-button';
    button.textContent = vowel;
    button.setAttribute('aria-label', `Choose the vowel ${vowel}`);
    button.addEventListener('click', () => chooseVowel(vowel, button));
    options.append(button);
  });
}

function chooseVowel(vowel, button) {
  if (vowel !== currentWord[1]) {
    missedCurrent = true;
    button.classList.add('incorrect');
    button.disabled = true;
    feedback.textContent = 'Good try. Listen once more and choose another sound.';
    feedback.className = 'game-feedback feedback-try';
    speakCurrentWord();
    return;
  }

  if (!missedCurrent) score += 1;
  slots.innerHTML = currentWord.split('').map(letter => `<span class="slot-correct">${letter}</span>`).join('');
  options.querySelectorAll('button').forEach(item => { item.disabled = true; });
  button.classList.add('correct');
  feedback.textContent = `Yes — ${currentWord}!`;
  feedback.className = 'game-feedback feedback-correct';
  nextButton.hidden = false;
  nextButton.textContent = index === words.length - 1 ? 'See my result →' : 'Next word →';
}

function showClue() {
  clue.textContent = `The middle sound is /${currentWord[1]}/.`;
  clue.hidden = false;
  missedCurrent = true;
}

function speakCurrentWord() {
  if (!('speechSynthesis' in window)) {
    feedback.textContent = 'Audio is not available in this browser. Ask a grown-up to say the word.';
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.lang = 'en-GB';
  utterance.rate = 0.72;
  utterance.pitch = 1.05;
  speechSynthesis.speak(utterance);
}

function next() {
  index += 1;
  if (index < words.length) render();
  else showResult();
}

function showResult() {
  const percentage = Math.round((score / words.length) * 100);
  container.hidden = true;
  result.hidden = false;
  result.innerHTML = `
    <div class="result-celebration" aria-hidden="true">★</div>
    <p class="kicker">Ten rounds complete</p>
    <h1>${percentage >= 80 ? 'Super sound work!' : 'Practice makes progress!'}</h1>
    <p class="result-summary">You found <strong>${score} of ${words.length}</strong> middle sounds on your first try.</p>
    <div class="result-actions">
      <button id="play-again" class="button button-primary" type="button">Play another ten</button>
      <a class="button button-secondary" href="index.html">Choose a reading level</a>
      <a class="button button-secondary" href="../index.html">Back to home</a>
    </div>
  `;
  document.getElementById('play-again').addEventListener('click', () => start(level));
}
