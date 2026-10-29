/* Original friendly SVG pictures; no reading needed during the listening rounds. */
(() => {
  'use strict';
  const items = [
    {id:'pumpkin',label:'pumpkin',spoken:'Pumpkin',art:'<path d="M112 63Q105 38 123 25L139 34Q123 43 130 64" fill="#6f9f57"/><path d="M126 60Q68 32 40 81Q9 144 65 181Q95 200 126 187Q161 199 191 173Q228 123 199 82Q176 43 126 60Z" fill="#ee9b48"/><ellipse cx="126" cy="126" rx="43" ry="64" fill="#f7b15b"/><path d="M88 70Q62 123 88 179M164 70Q190 123 164 179" fill="none" stroke="#ce7d38"/><circle cx="106" cy="118" r="5"/><circle cx="145" cy="118" r="5"/><path d="M110 141Q126 159 143 141" fill="none"/>'},
    {id:'hat',label:'magic hat',spoken:'Magic hat',art:'<path d="M57 168L105 32Q134 20 168 34L146 62L188 170Z" fill="#9b88c5"/><path d="M68 135L176 134L186 165H57Z" fill="#efb25e"/><ellipse cx="124" cy="177" rx="103" ry="21" fill="#9b88c5"/><path d="M117 70L123 85L140 86L127 96L131 112L117 103L103 112L108 96L95 86L112 85Z" fill="#f9d873"/><path d="M194 52V77M182 64H206M49 58V75M41 67H57" stroke="#d7ac47" fill="none"/>'},
    {id:'candy',label:'candy',spoken:'Candy',art:'<g transform="rotate(-18 125 118)"><path d="M80 93L28 72L36 118L28 163L80 142M170 93L222 72L214 118L222 163L170 142" fill="#aa98d1"/><rect x="70" y="79" width="110" height="78" rx="26" fill="#f0a0af"/><path d="M98 81L121 155M130 81L153 155" stroke="#fff3db" stroke-width="12"/><path d="M68 103L52 111M68 136L52 129M182 103L198 111M182 136L198 129" fill="none"/></g>'},
    {id:'trick',label:'Trick or treat!',spoken:'Trick or treat!',art:'<path d="M145 36H226V198H145Z" fill="#ddb58b"/><path d="M157 49H214V198H157Z" fill="#b7d3bb"/><circle cx="201" cy="124" r="4" fill="#654a3f"/><circle cx="78" cy="87" r="24" fill="#efc29b"/><path d="M48 70L77 27L105 70Z" fill="#a18ac7"/><path d="M39 71Q77 56 115 71" fill="none" stroke="#a18ac7" stroke-width="10"/><path d="M62 111L43 170H113L96 111Z" fill="#a18ac7"/><path d="M96 119L136 100" fill="none" stroke="#efc29b" stroke-width="12"/><path d="M62 171V197M96 171V197" stroke="#6d648c" stroke-width="10"/><path d="M24 143H49L55 178H19Z" fill="#f1ab53"/><path d="M28 143V136Q36 126 45 136V143" fill="none"/><circle cx="71" cy="86" r="3"/><circle cx="86" cy="86" r="3"/><path d="M73 98Q79 103 85 98M130 75L136 71M132 88H140" fill="none"/>'}
  ];
  const $=id=>document.getElementById(id);
  const shuffle=input=>{const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const svg=item=>`<svg viewBox="0 0 250 225" aria-hidden="true" focusable="false"><g stroke="#554b59" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="#554b59">${item.art}</g></svg>`;
  const find=id=>items.find(item=>item.id===id);
  let deck=[],index=0,solved=false,generation=0;
  function stopAudio(){generation++;if('speechSynthesis' in window)window.speechSynthesis.cancel();}
  function say(item){
    stopAudio();$('party-audio-status').textContent='';
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){$('party-audio-status').textContent='Audio is unavailable. Ask a grown-up to use “Show me a clue” and say the word or phrase.';return;}
    const current=generation;const speech=new SpeechSynthesisUtterance(item.spoken);speech.lang='en-GB';speech.rate=.8;
    const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));if(voice)speech.voice=voice;
    speech.onerror=e=>{if(current===generation&&e.error!=='canceled'&&e.error!=='interrupted')$('party-audio-status').textContent='Audio could not play. Ask a grown-up to use the clue and say it together.';};window.speechSynthesis.speak(speech);
  }
  function practiceCards(){return items.map(item=>`<button type="button" data-hear="${item.id}">${svg(item)}<span>${item.label}</span><small>🔊 Listen</small></button>`).join('');}
  $('party-practice').innerHTML=practiceCards();$('party-review').innerHTML=practiceCards();
  ['party-practice','party-review'].forEach(id=>$(id).addEventListener('click',e=>{const b=e.target.closest('[data-hear]');if(b)say(find(b.dataset.hear));}));
  function show(id){['party-menu','party-play','party-finish'].forEach(s=>$(s).hidden=s!==id);}
  function treats(n){$('treat-count').textContent=`${n} of 8 treats collected`;$('party-treats').innerHTML=deck.map((_,i)=>`<span class="${i<n?'collected':''}">🍬</span>`).join('');}
  function start(){const first=shuffle(items),second=shuffle(items);if(first.at(-1).id===second[0].id)[second[0],second[1]]=[second[1],second[0]];deck=[...first,...second];index=0;show('party-play');round();}
  function round(){
    solved=false;const target=deck[index];const choices=shuffle([target,...shuffle(items.filter(item=>item.id!==target.id)).slice(0,2)]);
    $('party-round').textContent=`Round ${index+1} of 8`;$('party-progress').value=index;$('party-feedback').textContent='';$('party-next').hidden=true;$('party-hint').hidden=false;
    $('party-choices').innerHTML=choices.map(item=>`<button type="button" data-choice="${item.id}" aria-label="${item.label}">${svg(item)}<span class="choice-label" hidden>${item.label}</span></button>`).join('');
    treats(index);$('party-listen').focus();say(target);
  }
  $('party-start').addEventListener('click',start);$('party-replay').addEventListener('click',start);
  $('party-listen').addEventListener('click',()=>say(deck[index]));
  $('party-menu-button').addEventListener('click',()=>{stopAudio();show('party-menu');$('party-audio-status').textContent='';$('party-start').focus();});
  $('party-hint').addEventListener('click',()=>{if(solved)return;const b=$('party-choices').querySelector(`[data-choice="${deck[index].id}"]`);b.classList.add('clue');b.querySelector('.choice-label').hidden=false;$('party-feedback').textContent=`Look for ${deck[index].label}. Say it together!`;});
  $('party-choices').addEventListener('click',e=>{
    const b=e.target.closest('[data-choice]');if(!b||solved||b.disabled)return;
    if(b.dataset.choice!==deck[index].id){b.disabled=true;b.classList.add('try-again');$('party-feedback').textContent='Have another look. Listen and try again!';say(deck[index]);return;}
    stopAudio();solved=true;b.classList.remove('clue');b.classList.add('correct');b.querySelector('.choice-label').hidden=false;$('party-choices').querySelectorAll('button').forEach(button=>button.disabled=true);
    $('party-feedback').textContent=`Yes! ${deck[index].label} — a treat for your bag!`;$('party-progress').value=index+1;treats(index+1);$('party-hint').hidden=true;$('party-next').hidden=false;$('party-next').textContent=index===7?'Open my treat bag!':'Next picture →';$('party-next').focus();
  });
  $('party-next').addEventListener('click',()=>{if(!solved)return;stopAudio();index++;if(index<deck.length){round();return;}show('party-finish');$('party-audio-status').textContent='';$('party-replay').focus();});
  window.addEventListener('pagehide',stopAudio);
})();
