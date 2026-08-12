import { AGE_SETS, CATEGORY_DETAILS } from './development-data.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const RESPONSE_DETAILS = {
  yes: { label: 'Yes', className: 'yes' },
  sometimes: { label: 'Sometimes', className: 'sometimes' },
  notYet: { label: 'Not yet', className: 'not-yet' }
};

const state = {
  profile: null,
  ageSet: null,
  responses: [],
  questionIndex: 0,
  skillLoss: '',
  notes: ''
};

const intro = document.getElementById('development-intro');
const information = document.getElementById('development-information');
const setupPanel = document.getElementById('setup-panel');
const questionPanel = document.getElementById('question-panel');
const concernPanel = document.getElementById('concern-panel');
const resultPanel = document.getElementById('result-panel');
const panels = { setup: setupPanel, question: questionPanel, concern: concernPanel, result: resultPanel };

const setupForm = document.getElementById('setup-form');
const childNameInput = document.getElementById('child-name');
const observerRoleInput = document.getElementById('observer-role');
const birthDateInput = document.getElementById('birth-date');
const bornEarlyInput = document.getElementById('born-early');
const weeksEarlyField = document.getElementById('weeks-early-field');
const weeksEarlyInput = document.getElementById('weeks-early');
const setupError = document.getElementById('setup-error');

const ageSetLabel = document.getElementById('age-set-label');
const questionCount = document.getElementById('question-count');
const questionProgress = document.getElementById('question-progress');
const categoryBadge = document.getElementById('category-badge');
const categoryIcon = document.getElementById('category-icon');
const categoryLabel = document.getElementById('category-label');
const questionText = document.getElementById('question-text');
const questionDirection = document.getElementById('question-direction');
const responseButtons = [...document.querySelectorAll('[data-response]')];
const previousQuestionButton = document.getElementById('previous-question');
const questionExitButton = document.getElementById('question-exit');

const concernForm = document.getElementById('concern-form');
const concernNotes = document.getElementById('concern-notes');
const concernError = document.getElementById('concern-error');
const backToQuestionsButton = document.getElementById('back-to-questions');

const resultMeta = document.getElementById('result-meta');
const resultNotice = document.getElementById('result-notice');
const responseOverview = document.getElementById('response-overview');
const categorySummary = document.getElementById('category-summary');
const followUpSection = document.getElementById('follow-up-section');
const followUpItems = document.getElementById('follow-up-items');
const notesSummary = document.getElementById('notes-summary');
const printSummaryButton = document.getElementById('print-summary');
const editSummaryButton = document.getElementById('edit-summary');
const newCheckInButton = document.getElementById('new-check-in');

birthDateInput.max = localDateValue(new Date());

bornEarlyInput.addEventListener('change', () => {
  weeksEarlyField.hidden = !bornEarlyInput.checked;
  weeksEarlyInput.required = bornEarlyInput.checked;
  if (bornEarlyInput.checked) weeksEarlyInput.focus();
  else weeksEarlyInput.value = '';
});

setupForm.addEventListener('submit', event => {
  event.preventDefault();
  const profile = buildProfile();
  if (!profile) return;

  state.profile = profile;
  state.ageSet = selectAgeSet(profile.adjustedAge.completeMonths);
  state.responses = Array(state.ageSet.questions.length).fill(null);
  state.questionIndex = 0;
  state.skillLoss = '';
  state.notes = '';

  document.body.classList.add('check-in-active');
  renderQuestion();
  showPanel('question');
});

responseButtons.forEach(button => {
  button.addEventListener('click', () => {
    state.responses[state.questionIndex] = button.dataset.response;
    if (state.questionIndex === state.ageSet.questions.length - 1) {
      showConcernPanel();
      return;
    }

    state.questionIndex += 1;
    renderQuestion();
  });
});

previousQuestionButton.addEventListener('click', () => {
  if (state.questionIndex === 0) return;
  state.questionIndex -= 1;
  renderQuestion();
});

questionExitButton.addEventListener('click', () => {
  const hasAnswers = state.responses.some(Boolean);
  if (hasAnswers && !window.confirm('Change the child’s details and restart this check-in? Your current answers will be cleared.')) return;
  resetToSetup();
});

backToQuestionsButton.addEventListener('click', () => {
  state.questionIndex = state.ageSet.questions.length - 1;
  showPanel('question');
  renderQuestion();
});

concernForm.addEventListener('submit', event => {
  event.preventDefault();
  const selectedLoss = concernForm.querySelector('input[name="skillLoss"]:checked');
  if (!selectedLoss) {
    showError(concernError, 'Please choose an answer about whether the child has lost a skill.');
    return;
  }

  concernError.hidden = true;
  state.skillLoss = selectedLoss.value;
  state.notes = concernNotes.value.trim();
  buildSummary();
  showPanel('result');
});

printSummaryButton.addEventListener('click', () => window.print());

editSummaryButton.addEventListener('click', () => {
  state.questionIndex = state.ageSet.questions.length - 1;
  showPanel('question');
  renderQuestion();
});

newCheckInButton.addEventListener('click', resetToSetup);

