import { ALPHABET, letterSpeech, speak } from './alphabet-data.js';

const grid = document.getElementById('alphabet-grid');
const pair = document.getElementById('explorer-pair');
const emoji = document.getElementById('explorer-emoji');
const word = document.getElementById('explorer-word');
const speakButton = document.getElementById('explorer-speak');
const gameLink = document.getElementById('explorer-game-link');
let current = ALPHABET[0];

ALPHABET.forEach((item, index) => {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'alphabet-tile';
  button.textContent = `${item.upper}${item.lower}`;
  button.setAttribute('aria-label', `${item.upper}, ${item.word}`);
  button.addEventListener('click', () => selectLetter(item, button));
  if (index === 0) button.classList.add('active');
  grid.append(button);
});

speakButton.addEventListener('click', () => speak(letterSpeech(current)));

function selectLetter(item, button) {
  current = item;
  grid.querySelectorAll('button').forEach(tile => tile.classList.toggle('active', tile === button));
  pair.textContent = `${item.upper}${item.lower}`; emoji.textContent = item.emoji; word.textContent = item.word;
  gameLink.href = `letter-game.html?letter=${item.upper}`; gameLink.textContent = `Play the ${item.upper} game`;
  speak(letterSpeech(item));
}
