/* Beginner oral first-sound practice. Listening never submits an answer. */
(() => {
  'use strict';
  const targets = ['bear', 'bird', 'bed', 'banana', 'ball', 'bag'];
  const distractors = ['cat', 'dog', 'sun', 'fish', 'hat', 'cup'];
  const pictures = {
    bear: '<circle cx="61" cy="50" r="24" fill="#bb8964"/><circle cx="139" cy="50" r="24" fill="#bb8964"/><circle cx="61" cy="50" r="12" fill="#ebc69c"/><circle cx="139" cy="50" r="12" fill="#ebc69c"/><ellipse cx="100" cy="111" rx="63" ry="65" fill="#bb8964"/><ellipse cx="100" cy="135" rx="34" ry="26" fill="#ebc69c"/><circle cx="76" cy="104" r="5"/><circle cx="124" cy="104" r="5"/><path d="M90 126Q100 119 110 126L100 136Z"/><path d="M100 136V145Q89 155 81 144M100 145Q111 155 119 144" fill="none"/>',
    bird: '<path d="M115 78Q137 39 154 65L159 86L182 99L158 109Q154 154 110 154Q68 153 52 121L22 106L56 101Q72 64 115 78Z" fill="#80bad4"/><path d="M159 87L182 99L158 109Z" fill="#f2bd55"/><path d="M88 97Q119 93 129 120Q103 148 78 123Z" fill="#add7e5"/><circle cx="143" cy="81" r="5"/><path d="M104 155V174H91M127 154V174H140" fill="none" stroke="#b18549" stroke-width="6"/>',
    bed: '<path d="M28 65V168M172 102V168" fill="none" stroke="#9b7459" stroke-width="13"/><path d="M29 104H171V146H29Z" fill="#8cbace"/><path d="M34 100Q45 82 76 100V116H34Z" fill="#fffaf0"/><path d="M81 99H169V143H81Z" fill="#e6b073"/><path d="M29 146H170" stroke="#9b7459" stroke-width="9"/>',
    banana: '<path d="M46 55Q66 149 166 78Q146 153 90 163Q30 168 31 94Z" fill="#f5d35f"/><path d="M46 55L42 40L53 35L59 58M166 78L171 67L178 72L173 85" fill="#93704a"/><path d="M43 90Q67 166 153 105" fill="none" stroke="#d7aa37" stroke-width="5"/>',
    ball: '<circle cx="100" cy="104" r="70" fill="#f1cb65"/><path d="M100 34Q61 68 62 105Q62 145 100 174Q141 145 140 105Q140 67 100 34Z" fill="#8bb9cb"/><path d="M100 34V174M30 104H170" fill="none" stroke="#fff8e4" stroke-width="6"/><circle cx="100" cy="104" r="16" fill="#e88c79"/>',
    bag: '<path d="M54 70H146L163 170H37Z" fill="#e69876"/><path d="M73 74V49Q100 18 127 49V74" fill="none" stroke="#a96d50" stroke-width="11"/><path d="M70 100H130V146H70Z" fill="#f5c399"/><circle cx="100" cy="114" r="5" fill="#a96d50"/>',
    cat: '<path d="M49 99L42 39L82 63Q100 55 120 64L157 39L151 99Q176 162 100 172Q24 162 49 99Z" fill="#e7b06d"/><path d="M53 58L59 85L75 72M145 58L139 85L123 72" fill="#e7a2a0"/><circle cx="76" cy="110" r="6"/><circle cx="124" cy="110" r="6"/><path d="M91 131H109L100 140Z" fill="#cf7f7f"/><path d="M100 140V147M61 139L28 132M61 150L27 154M139 139L172 132M139 150L173 154" fill="none"/>',
    dog: '<path d="M64 60Q29 43 24 79Q16 137 52 136L72 86M136 60Q171 43 176 79Q184 137 148 136L128 86" fill="#ae7e59"/><ellipse cx="100" cy="111" rx="53" ry="62" fill="#dab185"/><circle cx="78" cy="106" r="5"/><circle cx="122" cy="106" r="5"/><ellipse cx="100" cy="134" rx="25" ry="21" fill="#f4d8b1"/><path d="M91 128Q100 121 109 128L100 139Z"/><path d="M100 139V152Q118 171 120 149" fill="#eb9ba3"/>',
    sun: '<g stroke="#e4b344" stroke-width="9"><path d="M100 17V33M100 167V183M17 100H33M167 100H183M41 41L54 54M146 146L159 159M41 159L54 146M146 54L159 41"/></g><circle cx="100" cy="100" r="52" fill="#f6d46c"/><circle cx="82" cy="93" r="4"/><circle cx="118" cy="93" r="4"/><path d="M82 113Q100 134 118 113" fill="none"/>',
    fish: '<path d="M57 88L23 58V144L57 118Q107 176 166 103Q111 30 57 88Z" fill="#8ec7d3"/><path d="M103 54L113 34L132 66M101 147L119 167L132 137" fill="#e6b666"/><circle cx="140" cy="94" r="5"/><path d="M105 76Q85 102 105 129" fill="none"/>',
    hat: '<path d="M48 137L64 48H135L153 137Z" fill="#a795c9"/><path d="M53 109H148L153 136H48Z" fill="#f3ce73"/><ellipse cx="100" cy="143" rx="80" ry="17" fill="#a795c9"/>',
    cup: '<path d="M139 70H155Q181 71 173 106Q166 126 140 121" fill="none" stroke="#cb8a73" stroke-width="12"/><path d="M45 59H141V135Q94 171 45 135Z" fill="#edb39a"/><ellipse cx="93" cy="59" rx="48" ry="13" fill="#fff4dd"/><path d="M58 168H151" stroke="#8fbaae" stroke-width="9"/>'
  };
  const $ = id => document.getElementById(id);
  const shuffle = input => {const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const svg = word => `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><g stroke="#3e554e" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="#3e554e">${pictures[word]}</g></svg>`;
  let rounds=[], index=0, choices=[], solved=false;
  function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel();}
  function say(text){
    stopAudio();const status=$($('b-finish').hidden?'b-audio-status':'b-finish-audio');status.textContent='';
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){status.textContent='Audio is unavailable. Ask a grown-up to say the picture words.';return;}
    const speech=new SpeechSynthesisUtterance(text);speech.lang='en-GB';speech.rate=.8;
    const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));if(voice)speech.voice=voice;
    speech.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted')status.textContent='Audio could not play. Ask a grown-up to say the picture words.';};window.speechSynthesis.speak(speech);
  }
  function show(id){['b-menu','b-play','b-finish'].forEach(s=>$(s).hidden=s!==id);}
  function start(){stopAudio();rounds=shuffle(targets);index=0;show('b-play');round();}
  function round(){
    stopAudio();solved=false;choices=shuffle([rounds[index],...shuffle(distractors).slice(0,2)]);
    $('b-round').textContent=`Round ${index+1} of 6`;$('b-progress').value=index;$('b-feedback').textContent='';$('b-audio-status').textContent='';$('b-next').hidden=true;
    $('b-choices').innerHTML=choices.map((word,i)=>`<article class="b-choice"><span class="b-number" aria-hidden="true">${i+1}</span><button type="button" class="b-listen" data-hear="${word}" aria-label="Hear picture ${i+1}: ${word}">${svg(word)}<span class="b-listen-label">🔊 Listen</span></button><p class="b-answer" hidden><strong>${word[0]}</strong>${word.slice(1)}</p><button type="button" class="b-choose" data-choose="${word}" aria-label="Choose picture ${i+1}">Choose ✓</button></article>`).join('');
    stars(index);$('b-hear-all').focus();
  }
  function stars(n){$('b-stars').innerHTML=targets.map((_,i)=>`<span class="${i<n?'found':''}">★</span>`).join('');}
  $('b-start').addEventListener('click',start);$('b-replay').addEventListener('click',start);
  $('b-home').addEventListener('click',()=>{stopAudio();show('b-menu');$('b-start').focus();});
  $('b-hear-all').addEventListener('click',()=>say(choices.map((word,i)=>`${['One','Two','Three'][i]}. ${word}.`).join(' ')));
  $('b-choices').addEventListener('click',e=>{
    const hear=e.target.closest('[data-hear]');if(hear){say(hear.dataset.hear);return;}
    const button=e.target.closest('[data-choose]');if(!button||solved||button.disabled)return;
    stopAudio();const card=button.closest('.b-choice');
    if(button.dataset.choose!==rounds[index]){card.classList.add('try-again');button.disabled=true;$('b-feedback').textContent='Listen again. Which word begins like bear?';say('Listen again. Which word begins like bear?');return;}
    solved=true;card.classList.add('correct');card.querySelector('.b-answer').hidden=false;
    $('b-choices').querySelectorAll('[data-choose]').forEach(b=>b.disabled=true);
    $('b-feedback').textContent=`Yes! ${rounds[index]} begins with /b/.`;
    say(`Yes! ${rounds[index]}. ${rounds[index]} starts like bear.`);
    $('b-progress').value=index+1;stars(index+1);$('b-next').hidden=false;$('b-next').textContent=index===5?'See my pictures ★':'Next pictures →';$('b-next').focus();
  });
  $('b-next').addEventListener('click',()=>{
    if(!solved)return;stopAudio();index++;if(index<rounds.length){round();return;}
    show('b-finish');$('b-finish-audio').textContent='';$('b-collection').innerHTML=targets.map(word=>`<button type="button" data-hear="${word}" aria-label="Hear ${word}">${svg(word)}<span>${word}</span></button>`).join('');$('b-replay').focus();
  });
  $('b-collection').addEventListener('click',e=>{const b=e.target.closest('[data-hear]');if(b)say(b.dataset.hear);});
  window.addEventListener('pagehide',stopAudio);
})();
