const screen = document.getElementById('board-screen');
const phaseLabel = document.getElementById('phase-label');
const screenCount = document.getElementById('screen-count');
const progressDots = document.getElementById('progress-dots');
const homeButton = document.getElementById('board-home');
const backButton = document.getElementById('board-back');
const nextButton = document.getElementById('board-next');
const repeatButton = document.getElementById('repeat-audio');
const teacherInfoDialog = document.getElementById('teacher-info-dialog');
const assessmentDialog = document.getElementById('assessment-dialog');
const movementDialog = document.getElementById('movement-dialog');

const SCREEN_NAMES = ['Welcome', 'Show Me', 'Sound Corners', 'Sound and Print', 'Speaking', 'Quick Check', 'Goodbye'];

const ITEMS = {
  bag: { id: 'bag', word: 'bag', label: 'Bag', emoji: '🎒' },
  pencil: { id: 'pencil', word: 'pencil', label: 'Pencil', emoji: '✏️' },
  board: { id: 'board', word: 'board', label: 'Board', emoji: '🟩' },
  book: { id: 'book', word: 'book', label: 'Book', emoji: '📖' },
  computer: { id: 'computer', word: 'computer', label: 'Computer', emoji: '💻' },
  bear: { id: 'bear', word: 'bear', label: 'Bear', emoji: '🧸' },
  bird: { id: 'bird', word: 'bird', label: 'Bird', emoji: '🐦' },
  banana: { id: 'banana', word: 'banana', label: 'Banana', emoji: '🍌' },
  cat: { id: 'cat', word: 'cat', label: 'Cat', emoji: '🐱' },
  apple: { id: 'apple', word: 'apple', label: 'Apple', emoji: '🍎' }
};

const PHASES = {
  phase1: {
    name: 'Phase 1', colour: 'Yellow', theme: '#ffd84f',
    welcomeSpeech: 'Hello! Today is Tuesday. Point to Tuesday. Join in with the actions. Clap, tap, and wave. Tuesday!',
    showItems: [ITEMS.bag, ITEMS.pencil],
    bWords: [ITEMS.bear, ITEMS.bird, ITEMS.banana, ITEMS.bag],
    mysteryItems: [
      { ...ITEMS.bag, phrase: 'My bag.' },
      { ...ITEMS.pencil, phrase: 'A pencil.' }
    ]
  },
  phase2: {
    name: 'Phase 2', colour: 'Pink', theme: '#f69abd',
    welcomeSpeech: 'Hello! Today is Tuesday. What day is it? Point to Tuesday and say, Today is Tuesday.',
    showItems: [ITEMS.board, ITEMS.book, ITEMS.computer, ITEMS.pencil],
    cornerItems: [ITEMS.board, ITEMS.book, ITEMS.computer, ITEMS.pencil],
    phraseItems: [
      { ...ITEMS.pencil, answer: 'my', clue: 'It belongs to me.', phrase: 'my pencil' },
      { ...ITEMS.book, answer: 'a', clue: 'There is one book.', phrase: 'a book' },
      { ...ITEMS.book, answer: 'my', clue: 'It belongs to me.', phrase: 'my book' },
      { ...ITEMS.pencil, answer: 'a', clue: 'There is one pencil.', phrase: 'a pencil' }
    ],
    mysteryItems: [
      { ...ITEMS.book, phrase: 'This is my book.' },
      { ...ITEMS.pencil, phrase: 'This is my pencil.' }
    ]
  }
};

