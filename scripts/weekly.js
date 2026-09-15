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

const phonicsSets = {
  a: {
    pair: 'Aa',
    sound: '/a/',
    kicker: 'Short a sound',
    title: 'Aa Apple Orchard',
    action: 'Open wide for /a/.',
    finishTitle: 'Amazing Aa!',
    words: [
      { word: 'apple', picture: '🍎', letter: 'a' },
      { word: 'axe', picture: '🪓', letter: 'a' },
      { word: 'ant', picture: '🐜', letter: 'a' },
      { word: 'alligator', picture: '🐊', letter: 'a' }
    ]
  },
  b: {
    pair: 'Bb',
    sound: '/b/',
    kicker: 'Bouncy b sound',
    title: 'Bb Bear’s Picnic',
    action: 'Bring your lips together for /b/.',
    finishTitle: 'Brilliant Bb!',
    words: [
      { word: 'bear', picture: '🐻', letter: 'b' },
      { word: 'bed', picture: '🛏️', letter: 'b' },
      { word: 'bird', picture: '🐦', letter: 'b' },
      { word: 'banana', picture: '🍌', letter: 'b' }
    ]
  }
};

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
const letterHunt = document.getElementById('letter-hunt');
const huntKicker = document.getElementById('hunt-kicker');
const huntTitle = document.getElementById('hunt-title');
const huntLetterBadge = document.getElementById('hunt-letter-badge');
const huntAction = document.getElementById('hunt-action');
const huntInstruction = document.getElementById('hunt-instruction');
const huntProgressLabel = document.getElementById('hunt-progress-label');
const huntProgressFill = document.getElementById('hunt-progress-fill');
const huntCollectionLabel = document.getElementById('hunt-collection-label');
const huntCollection = document.getElementById('hunt-collection');
const huntOptions = document.getElementById('hunt-options');
const huntFeedback = document.getElementById('hunt-feedback');
const huntFinish = document.getElementById('hunt-finish');
const huntFinishTitle = document.getElementById('hunt-finish-title');
const huntFinishCopy = document.getElementById('hunt-finish-copy');
const switchLetterHuntButton = document.getElementById('switch-letter-hunt');

let rounds = [];
let roundIndex = 0;
let selected = false;
let locked = false;
let activeAudio = null;
let audioGeneration = 0;
let dragState = null;
let suppressObjectClick = false;
let activePhonicsLetter = 'a';
let foundPhonicsWords = new Set();

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

const audioRoot = '../assets/audio/weekly';
const audioCache = new Map();

function audioFor(source) {
  if (!audioCache.has(source)) {
    const audio = new Audio(source);
    audio.preload = 'auto';
    audioCache.set(source, audio);
  }
  return audioCache.get(source);
}

function stopAudio() {
  audioGeneration += 1;
  if (!activeAudio) return;
  activeAudio.onended = null;
  activeAudio.onerror = null;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

function showAudioFallback(text, statusTarget) {
  if (statusTarget) statusTarget.textContent = `Audio unavailable. Say together: “${text}”`;
}

function playAudio(source, text, statusTarget = speechStatus) {
  stopAudio();
  if (statusTarget) statusTarget.textContent = `Listen: “${text}”`;
  const audio = audioFor(source);
  activeAudio = audio;
  audio.currentTime = 0;
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = null;
  };
  audio.onerror = () => showAudioFallback(text, statusTarget);
  const playback = audio.play();
  if (playback?.catch) playback.catch(() => showAudioFallback(text, statusTarget));
}

function playAudioSequence(sources, text, statusTarget = speechStatus) {
  stopAudio();
  if (statusTarget) statusTarget.textContent = `Listen: “${text}”`;
  const generation = audioGeneration;
  let index = 0;

  const playNext = () => {
    if (generation !== audioGeneration) return;
    if (index >= sources.length) {
      activeAudio = null;
      return;
    }

    const audio = audioFor(sources[index]);
    index += 1;
    activeAudio = audio;
    audio.currentTime = 0;
    audio.onended = playNext;
    audio.onerror = playNext;
    const playback = audio.play();
    if (playback?.catch) playback.catch(() => showAudioFallback(text, statusTarget));
  };

  playNext();
}

