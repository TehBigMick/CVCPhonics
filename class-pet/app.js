import { levelProgress } from "./levels.js";
import { createPetPerformance } from "./performance.js";
import { avatars, frameSource } from "./avatars.js";
import { awardDaily, createRewards, undoDaily } from "./rewards.js";

const storageKey = "cvcphonics-class-pet-v1";
const defaults = () => ({
  selectedId: "first-class",
  classes: [{ id: "first-class", name: "Class 1", total: 0, lastAward: 0 }],
});
const byId = (id) => document.getElementById(id);
const select = byId("class-select");
const dialog = byId("class-dialog");
const className = byId("class-name");
const celebration = byId("celebration");
const habitat = byId("habitat");
const motionToggle = byId("motion-toggle");
const petJump = byId("pet-jump");
const pointSparkles = byId("point-sparkles");
const eggChoices = byId("egg-choices");
const eggLife = byId("egg-life");
const petTrack = byId("pet-track");
const awardButtons = [...document.querySelectorAll("[data-points]")];
const danceButton = byId("dance-button");
const petPerformance = createPetPerformance({
  habitat,
  pet: petJump,
  button: danceButton,
  audio: byId("dance-audio"),
  soundStatus: byId("sound-status"),
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const saveError = byId("save-error");
const number = new Intl.NumberFormat("en-GB");
let celebrationTimer;

function setMotion(enabled) {
  petJump.classList.remove("is-celebrating");
  habitat.dataset.motion = enabled ? "on" : "off";
  motionToggle.textContent = enabled ? "Pause motion" : "Play motion";
}

setMotion(!reducedMotion.matches);
motionToggle.hidden = false;
motionToggle.addEventListener("click", () => setMotion(habitat.dataset.motion !== "on"));
reducedMotion.addEventListener("change", (event) => setMotion(!event.matches));
pointSparkles.addEventListener("animationend", () => petJump.classList.remove("is-celebrating"));

function readState() {
  try {
    const saved = localStorage.getItem(storageKey);
    const result = saved ? JSON.parse(saved) : defaults();
    for (const group of result.classes) {
      // Classes with progress from before egg selection already had Pip.
      if (!group.egg && group.total > 0) group.egg = "green";
    }
    return result;
  } catch {
    saveError.hidden = false;
    return defaults();
  }
}

let state = readState();
const rewards = createRewards({
  getClass: currentClass,
  changeClass,
  performance: petPerformance,
  habitat,
  announcement: byId("announcement"),
});

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    saveError.hidden = true;
  } catch {
    saveError.hidden = false;
  }
}

function currentClass() {
  return state.classes.find((group) => group.id === state.selectedId) ?? state.classes[0];
}

function changeState(update) {
  function apply() {
    if (saveError.hidden) state = readState();
    const effect = update();
    if (effect === false) return false;
    saveState();
    renderClasses();
    render();
    if (typeof effect === "function") effect();
    return true;
  }
  return navigator.locks ? navigator.locks.request(storageKey, apply) : Promise.resolve(apply());
}

function changeClass(update) {
  const id = currentClass().id;
  return changeState(() => {
    const group = state.classes.find((item) => item.id === id);
    return group ? update(group) : false;
  });
}

function renderClasses() {
  select.replaceChildren(...state.classes.map((group) => new Option(group.name, group.id)));
  select.value = currentClass().id;
}

function render() {
  const group = currentClass();
  const egg = group.egg;
  const avatar = avatars[egg];
  const { level, towards, goal, stage } = levelProgress(group.total);
  const hatched = Boolean(avatar) && level >= 2;
  const phase = hatched ? "pet" : avatar ? "egg" : "choose";
  if (habitat.dataset.egg !== (egg ?? "")) {
    habitat.dataset.egg = egg ?? "";
    petPerformance.setAvatar(avatar);
    if (avatar) {
      for (const frame of petJump.querySelectorAll("[data-frame]")) {
        frame.src = frameSource(egg, frame.dataset.frame);
      }
      petJump.setAttribute("aria-label", avatar.name + ", " + avatar.animal);
      eggLife.setAttribute("aria-label", avatar.colour + " egg");
    }
  }
  if (phase !== "pet" && habitat.dataset.phase === "pet") petPerformance.stop();
  habitat.dataset.phase = phase;
  eggChoices.hidden = Boolean(avatar);
  eggLife.hidden = !avatar;
  eggLife.setAttribute("aria-hidden", String(hatched));
  petTrack.hidden = !hatched;
  for (const button of awardButtons) button.disabled = !avatar;
  byId("pet-name").textContent = hatched ? avatar.name : avatar ? avatar.colour + " egg" : "Choose an egg";
  byId("points-instructions").textContent = hatched
    ? "Count the class tokens and give " + avatar.name + " the points."
    : avatar ? "Earn points to hatch your class egg." : "Choose an egg to start earning points.";
  byId("level").textContent = number.format(level);
  byId("stage").textContent = hatched ? avatar.stages[stage - 1] : avatar ? "Hatches at 5 points" : "";
  byId("total").textContent = number.format(group.total);
  byId("undo").disabled = !group.lastAward;
  habitat.dataset.stage = stage;
  byId("unlocked").hidden = stage < 3;
  if (level < 2 && !danceButton.hidden) petPerformance.stop();
  danceButton.hidden = level < 2;
  byId("dance-hint").hidden = danceButton.hidden;
  byId("towards").textContent = number.format(towards);
  byId("goal").textContent = "/ " + number.format(goal) + " points";
  byId("progress").max = goal;
  byId("progress").value = towards;
  const remaining = goal - towards;
  byId("remaining").textContent = number.format(remaining) + (remaining === 1 ? " point to go" : " points to go");
  byId("next-level").textContent = "Level " + number.format(level + 1);
  rewards.refresh();
}