const TEACHER_GUIDANCE = {
  phase1: [
    ['Invite children to point to Tuesday, then lead the short clap, tap and wave rhythm. Repeat the line slowly.', 'Model each action from the side of the group. Support pointing without saying the answer first.'],
    ['Place a real bag and pencil where children can reach them. Play two or three prompts, then invite a child to retrieve the named object.', 'Keep the objects visible, support turn-taking and help children return each item to its place.'],
    ['Mark a Bear corner and a Bird corner in the room. Play a word, let children choose either movement corner, then say its first /b/ sound together.', 'Stand near a corner, model safe movement and repeat the stretched first sound without requiring a spoken answer.'],
    ['Model a large B from top to bottom. Children can trace on the board, in the air and then in sand or another sensory tray.', 'Prepare the tracing tray and model a top-to-bottom line. Offer verbal guidance instead of moving a child’s hand.'],
    ['Hide one classroom object in the Mystery School Bag. Reveal it, model “My bag” or “A pencil”, then give partners a turn.', 'Accept pointing, recast the short phrase warmly and help children swap and return objects.'],
    ['Give each prompt once, pause, then repeat only if needed. Record the level of support in the assessment panel.', 'Observe quietly during the first attempt. Prompt only when the teacher signals, and note pointing as a valid response.'],
    ['Repeat the Tuesday line, wave goodbye and invite children to return the bag, pencil and tracing resources.', 'Lead the pack-away action and praise careful returning and partner help.']
  ],
  phase2: [
    ['Ask “What day is it?” before revealing or emphasising Tuesday. Invite a complete answer if the group is ready.', 'Model the action sequence and wait before offering the first word of the answer.'],
    ['Set out a board card, book, computer and pencil. Children can point on screen, then retrieve or move towards a real object.', 'Support scanning from left to right and help children return borrowed classroom objects.'],
    ['Place the four pictures in four physical corners. Play the target word, then let children select on screen or move to its matching corner.', 'Check that routes are clear, stand near a corner and model the object word for children who need it.'],
    ['Read the clue aloud, then let children choose “my” or “a”. Build the whole phrase together and find another real example nearby.', 'Hold up the matching object, give processing time and recast the completed phrase clearly.'],
    ['Reveal one object at a time. Model “This is my…” and pass the object to a partner for another turn.', 'Prompt with the sentence opening when needed and accept an object word or pointing before recasting the full sentence.'],
    ['Use the three brief prompts as an observation, not a test. The final sentence is optional. Record support discreetly.', 'Avoid extra cues on the first attempt. Celebrate participation and note whether the response followed a prompt.'],
    ['Recall Tuesday, wave goodbye and optionally say one complete “This is my…” sentence before packing away.', 'Lead resource return and offer the optional sentence only to children who remain comfortable and engaged.']
  ]
};

let phase = 'phase1';
let screenIndex = 0;
let currentSpeech = '';
let interactionCount = 0;
let movementShown = { phase1: false, phase2: false };
let assessments = readAssessments();

const activityState = {
  phase1: makePhaseState('phase1'),
  phase2: makePhaseState('phase2')
};

function makePhaseState(phaseId) {
  const content = PHASES[phaseId];
  return {
    showIndex: 0,
    showOrder: shuffle(content.showItems),
    mainIndex: 0,
    mainOrder: shuffle(phaseId === 'phase1' ? [ITEMS.bear, ITEMS.bird] : content.cornerItems),
    phraseIndex: 0,
    mysteryIndex: 0,
    mysteryVisible: false,
    quickStep: 0
  };
}

document.querySelectorAll('[data-phase-choice]').forEach(button => {
  button.addEventListener('click', () => changePhase(button.dataset.phaseChoice));
});
homeButton.addEventListener('click', () => goToScreen(0));
backButton.addEventListener('click', () => goToScreen(screenIndex - 1));
nextButton.addEventListener('click', () => goToScreen(screenIndex + 1));
repeatButton.addEventListener('click', speakCurrent);
screen.addEventListener('click', handleScreenClick);
document.getElementById('open-teacher-info').addEventListener('click', openTeacherInfo);
document.getElementById('open-assessment').addEventListener('click', openAssessment);
document.getElementById('clear-assessment').addEventListener('click', clearAssessments);
document.querySelectorAll('[data-assessment]').forEach(button => button.addEventListener('click', recordAssessment));

renderProgressDots();
renderScreen();

function renderProgressDots() {
  progressDots.replaceChildren();
  SCREEN_NAMES.forEach((name, index) => {
    const dot = document.createElement('span');
    dot.title = name;
    dot.className = index < screenIndex ? 'complete' : index === screenIndex ? 'current complete' : '';
    progressDots.append(dot);
  });
}

