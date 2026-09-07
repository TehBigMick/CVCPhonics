function letterChoices(first, second) {
  return [first, second].map(letter => ({
    value: letter,
    label: letter,
    className: 'letter-choice',
    accessibleName: letter === letter.toUpperCase() ? `capital ${letter}` : `small ${letter}`
  }));
}

function pairChoices() {
  return ['Aa', 'Bb'].map(pair => ({
    value: pair,
    label: pair,
    className: 'pair-choice',
    accessibleName: `${pair[0]} and ${pair[1]}`
  }));
}

function pictureChoices(...items) {
  return items.map(([word, emoji]) => ({
    value: word,
    label: `<span class="picture-emoji" aria-hidden="true">${emoji}</span><span>${word}</span>`,
    className: 'picture-choice',
    accessibleName: word
  }));
}

function wordQuestion(word, emoji, answer) {
  return {
    prompt: `What letter does ${word.toLowerCase()} start with?`,
    speech: `What letter does ${word} start with?`,
    cue: `<span class="word-cue"><span aria-hidden="true">${emoji}</span><strong>${word}</strong></span>`,
    choices: pairChoices(),
    answer,
    success: `${word} starts with ${answer[0]}!`
  };
}

export const LETTER_QUESTIONS = [
  {
    prompt: 'Find capital A.',
    speech: 'Find capital A.',
    cue: '<span class="cue-pair"><b>A</b><b>a</b></span>',
    choices: letterChoices('A', 'B'),
    answer: 'A',
    success: 'That is capital A!'
  },
  {
    prompt: 'Find small a.',
    speech: 'Find small a.',
    cue: '<span class="cue-pair"><b>A</b><b>a</b></span>',
    choices: letterChoices('a', 'b'),
    answer: 'a',
    success: 'That is small a!'
  },
  {
    prompt: 'Find capital B.',
    speech: 'Find capital B.',
    cue: '<span class="cue-pair cue-pair-b"><b>B</b><b>b</b></span>',
    choices: letterChoices('A', 'B'),
    answer: 'B',
    success: 'That is capital B!'
  },
  {
    prompt: 'Find small b.',
    speech: 'Find small b.',
    cue: '<span class="cue-pair cue-pair-b"><b>B</b><b>b</b></span>',
    choices: letterChoices('a', 'b'),
    answer: 'b',
    success: 'That is small b!'
  },
  {
    prompt: 'Which pair shows capital A and small a?',
    speech: 'Which pair shows capital A and small a?',
    cue: '<span class="cue-label">Match the pair</span>',
    choices: pairChoices(),
    answer: 'Aa',
    success: 'A and a belong together!'
  },
  {
    prompt: 'Which pair shows capital B and small b?',
    speech: 'Which pair shows capital B and small b?',
    cue: '<span class="cue-label">Match the pair</span>',
    choices: pairChoices(),
    answer: 'Bb',
    success: 'B and b belong together!'
  },
  wordQuestion('Apple', '🍎', 'Aa'),
  wordQuestion('Axe', '🪓', 'Aa'),
  wordQuestion('Book', '📖', 'Bb'),
  wordQuestion('Bag', '🎒', 'Bb'),
  {
    prompt: 'Which picture starts with A?',
    speech: 'Which picture starts with A?',
    cue: '<span class="cue-pair"><b>A</b><b>a</b></span>',
    choices: pictureChoices(['Apple', '🍎'], ['Book', '📖']),
    answer: 'Apple',
    success: 'Apple starts with A!'
  },
  {
    prompt: 'Which picture starts with B?',
    speech: 'Which picture starts with B?',
    cue: '<span class="cue-pair cue-pair-b"><b>B</b><b>b</b></span>',
    choices: pictureChoices(['Axe', '🪓'], ['Bag', '🎒']),
    answer: 'Bag',
    success: 'Bag starts with B!'
  }
];
