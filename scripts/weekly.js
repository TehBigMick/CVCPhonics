const classroomVocabulary = [
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

const myFamilyPages = [
  { image: 'page-01.webp', audio: 'my-family.m4a', label: 'Cover', words: ['My', 'Family'], narration: 'My Family.', alt: 'My Family book cover showing a family together' },
  { image: 'page-02.webp', audio: 'my-family.m4a', label: 'Title page', words: ['My', 'Family'], narration: 'My Family.', alt: 'My Family title page showing a smiling child' },
  { image: 'page-03.webp', audio: 'my-mother.m4a', label: 'My mother', words: ['My', 'mother.'], narration: 'My mother.', alt: 'A mother holding flowers' },
  { image: 'page-04.webp', audio: 'my-father.m4a', label: 'My father', words: ['My', 'father.'], narration: 'My father.', alt: 'A father reading a newspaper' },
  { image: 'page-05.webp', audio: 'my-brother.m4a', label: 'My brother', words: ['My', 'brother.'], narration: 'My brother.', alt: 'A brother holding a yo-yo' },
  { image: 'page-06.webp', audio: 'my-sister.m4a', label: 'My sister', words: ['My', 'sister.'], narration: 'My sister.', alt: 'A sister smiling' },
  { image: 'page-07.webp', audio: 'my-grandfather.m4a', label: 'My grandfather', words: ['My', 'grandfather.'], narration: 'My grandfather.', alt: 'A grandfather holding a hat' },
  { image: 'page-08.webp', audio: 'my-grandmother.m4a', label: 'My grandmother', words: ['My', 'grandmother.'], narration: 'My grandmother.', alt: 'A grandmother gardening' },
  { image: 'page-09.webp', audio: 'me.m4a', label: 'Me', words: ['Me.'], narration: 'Me.', alt: 'A smiling child' },
  { image: 'page-10.webp', audio: 'my-family-and-me.m4a', label: 'My family and me', words: ['My', 'family', 'and', 'me.'], narration: 'My family and me.', alt: 'The whole family standing together' }
];

const abWordChoices = {
  a: { word: 'apple', picture: '🍎', label: 'Aa /a/' },
  b: { word: 'book', picture: '📘', label: 'Bb /b/' }
};

const audioRoot = '../assets/audio/weekly';
const audioCache = new Map();
let activeAudio = null;
let audioGeneration = 0;

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function audioFor(source) {
  if (!audioCache.has(source)) {
    const audio = new Audio(source);
    audio.preload = 'metadata';
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
  if (statusTarget) statusTarget.textContent = `Recording not added yet. Say together: “${text}”`;
}

function playAudio(source, text, statusTarget = document.getElementById('speech-status')) {
  stopAudio();
  if (statusTarget) statusTarget.textContent = `Listen: “${text}”`;
  const audio = audioFor(source);
  activeAudio = audio;
  audio.currentTime = 0;
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = null;
  };
  const handlePlaybackError = () => {
    if (activeAudio === audio) activeAudio = null;
    showAudioFallback(text, statusTarget);
  };
  audio.onerror = handlePlaybackError;
  const playback = audio.play();
  if (playback?.catch) playback.catch(handlePlaybackError);
}

function playAudioSequence(words, statusTarget = document.getElementById('speech-status')) {
  stopAudio();
  if (statusTarget) statusTarget.textContent = `Listen: “${words.join('. ')}.”`;
  const generation = audioGeneration;
  let index = 0;
  let played = 0;

  const playNext = () => {
    if (generation !== audioGeneration) return;
    if (index >= words.length) {
      activeAudio = null;
      if (!played) showAudioFallback(words.join('. '), statusTarget);
      return;
    }
    const word = words[index];
    index += 1;
    const audio = audioFor(wordAudioPath(word));
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      playNext();
    };
    activeAudio = audio;
    audio.currentTime = 0;
    audio.onended = () => {
      played += 1;
      advance();
    };
    audio.onerror = advance;
    const playback = audio.play();
    if (playback?.catch) playback.catch(advance);
  };

  playNext();
}

function wordAudioPath(word) {
  return `${audioRoot}/words/${word}.m4a`;
}

function instructionAudioPath(round) {
  return `${audioRoot}/instructions/give-${round.object.word}-to-${round.character.name.toLowerCase()}.m4a`;
}