function renderScreen(autoSpeak = true) {
  const renderers = [renderWelcome, renderShowMe, renderMainGame, renderPrintActivity, renderSpeaking, renderQuickCheck, renderGoodbye];
  screen.innerHTML = renderers[screenIndex]();
  phaseLabel.textContent = `${PHASES[phase].name} · ${PHASES[phase].colour}`;
  screenCount.textContent = `${screenIndex + 1} of ${SCREEN_NAMES.length}`;
  backButton.disabled = screenIndex === 0;
  homeButton.disabled = screenIndex === 0;
  nextButton.disabled = screenIndex === SCREEN_NAMES.length - 1;
  nextButton.querySelector('strong').textContent = screenIndex === SCREEN_NAMES.length - 2 ? 'Goodbye' : 'Next';
  renderProgressDots();
  if (phase === 'phase1' && screenIndex === 3) window.requestAnimationFrame(setupTraceBoard);
  if (autoSpeak) window.setTimeout(speakCurrent, 180);
}

function renderWelcome() {
  currentSpeech = PHASES[phase].welcomeSpeech;
  const heading = phase === 'phase1' ? 'Hello! Today is Tuesday.' : 'What day is it?';
  const prompt = phase === 'phase1' ? 'Point to Tuesday. Then clap, tap and wave.' : 'Point, say the day, then join the actions.';
  return `
    <p class="screen-kicker">Welcome</p>
    <h1>${heading}</h1>
    <p class="board-prompt">${prompt}</p>
    <div class="days-row" role="group" aria-label="Choose a day">
      ${dayCard('Monday', '🌙')}${dayCard('Tuesday', '☀️', true)}${dayCard('Wednesday', '🌈')}
    </div>
    <div class="song-actions" aria-label="Song actions"><span>👏 Clap</span><span>👇 Tap</span><span>👋 Wave</span></div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>`;
}

function dayCard(day, emoji, isTuesday = false) {
  return `<button class="day-card${isTuesday ? ' tuesday' : ''}" type="button" data-action="choose-day" data-day="${day}" data-child-action><span aria-hidden="true">${emoji}</span><strong>${day}</strong></button>`;
}

function renderShowMe() {
  const state = activityState[phase];
  const items = PHASES[phase].showItems;
  const target = items[state.showIndex % items.length];
  currentSpeech = `Show me the ${target.word}.`;
  return `
    <p class="screen-kicker">Show Me</p>
    <h1>Show me the ${target.word}.</h1>
    <p class="board-prompt">Listen, point, then find the real object.</p>
    <div class="picture-grid${items.length > 2 ? ' four' : ''}" role="group" aria-label="Classroom objects">
      ${state.showOrder.map(item => pictureCard(item, 'show-choice')).join('')}
    </div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>
    <div class="screen-tools">
      <button class="screen-button secondary" type="button" data-action="shuffle-show"><span aria-hidden="true">🔀</span> Shuffle pictures</button>
      <button class="screen-button" type="button" data-action="new-show"><span aria-hidden="true">👂</span> Next word</button>
    </div>`;
}

function renderMainGame() {
  const state = activityState[phase];
  if (phase === 'phase1') {
    const word = PHASES.phase1.bWords[state.mainIndex % PHASES.phase1.bWords.length];
    currentSpeech = `${word.word}. Listen for the first sound. ${word.word}. Choose the bear or bird corner, then move and say b.`;
    return `
      <p class="screen-kicker">Bear-or-Bird Sound Corners</p>
      <h1>Listen. Choose. Move!</h1>
      <span class="move-label">👣 Move to either picture</span>
      <div class="sound-mystery" id="sound-mystery"><span class="ear" aria-hidden="true">👂</span></div>
      <div class="corner-grid" role="group" aria-label="Bear and bird movement corners">
        ${state.mainOrder.map(item => cornerCard(item, 'choose-sound-corner')).join('')}
      </div>
      <p class="board-feedback" id="board-feedback" aria-live="polite"></p>
      <div class="screen-tools">
        <button class="screen-button secondary" type="button" data-action="shuffle-corners">🔀 Shuffle sides</button>
        <button class="screen-button" type="button" data-action="new-b-sound">👂 Next /b/ word</button>
      </div>`;
  }

  const target = PHASES.phase2.cornerItems[state.mainIndex % PHASES.phase2.cornerItems.length];
  currentSpeech = `Four corners. Find the ${target.word}. Point to it or stand up and move to its picture.`;
  return `
    <p class="screen-kicker">Four Corners</p>
    <h1>Find the ${target.word}.</h1>
    <span class="move-label">👣 Point or move to the picture</span>
    <div class="picture-grid four" role="group" aria-label="Four classroom object corners">
      ${state.mainOrder.map(item => pictureCard(item, 'four-corner-choice')).join('')}
    </div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>
    <div class="screen-tools">
      <button class="screen-button secondary" type="button" data-action="shuffle-corners">🔀 Shuffle pictures</button>
      <button class="screen-button" type="button" data-action="new-corner-word">👂 Next word</button>
    </div>`;
}

