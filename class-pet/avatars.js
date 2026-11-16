const poses = {
  default: {
    wave: ["wave-up", "wave-out", "wave-up", "wave-out", "smile"],
    dance: ["dance-left", "dance-up", "dance-right", "dance-up", "dance-left", "dance-right", "dance-up", "smile"],
  },
  blue: {
    wave: ["wave-up", "wave-out", "wave-up", "wave-out", "idle"],
    dance: ["dance-left", "dance-left", "dance-right", "dance-right", "dance-up", "idle", "dance-up", "idle"],
  },
  red: {
    wave: ["wave-up", "wave-out", "wave-out", "wave-up", "idle"],
    dance: ["dance-left", "dance-right", "dance-left", "dance-up", "dance-right", "dance-left", "dance-up", "idle"],
  },
  yellow: {
    wave: ["wave-out", "wave-up", "wave-out", "wave-up", "wave-out", "idle"],
    dance: ["dance-up", "dance-left", "dance-up", "dance-right", "dance-up", "wave-out", "dance-up", "idle"],
  },
};

export const avatars = {
  green: { name: "Pip", animal: "a mint-green baby dragon", colour: "Green", stages: ["Egg", "Little Flier", "Sky Scout", "Cloud Keeper", "Star Dragon"], ...poses.default },
  blue: { name: "Pebble", animal: "a sky-blue baby penguin", colour: "Blue", stages: ["Egg", "Little Waddler", "Ice Explorer", "Snow Scout", "Polar Star"], ...poses.blue },
  red: { name: "Rusty", animal: "a russet-red fox cub", colour: "Red", stages: ["Egg", "Little Cub", "Trail Scout", "Forest Keeper", "Woodland Star"], ...poses.red },
  yellow: { name: "Sunny", animal: "a golden-yellow chick", colour: "Yellow", stages: ["Egg", "Little Chirper", "Meadow Scout", "Sunbeam Dancer", "Golden Star"], ...poses.yellow },
};

export function frameSource(egg, frame) {
  if (egg === "green") return frame === "idle" ? "./pip-sprite.webp" : "./poses/" + frame + ".webp";
  const pose = frame === "smile" ? "wave-out" : frame;
  return "./poses/" + egg + "/" + pose + ".webp";
}
