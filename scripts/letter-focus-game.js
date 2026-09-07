import { ALPHABET, letterSpeech, speak } from './alphabet-data.js';
import { shuffle } from './utils.js';

const requested = (new URLSearchParams(window.location.search).get('letter') || 'A').toUpperCase();
const targetIndex = ALPHABET.findIndex(item => item.upper === requested);
const target = ALPHABET[targetIndex < 0 ? 0 : targetIndex];
const distractors = shuffle(ALPHABET.filter(item => item.upper !== target.upper)).slice(0, 4);
const rounds = buildRounds();
let index = 0, score = 0, missed = false, answered = false;

const intro = document.getElementById('focus-intro'), game = document.getElementById('focus-game'), result = document.getElementById('focus-result');
const cue = document.getElementById('focus-cue'), prompt = document.getElementById('focus-prompt'), choices = document.getElementById('focus-choices');
const feedback = document.getElementById('focus-feedback'), next = document.getElementById('focus-next'), hear = document.getElementById('focus-hear');

document.title = `All About ${target.upper} | Michael's Phonics Hub`;
document.getElementById('focus-title').textContent = `All about ${target.upper}`;
document.getElementById('focus-pair').textContent = `${target.upper}${target.lower}`;
document.getElementById('focus-emoji').textContent = target.emoji;
document.getElementById('focus-word').textContent = target.word;
document.getElementById('focus-kicker').textContent = `Letter ${target.upper}`;
document.getElementById('focus-game-title').textContent = `All about ${target.upper}`;
document.getElementById('focus-hear-intro').addEventListener('click', () => speak(letterSpeech(target)));
document.getElementById('focus-start').addEventListener('click', start);
hear.addEventListener('click', speakRound); next.addEventListener('click', advance);
document.addEventListener('keydown', event => {
  if (game.hidden) return;
  if (['1','2','3'].includes(event.key) && !answered) { const button = choices.querySelectorAll('button')[Number(event.key) - 1]; if (button && !button.disabled) { event.preventDefault(); button.click(); } }
  if (event.key === 'Enter' && answered && !next.hidden) { event.preventDefault(); next.click(); }
});

function buildRounds() {
  const letters = [target, distractors[0], distractors[1]];
  const pictures = [target, distractors[2], distractors[3]];
  return [
    make('Find capital ' + target.upper + '.', target.upper, letters.map(item => option(item.upper, 'capital ' + item.upper)), `<span class="picture-cue"><span>👂</span><strong>Listen and look</strong></span>`),
    make('Find small ' + target.lower + '.', target.lower, letters.map(item => option(item.lower, 'small ' + item.lower)), `<span class="big-pair"><b>${target.upper}</b></span>`),
    make(`Which pair belongs to letter ${target.upper}?`, target.upper, letters.map(item => option(item.upper, `${item.upper} and ${item.lower}`, `${item.upper}${item.lower}`)), '<span class="cue-label">Match the pair</span>'),
    make(`What letter does ${target.word.toLowerCase()} start with?`, target.upper, letters.map(item => option(item.upper, `${item.upper} and ${item.lower}`, `${item.upper}${item.lower}`)), `<span class="picture-cue"><span>${target.emoji}</span><strong>${target.word}</strong></span>`),
    make(`Which picture starts with ${target.upper}?`, target.word, pictures.map(item => pictureOption(item)), `<span class="big-pair"><b>${target.upper}</b><b>${target.lower}</b></span>`),
    make(`Find ${target.word}.`, target.word, shuffle(pictures).map(item => pictureOption(item)), '<span class="picture-cue"><span>👂</span><strong>Listen for the word</strong></span>')
  ];
}

function option(value, spoken, label = value) { return { value, spoken, label, picture: false }; }
function pictureOption(item) { return { value: item.word, spoken: item.word, label: `<span class="focus-choice-emoji">${item.emoji}</span><small>${item.word}</small>`, picture: true }; }
function make(speechText, answer, options, cueHtml) { return { prompt: speechText, speech: speechText, answer, options, cue: cueHtml }; }

function start() { index = 0; score = 0; intro.hidden = true; result.hidden = true; game.hidden = false; render(); }
function render() {
  const round = rounds[index]; missed = false; answered = false;
  document.getElementById('focus-counter').textContent = `Round ${index + 1} of ${rounds.length}`;
  document.getElementById('focus-score').textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  document.getElementById('focus-progress').style.width = `${(index / rounds.length) * 100}%`;
  cue.innerHTML = round.cue; prompt.textContent = round.prompt; feedback.textContent = ''; feedback.className = 'game-feedback'; next.hidden = true;
  next.textContent = index === rounds.length - 1 ? 'See my result →' : 'Next round →'; choices.replaceChildren();
  shuffle(round.options).forEach((choice, choiceIndex) => { const button = document.createElement('button'); button.type = 'button'; button.className = `alphabet-choice${choice.picture ? ' focus-picture-choice' : ''}`; button.setAttribute('aria-label', `Answer ${choiceIndex + 1}: ${choice.spoken}`); button.innerHTML = choice.label; button.addEventListener('click', () => choose(choice.value, button)); choices.append(button); });
  window.setTimeout(speakRound, 180);
}
function choose(value, button) {
  if (answered) return; const round = rounds[index];
  if (value !== round.answer) { missed = true; button.classList.add('incorrect'); button.disabled = true; feedback.textContent = 'Good try. Look again.'; feedback.className = 'game-feedback feedback-try'; speak('Good try. Look again.'); return; }
  answered = true; if (!missed) score += 1; choices.querySelectorAll('button').forEach(item => { item.disabled = true; }); button.classList.add('correct');
  document.getElementById('focus-progress').style.width = `${((index + 1) / rounds.length) * 100}%`; document.getElementById('focus-score').textContent = `${score} ${score === 1 ? 'star' : 'stars'}`;
  feedback.textContent = `Yes! ${target.upper} is for ${target.word}.`; feedback.className = 'game-feedback feedback-correct'; next.hidden = false; speak(feedback.textContent); next.focus();
}
function speakRound() { if (!speak(rounds[index].speech)) { hear.disabled = true; hear.title = 'Audio is not available in this browser'; } }
function advance() { index += 1; if (index < rounds.length) render(); else finish(); }
function finish() {
  game.hidden = true; result.hidden = false;
  const previous = ALPHABET[(ALPHABET.indexOf(target) + 25) % 26].upper, following = ALPHABET[(ALPHABET.indexOf(target) + 1) % 26].upper;
  result.innerHTML = `<div class="result-celebration" aria-hidden="true">★</div><p class="kicker">Letter ${target.upper} complete</p><h1>Wonderful ${target.upper} work!</h1><p class="result-summary">You earned <strong>${score} of ${rounds.length}</strong> stars and practised <strong>${target.upper}${target.lower} — ${target.word}</strong> ${target.emoji}</p><div class="result-actions alphabet-result-links"><button id="focus-again" class="button button-primary" type="button">Play ${target.upper} again</button><a class="button button-secondary" href="letter-game.html?letter=${following}">Next: ${following}</a><a class="button button-secondary" href="letter-game.html?letter=${previous}">Previous: ${previous}</a><a class="button button-secondary" href="index.html">Choose a letter</a></div>`;
  document.getElementById('focus-again').addEventListener('click', start);
}