function buildProfile() {
  setupError.hidden = true;
  const birthDate = parseDateInput(birthDateInput.value);
  const today = todayUtc();

  if (!birthDate) {
    showError(setupError, 'Please enter the child’s date of birth.');
    return null;
  }

  if (birthDate > today) {
    showError(setupError, 'The date of birth cannot be in the future.');
    return null;
  }

  const chronologicalAge = calendarAge(birthDate, today);
  if (chronologicalAge.completeMonths >= 72) {
    showError(setupError, 'This check-in covers children from 2 months until their sixth birthday.');
    return null;
  }

  let weeksEarly = 0;
  let adjustedBirthDate = birthDate;
  let adjustmentApplied = false;

  if (bornEarlyInput.checked) {
    weeksEarly = Number(weeksEarlyInput.value);
    if (!Number.isInteger(weeksEarly) || weeksEarly < 3 || weeksEarly > 16) {
      showError(setupError, 'Enter the number of weeks early, from 3 to 16.');
      return null;
    }

    if (chronologicalAge.completeMonths < 24) {
      adjustedBirthDate = new Date(birthDate.getTime() + weeksEarly * 7 * DAY_MS);
      adjustmentApplied = true;
    }
  }

  const adjustedAge = calendarAge(adjustedBirthDate, today);
  if (adjustedAge.completeMonths < 2) {
    const reason = adjustmentApplied ? 'adjusted age' : 'age';
    showError(setupError, `The child’s ${reason} is under 2 months. Return when they reach 2 months for the first check-in.`);
    return null;
  }

  return {
    childName: childNameInput.value.trim(),
    observerRole: observerRoleInput.value,
    birthDate,
    today,
    chronologicalAge,
    adjustedAge,
    weeksEarly,
    adjustmentApplied
  };
}

function selectAgeSet(completeMonths) {
  return [...AGE_SETS].reverse().find(set => completeMonths >= set.months) || AGE_SETS[0];
}