function bookPageAudioPath(filename) {
  return `${audioRoot}/book/pages/${filename}`;
}

function playWord(word, statusTarget) {
  playAudio(wordAudioPath(word), word, statusTarget);
}

// Classroom-object listening and movement game
const game = document.getElementById('give-game');
const instruction = document.getElementById('give-instruction');
const objectCard = document.getElementById('game-object');
const objectPicture = document.getElementById('game-object-picture');
const objectWord = document.getElementById('game-object-word');
const charactersGrid = document.getElementById('characters-grid');
const giveFeedback = document.getElementById('give-feedback');
const nextGiveButton = document.getElementById('next-give-round');
const roundLabel = document.getElementById('round-label');
const roundStars = document.getElementById('round-stars');

let giveRounds = [];
let giveRoundIndex = 0;
let objectSelected = false;
let giveLocked = false;
let dragState = null;
let suppressObjectClick = false;

function createGiveRounds() {
  const rounds = [];
  for (let cycle = 0; cycle < 2; cycle += 1) {
    const objects = shuffle(classroomVocabulary);
    const friends = shuffle(characters);
    objects.forEach((object, index) => rounds.push({ object, character: friends[index] }));
  }
  return rounds;
}

function currentGiveRound() {
  return giveRounds[giveRoundIndex];
}

function giveInstructionText(round = currentGiveRound()) {
  return round ? `Give the ${round.object.word} to ${round.character.name}.` : '';
}

function playGiveInstruction(round = currentGiveRound()) {
  if (!round) return;
  playAudio(instructionAudioPath(round), giveInstructionText(round), giveFeedback);
}

function renderGiveStars(completed = giveRoundIndex) {
  roundStars.innerHTML = Array.from({ length: giveRounds.length }, (_, index) => `<span class="${index < completed ? 'complete' : ''}" aria-hidden="true">★</span>`).join('');
  roundStars.setAttribute('aria-label', `${completed} completed ${completed === 1 ? 'round' : 'rounds'}`);
}

function characterCard(character) {
  return `<button class="character-card" type="button" data-character="${character.name}">
    <span class="character-portrait" aria-hidden="true">${character.picture}</span>
    <strong>${character.name}</strong><small>${character.animal}</small>
  </button>`;
}

