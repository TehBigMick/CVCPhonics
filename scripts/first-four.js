import { FRY_LEVELS } from './data.js';

// Keep the game aligned with the site's actual pre-primer selection.
const words = FRY_LEVELS['Pre-Primer'].slice(0, 4);
const phrases = {
  the: '<strong>the</strong> book',
  of: 'a bag <strong>of</strong> books',
  and: 'book <strong>and</strong> pencil',
  a: '<strong>a</strong> chair'
};
const $ = id => document.getElementById(id);
const shuffle = input => { const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
let deck=[], index=0, solved=false, speechGeneration=0;
function stopAudio() { speechGeneration++;if('speechSynthesis' in window)window.speechSynthesis.cancel(); }
function say(word) {
  stopAudio();$('four-audio-status').textContent='';
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)) {
    $('four-audio-status').textContent='Audio is unavailable. Ask a grown-up to use “Show me the word” and read it aloud.';return;
  }
  const generation=speechGeneration;
  const speech=new SpeechSynthesisUtterance(word);speech.lang='en-GB';speech.rate=.8;
  const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));if(voice)speech.voice=voice;
  speech.onerror=e=>{if(generation===speechGeneration&&e.error!=='canceled'&&e.error!=='interrupted')$('four-audio-status').textContent='Audio could not play. Ask a grown-up to use “Show me the word” and read it aloud.';};
  window.speechSynthesis.speak(speech);
}
function show(section) { ['four-menu','four-play','four-finish'].forEach(id=>$(id).hidden=id!==section); }
function listenCards() { return words.map(word=>`<button type="button" data-hear="${word}" aria-label="Hear ${word}"><span>${word}</span><small>🔊 Listen</small></button>`).join(''); }
$('four-practice').innerHTML=listenCards();$('four-review').innerHTML=listenCards();
for(const id of ['four-practice','four-review'])$(id).addEventListener('click',e=>{const b=e.target.closest('[data-hear]');if(b)say(b.dataset.hear);});
function stars(n) { $('four-stars').innerHTML=deck.map((_,i)=>`<span class="${i<n?'collected':''}">★</span>`).join(''); }
function start() {
  stopAudio();const first=shuffle(words),second=shuffle(words);
  if(first.at(-1)===second[0])[second[0],second[1]]=[second[1],second[0]];
  deck=[...first,...second];index=0;show('four-play');round();
}
function round() {
  solved=false;$('four-round').textContent=`Star ${index+1} of ${deck.length}`;$('four-progress').value=index;
  $('four-feedback').textContent='';$('four-hint-word').hidden=true;$('four-hint-word').textContent='';$('four-hint').hidden=false;$('four-phrase').hidden=true;$('four-phrase').textContent='';$('four-next').hidden=true;
  $('four-choices').innerHTML=shuffle(words).map(word=>`<button type="button" data-word="${word}"><span>${word}</span></button>`).join('');
  stars(index);$('four-listen').focus();say(deck[index]);
}
function menu() {stopAudio();show('four-menu');$('four-audio-status').textContent='';$('four-start').focus();}
$('four-start').addEventListener('click',start);$('four-replay').addEventListener('click',start);$('four-menu-button').addEventListener('click',menu);$('four-back').addEventListener('click',menu);
$('four-listen').addEventListener('click',()=>say(deck[index]));
$('four-hint').addEventListener('click',()=>{
  if(solved)return;$('four-hint-word').textContent=deck[index];$('four-hint-word').hidden=false;
  $('four-choices').querySelector(`[data-word="${deck[index]}"]`).classList.add('word-hint');
});
$('four-choices').addEventListener('click',e=>{
  const b=e.target.closest('[data-word]');if(!b||solved||b.disabled)return;
  if(b.dataset.word!==deck[index]){b.classList.add('tried');b.disabled=true;$('four-feedback').textContent='Have another look. Listen and try again.';say(deck[index]);return;}
  stopAudio();solved=true;b.classList.remove('word-hint');b.classList.add('correct');$('four-choices').querySelectorAll('button').forEach(button=>button.disabled=true);
  $('four-feedback').textContent=`Yes! You found “${deck[index]}”. ★`;
  $('four-phrase').innerHTML=phrases[deck[index]]||deck[index];$('four-phrase').hidden=false;$('four-hint').hidden=true;
  $('four-progress').value=index+1;stars(index+1);$('four-next').hidden=false;$('four-next').textContent=index===deck.length-1?'See my stars ★':'Next word →';$('four-next').focus();
});
$('four-next').addEventListener('click',()=>{
  if(!solved)return;stopAudio();index++;if(index<deck.length){round();return;}show('four-finish');$('four-audio-status').textContent='';$('four-replay').focus();
});
window.addEventListener('pagehide',stopAudio);