function wordAudioPath(word) {
  return `${audioRoot}/words/${word}.m4a`;
}

function instructionAudioPath(round) {
  return `${audioRoot}/instructions/give-${round.object.word}-to-${round.character.name.toLowerCase()}.m4a`;
}

function playWord(word, statusTarget = speechStatus) {
  playAudio(wordAudioPath(word), word, statusTarget);
}

function playInstruction(round = currentRound(), statusTarget = null) {
  if (!round) return;
  playAudio(instructionAudioPath(round), instructionText(round), statusTarget);
}

function preloadAudioFiles() {
  vocabulary.forEach(({ word }) => audioFor(wordAudioPath(word)));
  vocabulary.forEach(object => {
    characters.forEach(character => audioFor(instructionAudioPath({ object, character })));
  });
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

function instructionText(round = currentRound()) {
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
  if (announce) playInstruction(round);
}

function selectObject(announce = true) {
  if (locked) return;
  selected = true;
  objectCard.classList.add('selected');
  objectCard.setAttribute('aria-pressed', 'true');
  feedback.textContent = `${currentRound().object.word[0].toUpperCase()}${currentRound().object.word.slice(1)} is ready. Choose a friend.`;
  if (announce) playWord(currentRound().object.word, null);
}

function tryGiving(characterName, card) {
  if (locked) return;
  if (!selected) {
    feedback.textContent = 'Choose or drag the object first.';
    playWord(currentRound().object.word, null);
    return;
  }
  const round = currentRound();
  if (characterName !== round.character.name) {
    card.classList.remove('gentle-try');
    void card.offsetWidth;
    card.classList.add('gentle-try');
    feedback.textContent = `Good try. ${round.character.name} is waiting for the ${round.object.word}.`;
    playInstruction(round);
    return;
  }
  locked = true;
  card.classList.add('received');
  card.insertAdjacentHTML('beforeend', `<span class="gift-badge" aria-hidden="true">${round.object.picture}</span>`);
  objectCard.classList.add('delivered');
  feedback.textContent = `Well done! You gave the ${round.object.word} to ${round.character.name}.`;
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
    playWord(word);
  });
});

document.getElementById('hear-all-words').addEventListener('click', () => {
  playAudioSequence(vocabulary.map(({ word }) => wordAudioPath(word)), 'Bag. Pencil. Chair. Book.');
});
document.getElementById('repeat-give-instruction').addEventListener('click', () => playInstruction());
document.getElementById('shuffle-characters').addEventListener('click', () => {
  if (locked) return;
  charactersGrid.innerHTML = shuffle(characters).map(characterCard).join('');
  attachCharacterEvents();
  feedback.textContent = 'The friends have moved. Listen again!';
  playInstruction();
});
document.getElementById('hear-real-prompt').addEventListener('click', () => playInstruction());

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


function allPhonicsWords() {
  return Object.values(phonicsSets).flatMap(set => set.words);
}

function phonicsOptionCard(item, targetLetter) {
  const isTarget = item.letter === targetLetter;
  const firstLetter = item.word.charAt(0).toUpperCase();
  const restOfWord = item.word.slice(1);
  return `<button class="hunt-option" type="button" data-hunt-word="${item.word}" data-hunt-letter="${item.letter}" aria-label="${item.word}">
    <span aria-hidden="true">${item.picture}</span>
    <strong><mark>${firstLetter}</mark>${restOfWord}</strong>
    <small>${isTarget ? 'Say me, then tap' : 'Check my first sound'}</small>
  </button>`;
}

function renderHuntCollection() {
  const set = phonicsSets[activePhonicsLetter];
  const found = set.words.filter(item => foundPhonicsWords.has(item.word));
  const filled = found.map(item => `<span class="collection-word"><b aria-hidden="true">${item.picture}</b><strong>${item.word}</strong></span>`);
  const empty = Array.from({ length: set.words.length - found.length }, () => '<span class="collection-space" aria-hidden="true">?</span>');
  huntCollection.innerHTML = [...filled, ...empty].join('');
  huntCollection.setAttribute('aria-label', `${found.length} of 4 ${set.pair} words found`);
  huntProgressLabel.textContent = `${found.length} of 4 found`;
  huntProgressFill.style.width = `${(found.length / set.words.length) * 100}%`;
}