function attachCharacterEvents() {
  charactersGrid.querySelectorAll('[data-character]').forEach(card => {
    card.addEventListener('click', () => {
      if (!giveLocked) tryGiving(card.dataset.character, card);
    });
    card.addEventListener('dragover', event => {
      if (giveLocked) return;
      event.preventDefault();
      card.classList.add('drop-ready');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drop-ready'));
    card.addEventListener('drop', event => {
      event.preventDefault();
      card.classList.remove('drop-ready');
      objectSelected = true;
      objectCard.classList.add('selected');
      tryGiving(card.dataset.character, card);
    });
  });
}

function renderGiveRound(playPrompt = false) {
  const round = currentGiveRound();
  if (!round) return showGiveFinish();
  objectSelected = false;
  giveLocked = false;
  game.classList.remove('game-complete');
  roundLabel.textContent = `Round ${giveRoundIndex + 1} of ${giveRounds.length}`;
  instruction.textContent = giveInstructionText(round);
  objectPicture.textContent = round.object.picture;
  objectWord.textContent = round.object.word;
  objectCard.classList.remove('selected', 'delivered');
  objectCard.setAttribute('aria-pressed', 'false');
  objectCard.hidden = false;
  charactersGrid.innerHTML = shuffle(characters).map(characterCard).join('');
  giveFeedback.textContent = 'Who needs the object?';
  nextGiveButton.hidden = true;
  nextGiveButton.innerHTML = 'Next round <span aria-hidden="true">→</span>';
  renderGiveStars();
  attachCharacterEvents();
  if (playPrompt) playGiveInstruction(round);
}

function selectObject(playRecording = true) {
  if (giveLocked) return;
  objectSelected = true;
  objectCard.classList.add('selected');
  objectCard.setAttribute('aria-pressed', 'true');
  const word = currentGiveRound().object.word;
  giveFeedback.textContent = `${word[0].toUpperCase()}${word.slice(1)} is ready. Choose a friend.`;
  if (playRecording) playWord(word, giveFeedback);
}

function tryGiving(characterName, card) {
  if (giveLocked) return;
  if (!objectSelected) {
    giveFeedback.textContent = 'Choose or drag the object first.';
    playWord(currentGiveRound().object.word, giveFeedback);
    return;
  }
  const round = currentGiveRound();
  if (characterName !== round.character.name) {
    card.classList.remove('gentle-try');
    void card.offsetWidth;
    card.classList.add('gentle-try');
    giveFeedback.textContent = `Good try. ${round.character.name} is waiting for the ${round.object.word}.`;
    playGiveInstruction(round);
    return;
  }
  giveLocked = true;
  card.classList.add('received');
  card.insertAdjacentHTML('beforeend', `<span class="gift-badge" aria-hidden="true">${round.object.picture}</span>`);
  objectCard.classList.add('delivered');
  giveFeedback.textContent = `Well done! You gave the ${round.object.word} to ${round.character.name}.`;
  renderGiveStars(giveRoundIndex + 1);
  nextGiveButton.hidden = false;
  if (giveRoundIndex === giveRounds.length - 1) nextGiveButton.innerHTML = 'Finish the game <span aria-hidden="true">★</span>';
}

function showGiveFinish() {
  giveRoundIndex = giveRounds.length;
  giveLocked = true;
  game.classList.add('game-complete');
  roundLabel.textContent = `All ${giveRounds.length} rounds complete`;
  instruction.textContent = 'Brilliant sharing!';
  giveFeedback.textContent = 'You listened, found every object and helped every friend.';
  nextGiveButton.hidden = false;
  nextGiveButton.innerHTML = 'Play again <span aria-hidden="true">↻</span>';
  renderGiveStars();
}

function startGiveGame() {
  giveRounds = createGiveRounds();
  giveRoundIndex = 0;
  renderGiveRound(false);
}

function cleanDrag() {
  if (dragState?.ghost) dragState.ghost.remove();
  charactersGrid.querySelectorAll('[data-character]').forEach(card => card.classList.remove('drop-ready'));
  dragState = null;
}

document.getElementById('repeat-give-instruction').addEventListener('click', () => playGiveInstruction());
document.getElementById('shuffle-characters').addEventListener('click', () => {
  if (giveLocked) return;
  charactersGrid.innerHTML = shuffle(characters).map(characterCard).join('');
  attachCharacterEvents();
  giveFeedback.textContent = 'The friends have moved. Listen again!';
  playGiveInstruction();
});

objectCard.addEventListener('click', () => {
  if (!suppressObjectClick) selectObject();
});
objectCard.addEventListener('dragstart', event => {
  if (giveLocked) return event.preventDefault();
  selectObject(false);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', currentGiveRound().object.word);
});
objectCard.addEventListener('pointerdown', event => {
  if (giveLocked || event.pointerType === 'mouse') return;
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
  charactersGrid.querySelectorAll('[data-character]').forEach(card => {
    const rect = card.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    card.classList.toggle('drop-ready', inside);
  });
});
objectCard.addEventListener('pointerup', event => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  if (dragState.moved) {
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-character]');
    if (target) tryGiving(target.dataset.character, target);
    else giveFeedback.textContent = 'Move the object onto a friend, or tap a friend.';
    suppressObjectClick = true;
    window.setTimeout(() => { suppressObjectClick = false; }, 0);
  }
  cleanDrag();
});
objectCard.addEventListener('pointercancel', cleanDrag);
nextGiveButton.addEventListener('click', () => {
  if (giveRoundIndex >= giveRounds.length) return startGiveGame();
  giveRoundIndex += 1;
  renderGiveRound(true);
});

// Vocabulary and word-audio controls
document.querySelectorAll('[data-vocabulary]').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.add('is-speaking');
    window.setTimeout(() => card.classList.remove('is-speaking'), 280);
    playWord(card.dataset.vocabulary);
  });
});

document.querySelectorAll('[data-hear-words]').forEach(button => {
  button.addEventListener('click', () => playAudioSequence(button.dataset.hearWords.split(',')));
});

document.querySelectorAll('[data-play-word]').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('is-speaking');
    window.setTimeout(() => button.classList.remove('is-speaking'), 280);
    playWord(button.dataset.playWord);
  });
});