function renderPrintActivity() {
  if (phase === 'phase1') {
    currentSpeech = 'Make a big capital B. Start at the top, go down, then around and around. Try straight lines too. Trace in the air or in sand.';
    return `
      <p class="screen-kicker">Sound and Print</p>
      <h1>Trace a big B.</h1>
      <p class="board-prompt">Finger trace on screen, then try it in the air or in sand.</p>
      <div class="trace-layout">
        <div class="trace-guide" aria-label="Drawing area with a capital B and vertical line guides">
          <span class="trace-letter" aria-hidden="true">B</span>
          <div class="line-guides" aria-hidden="true"><span></span><span></span><span></span></div>
          <canvas id="board-trace-canvas"></canvas>
        </div>
        <div class="offscreen-practice"><span aria-hidden="true">☝️</span><h2>Down, around, around.</h2><p>Now make B in the air, draw vertical lines in sand, or trace on a partner’s back.</p></div>
      </div>
      <div class="screen-tools"><button class="screen-button" type="button" data-action="clear-trace">↻ Clear and try again</button></div>`;
  }

  const state = activityState.phase2;
  const item = PHASES.phase2.phraseItems[state.phraseIndex % PHASES.phase2.phraseItems.length];
  currentSpeech = `${item.clue} Choose ${item.answer} to make the phrase ${item.phrase}.`;
  return `
    <p class="screen-kicker">Sound and Print</p>
    <h1>Which word fits?</h1>
    <p class="board-prompt">${item.clue}</p>
    <div class="phrase-card">
      <span class="picture" aria-hidden="true">${item.emoji}</span>
      <div class="phrase-line"><span class="phrase-blank" id="phrase-blank">___</span><span>${item.word}</span></div>
    </div>
    <div class="phrase-options" role="group" aria-label="Choose my or a">
      <button class="word-choice" type="button" data-action="phrase-choice" data-value="my" data-child-action>my</button>
      <button class="word-choice" type="button" data-action="phrase-choice" data-value="a" data-child-action>a</button>
    </div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>
    <div class="screen-tools"><button class="screen-button" type="button" data-action="new-phrase">✨ Another phrase</button></div>`;
}

function renderSpeaking() {
  const state = activityState[phase];
  const items = PHASES[phase].mysteryItems;
  const item = items[state.mysteryIndex % items.length];
  const supportText = phase === 'phase1' ? 'Say the short phrase, or point if that is right for you.' : 'Tell a partner: “This is my…”';
  currentSpeech = state.mysteryVisible
    ? `${item.word}. ${item.phrase} Tell your partner, or point to the picture.`
    : 'What is inside the Mystery School Bag? Tap reveal when everyone is ready.';
  return `
    <p class="screen-kicker">Speaking Game</p>
    <h1>Mystery School Bag</h1>
    <p class="board-prompt">${supportText}</p>
    <div class="mystery-layout">
      <div class="mystery-bag" aria-label="Closed mystery school bag"><span class="closed-bag" aria-hidden="true">🎒</span><span class="question-mark" aria-hidden="true">?</span></div>
      ${state.mysteryVisible
        ? `<button class="mystery-reveal" type="button" data-word="${item.word}" data-child-action><span class="picture" aria-hidden="true">${item.emoji}</span><h2>${item.phrase}</h2><p>Tap the picture to hear it.</p></button>`
        : '<div class="mystery-reveal"><span class="picture" aria-hidden="true">🙈</span><h2>Hidden</h2><p>Ready to look?</p></div>'}
    </div>
    <div class="screen-tools">
      <button class="screen-button" type="button" data-action="toggle-mystery">${state.mysteryVisible ? '🙈 Hide again' : '✨ Reveal'}</button>
      <button class="screen-button secondary" type="button" data-action="new-mystery">🔀 Another object</button>
    </div>`;
}

function renderQuickCheck() {
  const state = activityState[phase];
  if (phase === 'phase1') return renderPhaseOneCheck(state.quickStep);
  return renderPhaseTwoCheck(state.quickStep);
}