function renderQuestion() {
  const question = state.ageSet.questions[state.questionIndex];
  const category = CATEGORY_DETAILS[question.category];
  const savedResponse = state.responses[state.questionIndex];

  ageSetLabel.textContent = state.ageSet.label;
  questionCount.textContent = `${state.questionIndex + 1} of ${state.ageSet.questions.length}`;
  questionProgress.style.width = `${((state.questionIndex + 1) / state.ageSet.questions.length) * 100}%`;
  categoryIcon.textContent = category.icon;
  categoryLabel.textContent = category.label;
  categoryBadge.className = `category-badge category-${question.category}`;
  questionText.textContent = question.prompt;
  questionDirection.innerHTML = `<span aria-hidden="true">Try it</span><p>${escapeHtml(question.direction)}</p>`;
  previousQuestionButton.disabled = state.questionIndex === 0;

  responseButtons.forEach(button => {
    const selected = button.dataset.response === savedResponse;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  questionText.tabIndex = -1;
  questionText.focus({ preventScroll: true });
  questionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showConcernPanel() {
  if (state.skillLoss) {
    const savedLoss = concernForm.querySelector(`input[name="skillLoss"][value="${state.skillLoss}"]`);
    if (savedLoss) savedLoss.checked = true;
  }
  concernNotes.value = state.notes;
  showPanel('concern');
}

function buildSummary() {
  const counts = responseCounts(state.responses);
  const followUps = state.ageSet.questions
    .map((question, index) => ({ ...question, response: state.responses[index] }))
    .filter(item => item.response === 'notYet');
  const name = state.profile.childName || 'Child';
  const ageText = formatAge(state.profile.chronologicalAge);
  const adjustedText = state.profile.adjustmentApplied
    ? ` · adjusted age ${formatAge(state.profile.adjustedAge)}`
    : '';
  const roleText = state.profile.observerRole ? ` · ${state.profile.observerRole}` : '';

  resultMeta.textContent = `${name} · ${ageText}${adjustedText} · ${state.ageSet.label}${roleText} · ${formatDisplayDate(state.profile.today)}`;
  renderGuidance(followUps.length);

  responseOverview.innerHTML = Object.entries(RESPONSE_DETAILS).map(([key, detail]) => `
    <div class="overview-card overview-${detail.className}">
      <strong>${counts[key]}</strong>
      <span>${detail.label}</span>
    </div>
  `).join('');

  categorySummary.innerHTML = Object.entries(CATEGORY_DETAILS).map(([categoryKey, category]) => {
    const categoryResponses = state.ageSet.questions
      .map((question, index) => question.category === categoryKey ? state.responses[index] : null)
      .filter(Boolean);
    const categoryCounts = responseCounts(categoryResponses);
    const positiveWidth = ((categoryCounts.yes + categoryCounts.sometimes) / categoryResponses.length) * 100;

    return `
      <article class="category-result category-result-${categoryKey}">
        <div class="category-result-heading">
          <span aria-hidden="true">${category.icon}</span>
          <div><strong>${category.label}</strong><small>${categoryCounts.yes} yes · ${categoryCounts.sometimes} sometimes · ${categoryCounts.notYet} not yet</small></div>
        </div>
        <div class="category-result-bar" aria-hidden="true"><span style="width: ${positiveWidth}%"></span></div>
      </article>
    `;
  }).join('');

  if (followUps.length === 0) {
    followUpSection.hidden = false;
    followUpItems.innerHTML = '<div class="no-follow-ups"><strong>No items were marked “Not yet”.</strong><p>Continue to notice new skills. Any concern is still worth discussing, regardless of these answers.</p></div>';
  } else {
    followUpSection.hidden = false;
    followUpItems.innerHTML = followUps.map(item => {
      const category = CATEGORY_DETAILS[item.category];
      const response = RESPONSE_DETAILS[item.response];
      return `
        <article class="follow-up-item">
          <div><span class="follow-up-category">${category.label}</span><span class="follow-up-response ${response.className}">${response.label}</span></div>
          <p>${escapeHtml(item.prompt)}</p>
        </article>
      `;
    }).join('');
  }

  notesSummary.hidden = false;
  notesSummary.innerHTML = `
    <div><strong>Loss of a previously used skill</strong><span>${skillLossLabel(state.skillLoss)}</span></div>
    ${state.notes ? `<div><strong>Notes and concerns</strong><p>${escapeHtml(state.notes).replace(/\n/g, '<br>')}</p></div>` : ''}
  `;
}

function renderGuidance(followUpCount) {
  if (state.skillLoss === 'yes') {
    resultNotice.className = 'result-guidance guidance-attention';
    resultNotice.innerHTML = '<span aria-hidden="true">!</span><div><strong>A loss of a previously used skill was noted.</strong><p>Contact the child’s health professional promptly and describe what changed and when. Do not wait for another check-in.</p></div>';
    return;
  }

  if (state.skillLoss === 'notSure' || followUpCount > 0) {
    resultNotice.className = 'result-guidance guidance-discuss';
    resultNotice.innerHTML = `<span aria-hidden="true">→</span><div><strong>Use this summary to guide your next conversation.</strong><p>${followUpCount} item${followUpCount === 1 ? ' was' : 's were'} marked “Not yet”. Try them during ordinary routines and discuss any concern with a teacher or health professional.</p></div>`;
    return;
  }

  resultNotice.className = 'result-guidance guidance-continue';
  resultNotice.innerHTML = '<span aria-hidden="true">✓</span><div><strong>Keep noticing, talking and playing.</strong><p>No items were marked “Not yet”. This is not a clinical result, so raise any concern even when the summary looks positive.</p></div>';
}

function responseCounts(responses) {
  return responses.reduce((counts, response) => {
    if (response) counts[response] += 1;
    return counts;
  }, { yes: 0, sometimes: 0, notYet: 0 });
}

function showPanel(name) {
  Object.entries(panels).forEach(([panelName, panel]) => {
    panel.hidden = panelName !== name;
  });

  if (name !== 'setup') {
    intro.hidden = true;
    information.hidden = true;
  }

  panels[name].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetToSetup() {
  state.profile = null;
  state.ageSet = null;
  state.responses = [];
  state.questionIndex = 0;
  state.skillLoss = '';
  state.notes = '';
  setupForm.reset();
  concernForm.reset();
  weeksEarlyField.hidden = true;
  weeksEarlyInput.required = false;
  setupError.hidden = true;
  concernError.hidden = true;
  intro.hidden = false;
  information.hidden = false;
  document.body.classList.remove('check-in-active');
  showPanel('setup');
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
  element.focus?.();
}

function parseDateInput(value) {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  if (date.getUTCFullYear() !== parts[0] || date.getUTCMonth() !== parts[1] - 1 || date.getUTCDate() !== parts[2]) return null;
  return date;
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function calendarAge(birthDate, asOfDate) {
  let completeMonths = (asOfDate.getUTCFullYear() - birthDate.getUTCFullYear()) * 12
    + asOfDate.getUTCMonth() - birthDate.getUTCMonth();
  let anchor = addCalendarMonths(birthDate, completeMonths);

  if (anchor > asOfDate) {
    completeMonths -= 1;
    anchor = addCalendarMonths(birthDate, completeMonths);
  }

  return {
    completeMonths,
    days: Math.floor((asOfDate - anchor) / DAY_MS),
    totalDays: Math.floor((asOfDate - birthDate) / DAY_MS)
  };
}

function addCalendarMonths(date, months) {
  const monthIndex = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)));
}

function formatAge(age) {
  if (age.completeMonths < 24) return `${age.completeMonths} month${age.completeMonths === 1 ? '' : 's'}, ${age.days} day${age.days === 1 ? '' : 's'}`;
  const years = Math.floor(age.completeMonths / 12);
  const months = age.completeMonths % 12;
  return months ? `${years} year${years === 1 ? '' : 's'}, ${months} month${months === 1 ? '' : 's'}` : `${years} year${years === 1 ? '' : 's'}`;
}

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function skillLossLabel(value) {
  if (value === 'yes') return 'Yes — discuss promptly with a health professional';
  if (value === 'notSure') return 'Not sure — discuss the observation';
  return 'No';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