// Keep the two phonics songs and recorded word audio from playing over one another.
const phonicsVideos = [...document.querySelectorAll('.phonics-video-card video')];
phonicsVideos.forEach(video => {
  video.addEventListener('play', () => {
    stopAudio();
    phonicsVideos.forEach(otherVideo => {
      if (otherVideo !== video) otherVideo.pause();
    });
  });
});

// Phase 1 classroom-word listening game
const vocabularyListenGame = document.getElementById('vocabulary-listen-game');
const vocabularyListenProgress = document.getElementById('vocabulary-listen-progress');
const vocabularyListenPrompt = document.getElementById('vocabulary-listen-prompt');
const vocabularyListenOptions = document.getElementById('vocabulary-listen-options');
const vocabularyListenStatus = document.getElementById('vocabulary-listen-status');
const vocabularyListenFeedback = document.getElementById('vocabulary-listen-feedback');
const playVocabularyWordButton = document.getElementById('play-vocabulary-word');
const nextVocabularyWordButton = document.getElementById('next-vocabulary-word');
let vocabularyListenRounds = [];
let vocabularyListenRoundIndex = 0;
let vocabularyListenStarted = false;
let vocabularyListenLocked = false;

function currentVocabularyListenWord() {
  return vocabularyListenRounds[vocabularyListenRoundIndex];
}

function vocabularyListenCard(item) {
  return `<button type="button" data-vocabulary-choice="${item.word}">
    <span aria-hidden="true">${item.picture}</span><strong>${item.word}</strong><small>Tap to choose</small>
  </button>`;
}

function renderVocabularyListenRound(playPrompt = false) {
  const target = currentVocabularyListenWord();
  vocabularyListenLocked = false;
  vocabularyListenProgress.textContent = `Word ${vocabularyListenRoundIndex + 1} of ${vocabularyListenRounds.length}`;
  vocabularyListenPrompt.textContent = 'Which classroom word did you hear?';
  vocabularyListenOptions.innerHTML = shuffle(classroomVocabulary).map(vocabularyListenCard).join('');
  vocabularyListenFeedback.textContent = 'Look at all four pictures before you choose.';
  vocabularyListenFeedback.className = 'vocabulary-listen-feedback';
  playVocabularyWordButton.innerHTML = '<span aria-hidden="true">🔊</span> Hear the word again';
  nextVocabularyWordButton.hidden = true;
  if (playPrompt) playWord(target.word, vocabularyListenStatus);
}

function startVocabularyListenGame() {
  vocabularyListenRounds = shuffle(classroomVocabulary);
  vocabularyListenRoundIndex = 0;
  vocabularyListenStarted = true;
  vocabularyListenGame.classList.remove('complete');
  renderVocabularyListenRound(true);
}

function finishVocabularyListenGame() {
  vocabularyListenLocked = true;
  vocabularyListenGame.classList.add('complete');
  vocabularyListenProgress.textContent = 'All 4 words complete';
  vocabularyListenPrompt.textContent = 'Brilliant classroom listening!';
  vocabularyListenOptions.innerHTML = '<div class="vocabulary-listen-celebration" aria-hidden="true">🎒 ✏️ 🪑 📘</div>';
  vocabularyListenStatus.textContent = 'You matched every classroom word.';
  vocabularyListenFeedback.textContent = 'Say them together: bag, pencil, chair, book.';
  vocabularyListenFeedback.className = 'vocabulary-listen-feedback success';
  playVocabularyWordButton.innerHTML = '<span aria-hidden="true">↻</span> Play again';
  nextVocabularyWordButton.hidden = true;
}

playVocabularyWordButton.addEventListener('click', () => {
  if (!vocabularyListenStarted || vocabularyListenGame.classList.contains('complete')) {
    startVocabularyListenGame();
    return;
  }
  playWord(currentVocabularyListenWord().word, vocabularyListenStatus);
});