function renderPhaseOneCheck(step) {
  if (step === 0) {
    currentSpeech = 'Quick check. Show me the bag.';
    return checkTemplate('1 of 2', 'Show me the bag.', [ITEMS.bag, ITEMS.pencil], 'bag', 'vocabulary');
  }
  currentSpeech = 'Quick check. Which picture starts with b? Bag or cat?';
  return checkTemplate('2 of 2', 'Which picture starts with /b/?', [ITEMS.bag, ITEMS.cat], 'bag', 'b sound');
}

function renderPhaseTwoCheck(step) {
  if (step === 0) {
    currentSpeech = 'Quick check. Show me the computer.';
    return checkTemplate('1 of 3', 'Show me the computer.', [ITEMS.book, ITEMS.computer], 'computer', 'object');
  }
  if (step === 1) {
    currentSpeech = 'Quick check. There is one book. Choose a to make a book.';
    return `
      <p class="screen-kicker">Quick Check · 2 of 3</p><h1>___ book</h1>
      <div class="phrase-card"><span class="picture" aria-hidden="true">📖</span><div class="phrase-line"><span class="phrase-blank" id="phrase-blank">___</span><span>book</span></div></div>
      <div class="phrase-options"><button class="word-choice" type="button" data-action="quick-choice" data-value="my" data-answer="a" data-child-action>my</button><button class="word-choice" type="button" data-action="quick-choice" data-value="a" data-answer="a" data-child-action>a</button></div>
      <p class="board-feedback" id="board-feedback" aria-live="polite"></p>`;
  }
  currentSpeech = 'Optional speaking turn. Look at the pencil and say, This is my pencil. You may point or skip for today.';
  return `
    <p class="screen-kicker">Quick Check · 3 of 3 · Optional</p>
    <h1>Say it, point, or pass.</h1>
    <div class="optional-sentence"><span aria-hidden="true">✏️</span><blockquote>“This is my pencil.”</blockquote><div class="action-row"><button class="screen-button" type="button" data-action="optional-done" data-child-action>😊 We said it</button><button class="screen-button secondary" type="button" data-action="optional-skip">Skip for today</button></div></div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>`;
}

function checkTemplate(count, heading, items, answer, kind) {
  return `
    <p class="screen-kicker">Quick Check · ${count}</p>
    <h1>${heading}</h1>
    <p class="board-prompt">One calm try. Pointing is welcome.</p>
    <div class="picture-grid" role="group" aria-label="Quick check choices">
      ${shuffle(items).map(item => `<button class="picture-card" type="button" data-action="quick-choice" data-value="${item.id}" data-answer="${answer}" data-check-kind="${kind}" data-child-action><span class="picture" aria-hidden="true">${item.emoji}</span><strong>${item.label}</strong><small>tap to choose</small></button>`).join('')}
    </div>
    <p class="board-feedback" id="board-feedback" aria-live="polite"></p>`;
}

function renderGoodbye() {
  const optionalSentence = phase === 'phase2'
    ? '<button class="screen-button secondary" type="button" data-action="goodbye-sentence">💬 “This is my book.”</button>'
    : '';
  currentSpeech = phase === 'phase1'
    ? 'Wonderful joining in! Today is Tuesday. Wave goodbye, help return the resources, and say, Goodbye everyone!'
    : 'Wonderful joining in! Today is Tuesday. You may say, This is my book. Wave goodbye and help return the resources.';
  return `
    <div class="confetti" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="goodbye-art" aria-hidden="true"><span class="calendar">☀️</span><span class="success-star">★</span></div>
    <p class="screen-kicker">Goodbye</p>
    <h1>Wonderful joining in!</h1>
    <p class="board-prompt">Today is <strong>Tuesday</strong>. Wave goodbye and help return the resources.</p>
    <div class="song-actions" aria-label="Goodbye actions"><span>👋 Wave</span><span>🤝 Help</span><span>🎒 Pack away</span></div>
    <div class="screen-tools">${optionalSentence}<button class="screen-button" type="button" data-action="repeat-goodbye">🔊 Goodbye routine</button></div>`;
}

function pictureCard(item, action) {
  return `<button class="picture-card" type="button" data-action="${action}" data-value="${item.id}" data-word="${item.word}" data-child-action><span class="picture" aria-hidden="true">${item.emoji}</span><strong>${item.label}</strong><small>tap to hear</small></button>`;
}

