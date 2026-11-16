const shows = {
  wave: { sequence: "wave", frameMs: 165, length: 990 },
  level: { sequence: "dance", frameMs: 250, length: 2000 },
  song: { sequence: "dance", frameMs: 250, length: 5000 },
  hatch: { length: 1550 },
};

export function createPetPerformance({ habitat, pet, button, audio, soundStatus }) {
  const frames = new Map([...pet.querySelectorAll("[data-frame]")].map((img) => [img.dataset.frame, img]));
  let pose = "idle";
  let current = "";
  let pending = "";
  let started = 0;
  let request = 0;
  let avatar;

  function showFrame(next) {
    if (next === pose) return;
    if (pose !== "idle") frames.get(pose).hidden = true;
    if (next !== "idle") frames.get(next).hidden = false;
    pet.dataset.pose = next;
    pose = next;
  }

  function stop() {
    cancelAnimationFrame(request);
    if (current === "song") audio.pause();
    current = "";
    pending = "";
    delete habitat.dataset.performance;
    showFrame("idle");
    button.removeAttribute("aria-disabled");
    button.disabled = false;
    button.textContent = avatar ? "Dance with " + avatar.name : "Dance";
  }

  function tick(now) {
    const show = shows[current];
    const elapsed = Math.max(0, now - started);
    if (elapsed >= show.length) {
      const next = pending;
      stop();
      if (next) play(next);
      return;
    }
    const sequence = avatar[show.sequence];
    const frame = !sequence ? "idle" : habitat.dataset.motion === "on"
      ? sequence[Math.floor(elapsed / show.frameMs) % sequence.length]
      : "smile";
    showFrame(frame);
    request = requestAnimationFrame(tick);
  }

  function play(kind) {
    if (!avatar) return;
    if (current === "hatch" || current === "song" || (current === "level" && kind === "wave")) {
      if (kind === "level" || (kind === "wave" && !pending)) pending = kind;
      return;
    }
    stop();
    current = kind;
    habitat.dataset.performance = kind;
    button.disabled = kind === "hatch";
    started = performance.now();
    tick(started);

    if (kind === "song") {
      soundStatus.hidden = true;
      button.setAttribute("aria-disabled", "true");
      button.textContent = "Dancing…";
      audio.currentTime = 0;
      const songStarted = started;
      audio.play().catch(() => {
        if (current === "song" && started === songStarted) soundStatus.hidden = false;
      });
    }
  }

  button.addEventListener("click", () => {
    if (!button.hidden) play("song");
  });

  function setAvatar(next) {
    avatar = next;
    stop();
  }

  return { play, stop, setAvatar };
}