vocabularyListenOptions.addEventListener('click', event => {
  const button = event.target.closest('[data-vocabulary-choice]');
  if (!button || !vocabularyListenStarted || vocabularyListenLocked) return;
  const chosenWord = button.dataset.vocabularyChoice;
  const targetWord = currentVocabularyListenWord().word;
  playWord(chosenWord, vocabularyListenStatus);
  if (chosenWord !== targetWord) {
    button.classList.remove('try-again');
    void button.offsetWidth;
    button.classList.add('try-again');
    vocabularyListenFeedback.textContent = `That is ${chosenWord}. Listen again and find ${targetWord}.`;
    vocabularyListenFeedback.className = 'vocabulary-listen-feedback retry';
    return;
  }
  vocabularyListenLocked = true;
  button.classList.add('correct');
  vocabularyListenOptions.querySelectorAll('button').forEach(option => { option.disabled = true; });
  vocabularyListenFeedback.textContent = `Yes — ${targetWord}! Say it together.`;
  vocabularyListenFeedback.className = 'vocabulary-listen-feedback success';
  nextVocabularyWordButton.hidden = false;
  nextVocabularyWordButton.innerHTML = vocabularyListenRoundIndex === vocabularyListenRounds.length - 1
    ? 'Finish the game <span aria-hidden="true">★</span>'
    : 'Next word <span aria-hidden="true">→</span>';
});

nextVocabularyWordButton.addEventListener('click', () => {
  vocabularyListenRoundIndex += 1;
  if (vocabularyListenRoundIndex >= vocabularyListenRounds.length) {
    finishVocabularyListenGame();
    return;
  }
  renderVocabularyListenRound(true);
});

vocabularyListenOptions.innerHTML = classroomVocabulary.map(vocabularyListenCard).join('');
vocabularyListenOptions.querySelectorAll('button').forEach(button => { button.disabled = true; });

// Phase 1 Aa/Bb listening check
const abGame = document.getElementById('ab-review-game');
const abProgress = document.getElementById('ab-progress');
const abPrompt = document.getElementById('ab-prompt');
const abOptions = document.getElementById('ab-options');
const abFeedback = document.getElementById('ab-feedback');
const nextAbRoundButton = document.getElementById('next-ab-round');
let abRounds = [];
let abRoundIndex = 0;
let abLocked = false;

function renderAbRound() {
  const target = abRounds[abRoundIndex];
  const targetChoice = abWordChoices[target];
  abLocked = false;
  abProgress.textContent = `Sound ${abRoundIndex + 1} of ${abRounds.length}`;
  abPrompt.textContent = `Find the word that starts with ${targetChoice.label}.`;
  abOptions.innerHTML = shuffle(Object.entries(abWordChoices)).map(([letter, choice]) => `
    <button type="button" data-ab-letter="${letter}" data-ab-word="${choice.word}">
      <span aria-hidden="true">${choice.picture}</span><strong>${choice.word}</strong><small>${choice.label}</small>
    </button>`).join('');
  abFeedback.textContent = 'Say both words, then choose.';
  abFeedback.className = '';
  nextAbRoundButton.hidden = true;
}

