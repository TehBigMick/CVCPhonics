import { ALPHABET, speak } from './alphabet-data.js';
import { shuffle } from './utils.js';

const MODE = document.body.dataset.alphabetGame;
const TOTAL = 8;
const LABELS = { hunt: 'Letter Hunt', pairs: 'Capital & small', sounds: 'First sounds', train: 'Alphabet Train' };
let rounds = [], index = 0, score = 0, missed = false, answered = false, current;
const card = document.getElementById('alphabet-game-card');
const result = document.getElementById('alphabet-result');
const scoreText = document.getElementById('alphabet-score');
const counter = document.getElementById('alphabet-counter');
const progress = document.getElementById('alphabet-progress');
const cue = document.getElementById('alphabet-cue');
const prompt = document.getElementById('alphabet-prompt');
const choices = document.getElementById('alphabet-choices');
const feedback = document.getElementById('alphabet-feedback');
const hear = document.getElementById('alphabet-hear');
const next = document.getElementById('alphabet-next');

hear.addEventListener('click', speakCurrent); next.addEventListener('click', advance);
document.addEventListener('keydown', event => {
  if (card.hidden) return;
  if (['1','2','3'].includes(event.key) && !answered) {
    const button = choices.querySelectorAll('button')[Number(event.key) - 1];
    if (button && !button.disabled) { event.preventDefault(); button.click(); }
  }
  if (event.key === 'Enter' && answered && !next.hidden) { event.preventDefault(); next.click(); }
});

start();

function start() {
  rounds = MODE === 'train'
    ? shuffle(ALPHABET.slice(0, -2).map((item, startIndex) => ({ startIndex }))).slice(0, TOTAL)
    : shuffle(ALPHABET).slice(0, TOTAL);
  index = 0; score = 0; card.hidden = false; result.hidden = true; render();
}

function render() {
  current = makeRound(rounds[index], index);
  missed = false; answered = false;
  counter.textContent = `Round ${index + 1} of ${TOTAL}`;
  scoreText.textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  progress.style.width = `${(index / TOTAL) * 100}%`;
  cue.innerHTML = current.cue; prompt.textContent = current.prompt;
  feedback.textContent = ''; feedback.className = 'game-feedback'; next.hidden = true;
  next.textContent = index === TOTAL - 1 ? 'See my result →' : 'Next round →';
  choices.replaceChildren();
  shuffle(current.options).forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'alphabet-choice'; button.textContent = option.label;
    button.setAttribute('aria-label', `Answer ${optionIndex + 1}: ${option.spoken}`);
    button.addEventListener('click', () => choose(option.value, button)); choices.append(button);
  });
  window.setTimeout(speakCurrent, 180);
}

function makeRound(source, roundIndex) {
  if (MODE === 'train') {
    const startIndex = source.startIndex, target = ALPHABET[startIndex + 2];
    return { answer: target.upper, prompt: 'Which letter comes next?', speech: `${ALPHABET[startIndex].upper}, ${ALPHABET[startIndex + 1].upper}. Which letter comes next?`, cue: `<div class="train-cars"><span>${ALPHABET[startIndex].upper}</span><span>${ALPHABET[startIndex + 1].upper}</span><span>?</span></div>`, options: optionsFor(target, 'upper') };
  }
  const item = source;
  if (MODE === 'pairs') return { answer: item.lower, prompt: `Which small letter matches capital ${item.upper}?`, speech: `Find small ${item.lower}.`, cue: `<span class="big-pair"><b>${item.upper}</b></span>`, options: optionsFor(item, 'lower') };
  if (MODE === 'sounds') return { answer: item.upper, prompt: `What letter does ${item.word.toLowerCase()} start with?`, speech: `What letter does ${item.word} start with?`, cue: `<span class="picture-cue"><span>${item.emoji}</span><strong>${item.word}</strong></span>`, options: optionsFor(item, 'pair') };
  const useLower = roundIndex % 2 === 1;
  return { answer: useLower ? item.lower : item.upper, prompt: `Find ${useLower ? 'small' : 'capital'} ${useLower ? item.lower : item.upper}.`, speech: `Find ${useLower ? 'small' : 'capital'} ${useLower ? item.lower : item.upper}.`, cue: '<span class="picture-cue"><span>👂</span><strong>Listen and look</strong></span>', options: optionsFor(item, useLower ? 'lower' : 'upper') };
}

function optionsFor(target, style) {
  const pool = shuffle(ALPHABET.filter(item => item.upper !== target.upper)).slice(0, 2);
  return [target, ...pool].map(item => ({ value: style === 'lower' ? item.lower : item.upper, label: style === 'pair' ? `${item.upper}${item.lower}` : style === 'lower' ? item.lower : item.upper, spoken: style === 'lower' ? `small ${item.lower}` : style === 'pair' ? `${item.upper} and ${item.lower}` : `capital ${item.upper}` }));
}

function choose(value, button) {
  if (answered) return;
  if (value !== current.answer) {
    missed = true; button.classList.add('incorrect'); button.disabled = true;
    feedback.textContent = 'Good try. Look again.'; feedback.className = 'game-feedback feedback-try'; speak('Good try. Look again.'); return;
  }
  answered = true; if (!missed) score += 1;
  choices.querySelectorAll('button').forEach(item => { item.disabled = true; });
  button.classList.add('correct'); progress.style.width = `${((index + 1) / TOTAL) * 100}%`;
  scoreText.textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  const success = MODE === 'sounds' ? `Yes! ${value} starts the word.` : MODE === 'train' ? `Yes! ${value} comes next.` : 'Yes! You found it.';
  feedback.textContent = success; feedback.className = 'game-feedback feedback-correct'; next.hidden = false; speak(success); next.focus();
}

function advance() { index += 1; if (index < TOTAL) render(); else finish(); }
function speakCurrent() { if (!speak(current.speech)) { hear.disabled = true; hear.title = 'Audio is not available in this browser'; } }
function finish() {
  const heading = score >= 7 ? 'Wonderful alphabet work!' : 'Every try helps you learn!';
  card.hidden = true; result.hidden = false;
  result.innerHTML = `<div class="result-celebration" aria-hidden="true">★</div><p class="kicker">${LABELS[MODE]} complete</p><h1>${heading}</h1><p class="result-summary">You earned <strong>${score} of ${TOTAL}</strong> stars on your first try.</p><div class="result-actions alphabet-result-links"><button id="alphabet-again" class="button button-primary" type="button">Play again</button><a class="button button-secondary" href="index.html">Alphabet playroom</a></div>`;
  document.getElementById('alphabet-again').addEventListener('click', start);
}
