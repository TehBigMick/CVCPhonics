const entryCosts = [5, 10, 20, 35, 55];
const stageNames = ["Hatchling", "Little Flier", "Sky Scout", "Cloud Keeper", "Star Dragon"];

export function levelProgress(total) {
  let level = 1;
  let towards = total;
  let goal = entryCosts[0];

  while (towards >= goal) {
    towards -= goal;
    level += 1;
    goal = entryCosts[level - 1] ?? 55 + (level - 5) * 25;
  }

  const stage = Math.min(level, stageNames.length);
  return { level, towards, goal, stage, stageName: stageNames[stage - 1] };
}