function startAbGame() {
  abRounds = shuffle(['a', 'b', 'a', 'b']);
  abRoundIndex = 0;
  abGame.hidden = false;
  renderAbRound();
  abGame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('start-ab-game').addEventListener('click', startAbGame);
abOptions.addEventListener('click', event => {
  const button = event.target.closest('[data-ab-letter]');
  if (!button || abLocked) return;
  playWord(button.dataset.abWord);
  if (button.dataset.abLetter !== abRounds[abRoundIndex]) {
    button.classList.add('try-again');
    abFeedback.textContent = `That is ${button.dataset.abWord}. Listen to its first sound and try again.`;
    return;
  }
  abLocked = true;
  button.classList.add('correct');
  abOptions.querySelectorAll('button').forEach(option => { option.disabled = true; });
  abFeedback.textContent = `Yes — ${button.dataset.abWord}!`;
  abFeedback.className = 'success';
  nextAbRoundButton.hidden = false;
  nextAbRoundButton.innerHTML = abRoundIndex === abRounds.length - 1
    ? 'Finish <span aria-hidden="true">★</span>'
    : 'Next sound <span aria-hidden="true">→</span>';
});
nextAbRoundButton.addEventListener('click', () => {
  abRoundIndex += 1;
  if (abRoundIndex >= abRounds.length) {
    abProgress.textContent = 'All 4 sounds complete';
    abPrompt.textContent = 'Amazing listening!';
    abOptions.innerHTML = '<span class="mini-game-celebration" aria-hidden="true">🍎 ★ 📘</span>';
    abFeedback.textContent = 'You heard Aa /a/ and Bb /b/.';
    nextAbRoundButton.hidden = true;
    return;
  }
  renderAbRound();
});

// My Family page-turning reader
const bookPageLabel = document.getElementById('book-page-label');
const bookPageFrame = document.getElementById('book-page-frame');
const bookPageImage = document.getElementById('book-page-image');
const bookPictureButton = document.getElementById('book-picture-button');
const bookSentence = document.getElementById('book-sentence');
const bookAudioStatus = document.getElementById('book-audio-status');
const bookPageDots = document.getElementById('book-page-dots');
const previousBookPage = document.getElementById('previous-book-page');
const nextBookPage = document.getElementById('next-book-page');
const readBookPageButton = document.getElementById('read-book-page');
let bookPageIndex = 0;

function readBookPageRecording() {
  const page = myFamilyPages[bookPageIndex];
  playAudio(bookPageAudioPath(page.audio), page.narration, bookAudioStatus);
}

function bookWordButton(word, narration) {
  return `<button class="book-word" type="button" data-read-book-page aria-label="Read this page aloud: ${narration}">${word}</button>`;
}

function renderBookDots() {
  bookPageDots.innerHTML = myFamilyPages.map((page, index) =>
    `<button type="button" data-book-page="${index}" aria-label="Go to ${page.label}" ${index === bookPageIndex ? 'aria-current="page"' : ''}></button>`
  ).join('');
}

function preloadBookNeighbours() {
  [bookPageIndex - 1, bookPageIndex + 1].filter(index => myFamilyPages[index]).forEach(index => {
    const page = myFamilyPages[index];
    const image = new Image();
    image.src = `../assets/books/my-family/${page.image}`;
  });
}

function renderBookPage(direction = 'forward') {
  stopAudio();
  const page = myFamilyPages[bookPageIndex];
  bookPageFrame.classList.remove('turn-forward', 'turn-back');
  void bookPageFrame.offsetWidth;
  bookPageFrame.classList.add(direction === 'back' ? 'turn-back' : 'turn-forward');
  window.setTimeout(() => bookPageFrame.classList.remove('turn-forward', 'turn-back'), 430);
  bookPageLabel.textContent = `${page.label} · ${bookPageIndex + 1} of ${myFamilyPages.length}`;
  bookPageImage.src = `../assets/books/my-family/${page.image}`;
  bookPageImage.alt = page.alt;
  bookPictureButton.setAttribute('aria-label', `Read this page aloud: ${page.narration}`);
  bookSentence.innerHTML = page.words.map(word => bookWordButton(word, page.narration)).join('');
  bookSentence.setAttribute('aria-label', page.narration);
  bookAudioStatus.textContent = `Ready to read “${page.narration}”`;
  previousBookPage.disabled = bookPageIndex === 0;
  nextBookPage.disabled = bookPageIndex === myFamilyPages.length - 1;
  renderBookDots();
  preloadBookNeighbours();
}

previousBookPage.addEventListener('click', () => {
  if (bookPageIndex === 0) return;
  bookPageIndex -= 1;
  renderBookPage('back');
});
nextBookPage.addEventListener('click', () => {
  if (bookPageIndex === myFamilyPages.length - 1) return;
  bookPageIndex += 1;
  renderBookPage('forward');
});
readBookPageButton.addEventListener('click', readBookPageRecording);
bookPictureButton.addEventListener('click', readBookPageRecording);
bookSentence.addEventListener('click', event => {
  if (event.target.closest('[data-read-book-page]')) readBookPageRecording();
});
bookPageDots.addEventListener('click', event => {
  const button = event.target.closest('[data-book-page]');
  if (!button) return;
  const nextIndex = Number(button.dataset.bookPage);
  const direction = nextIndex < bookPageIndex ? 'back' : 'forward';
  bookPageIndex = nextIndex;
  renderBookPage(direction);
});

classroomVocabulary.forEach(({ word }) => audioFor(wordAudioPath(word)));
classroomVocabulary.forEach(object => {
  characters.forEach(character => audioFor(instructionAudioPath({ object, character })));
});

startGiveGame();
renderBookPage();
