import { shuffle } from './utils.js';
import { LETTER_QUESTIONS as QUESTIONS } from './letters-data.js';

let index = 0;
let score = 0;
let missedCurrent = false;
let answered = false;

const intro = document.getElementById('letter-intro');
const questionPanel = document.getElementById('letter-question');
const result = document.getElementById('letter-result');
const counter = document.getElementById('letter-counter');
const scoreText = document.getElementById('letter-score');
const progress = document.getElementById('letter-progress');
const cue = document.getElementById('letter-cue');
const prompt = document.getElementById('letter-prompt');
const options = document.getElementById('letter-options');
const feedback = document.getElementById('letter-feedback');
const hearButton = document.getElementById('hear-letter-question');
const nextButton = document.getElementById('next-letter-question');

document.querySelectorAll('[data-say]').forEach(button => {
  button.addEventListener('click', () => speak(button.dataset.say));
});
document.getElementById('start-letter-game').addEventListener('click', startGame);
hearButton.addEventListener('click', speakQuestion);
nextButton.addEventListener('click', nextQuestion);
document.addEventListener('keydown', handleKeydown);

function startGame() {
  index = 0;
  score = 0;
  intro.hidden = true;
  result.hidden = true;
  questionPanel.hidden = false;
  renderQuestion();
  speakQuestion();
}

function renderQuestion() {
  const current = QUESTIONS[index];
  missedCurrent = false;
  answered = false;
  counter.textContent = `Round ${index + 1} of ${QUESTIONS.length}`;
  scoreText.textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  progress.style.width = `${(index / QUESTIONS.length) * 100}%`;
  cue.innerHTML = current.cue;
  prompt.textContent = current.prompt;
  feedback.textContent = '';
  feedback.className = 'game-feedback';
  nextButton.hidden = true;
  nextButton.innerHTML = index === QUESTIONS.length - 1
    ? 'See my result <span aria-hidden="true">→</span>'
    : 'Next round <span aria-hidden="true">→</span>';
  renderChoices(current);
}

function renderChoices(current) {
  options.replaceChildren();
  shuffle(current.choices).forEach((choice, choiceIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `letter-option ${choice.className}`;
    button.dataset.value = choice.value;
    button.setAttribute('aria-label', `Answer ${choiceIndex + 1}: ${choice.accessibleName}`);
    button.innerHTML = choice.label;
    button.addEventListener('click', () => chooseAnswer(choice.value, button));
    options.append(button);
  });
}

function chooseAnswer(value, button) {
  if (answered) return;
  const current = QUESTIONS[index];

  if (value !== current.answer) {
    missedCurrent = true;
    button.classList.add('incorrect');
    button.disabled = true;
    feedback.textContent = 'Good try. Look carefully and choose again.';
    feedback.className = 'game-feedback feedback-try';
    speak('Good try. Look carefully and choose again.');
    return;
  }

  answered = true;
  if (!missedCurrent) score += 1;
  progress.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;
  scoreText.textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  options.querySelectorAll('button').forEach(item => { item.disabled = true; });
  button.classList.add('correct');
  feedback.textContent = current.success;
  feedback.className = 'game-feedback feedback-correct';
  nextButton.hidden = false;
  speak(current.success);
  nextButton.focus();
}

function nextQuestion() {
  index += 1;
  if (index < QUESTIONS.length) {
    renderQuestion();
    speakQuestion();
    return;
  }
  showResult();
}

function showResult() {
  const percentage = Math.round((score / QUESTIONS.length) * 100);
  questionPanel.hidden = true;
  result.hidden = false;
  result.innerHTML = `
    <div class="result-celebration" aria-hidden="true">★</div>
    <p class="kicker">Twelve rounds complete</p>
    <h1>${percentage >= 80 ? 'Brilliant letter work!' : 'A great first step!'}</h1>
    <p class="result-summary">You earned <strong>${score} of ${QUESTIONS.length}</strong> stars on your first try.</p>
    <div class="letter-recap" aria-label="Letters and words practised">
      <article><span class="recap-pair">Aa</span><strong>Apple · Axe</strong><span aria-hidden="true">🍎 🪓</span></article>
      <article><span class="recap-pair recap-pair-b">Bb</span><strong>Book · Bag</strong><span aria-hidden="true">📖 🎒</span></article>
    </div>
    <div class="result-actions">
      <button id="play-letters-again" class="button button-primary" type="button">Play again</button>
      <button id="review-letters" class="button button-secondary" type="button">Review A and B</button>
      <a class="button button-secondary" href="index.html">Alphabet games</a>
    </div>
  `;
  document.getElementById('play-letters-again').addEventListener('click', startGame);
  document.getElementById('review-letters').addEventListener('click', showIntro);
}

function showIntro() {
  result.hidden = true;
  questionPanel.hidden = true;
  intro.hidden = false;
  document.getElementById('start-letter-game').focus();
}

function speakQuestion() {
  speak(QUESTIONS[index].speech);
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    hearButton.disabled = true;
    hearButton.title = 'Audio is not available in this browser';
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.78;
  utterance.pitch = 1.04;
  speechSynthesis.speak(utterance);
}

function handleKeydown(event) {
  if (questionPanel.hidden) return;
  if ((event.key === '1' || event.key === '2') && !answered) {
    const button = options.querySelectorAll('button')[Number(event.key) - 1];
    if (button && !button.disabled) {
      event.preventDefault();
      button.click();
    }
  }
  if (event.key === 'Enter' && answered && !nextButton.hidden) {
    event.preventDefault();
    nextButton.click();
  }
}
