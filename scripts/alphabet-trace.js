import { ALPHABET, letterSpeech, speak } from './alphabet-data.js';

const canvas = document.getElementById('trace-canvas');
const context = canvas.getContext('2d');
const letterSelect = document.getElementById('trace-letter');
const caseSelect = document.getElementById('trace-case');
const word = document.getElementById('trace-word');
let index = 0, drawing = false, lastPoint = null;

ALPHABET.forEach((item, itemIndex) => { const option = document.createElement('option'); option.value = itemIndex; option.textContent = `${item.upper}${item.lower} — ${item.word}`; letterSelect.append(option); });
letterSelect.addEventListener('change', () => { index = Number(letterSelect.value); resetBoard(); });
caseSelect.addEventListener('change', resetBoard);
document.getElementById('trace-clear').addEventListener('click', resetBoard);
document.getElementById('trace-hear').addEventListener('click', () => speak(letterSpeech(ALPHABET[index])));
document.getElementById('trace-previous').addEventListener('click', () => move(-1));
document.getElementById('trace-next').addEventListener('click', () => move(1));
canvas.addEventListener('pointerdown', event => { drawing = true; lastPoint = point(event); canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointermove', event => { if (!drawing) return; const nextPoint = point(event); context.beginPath(); context.moveTo(lastPoint.x, lastPoint.y); context.lineTo(nextPoint.x, nextPoint.y); context.strokeStyle = '#307fa7'; context.lineWidth = 14; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke(); lastPoint = nextPoint; });
canvas.addEventListener('pointerup', () => { drawing = false; lastPoint = null; });
canvas.addEventListener('pointercancel', () => { drawing = false; lastPoint = null; });
window.addEventListener('resize', resetBoard);

function move(amount) { index = (index + amount + ALPHABET.length) % ALPHABET.length; letterSelect.value = index; resetBoard(); speak(letterSpeech(ALPHABET[index])); }
function point(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) }; }
function resetBoard() {
  const rect = canvas.getBoundingClientRect(), ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, rect.width, rect.height);
  const item = ALPHABET[index], letter = caseSelect.value === 'upper' ? item.upper : item.lower;
  context.save(); context.globalAlpha = 0.13; context.fillStyle = '#173c3a'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.font = `${Math.min(rect.height * .78, rect.width * .62)}px "KG Primary", "Comic Sans MS", cursive`; context.fillText(letter, rect.width / 2, rect.height / 2 + 12); context.restore();
  word.textContent = `${item.upper} is for ${item.word} ${item.emoji}`;
}

requestAnimationFrame(resetBoard);
if (document.fonts) document.fonts.ready.then(resetBoard);