function cornerCard(item, action) {
  return `<button class="corner-card" type="button" data-action="${action}" data-value="${item.id}" data-word="${item.word}" data-child-action><span class="picture" aria-hidden="true">${item.emoji}</span><strong>${item.label} corner</strong><small>tap, then move</small></button>`;
}

function handleScreenClick(event) {
  const button = event.target.closest('button');
  if (!button || !screen.contains(button)) return;
  if (button.hasAttribute('data-child-action')) recordChildInteraction();
  if (button.dataset.word && !button.dataset.action) {
    speak(button.dataset.word);
    return;
  }

  const handlers = {
    'choose-day': chooseDay,
    'show-choice': chooseShowItem,
    'shuffle-show': shuffleShowItems,
    'new-show': nextShowItem,
    'choose-sound-corner': chooseSoundCorner,
    'shuffle-corners': shuffleCorners,
    'new-b-sound': nextBSound,
    'four-corner-choice': chooseFourCorner,
    'new-corner-word': nextCornerWord,
    'clear-trace': clearTrace,
    'phrase-choice': choosePhraseWord,
    'new-phrase': nextPhrase,
    'toggle-mystery': toggleMystery,
    'new-mystery': nextMystery,
    'quick-choice': chooseQuickAnswer,
    'optional-done': finishOptionalSentence,
    'optional-skip': finishOptionalSentence,
    'goodbye-sentence': () => speak('This is my book.'),
    'repeat-goodbye': speakCurrent
  };
  if (handlers[button.dataset.action]) handlers[button.dataset.action](button);
}

function chooseDay(button) {
  const isTuesday = button.dataset.day === 'Tuesday';
  speak(button.dataset.day);
  clearGentleStates(button.parentElement);
  button.classList.add(isTuesday ? 'gentle-correct' : 'listen-again');
  showFeedback(isTuesday ? 'Yes — today is Tuesday! ☀️' : `That says ${button.dataset.day}. Listen for Tuesday.`);
  window.setTimeout(() => speak(isTuesday ? 'Yes. Today is Tuesday!' : `That is ${button.dataset.day}. Find Tuesday.`), 550);
}

function chooseShowItem(button) {
  const state = activityState[phase];
  const items = PHASES[phase].showItems;
  const target = items[state.showIndex % items.length];
  const correct = button.dataset.value === target.id;
  speak(button.dataset.word);
  clearGentleStates(button.parentElement);
  button.classList.add(correct ? 'gentle-correct' : 'listen-again');
  showFeedback(correct ? `Yes — ${target.label}! Now find the real ${target.word}.` : 'Thank you for trying. Listen once more.');
  window.setTimeout(() => speak(correct ? `Yes, ${target.word}. Now find the real ${target.word}.` : `Listen again. Show me the ${target.word}.`), 600);
}

function shuffleShowItems() {
  const state = activityState[phase];
  state.showOrder = shuffle(PHASES[phase].showItems);
  renderScreen(false);
  speak('Pictures shuffled. ' + currentSpeech);
}

function nextShowItem() {
  const state = activityState[phase];
  state.showIndex = (state.showIndex + 1) % PHASES[phase].showItems.length;
  renderScreen();
}

function chooseSoundCorner(button) {
  const state = activityState.phase1;
  const word = PHASES.phase1.bWords[state.mainIndex % PHASES.phase1.bWords.length];
  const reveal = document.getElementById('sound-mystery');
  reveal.innerHTML = `<button class="reveal-word" type="button" data-word="${word.word}" data-child-action><span aria-hidden="true">${word.emoji}</span><strong>${word.label}</strong></button>`;
  showFeedback(`Great moving! ${word.label} starts with /b/.`);
  speak(`${button.dataset.word} corner. ${word.word} starts with b. Say b as you move.`);
}

function shuffleCorners() {
  const state = activityState[phase];
  const items = phase === 'phase1' ? [ITEMS.bear, ITEMS.bird] : PHASES.phase2.cornerItems;
  state.mainOrder = shuffle(items);
  renderScreen(false);
  speak('Pictures shuffled. ' + currentSpeech);
}

function nextBSound() {
  const state = activityState.phase1;
  state.mainIndex = (state.mainIndex + 1) % PHASES.phase1.bWords.length;
  renderScreen();
}

