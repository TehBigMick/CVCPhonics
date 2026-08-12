import { CVC_LEVELS, FRY_LEVELS } from './data.js';
import { getQueryParam, shuffle, downloadCertificate } from './utils.js';

const type = document.documentElement.dataset.quizType;
const isCvc = type === 'cvc';
const levels = isCvc ? CVC_LEVELS : FRY_LEVELS;
const fallbackLevel = isCvc ? 'Level A' : 'Pre-Primer';
const level = getQueryParam('level') || fallbackLevel;
const sourceWords = levels[level];

if (!sourceWords) window.location.replace('index.html');

const words = shuffle(sourceWords || levels[fallbackLevel]);
const answers = [];
let index = 0;
let finished = false;

const certificateMap = isCvc
  ? {
      'Level A': '../assets/cert-cvc-Level A.png',
      'Level B': '../assets/cert-cvc-Level B.png',
      'Level C': '../assets/cert-cvc-Level C.png',
      'Level D': '../assets/cert-cvc-Level D.png'
    }
  : {
      'Pre-Primer': '../assets/cert-sight-Pre-Primer.png',
      'Primer': '../assets/cert-sight-Primer.png',
      'Grade 1': '../assets/cert-sight-Grade 1.png',
      'Grade 2': '../assets/cert-sight-Grade 2.png'
    };

const quiz = document.getElementById('quiz-container');
const result = document.getElementById('result-container');
const levelTitle = document.getElementById('level-title');
const word = document.getElementById('word');
const counter = document.getElementById('counter');
const progress = document.getElementById('progress-bar');
const yesButton = document.getElementById('yes-btn');
const noButton = document.getElementById('no-btn');
const undoButton = document.getElementById('undo-btn');

levelTitle.textContent = level;
document.title = `${level} ${isCvc ? 'CVC' : 'sight-word'} check | Michael's Phonics Hub`;
renderWord();

yesButton.addEventListener('click', () => answer(true));
noButton.addEventListener('click', () => answer(false));
undoButton.addEventListener('click', undo);

document.addEventListener('keydown', event => {
  if (finished || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'ArrowRight') answer(true);
  if (event.key === 'ArrowLeft') answer(false);
});

function renderWord() {
  word.textContent = words[index];
  counter.textContent = `Word ${index + 1} of ${words.length}`;
  progress.style.width = `${(index / words.length) * 100}%`;
  undoButton.disabled = answers.length === 0;

  word.classList.remove('word-enter');
  requestAnimationFrame(() => word.classList.add('word-enter'));
}

function answer(canRead) {
  if (finished) return;
  answers.push({ word: words[index], canRead });
  index += 1;

  if (index < words.length) renderWord();
  else showResult();
}

function undo() {
  if (finished || answers.length === 0) return;
  answers.pop();
  index -= 1;
  renderWord();
}

function showResult() {
  finished = true;
  const score = answers.filter(item => item.canRead).length;
  const missed = answers.filter(item => !item.canRead).map(item => item.word);
  const percentage = Math.round((score / words.length) * 100);
  const passed = score >= 23;
  const message = passed
    ? 'Brilliant reading!'
    : percentage >= 72
      ? 'Good progress!'
      : 'A useful first step.';

  saveResult(score);
  quiz.hidden = true;
  result.hidden = false;

  result.innerHTML = `
    <div class="result-celebration" aria-hidden="true">${passed ? '★' : '↗'}</div>
    <p class="kicker">Check complete</p>
    <h1>${message}</h1>
    <p class="result-summary">The learner read <strong>${score} of ${words.length}</strong> words independently.</p>
    <div class="score-ring" style="--score: ${percentage * 3.6}deg">
      <div><strong>${percentage}%</strong><span>${score} / ${words.length}</span></div>
    </div>
    ${missed.length
      ? `<div class="review-panel"><h2>Words to practise</h2><p>Use these for the next short review.</p><div class="review-words">${missed.map(item => `<span>${item}</span>`).join('')}</div></div>`
      : '<div class="review-panel all-clear"><h2>Every word was read correctly</h2><p>That is worth celebrating.</p></div>'}
    <div class="result-actions" id="result-actions"></div>
  `;

  const actions = document.getElementById('result-actions');
  if (passed) actions.append(createCertificateButton());
  actions.append(
    createAction('Try this check again', window.location.href, 'button-secondary'),
    createAction(`Choose another ${isCvc ? 'level' : 'stage'}`, 'index.html', 'button-secondary'),
    createAction(isCvc ? 'Play sound builder' : 'Practise quick cards', isCvc ? 'builder.html' : 'practice.html', 'button-primary')
  );
}

function createAction(label, href, className) {
  const link = document.createElement('a');
  link.className = `button ${className}`;
  link.href = href;
  link.textContent = label;
  return link;
}

function createCertificateButton() {
  const button = document.createElement('button');
  button.className = 'button button-certificate';
  button.type = 'button';
  button.textContent = 'Download certificate';
  button.addEventListener('click', () => {
    const safeLevel = level.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    downloadCertificate({
      templatePath: certificateMap[level],
      filename: `Certificate_${safeLevel}.png`
    });
  });
  return button;
}

function saveResult(score) {
  try {
    const history = JSON.parse(localStorage.getItem('phonicsHubProgress') || '[]');
    history.push({ type, level, score, total: words.length, date: new Date().toISOString() });
    localStorage.setItem('phonicsHubProgress', JSON.stringify(history.slice(-20)));
  } catch {
    // Progress saving is optional and must not interrupt a reading check.
  }
}
