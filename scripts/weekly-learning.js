import { WEEK, COURSES, REVIEW_VIDEOS, COLOURS } from './weekly-data.js?v=20261013-2';
import { shuffle } from './utils.js';
import { pictureIcon } from './weekly-pictures.js?v=20261013-2';

const courseId = document.body.dataset.course;
const course = COURSES[courseId];
const byId = id => document.getElementById(id);
const audioStatus = byId('audio-status');
let soundEnabled = true;
let speechGeneration = 0;

function stopSpeech() {
  speechGeneration += 1;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function speak(text) {
  stopSpeech();
  if (!soundEnabled) return;
  if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
    audioStatus.textContent = `Read together: “${text}”`;
    return;
  }
  document.querySelectorAll('video').forEach(video => video.pause());
  const generation = speechGeneration;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(item => item.lang === 'en-GB') || voices.find(item => item.lang.startsWith('en'));
  if (voice) utterance.voice = voice;
  utterance.onerror = () => {
    if (generation === speechGeneration) audioStatus.textContent = `Read together: “${text}”`;
  };
  audioStatus.textContent = `Listen: “${text}”`;
  window.speechSynthesis.speak(utterance);
}

// Highlight only the named part. The full figure gives children visual context.
function bodyPicture(part) {
  const focus = '#b7466c';
  const neutral = '#dde4df';
  const colour = name => part === 'body' || part === name ? focus : neutral;
  return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <g stroke="#173c3a" stroke-width="2.5" stroke-linejoin="round">
      <path d="M49 84 L46 123 Q47 128 53 127 L58 88 M63 88 L68 127 Q74 128 76 122 L71 83" fill="${colour('legs')}"/>
      <path d="M45 122 Q37 125 35 133 Q42 141 55 133 L55 124 Z M68 124 L68 133 Q81 141 87 133 Q85 125 75 123 Z" fill="${colour('feet')}"/>
      <path d="M43 49 Q35 47 30 61 L20 89 Q22 97 29 93 L43 65 M77 49 Q85 47 90 61 L100 89 Q98 97 91 93 L77 65" fill="${colour('arms')}"/>
      <path d="M20 87 Q12 86 12 95 Q12 104 20 105 Q29 104 29 95 L28 91 Z M100 87 Q108 86 108 95 Q108 104 100 105 Q91 104 91 95 L92 91 Z" fill="${colour('hands')}"/>
      <rect x="40" y="47" width="40" height="42" rx="10" fill="${colour('body')}"/>
      <path d="M54 40 L54 48 L66 48 L66 40" fill="${colour('head')}"/>
      <circle cx="60" cy="25" r="20" fill="${colour('head')}"/>
      <path d="M53 24 L53 25 M67 24 L67 25 M54 33 Q60 38 66 33" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

function picture(item) {
  if (item.colour) return `<span class="colour-block" style="background:${item.colour}" aria-hidden="true"></span>`;
  if (item.part) return bodyPicture(item.part);
  if (pictureIcon(item.word)) return pictureIcon(item.word);
  if (item.drawing === 'jam') return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect x="23" y="18" width="54" height="12" rx="5" fill="#f7cb55" stroke="#173c3a" stroke-width="3"/><rect x="25" y="30" width="50" height="57" rx="10" fill="#d74860" stroke="#173c3a" stroke-width="3"/><rect x="29" y="46" width="42" height="26" rx="5" fill="#fff6db"/><path d="M40 51 Q49 43 59 51 Q65 63 50 70 Q35 62 40 51" fill="#e94845"/><path d="M50 50 L46 43 L55 46" fill="none" stroke="#32966c" stroke-width="3"/></svg>`;
  return `<span aria-hidden="true">${item.emoji || ''}</span>`;
}

function wordMarkup(item, extra = '') {
  return `<button type="button" class="week-word" ${extra} aria-label="${item.word}"><span class="word-picture" aria-hidden="true">${picture(item)}</span><strong>${item.word}</strong><small>Listen and say</small></button>`;
}

function renderLearning() {
  byId('week-date').textContent = WEEK.label;
  byId('vocabulary-grid').innerHTML = course.vocabulary.map(item => wordMarkup(item, `data-say="${item.word}"`)).join('');
  byId('focus-words').innerHTML = course.focusWords.map(item => wordMarkup(item, `data-say="${item.word}"`)).join('');
  if (course.faceWords) {
    byId('face-words').innerHTML = course.faceWords.map(item => `<button type="button" data-say="${item.word}"><span aria-hidden="true">${picture(item)}</span>${item.word}</button>`).join('');
  }
  if (byId('hero-body')) byId('hero-body').innerHTML = bodyPicture('body');
  document.querySelectorAll('[data-say]').forEach(button => {
    button.addEventListener('click', () => speak(button.dataset.say));
  });
  renderGameMenu();
  renderVideos();
}

function attachVideoEvents(video) {
  video.addEventListener('play', () => {
    stopSpeech();
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
}

function renderVideos() {
  byId('review-video-grid').innerHTML = REVIEW_VIDEOS.map(video => `<article class="week-video-card"><h3>${video.letter} sound song</h3><video controls playsinline preload="none" poster="${video.poster}" aria-label="${video.letter} phonics sound song"><source src="${video.src}" type="video/mp4">Your browser does not support this video.</video></article>`).join('');
  if (course.video.ready) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.src = course.video.src;
    video.setAttribute('aria-label', `${course.letter} phonics sound song`);
    byId('focus-video-player').append(video);
    byId('video-pending').hidden = true;
    video.addEventListener('error', () => {
      video.hidden = true;
      byId('video-pending').hidden = false;
    });
  }
  document.querySelectorAll('video').forEach(attachVideoEvents);
}

const completedGames = new Set();
let currentGame = null;
let questions = [];
let round = 0;
let answered = false;
const gameMenu = byId('week-game-menu');
const stage = byId('week-game-stage');
const options = byId('game-options');
const next = byId('next-question');

function renderGameMenu() {
  const icons = { vocabulary: 'search', phonics: courseId === 'ph1' ? 'basket' : 'juice', patterns: 'palette', sightwords: 'blocks' };
  gameMenu.innerHTML = course.games.map(game => `<button type="button" class="week-game-card" data-week-game="${game.id}"><span class="game-icon" aria-hidden="true">${pictureIcon(icons[game.id])}</span><strong>${game.title}</strong><p>${game.description}</p><span class="game-link">${completedGames.has(game.id) ? '✓ Play again' : 'Play the game →'}</span></button>`).join('');
  byId('games-completed').textContent = completedGames.size ? `${completedGames.size} of ${course.games.length} games explored. Play any one again.` : 'Take your time. Listen again whenever you need.';
}

function makeQuestions(id) {
  if (id === 'vocabulary') {
    return shuffle(Array.from({ length: currentGame.rounds }, (_, index) => course.vocabulary[index % course.vocabulary.length])).map(item => ({
      prompt: `Find ${item.word}.`, speech: `Find ${item.word}.`,
      options: shuffle([item, ...shuffle(course.vocabulary.filter(other => other.word !== item.word)).slice(0, 3)]),
      answer: item.word, success: courseId === 'ph1' ? `It’s ${item.word}!` : `${['body', 'head'].includes(item.word) ? 'This is' : 'These are'} my ${item.word}.`,
      cue: ''
    }));
  }
  if (id === 'phonics') {
    return shuffle(course.focusWords).map(item => ({
      prompt: `Find a ${course.letter} word.`, speech: `Find a word that starts like ${course.model}.`,
      options: shuffle([item, ...shuffle(course.distractors).slice(0, 3)]),
      answer: item.word, success: `${item.word} starts like ${course.model}!`,
      cue: `<span class="letter-model">${course.letter}</span><span class="word-picture">${picture(course.focusWords[0])}</span>`
    }));
  }
  if (id === 'patterns') {
    return Array.from({ length: currentGame.rounds }, (_, index) => {
      const pair = shuffle(COLOURS).slice(0, 2);
      const length = index % 2 === 0 ? 3 : 4;
      const pattern = Array.from({ length }, (_, position) => pair[position % 2]);
      const answer = pair[length % 2].word;
      return {
        prompt: 'Which colour comes next?', speech: `${pattern.map(item => item.word).join(', ')}. Which colour comes next?`,
        options: shuffle(COLOURS), answer, success: `Next is ${answer}!`,
        cue: pattern.map(item => `<span class="pattern-token" style="background:${item.colour}" role="img" aria-label="${item.word}"></span>`).join('') + '<span class="pattern-token blank" aria-label="Missing colour">?</span>'
      };
    });
  }
  return shuffle(course.sentences).map(sentence => ({
    prompt: 'Which little word fits?', speech: `${sentence.spoken} Choose the missing word.`,
    options: shuffle(course.sightWords.map(word => ({ word }))),
    answer: sentence.answer, success: sentence.spoken,
    cue: `<span class="word-picture">${bodyPicture(sentence.part)}</span><span class="sentence-cue">${sentence.before} <span class="sentence-blank">?</span> ${sentence.after}</span>`
  }));
}

function startGame(id) {
  currentGame = course.games.find(game => game.id === id);
  if (!currentGame) return;
  questions = makeQuestions(id);
  round = 0;
  stage.hidden = false;
  gameMenu.hidden = true;
  byId('game-finish').hidden = true;
  byId('game-round').hidden = false;
  byId('restart-game').hidden = false;
  byId('hear-question').hidden = false;
  byId('game-title').textContent = currentGame.title;
  byId('game-title').focus({ preventScroll: true });
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  next.hidden = true;
  byId('game-count').textContent = `Round ${round + 1} of ${questions.length}`;
  byId('game-progress-bar').style.width = `${(round / questions.length) * 100}%`;
  const question = questions[round];
  byId('game-question').textContent = question.prompt;
  byId('game-cue').innerHTML = question.cue;
  options.classList.toggle('sight-options', currentGame.id === 'sightwords');
  options.innerHTML = question.options.map(item => {
    if (!item.emoji && !item.colour && !item.part && !item.drawing) return `<button class="week-word" type="button" data-answer="${item.word}"><strong>${item.word}</strong></button>`;
    return wordMarkup(item, `data-answer="${item.word}"`);
  }).join('');
  byId('game-feedback').textContent = 'Look at every choice, then choose one.';
  speak(question.speech);
}

function chooseAnswer(button) {
  if (answered || !currentGame) return;
  const question = questions[round];
  options.querySelectorAll('.try-again').forEach(item => item.classList.remove('try-again'));
  if (button.dataset.answer !== question.answer) {
    button.classList.add('try-again');
    byId('game-feedback').textContent = 'Try again. Listen once more and look at the pictures or words.';
    speak(`Try again. ${question.speech}`);
    return;
  }
  answered = true;
  button.classList.add('is-correct');
  options.querySelectorAll('button').forEach(item => { item.disabled = true; });
  byId('game-feedback').textContent = `✓ ${question.success}`;
  byId('game-progress-bar').style.width = `${((round + 1) / questions.length) * 100}%`;
  next.textContent = round + 1 === questions.length ? 'Finish the game ★' : 'Next round →';
  next.hidden = false;
  next.focus({ preventScroll: true });
  speak(question.success);
}

function finishGame() {
  completedGames.add(currentGame.id);
  byId('game-round').hidden = true;
  byId('game-finish').hidden = false;
  byId('restart-game').hidden = true;
  byId('hear-question').hidden = true;
  byId('game-count').textContent = `${questions.length} rounds explored`;
  byId('finish-copy').textContent = `You finished ${currentGame.title}. Say your favourite word, then try another game.`;
  byId('play-again').focus({ preventScroll: true });
  speak('You finished the game!');
  renderGameMenu();
}

function returnToMenu() {
  stopSpeech();
  stage.hidden = true;
  gameMenu.hidden = false;
  const previous = currentGame?.id;
  currentGame = null;
  const button = gameMenu.querySelector(`[data-week-game="${previous}"]`);
  if (button) button.focus({ preventScroll: true });
}

gameMenu.addEventListener('click', event => {
  const button = event.target.closest('[data-week-game]');
  if (button) startGame(button.dataset.weekGame);
});
options.addEventListener('click', event => {
  const button = event.target.closest('[data-answer]');
  if (button) chooseAnswer(button);
});
next.addEventListener('click', () => {
  if (!answered) return;
  round += 1;
  if (round === questions.length) finishGame();
  else { renderQuestion(); byId('game-question').focus({ preventScroll: true }); }
});
byId('hear-question').addEventListener('click', () => speak(questions[round].speech));
byId('restart-game').addEventListener('click', () => startGame(currentGame.id));
byId('play-again').addEventListener('click', () => startGame(currentGame.id));
byId('back-to-games').addEventListener('click', returnToMenu);
byId('try-another-game').addEventListener('click', returnToMenu);
byId('sound-toggle').addEventListener('click', event => {
  soundEnabled = !soundEnabled;
  stopSpeech();
  event.currentTarget.textContent = soundEnabled ? 'Sound on' : 'Sound off';
  event.currentTarget.setAttribute('aria-pressed', String(soundEnabled));
  audioStatus.textContent = soundEnabled ? 'Listen together, or read each prompt aloud.' : 'Sound is off. Read the prompts together.';
});

if (course.movements) {
  let movementRound = 0;
  const showMovement = () => {
    const movement = course.movements[movementRound];
    byId('movement-picture').innerHTML = bodyPicture(movement.part);
    byId('movement-text').textContent = movement.text;
    byId('movement-count').textContent = `Action ${movementRound + 1} of ${course.movements.length}`;
    byId('next-movement').textContent = movementRound + 1 === course.movements.length ? 'Start again →' : 'Next action →';
  };
  byId('hear-movement').addEventListener('click', () => speak(course.movements[movementRound].text));
  byId('next-movement').addEventListener('click', () => {
    movementRound = (movementRound + 1) % course.movements.length;
    showMovement();
    speak(course.movements[movementRound].text);
  });
  showMovement();
}

window.addEventListener('pagehide', stopSpeech);
renderLearning();