function preferredScrollBehaviour() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth';
}

function startLetterHunt(letter, shouldScroll = true) {
  const set = phonicsSets[letter];
  if (!set) return;
  activePhonicsLetter = letter;
  foundPhonicsWords = new Set();
  letterHunt.dataset.letter = letter;
  huntKicker.textContent = set.kicker;
  huntTitle.textContent = set.title;
  huntLetterBadge.textContent = set.pair;
  huntAction.textContent = set.action;
  huntInstruction.textContent = `Say each picture. Tap the four words that begin with ${set.pair}.`;
  huntCollectionLabel.textContent = `Your ${set.pair} collection`;
  huntOptions.setAttribute('aria-label', `Choose words beginning with ${set.pair}`);
  huntOptions.innerHTML = shuffle(allPhonicsWords()).map(item => phonicsOptionCard(item, letter)).join('');
  huntFeedback.textContent = 'Say a picture name and listen to its first sound.';
  huntFeedback.className = 'hunt-feedback';
  huntFinish.hidden = true;
  switchLetterHuntButton.innerHTML = `Try ${letter === 'a' ? 'Bb' : 'Aa'} next <span aria-hidden="true">→</span>`;
  renderHuntCollection();
  letterHunt.hidden = false;
  if (shouldScroll) letterHunt.scrollIntoView({ behavior: preferredScrollBehaviour(), block: 'start' });
}

function choosePhonicsWord(button) {
  const set = phonicsSets[activePhonicsLetter];
  const word = button.dataset.huntWord;
  const wordLetter = button.dataset.huntLetter;
  if (wordLetter !== activePhonicsLetter) {
    button.classList.remove('try-again');
    void button.offsetWidth;
    button.classList.add('try-again');
    huntFeedback.className = 'hunt-feedback try-feedback';
    huntFeedback.textContent = `That is ${word}. It begins with ${phonicsSets[wordLetter].pair}. Try another picture.`;
    return;
  }
  if (foundPhonicsWords.has(word)) return;

  foundPhonicsWords.add(word);
  button.classList.add('found');
  button.disabled = true;
  huntFeedback.className = 'hunt-feedback success-feedback';
  huntFeedback.textContent = `Yes — ${word}! ${set.sound} ${set.sound} ${word}.`;
  renderHuntCollection();

  if (foundPhonicsWords.size === set.words.length) {
    huntOptions.querySelectorAll('button').forEach(option => { option.disabled = true; });
    huntInstruction.textContent = `You found all four ${set.pair} words!`;
    huntFinishTitle.textContent = set.finishTitle;
    huntFinishCopy.textContent = `You said and sorted ${set.words.map(item => item.word).join(', ')}.`;
    huntFinish.hidden = false;
    huntFinish.scrollIntoView({ behavior: preferredScrollBehaviour(), block: 'nearest' });
  }
}

document.querySelectorAll('[data-start-letter-hunt]').forEach(button => {
  button.addEventListener('click', () => startLetterHunt(button.dataset.startLetterHunt));
});
huntOptions.addEventListener('click', event => {
  const button = event.target.closest('[data-hunt-word]');
  if (button && !button.disabled) choosePhonicsWord(button);
});
document.getElementById('replay-letter-hunt').addEventListener('click', () => startLetterHunt(activePhonicsLetter, false));
switchLetterHuntButton.addEventListener('click', () => startLetterHunt(activePhonicsLetter === 'a' ? 'b' : 'a', false));
document.getElementById('close-letter-hunt').addEventListener('click', () => {
  letterHunt.hidden = true;
  document.getElementById('weekly-phonics-title').scrollIntoView({ behavior: preferredScrollBehaviour(), block: 'start' });
});

preloadAudioFiles();
startGame();
