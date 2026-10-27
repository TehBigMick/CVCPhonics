/* Colour is applied only to the object's paintable SVG shapes. */
(() => {
  'use strict';
  const colours = { red: '#ed3b3b', yellow: '#ffdf24', blue: '#327be8', green: '#2fa951' };
  const palette = [...document.querySelectorAll('[data-colour]')];
  const objects = [...document.querySelectorAll('[data-object]')];
  const feedback = document.getElementById('colour-feedback');
  const selectedLabel = document.getElementById('selected-colour');
  let selected = null;
  palette.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.colour;
    palette.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    selectedLabel.textContent = `${selected[0].toUpperCase() + selected.slice(1)} is ready! Tap a picture.`;
    feedback.textContent = `You chose ${selected}. What will you colour?`;
  }));
  objects.forEach(button => button.addEventListener('click', () => {
    if (!selected) {
      feedback.textContent = 'Choose a colour first, then tap a picture.';
      return;
    }
    const object = button.dataset.object;
    button.querySelectorAll('[data-paint]').forEach(shape => shape.setAttribute('fill', colours[selected]));
    button.classList.add('is-coloured');
    button.dataset.painted = selected;
    button.setAttribute('aria-label', `${selected[0].toUpperCase() + selected.slice(1)} ${object}. Tap to recolour.`);
    button.querySelector('[data-caption]').textContent = `${selected} ${object}`;
    feedback.textContent = `It is a ${selected} ${object}.`;
  }));
  document.getElementById('clear-colours').addEventListener('click', () => {
    selected = null;
    palette.forEach(b => b.setAttribute('aria-pressed', 'false'));
    objects.forEach(button => {
      button.querySelectorAll('[data-paint]').forEach(shape => shape.setAttribute('fill', '#ffffff'));
      button.classList.remove('is-coloured');
      delete button.dataset.painted;
      const object = button.dataset.object;
      button.setAttribute('aria-label', `${object[0].toUpperCase() + object.slice(1)}, uncoloured. Tap to colour.`);
      button.querySelector('[data-caption]').textContent = 'Tap to colour';
    });
    selectedLabel.textContent = 'Choose a colour to begin.';
    feedback.textContent = 'All clean! Choose a colour and start again.';
  });
})();
