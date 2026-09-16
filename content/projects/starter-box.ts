import type { Project } from "../types";

export const starterBox: Project = {
  slug: "starter-box",
  name: "Starter Box",
  world: "games",
  kind: "Tool",
  status: "resting",
  line: "A world builder for making games the way I make games.",
  body: [
    "Starter Box is the tool underneath the games: rooms connected in eight directions, an edit mode for building and a play mode for walking through it, items to place and pick up, a map that draws itself. It has been rebuilt four times, most recently in TypeScript with tests and full keyboard navigation.",
    "The real ambition is a system: a layered way of describing a world once and generating the game from it. Light Gray is the first customer.",
  ],
  entries: [
    {
      date: "2025-10",
      title: "SB4, the TypeScript rebuild",
      note: "Component architecture, tests, accessibility, an SVG world map.",
    },
  ],
};
