/* Ten regular short-i CVC words. Original SVG pictures are shown only after a reading attempt. */
(() => {
  'use strict';
  const pictures = {
    sit: '<path d="M116 87V150H65V177M116 150V177" fill="none" stroke="#b27c4b" stroke-width="12"/><circle cx="82" cy="48" r="20" fill="#f1bd8e"/><path d="M83 76V119H48V164" fill="none" stroke="#5197cf" stroke-width="19"/><path d="M83 83L106 108" fill="none" stroke="#f1bd8e" stroke-width="12"/>',
    pin: '<g transform="rotate(30 100 100)"><path d="M100 90V176" stroke="#7e939e" stroke-width="9"/><path d="M74 35H126L116 66L134 93H66L84 66Z" fill="#ed7c83"/></g>',
    pig: '<ellipse cx="104" cy="110" rx="59" ry="44" fill="#f5a7b6"/><path d="M63 91L48 56L80 76M127 77L150 56L149 101" fill="#f5a7b6"/><ellipse cx="108" cy="117" rx="28" ry="20" fill="#e986a0"/><circle cx="98" cy="117" r="4" fill="#623d52"/><circle cx="118" cy="117" r="4" fill="#623d52"/><circle cx="77" cy="94" r="5"/><circle cx="132" cy="94" r="5"/><path d="M65 145V165M137 144V165" stroke="#f5a7b6" stroke-width="15"/><path d="M44 107Q18 85 24 110Q29 122 36 105" fill="none"/>',
    dig: '<path d="M20 154Q63 126 96 153Q130 130 180 153V180H20Z" fill="#bd956c"/><path d="M132 36L82 137" stroke="#ba8053" stroke-width="12"/><path d="M113 26L147 43L137 62L103 45Z" fill="none" stroke="#6b8991" stroke-width="8"/><path d="M69 111L101 128L82 160Q52 161 56 143Z" fill="#a9c9ce"/><path d="M108 149L117 139M138 147L146 140M45 144L39 134" stroke="#866247" stroke-width="5"/>',
    bin: '<path d="M55 61H145L135 171H65Z" fill="#7eb9a5"/><path d="M46 49H154V65H46Z" fill="#548878"/><path d="M81 46V32H119V46M83 85V148M116 85V148" fill="none" stroke="#3b7261" stroke-width="8"/>',
    lid: '<path d="M57 126V163Q100 187 143 163V126" fill="#b7c5ca" opacity=".45" stroke-dasharray="6 6"/><path d="M35 96Q100 13 165 96Z" fill="#8ec9d9"/><path d="M33 97H167" stroke-width="9"/><path d="M85 47V32Q100 22 115 32V47" fill="none" stroke-width="9"/><path d="M158 30L142 51M142 39V51H154" fill="none" stroke="#ec8a69" stroke-width="7"/>',
    fin: '<path d="M65 137Q93 96 97 35Q149 63 143 137Z" fill="#8eaab6"/><path d="M17 145Q38 126 59 145T101 145T143 145T185 145M17 171Q38 152 59 171T101 171T143 171T185 171" fill="none" stroke="#75bdd8" stroke-width="9"/>',
    lip: '<path d="M26 103Q58 75 80 73Q92 76 100 85Q109 76 120 73Q145 76 174 103Q149 148 101 150Q53 148 26 103Z" fill="#ec8c9b"/><path d="M28 103Q64 111 99 104Q137 111 172 103" fill="none"/><path d="M73 133Q96 140 118 134" stroke="#f8c6c9" stroke-width="6" fill="none"/>',
    zip: '<path d="M56 26H144V179H56Z" fill="#b7d9ea"/><path d="M91 27V177M109 27V177" fill="none" stroke="#5c6e80" stroke-width="7" stroke-dasharray="8 5"/><path d="M85 90H115V119H85Z" fill="#f5cd6c"/><path d="M93 115H107V145H93Z" fill="#f5cd6c"/>',
    wig: '<path d="M70 135L66 173H134L130 135" fill="#b8c7d1"/><ellipse cx="100" cy="100" rx="41" ry="49" fill="#e5ded4"/><path d="M51 131Q25 110 42 79Q31 57 58 44Q61 17 91 30Q113 11 136 34Q166 32 164 64Q186 84 164 106Q178 142 141 145L136 78Q108 84 91 60Q86 81 62 83L61 144Z" fill="#a681bf"/><path d="M71 173H129" stroke-width="9"/>'
  };
  const first = ['sit', 'pin', 'pig', 'dig', 'bin', 'lid'];
  const all = [...first, 'fin', 'lip', 'zip', 'wig'];
  const $ = id => document.getElementById(id);
  const shuffle = list => { const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
  let deck=[], selectedSet='first', index=0, solved=false, revealed=false, tricky=new Set(), guideTimer=null;
  const svg = word => `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><g stroke="#38544f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="#38544f">${pictures[word]}</g></svg>`;
  function stopAudio(){if('speechSynthesis' in window)window.speechSynthesis.cancel();$('quest-audio-status').textContent='';}
  function stopGuide(){clearInterval(guideTimer);guideTimer=null;$('blend-guide').disabled=false;$('word-tiles').classList.remove('blended');$('word-tiles').querySelectorAll('span').forEach(t=>t.classList.remove('sound-active'));}
  function show(section){['quest-menu','quest-play','quest-finish'].forEach(id=>$(id).hidden=id!==section);}
  function start(words){stopAudio();stopGuide();deck=[...words];index=0;tricky=new Set();show('quest-play');round();}
  function round(){
    stopGuide();stopAudio();solved=false;revealed=false;
    const word=deck[index];
    $('round-label').textContent=`Word ${index+1} of ${deck.length}`;
    $('quest-progress').max=deck.length;$('quest-progress').value=index;
    $('word-tiles').innerHTML=[...word].map((letter,i)=>`<span class="${i===1?'short-vowel':''}" aria-hidden="true">${letter}<i></i></span>`).join('');
    $('word-tiles').setAttribute('aria-label',`Read the word: ${word}`);
    $('reading-prompt').textContent='Can you read this word?';
    $('picture-choices').innerHTML='';$('picture-choices').hidden=true;$('reveal-pictures').hidden=false;$('next-word').hidden=true;$('quest-feedback').textContent='';
    $('blend-guide').focus();
  }
  document.querySelectorAll('[data-set]').forEach(b=>b.addEventListener('click',()=>{selectedSet=b.dataset.set;start(selectedSet==='first'?first:all);}));
  function menu(){stopGuide();stopAudio();show('quest-menu');document.querySelector('[data-set="first"]').focus();}
  $('change-set').addEventListener('click',menu);$('finish-menu').addEventListener('click',menu);
  $('blend-guide').addEventListener('click',()=>{
    stopGuide();let step=0;$('blend-guide').disabled=true;
    const tiles=[...$('word-tiles').querySelectorAll('span')];
    function tick(){tiles.forEach((t,i)=>t.classList.toggle('sound-active',i===step));if(step===3){$('word-tiles').classList.add('blended');}if(step===4){stopGuide();return;}step++;}
    tick();guideTimer=setInterval(tick,650);
  });
  $('hear-word').addEventListener('click',()=>{
    if(!solved)tricky.add(deck[index]);stopAudio();
    if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){$('quest-audio-status').textContent='Audio is unavailable. Ask a grown-up to model this word.';return;}
    const speech=new SpeechSynthesisUtterance(deck[index]);speech.lang='en-GB';speech.rate=.75;
    const voice=window.speechSynthesis.getVoices().find(v=>v.lang==='en-GB');if(voice)speech.voice=voice;
    speech.onerror=()=>{$('quest-audio-status').textContent='Audio could not play. Ask a grown-up to model this word.';};window.speechSynthesis.speak(speech);
  });
  $('reveal-pictures').addEventListener('click',()=>{
    if(revealed)return;revealed=true;const word=deck[index];
    const choices=shuffle([word,...shuffle(all.filter(w=>w!==word)).slice(0,2)]);
    $('picture-choices').innerHTML=choices.map((w,i)=>`<button type="button" class="picture-choice" data-word="${w}" aria-label="Picture ${i+1}: ${w}">${svg(w)}<span class="picture-caption" hidden>${w}</span></button>`).join('');
    $('picture-choices').hidden=false;$('reveal-pictures').hidden=true;$('reading-prompt').textContent='Which picture matches the word?';$('picture-choices').querySelector('button').focus();
  });
  $('picture-choices').addEventListener('click',e=>{
    const b=e.target.closest('[data-word]');if(!b||solved)return;
    if(b.dataset.word!==deck[index]){tricky.add(deck[index]);b.classList.add('try-again');b.disabled=true;$('quest-feedback').textContent='Have another look. Say the sounds and blend them together.';return;}
    solved=true;stopGuide();b.classList.add('correct');b.querySelector('.picture-caption').hidden=false;
    $('picture-choices').querySelectorAll('button').forEach(button=>button.disabled=true);
    $('quest-feedback').textContent=`Yes! ${deck[index]} — you matched the word!`;$('quest-progress').value=index+1;$('next-word').hidden=false;$('next-word').textContent=index===deck.length-1?'See my words ★':'Next word →';$('next-word').focus();
  });
  $('next-word').addEventListener('click',()=>{
    if(!solved)return;stopAudio();index++;if(index<deck.length){round();return;}
    show('quest-finish');$('finish-summary').textContent=`You matched ${deck.length} short-i words. Well done for reading and trying!`;
    $('finished-words').innerHTML=deck.map(w=>`<span>${w}</span>`).join('');$('practise-words').hidden=tricky.size===0;$('play-again').focus();
  });
  $('play-again').addEventListener('click',()=>start(shuffle(selectedSet==='first'?first:all)));
  $('practise-words').addEventListener('click',()=>start(shuffle([...tricky])));
  window.addEventListener('pagehide',()=>{stopAudio();stopGuide();});
})();
