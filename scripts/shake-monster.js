/* Explicit SVG joint groups let hands/feet move independently of arms/legs. */
(() => {
  'use strict';
  const actions = ['arms', 'feet', 'legs', 'hands', 'head', 'body'];
  const duration = 4800;
  const $ = id => document.getElementById(id);
  const monster = $('shake-monster');
  const buttons = [...document.querySelectorAll('[data-action]')];
  let timer = null;
  let playingAll = false;
  let speechGeneration = 0;
  function cancelSpeech() {
    speechGeneration++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  function say(instruction) {
    cancelSpeech();
    $('shake-audio-status').textContent = '';
    if (!$('shake-voice').checked) return;
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      $('shake-audio-status').textContent = 'Voice is unavailable in this browser. Say the instruction together — the monster can still move!';
      return;
    }
    const generation = speechGeneration;
    const speech = new SpeechSynthesisUtterance(instruction);
    speech.lang = 'en-GB';
    speech.rate = .85;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
    if (voice) speech.voice = voice;
    speech.onerror = e => {
      if (generation === speechGeneration && e.error !== 'canceled' && e.error !== 'interrupted') {
        $('shake-audio-status').textContent = 'Voice could not play. Say the instruction together and copy the monster.';
      }
    };
    window.speechSynthesis.speak(speech);
  }
  function clearTimer() { clearTimeout(timer); timer = null; }
  function stop() {
    clearTimer();
    cancelSpeech();
    playingAll = false;
    monster.removeAttribute('data-move');
    buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
    $('shake-play-all').setAttribute('aria-pressed', 'false');
    $('shake-caption').textContent = 'Ready to shake?';
    $('shake-description').textContent = 'A green monster waiting for an action.';
    $('shake-audio-status').textContent = '';
  }
  function move(action) {
    monster.setAttribute('data-move', action);
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.action === action)));
    const instruction = `Shake your ${action}!`;
    $('shake-caption').textContent = instruction;
    $('shake-description').textContent = `The monster is shaking its ${action}.`;
    say(instruction);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    stop();
    move(button.dataset.action);
    timer = setTimeout(stop, duration);
  }));
  $('shake-play-all').addEventListener('click', () => {
    stop();
    playingAll = true;
    $('shake-play-all').setAttribute('aria-pressed', 'true');
    let step = 0;
    function next() {
      if (!playingAll) return;
      if (step === actions.length) { stop(); return; }
      move(actions[step++]);
      timer = setTimeout(next, duration);
    }
    next();
  });
  $('shake-stop').addEventListener('click', stop);
  $('shake-voice').addEventListener('change', () => {
    cancelSpeech();
    $('shake-audio-status').textContent = '';
  });
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
