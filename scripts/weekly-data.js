// Weekly targets live here so the next week and new video uploads are easy to update.
export const WEEK = { label: '12–16 October 2026', start: '2026-10-12', end: '2026-10-16' };

export const REVIEW_VIDEOS = [
  { letter: 'Aa', src: '../assets/videos/OPW-A.mp4', poster: '../assets/videos/OPW-A-poster.webp' },
  { letter: 'Bb', src: '../assets/videos/OPW-B.mp4', poster: '../assets/videos/OPW-B-poster.webp' }
];

export const COLOURS = [
  { word: 'red', colour: '#e94845' }, { word: 'blue', colour: '#2581c2' },
  { word: 'yellow', colour: '#f7cb37' }, { word: 'green', colour: '#32966c' }
];

export const COURSES = {
  ph1: {
    letter: 'Cc', model: 'cat',
    vocabulary: COLOURS,
    focusWords: [
      { word: 'cat', emoji: '🐱' }, { word: 'car', emoji: '🚗' },
      { word: 'computer', emoji: '💻' }, { word: 'cup', emoji: '☕' }
    ],
    distractors: [{ word: 'apple', emoji: '🍎' }, { word: 'ant', emoji: '🐜' }, { word: 'book', emoji: '📘' }, { word: 'bag', emoji: '🎒' }],
    // Add the teacher's Cc file at this path, then change ready to true.
    video: { letter: 'Cc', src: '../assets/videos/OPW-C.mp4', ready: false },
    games: [
      { id: 'vocabulary', title: 'Colour Detective', icon: '🔎', description: 'Listen to a colour and find its block.', rounds: 8 },
      { id: 'phonics', title: 'Cc Picture Picnic', icon: '🧺', description: 'Find the words that start like cat.', rounds: 4 },
      { id: 'patterns', title: 'Colour Patterns', icon: '🎨', description: 'Look at the pattern. Which colour comes next?', rounds: 6 }
    ]
  },
  ph2: {
    letter: 'Jj', model: 'juice',
    vocabulary: ['body', 'head', 'arms', 'hands', 'legs', 'feet'].map(word => ({ word, part: word })),
    faceWords: [{ word: 'eyes', emoji: '👀' }, { word: 'ears', emoji: '👂' }, { word: 'nose', emoji: '👃' }, { word: 'mouth', emoji: '👄' }],
    focusWords: [
      { word: 'juice', emoji: '🧃' }, { word: 'jam', drawing: 'jam' },
      { word: 'jet', emoji: '✈️' }, { word: 'jacket', emoji: '🧥' }
    ],
    distractors: [{ word: 'apple', emoji: '🍎' }, { word: 'cat', emoji: '🐱' }, { word: 'book', emoji: '📘' }, { word: 'hand', emoji: '✋' }],
    sightWords: ['my', 'I', 'can'],
    // Add the teacher's Jj file at this path, then change ready to true.
    video: { letter: 'Jj', src: '../assets/videos/OPW-J.mp4', ready: false },
    games: [
      { id: 'vocabulary', title: 'Body Detective', icon: '🕵️', description: 'Listen and find the highlighted body part.', rounds: 6 },
      { id: 'phonics', title: 'Jj Sound Hunt', icon: '🧃', description: 'Find the words that start like juice.', rounds: 4 },
      { id: 'sightwords', title: 'Little Word Builders', icon: '🧱', description: 'Use my, I and can to finish a sentence.', rounds: 6 }
    ],
    sentences: [
      { before: 'This is', after: 'head.', answer: 'my', spoken: 'This is my head.', part: 'head' },
      { before: '', after: 'have two hands.', answer: 'I', spoken: 'I have two hands.', part: 'hands' },
      { before: 'I', after: 'clap my hands.', answer: 'can', spoken: 'I can clap my hands.', part: 'hands' },
      { before: 'These are', after: 'feet.', answer: 'my', spoken: 'These are my feet.', part: 'feet' },
      { before: '', after: 'have two arms.', answer: 'I', spoken: 'I have two arms.', part: 'arms' },
      { before: 'I', after: 'stamp my feet.', answer: 'can', spoken: 'I can stamp my feet.', part: 'feet' }
    ],
    movements: [
      { text: 'Clap your hands.', part: 'hands' }, { text: 'Touch your head.', part: 'head' },
      { text: 'Wave your arms.', part: 'arms' }, { text: 'Stamp your feet.', part: 'feet' },
      { text: 'Touch your legs.', part: 'legs' }, { text: 'Shake your body.', part: 'body' }
    ]
  }
};