function chooseFourCorner(button) {
  const state = activityState.phase2;
  const target = PHASES.phase2.cornerItems[state.mainIndex % PHASES.phase2.cornerItems.length];
  const correct = button.dataset.value === target.id;
  speak(button.dataset.word);
  clearGentleStates(button.parentElement);
  button.classList.add(correct ? 'gentle-correct' : 'listen-again');
  showFeedback(correct ? `That’s the ${target.word}. Move to its corner!` : 'Good listening. Hear the word again, then choose.');
  window.setTimeout(() => speak(correct ? `Yes, ${target.word}. Stand up and move to the picture.` : `Listen again. Find the ${target.word}.`), 600);
}

function nextCornerWord() {
  const state = activityState.phase2;
  state.mainIndex = (state.mainIndex + 1) % PHASES.phase2.cornerItems.length;
  renderScreen();
}

function choosePhraseWord(button) {
  const state = activityState.phase2;
  const item = PHASES.phase2.phraseItems[state.phraseIndex % PHASES.phase2.phraseItems.length];
  const correct = button.dataset.value === item.answer;
  speak(button.dataset.value);
  clearGentleStates(button.parentElement);
  button.classList.add(correct ? 'gentle-correct' : 'listen-again');
  if (correct) document.getElementById('phrase-blank').textContent = item.answer;
  showFeedback(correct ? `${item.phrase} ${item.emoji}` : 'Both are useful words. Listen to this clue once more.');
  window.setTimeout(() => speak(correct ? item.phrase : `${item.clue} Choose ${item.answer}.`), 500);
}

function nextPhrase() {
  const state = activityState.phase2;
  state.phraseIndex = (state.phraseIndex + 1) % PHASES.phase2.phraseItems.length;
  renderScreen();
}

function toggleMystery() {
  const state = activityState[phase];
  state.mysteryVisible = !state.mysteryVisible;
  const item = PHASES[phase].mysteryItems[state.mysteryIndex % PHASES[phase].mysteryItems.length];
  renderScreen(false);
  speak(state.mysteryVisible ? `${item.word}. ${item.phrase}` : 'Hidden again. What could be inside?');
}

function nextMystery() {
  const state = activityState[phase];
  state.mysteryIndex = (state.mysteryIndex + 1) % PHASES[phase].mysteryItems.length;
  state.mysteryVisible = false;
  renderScreen(false);
  speak('A new object is hidden in the Mystery School Bag.');
}

function chooseQuickAnswer(button) {
  const correct = button.dataset.value === button.dataset.answer;
  const word = button.dataset.value;
  speak(word);
  clearGentleStates(button.parentElement);
  button.classList.add(correct ? 'gentle-correct' : 'listen-again');
  if (!correct) {
    showFeedback('Thank you for trying. Listen once more.');
    window.setTimeout(speakCurrent, 550);
    return;
  }

  if (document.getElementById('phrase-blank')) document.getElementById('phrase-blank').textContent = button.dataset.value;
  showFeedback('Lovely listening. Ready for the next little check?');
  window.setTimeout(() => speak('Lovely listening.'), 480);
  addCheckNextButton();
}

function addCheckNextButton() {
  if (document.getElementById('next-check-step')) return;
  const controls = document.createElement('div');
  controls.className = 'screen-tools';
  controls.innerHTML = '<button class="screen-button" id="next-check-step" type="button">Next little check →</button>';
  screen.append(controls);
  document.getElementById('next-check-step').addEventListener('click', () => {
    const state = activityState[phase];
    const maximum = phase === 'phase1' ? 1 : 2;
    state.quickStep = Math.min(state.quickStep + 1, maximum);
    renderScreen();
  });
}

function finishOptionalSentence(button) {
  const skipped = button.dataset.action === 'optional-skip';
  showFeedback(skipped ? 'That’s fine. Pointing and listening count too.' : 'Wonderful talking together!');
  speak(skipped ? 'That is fine. Pointing and listening count too.' : 'Wonderful talking together. This is my pencil.');
}

function clearTrace() {
  const canvas = document.getElementById('board-trace-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  speak('All clear. Start at the top and try again.');
}

function setupTraceBoard() {
  const canvas = document.getElementById('board-trace-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const ratio = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  context.scale(ratio, ratio);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 13;
  context.strokeStyle = '#273b38';
  let drawing = false;

  const point = event => {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };
  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const start = point(event);
    context.beginPath();
    context.moveTo(start.x, start.y);
    recordChildInteraction();
  });
  canvas.addEventListener('pointermove', event => {
    if (!drawing) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.stroke();
  });
  const finish = () => { drawing = false; };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);
}