function hideCelebration() {
  clearTimeout(celebrationTimer);
  celebration.hidden = true;
  celebration.classList.remove("pop");
}

function celebratePoints() {
  petJump.classList.remove("is-celebrating");
  // Apply the removal before restarting so fast consecutive awards replay the jump.
  void petJump.offsetWidth;
  petJump.classList.add("is-celebrating");
}

function award(points) {
  changeClass((group) => {
    const avatar = avatars[group.egg];
    if (!avatar) return false;
    const previousLevel = levelProgress(group.total).level;
    group.total += points;
    group.lastAward = points;
    awardDaily(group, points);
    return () => {
      if (group.id === currentClass().id) animateAward(group, avatar, previousLevel);
    };
  });
}

function animateAward(group, avatar, previousLevel) {
  const { level, stage } = levelProgress(group.total);
  if (level > previousLevel) {
    const hatching = previousLevel === 1;
    petPerformance.play(hatching ? "hatch" : "level");
    hideCelebration();
    celebration.textContent = hatching ? "Meet " + avatar.name + "!" : avatar.name + " reached Level " + number.format(level) + "!";
    celebration.hidden = false;
    celebration.classList.add("pop");
    celebrationTimer = setTimeout(hideCelebration, 3800);
    byId("announcement").textContent = hatching
      ? avatar.colour + " egg hatched. " + celebration.textContent
      : celebration.textContent + " " + avatar.stages[stage - 1] + ".";
  } else {
    if (level >= 2) {
      celebratePoints();
      petPerformance.play("wave");
    } else {
      eggLife.classList.remove("egg-nudge");
      void eggLife.offsetWidth;
      eggLife.classList.add("egg-nudge");
    }
    byId("announcement").textContent = number.format(group.total) + " total points.";
  }
}

for (const button of awardButtons) {
  button.addEventListener("click", () => award(Number(button.dataset.points)));
}

for (const button of eggChoices.querySelectorAll("[data-egg-choice]")) {
  button.addEventListener("click", () => {
    changeClass((group) => {
      if (group.egg) return false;
      group.egg = button.dataset.eggChoice;
      return () => {
        byId("announcement").textContent = avatars[group.egg].colour + " egg chosen.";
        awardButtons[0].focus();
      };
    });
  });
}

byId("undo").addEventListener("click", () => {
  changeClass((group) => {
    if (!group.lastAward) return false;
    undoDaily(group);
    group.total -= group.lastAward;
    group.lastAward = 0;
    hideCelebration();
    return () => {
      byId("announcement").textContent = "Last addition undone. " + number.format(group.total) + " lifetime points.";
      awardButtons[0].focus();
    };
  });
});

select.addEventListener("change", () => {
  const id = select.value;
  changeState(() => {
    petPerformance.stop();
    state.selectedId = id;
    hideCelebration();
  });
});
select.form.addEventListener("submit", (event) => event.preventDefault());

byId("new-class").addEventListener("click", () => {
  className.value = "";
  className.setCustomValidity("");
  dialog.showModal();
  className.focus();
});
byId("cancel").addEventListener("click", () => dialog.close());
className.addEventListener("input", () => className.setCustomValidity(""));
byId("add-class").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = className.value.trim();
  changeState(() => {
    if (!name || state.classes.some((group) => group.name.toLowerCase() === name.toLowerCase())) {
      className.setCustomValidity(name ? "That class already exists." : "Enter a class name.");
      className.reportValidity();
      return false;
    }
    const id = crypto.randomUUID();
    petPerformance.stop();
    state.classes.push({ id, name, total: 0, lastAward: 0 });
    state.selectedId = id;
    hideCelebration();
    return () => {
      dialog.close();
      select.focus();
    };
  });
});

window.addEventListener("storage", (event) => {
  if (event.key !== storageKey && event.key !== null) return;
  const previousId = state.selectedId;
  state = readState();
  if (state.selectedId !== previousId) petPerformance.stop();
  hideCelebration();
  renderClasses();
  render();
});

renderClasses();
render();
