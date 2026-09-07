export const ALPHABET = [
  ['A', 'a', 'Apple', '🍎'], ['B', 'b', 'Ball', '⚽'], ['C', 'c', 'Cat', '🐱'],
  ['D', 'd', 'Dog', '🐶'], ['E', 'e', 'Egg', '🥚'], ['F', 'f', 'Fish', '🐟'],
  ['G', 'g', 'Goat', '🐐'], ['H', 'h', 'Hat', '🎩'], ['I', 'i', 'Ice cream', '🍦'],
  ['J', 'j', 'Juice', '🧃'], ['K', 'k', 'Kite', '🪁'], ['L', 'l', 'Lion', '🦁'],
  ['M', 'm', 'Moon', '🌙'], ['N', 'n', 'Nest', '🪺'], ['O', 'o', 'Orange', '🍊'],
  ['P', 'p', 'Pig', '🐷'], ['Q', 'q', 'Queen', '👑'], ['R', 'r', 'Rabbit', '🐰'],
  ['S', 's', 'Sun', '☀️'], ['T', 't', 'Tiger', '🐯'], ['U', 'u', 'Umbrella', '☂️'],
  ['V', 'v', 'Van', '🚐'], ['W', 'w', 'Whale', '🐋'], ['X', 'x', 'Xylophone', '🎶'],
  ['Y', 'y', 'Yo-yo', '🪀'], ['Z', 'z', 'Zebra', '🦓']
].map(([upper, lower, word, emoji]) => ({ upper, lower, word, emoji }));

export function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = 'en-GB'; voice.rate = 0.76; voice.pitch = 1.04;
  speechSynthesis.speak(voice);
  return true;
}

export function letterSpeech(item) { return `${item.upper}. ${item.upper} as in ${item.word}.`; }