function clearGentleStates(container) {
  container.querySelectorAll('.gentle-correct, .listen-again').forEach(item => item.classList.remove('gentle-correct', 'listen-again'));
}

function showFeedback(message) {
  const feedback = document.getElementById('board-feedback');
  if (feedback) feedback.textContent = message;
}

function goToScreen(index) {
  if (index < 0 || index >= SCREEN_NAMES.length) return;
  screenIndex = index;
  renderScreen();
  screen.focus({ preventScroll: true });
}

function changePhase(nextPhase) {
  if (!PHASES[nextPhase] || phase === nextPhase) return;
  phase = nextPhase;
  document.body.dataset.phase = phase;
  document.querySelector('meta[name="theme-color"]').content = PHASES[phase].theme;
  document.querySelectorAll('[data-phase-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.phaseChoice === phase));
  });
  renderScreen(false);
  speak(`${PHASES[phase].name}. ${currentSpeech}`);
}

function speakCurrent() {
  if (!speak(currentSpeech)) {
    repeatButton.disabled = true;
    repeatButton.title = 'Spoken instructions are not available in this browser';
  }
}

function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.76;
  utterance.pitch = 1.03;
  speechSynthesis.speak(utterance);
  return true;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function recordChildInteraction() {
  interactionCount += 1;
  if (interactionCount < 5 || movementShown[phase]) return;
  movementShown[phase] = true;
  window.setTimeout(() => {
    openDialog(movementDialog);
    speak('Stand up and move to the picture.');
  }, 850);
}

function openTeacherInfo() {
  const guidance = TEACHER_GUIDANCE[phase][screenIndex];
  document.getElementById('teacher-direction').textContent = guidance[0];
  document.getElementById('assistant-direction').textContent = guidance[1];
  openDialog(teacherInfoDialog);
}

function openAssessment() {
  const key = assessmentKey();
  const selected = assessments[key];
  document.getElementById('assessment-activity').textContent = `${PHASES[phase].name} · ${SCREEN_NAMES[screenIndex]}`;
  document.querySelectorAll('[data-assessment]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.assessment === selected));
  });
  document.getElementById('assessment-status').textContent = selected ? `Recorded: ${selected}.` : 'No observation recorded for this activity.';
  renderAssessmentSummary();
  openDialog(assessmentDialog);
}

function recordAssessment(event) {
  const value = event.currentTarget.dataset.assessment;
  assessments[assessmentKey()] = value;
  saveAssessments();
  document.querySelectorAll('[data-assessment]').forEach(button => {
    button.setAttribute('aria-pressed', String(button === event.currentTarget));
  });
  document.getElementById('assessment-status').textContent = `Recorded: ${value}.`;
  renderAssessmentSummary();
}

function renderAssessmentSummary() {
  const list = document.getElementById('assessment-summary-list');
  const entries = Object.entries(assessments);
  if (!entries.length) {
    list.innerHTML = '<p><span>No notes recorded yet.</span></p>';
    return;
  }
  list.innerHTML = entries.map(([key, value]) => {
    const [phaseId, index] = key.split(':');
    return `<p><span>${PHASES[phaseId].name} · ${SCREEN_NAMES[Number(index)]}</span><strong>${value}</strong></p>`;
  }).join('');
}

function clearAssessments() {
  assessments = {};
  saveAssessments();
  document.querySelectorAll('[data-assessment]').forEach(button => button.setAttribute('aria-pressed', 'false'));
  document.getElementById('assessment-status').textContent = 'Today’s notes have been cleared.';
  renderAssessmentSummary();
}

function assessmentKey() { return `${phase}:${screenIndex}`; }

function readAssessments() {
  try { return JSON.parse(sessionStorage.getItem('mph-tuesday-board-assessment') || '{}'); }
  catch { return {}; }
}

function saveAssessments() {
  try { sessionStorage.setItem('mph-tuesday-board-assessment', JSON.stringify(assessments)); }
  catch { /* The board still works when storage is unavailable. */ }
}

function openDialog(dialog) {
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
