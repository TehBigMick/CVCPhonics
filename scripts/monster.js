/* Original SVG artwork: each data-part group is one countable body part. */
(() => {
  'use strict';
  const parts = [
    { key: 'heads', one: 'head', max: 3, icon: '<circle cx="16" cy="16" r="12"/><circle cx="12" cy="14" r="2" fill="white"/><circle cx="20" cy="14" r="2" fill="white"/>' },
    { key: 'eyes', one: 'eye', max: 10, icon: '<ellipse cx="16" cy="16" rx="14" ry="10" fill="white"/><circle cx="16" cy="16" r="5"/>' },
    { key: 'arms', one: 'arm', max: 6, icon: '<path d="M7 5 Q5 25 26 24" fill="none" stroke-width="8"/>' },
    { key: 'hands', one: 'hand', max: 6, icon: '<path d="M10 27V12Q10 8 13 12V5Q15 1 17 5V12V4Q20 1 21 5V13V8Q25 5 25 10V22Q24 29 17 29Z"/>' },
    { key: 'legs', one: 'leg', max: 6, icon: '<path d="M13 4 L13 25 L23 25" fill="none" stroke-width="9"/>' },
    { key: 'feet', one: 'foot', max: 6, icon: '<path d="M8 7H19V18Q30 17 29 25Q28 29 5 27Z"/>' },
    { key: 'mouths', one: 'mouth', max: 3, icon: '<path d="M3 10H29Q27 29 16 28Q5 27 3 10" fill="#fc9b9a"/>' },
    { key: 'horns', one: 'horn', max: 6, icon: '<path d="M8 28Q7 15 24 3L25 28Z" fill="#f5cf63"/>' }
  ];
  const colours = [ ['Green', '#93c969'], ['Purple', '#b4a0e2'], ['Blue', '#7bc9e3'], ['Pink', '#f3a6ba'], ['Yellow', '#f6d963'], ['Orange', '#efa068'] ];
  const defaults = { heads: 1, eyes: 2, arms: 2, hands: 2, legs: 2, feet: 2, mouths: 1, horns: 2 };
  let counts = { ...defaults };
  let colourIndex = 0;
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const controls = document.getElementById('part-controls');
  const art = document.getElementById('monster-art');
  const summary = document.getElementById('monster-summary');
  const audioStatus = document.getElementById('audio-status');
  controls.innerHTML = parts.map(p => `<div class="part-row"><span class="part-name" id="label-${p.key}"><span class="part-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="#7aab62" stroke="#355a43" stroke-width="1.5" stroke-linejoin="round">${p.icon}</svg></span>${p.key[0].toUpperCase() + p.key.slice(1)}</span><button class="count-button" type="button" data-key="${p.key}" data-change="-1" aria-label="Remove one ${p.one}">−</button><output id="count-${p.key}" aria-labelledby="label-${p.key}"></output><button class="count-button" type="button" data-key="${p.key}" data-change="1" aria-label="Add one ${p.one}">+</button></div>`).join('');
  document.getElementById('colours').innerHTML = colours.map(([name, hex], i) => `<button type="button" class="colour-swatch" style="--swatch:${hex}" data-colour="${i}" aria-label="${name}" aria-pressed="false"></button>`).join('');
  const group = (part, shape) => `<g data-part="${part}">${shape}</g>`;
  const spaced = (n, min, max) => Array.from({length:n}, (_, i) => n === 1 ? (min + max) / 2 : min + (max - min) * i / (n - 1));
  const armPoint = i => ({ x: i % 2 ? 533 : 107, y: 310 + Math.floor(i / 2) * 58 });
  const footXs = n => spaced(n, 215, 425);
  function description() {
    return `My monster is ${colours[colourIndex][0].toLowerCase()}. ` + parts.map(p => `It has ${words[counts[p.key]]} ${counts[p.key] === 1 ? p.one : p.key}.`).join(' ');
  }
  function draw() {
    const skin = colours[colourIndex][1];
    const headXs = spaced(counts.heads, counts.heads === 3 ? 208 : 240, counts.heads === 3 ? 432 : 400);
    const headR = counts.heads === 3 ? 53 : counts.heads === 2 ? 64 : 83;
    const heads = headXs.map(x => ({ x, y: 198, r: headR }));
    // A headless monster wears facial features on its tummy.
    const faces = heads.length ? heads : [{ x:320, y:330, r:98 }];
    const faceSlot = (i, total, kind) => {
      const face = faces[i % faces.length];
      const local = Math.floor(i / faces.length);
      const localCount = Math.ceil((total - (i % faces.length)) / faces.length);
      if (kind === 'eyes') {
        const columns = Math.min(localCount, 4);
        const row = Math.floor(local / columns);
        const inRow = Math.min(columns, localCount - row * columns);
        return { x: face.x + (local % columns - (inRow - 1) / 2) * (face.r * 1.35 / Math.max(columns, 2)), y: face.y - 15 + row * 23, r: Math.min(17, face.r * .55 / columns) };
      }
      return { x: face.x + (local - (localCount - 1) / 2) * 40, y:face.y + face.r * .55 };
    };
    let svg = '<ellipse cx="320" cy="560" rx="188" ry="19" fill="#dfe6cb"/>';
    svg += `<g stroke="#355344" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="${skin}">`;
    footXs(counts.legs).forEach(x => { svg += group('legs', `<path d="M${x} 432 Q${x-10} 484 ${x} 525" fill="none" stroke="${skin}" stroke-width="28"/><path d="M${x-15} 463 L${x-14} 519 M${x+14} 463 L${x+14} 519" fill="none" stroke-width="3"/>`); });
    for(let i=0;i<counts.arms;i++) { const p=armPoint(i); const start=i%2?422:218; svg += group('arms', `<path d="M${start} ${305+Math.floor(i/2)*48} Q${p.x} ${p.y-35} ${p.x} ${p.y}" fill="none" stroke="#355344" stroke-width="29"/><path d="M${start} ${305+Math.floor(i/2)*48} Q${p.x} ${p.y-35} ${p.x} ${p.y}" fill="none" stroke="${skin}" stroke-width="23"/>`); }
    svg += '<path d="M218 286 Q194 301 203 390 Q200 466 320 469 Q440 466 437 390 Q446 301 422 286 Q320 246 218 286Z"/>';
    svg += '<ellipse cx="320" cy="384" rx="67" ry="57" fill="#fff" opacity=".2" stroke="none"/><g fill="#355344" opacity=".16" stroke="none"><circle cx="243" cy="343" r="10"/><circle cx="388" cy="400" r="13"/><circle cx="263" cy="421" r="7"/></g>';
    for(let i=0;i<counts.horns;i++) { const face=faces[i%faces.length]; const local=Math.floor(i/faces.length); const n=Math.ceil((counts.horns-i%faces.length)/faces.length); const x=face.x+(local-(n-1)/2)*(face.r*1.35/Math.max(n-1,1)); const y=heads.length?face.y-face.r+17:278; svg += group('horns', `<path d="M${x-10} ${y} Q${x-17} ${y-22} ${x+6} ${y-48} Q${x+2} ${y-20} ${x+12} ${y+2}Z" fill="#f9d570"/>`); }
    heads.forEach(p=>{ svg += group('heads', `<path d="M${p.x-12} ${p.y+p.r-8}V285H${p.x+12}V${p.y+p.r-8}Z"/><circle cx="${p.x}" cy="${p.y}" r="${p.r}"/>`); });
    for(let i=0;i<counts.eyes;i++) { const p=faceSlot(i,counts.eyes,'eyes'); svg+=group('eyes',`<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="#fffefa" stroke-width="2.5"/><circle cx="${p.x+2}" cy="${p.y+2}" r="${p.r*.43}" fill="#263e35" stroke="none"/><circle cx="${p.x+4}" cy="${p.y-1}" r="${p.r*.15}" fill="white" stroke="none"/>`); }
    for(let i=0;i<counts.mouths;i++) { const p=faceSlot(i,counts.mouths,'mouths'); svg+=group('mouths',`<path d="M${p.x-14} ${p.y-6} Q${p.x} ${p.y-2} ${p.x+14} ${p.y-6} Q${p.x+13} ${p.y+15} ${p.x} ${p.y+15} Q${p.x-13} ${p.y+15} ${p.x-14} ${p.y-6}Z" fill="#703c4d" stroke-width="2"/><path d="M${p.x-7} ${p.y-4}V${p.y+2}H${p.x+1}V${p.y-4}" fill="white" stroke="none"/>`); }
    for(let i=0;i<counts.hands;i++) { const p=armPoint(i); svg+=group('hands',`<g transform="translate(${p.x},${p.y+7}) scale(${i%2?-1:1},1)"><path d="M-12 5 L-22 -4 Q-29 -13 -22 -16 L-13 -10 L-15 -26 Q-15 -34 -9 -32 L-4 -15 L-3 -34 Q0 -41 5 -34 L6 -15 L13 -29 Q18 -33 21 -27 L15 -8 Q24 -18 28 -12 Q31 -6 18 7 Q8 24 -4 21Z" stroke-width="2.5"/></g>`); }
    footXs(counts.feet).forEach(x=>{svg+=group('feet',`<g transform="translate(${x} 0) scale(${counts.feet>4?.62:.85} 1) translate(${-x} 0)"><path d="M${x-14} 521 Q${x-22} 526 ${x-23} 543 Q${x-22} 551 ${x+24} 549 Q${x+39} 547 ${x+31} 535 Q${x+25} 527 ${x+13} 528 L${x+12} 521Z" stroke-width="3"/></g>`);});
    svg+='</g>';
    art.innerHTML=svg;
    document.getElementById('monster-description').textContent=description();
    summary.innerHTML='<span>My monster has </span>' + parts.map(p=>`<span class="sentence-chunk">${words[counts[p.key]]} ${counts[p.key]===1?p.one:p.key}</span>`).join(' · ');
    parts.forEach(p=>{
      document.getElementById(`count-${p.key}`).value=counts[p.key];
      controls.querySelector(`[data-key="${p.key}"][data-change="-1"]`).disabled=counts[p.key]===0;
      controls.querySelector(`[data-key="${p.key}"][data-change="1"]`).disabled=counts[p.key]===p.max;
    });
    document.querySelectorAll('[data-colour]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.colour)===colourIndex?'true':'false'));
  }
  function stopAudio() { if('speechSynthesis' in window) window.speechSynthesis.cancel(); audioStatus.textContent=''; }
  controls.addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(!b)return;const p=parts.find(p=>p.key===b.dataset.key);counts[p.key]=Math.max(0,Math.min(p.max,counts[p.key]+Number(b.dataset.change)));stopAudio();draw();});
  document.getElementById('colours').addEventListener('click',e=>{const b=e.target.closest('[data-colour]');if(b){colourIndex=Number(b.dataset.colour);stopAudio();draw();}});
  document.getElementById('reset-monster').addEventListener('click',()=>{counts={...defaults};colourIndex=0;stopAudio();draw();});
  document.getElementById('random-monster').addEventListener('click',()=>{parts.forEach(p=>{counts[p.key]=Math.floor(Math.random()*(p.max+1));});colourIndex=Math.floor(Math.random()*colours.length);stopAudio();draw();});
  document.getElementById('speak-monster').addEventListener('click',()=>{
    if(!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)){audioStatus.textContent='Speech is unavailable in this browser. Read the body-part counts together below.';return;}
    stopAudio();const speech=new SpeechSynthesisUtterance(description());speech.lang='en-GB';speech.rate=.8;
    const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='en-GB');if(voice)speech.voice=voice;
    speech.onerror=()=>{audioStatus.textContent='Audio could not play. Try again, or read the counts together below.';};window.speechSynthesis.speak(speech);
  });
  window.addEventListener('pagehide',stopAudio);
  draw();
})();
