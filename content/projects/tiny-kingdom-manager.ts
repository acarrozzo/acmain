import type { Project } from "../types";

export const tinyKingdomManager: Project = {
  slug: "tiny-kingdom-manager",
  name: "Tiny Kingdom Manager",
  world: "games",
  kind: "Game",
  status: "prototype",
  line: "A peaceful isometric kingdom you can leave running on a second monitor.",
  body: [
    "One person walks up a beach with nothing. You choose where the kingdom begins and they make camp. There is no win condition, no threat and no failure state. If you stop paying attention the kingdom slows down. It never collapses.",
    "A 44 by 44 island generated per save. Trees that deplete and regrow. Storage that belongs to buildings and only fills because somebody carried something there. Villagers with jobs, traits, sleep schedules and leisure. Wildlife that shows up when the habitat is right. All art and audio are generated in code: no framework, no asset files.",
  ],
  entries: [
    {
      date: "2026-08-23",
      title: "Building cards, two columns",
      note: "The construction menu got a proper layout.",
    },
  ],
};
