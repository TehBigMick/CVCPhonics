export const prizeCost = 5;

export const prizes = [
  { id: "stickers", icon: "⭐", name: "Stickers for everyone", detail: "Give each child in the class a sticker." },
  { id: "bubbles", icon: "🫧", name: "Bubble party", detail: "Blow bubbles together while your pet joins in.", seconds: 20, title: "Bubble party" },
  { id: "toys", icon: "🧸", name: "Toy time", detail: "Play with the class toys for 10 minutes. Your pet will play too.", seconds: 600, title: "Toy time" },
  { id: "party", icon: "🎵", name: "Dance party", detail: "Dance to the music with your pet for 5 minutes.", seconds: 300, title: "Dance party" },
  { id: "story", icon: "📚", name: "Choose a class story", detail: "Let the class choose a book to read together." },
];

function localDay(date = new Date()) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
}

export function dailyPoints(group, date = new Date()) {
  return group.day?.date === localDay(date) ? group.day.points : 0;
}

export function awardDaily(group, points, date = new Date()) {
  group.day = { date: localDay(date), points: dailyPoints(group, date) + points };
  group.lastAwardDay = group.day.date;
}

export function undoDaily(group, date = new Date()) {
  if (group.lastAwardDay === localDay(date) && group.day?.date === group.lastAwardDay) {
    group.day.points = Math.max(0, group.day.points - group.lastAward);
  }
  delete group.lastAwardDay;
}

export function drawPrize(group, random = Math.random, date = new Date()) {
  if (group.reward || dailyPoints(group, date) < prizeCost) return;
  const index = Math.floor(random() * prizes.length);
  group.day = { date: localDay(date), points: 0 };
  group.lastAward = 0;
  delete group.lastAwardDay;
  group.reward = { id: prizes[index].id };
  return index;
}

function formatTime(seconds) {
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
}

export function createRewards({ getClass, changeClass, performance, habitat, announcement }) {
  const byId = (id) => document.getElementById(id);
  const dialog = byId("prize-dialog");
  const wheel = byId("prize-wheel");
  const spin = byId("spin-wheel");
  const open = byId("open-prize-wheel");
  const close = byId("close-prize-wheel");
  const result = byId("wheel-result");
  const panel = byId("reward-panel");
  const start = byId("start-reward");
  const finish = byId("finish-reward");
  const music = byId("reward-music");
  const soundtrack = byId("reward-audio");
  let spinning = false;
  let revealed = false;
  let activity;

  prizes.forEach((prize, index) => {
    const icon = document.createElement("span");
    icon.style.setProperty("--angle", (index * 72) + "deg");
    icon.textContent = prize.icon;
    wheel.append(icon);
    const label = document.createElement("li");
    label.textContent = prize.icon + " " + prize.name;
    byId("prize-list").append(label);
  });

  function refresh() {
    const group = getClass();
    const balance = dailyPoints(group);
    const prize = prizes.find(({ id }) => id === group.reward?.id);
    const endsAt = group.reward?.endsAt;
    const remaining = endsAt ? Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)) : 0;
    const active = remaining > 0 ? prize?.id : undefined;
    const activityKey = active ? group.id + ":" + active + ":" + endsAt : undefined;
    if (activityKey !== activity) {
      if (activity) performance.stop();
      soundtrack.pause();
      activity = activityKey;
      if (active) performance.play(active);
    }

    if (active) habitat.dataset.reward = active;
    else delete habitat.dataset.reward;
    byId("daily-total").textContent = balance;
    open.hidden = Boolean(prize);
    open.disabled = balance < prizeCost;
    panel.hidden = !prize;
    if (!prize) return;

    byId("reward-title").textContent = prize.icon + " " + prize.name;
    byId("reward-detail").textContent = endsAt && !remaining ? (prize.title + " is over!") : prize.detail;
    byId("reward-countdown").hidden = !endsAt;
    byId("reward-countdown").textContent = formatTime(remaining);
    start.hidden = !prize.seconds || Boolean(endsAt);
    finish.textContent = remaining ? "End reward" : "Done";
    const wasCounting = byId("reward-countdown").dataset.counting === "yes";
    byId("reward-countdown").dataset.counting = remaining ? "yes" : "no";
    if (wasCounting && endsAt && !remaining) announcement.textContent = prize.title + " is over.";
    music.hidden = active !== "party";
    music.textContent = soundtrack.paused ? "Play music" : "Mute music";
  }

  open.addEventListener("click", () => {
    if (open.disabled || getClass().reward) return;
    revealed = false;
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";
    result.hidden = true;
    spin.hidden = false;
    spin.disabled = false;
    dialog.showModal();
  });
  close.addEventListener("click", () => {
    dialog.close();
    if (revealed) finish.focus();
  });
  dialog.addEventListener("cancel", (event) => {
    if (spinning) event.preventDefault();
  });

  spin.addEventListener("click", async () => {
    if (spinning) return;
    spinning = true;
    spin.disabled = true;
    close.disabled = true;
    let index;
    await changeClass((group) => {
      index = drawPrize(group);
      return index !== undefined;
    });
    if (index === undefined) {
      dialog.close();
    } else {
      const prize = prizes[index];
      const motion = habitat.dataset.motion === "on";
      wheel.style.transition = motion ? "transform 2s cubic-bezier(.14,.68,.17,1)" : "none";
      wheel.style.transform = "rotate(" + (1440 - index * 72) + "deg)";
      if (motion) await new Promise((resolve) => setTimeout(resolve, 2050));
      result.textContent = prize.icon + " " + prize.name + "!";
      result.hidden = false;
      spin.hidden = true;
      revealed = true;
    }
    spinning = false;
    close.disabled = false;
    if (revealed) close.focus();
  });

  function playMusic() {
    soundtrack.play().then(refresh, () => {
      announcement.textContent = "The music could not play. You can try Play music.";
    });
  }

  start.addEventListener("click", async () => {
    let started;
    await changeClass((group) => {
      const prize = prizes.find(({ id }) => id === group.reward?.id);
      if (!prize?.seconds || group.reward.endsAt) return false;
      group.reward.endsAt = Date.now() + prize.seconds * 1000;
      started = prize;
      return true;
    });
    if (!started) return;
    announcement.textContent = started.title + " has started.";
    if (started.id === "party") playMusic();
    finish.focus();
  });

  finish.addEventListener("click", async () => {
    await changeClass((group) => {
      if (!group.reward) return false;
      delete group.reward;
      return true;
    });
    if (open.disabled) document.querySelector("[data-points]").focus();
    else open.focus();
  });

  music.addEventListener("click", () => {
    if (soundtrack.paused) playMusic();
    else {
      soundtrack.pause();
      refresh();
    }
  });

  setInterval(refresh, 500);
  document.addEventListener("visibilitychange", refresh);
  return { refresh };
}
