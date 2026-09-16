import type { Project } from "../types";

export const towerTest: Project = {
  slug: "tower-test",
  name: "Tower Test",
  world: "games",
  kind: "Game",
  status: "resting",
  line: "A tower defense experiment, built fast to see what would happen.",
  body: [
    "Lives, gold, waves, an ice tower, a pause button and a 2x button. It did what it was for, which was to find out how quickly a playable tower defense could come together with the new tools. Quickly.",
  ],
  entries: [
    {
      date: "2026-03-11",
      title: "Ice tower, quality-of-life pass, rebalance",
    },
  ],
};
