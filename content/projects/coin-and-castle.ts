import type { Project } from "../types";

export const coinAndCastle: Project = {
  slug: "coin-and-castle",
  name: "Coin & Castle",
  world: "games",
  kind: "Game",
  status: "prototype",
  line: "An idle game about finding one coin and ending up with a kingdom.",
  hero: "/img/p/coin-and-castle.webp",
  body: [
    "Inspired by the paperclips game and the castle-building of the original Warcraft. You find a coin, buy a tool, gather a resource, build a thing that gathers more resources, and eventually you have walls to defend and a reason to defend them.",
    "The original was a monolithic prototype. The remake is a data-driven engine in Svelte 5 with one serializable state object, big-number math, tests, and the old game as the design spec: the numbers and progression are ported, the code is not.",
  ],
  entries: [
    {
      date: "2026-07-29",
      title: "Rate monitor in the core displays",
      note: "Every production rate at a glance, and ether costs rebalanced.",
    },
    {
      date: "2026-07-28",
      title: "A left nav that tells you what's new",
      note: "New-item and new-room indicators, resource status dots, and a long scrollable page with smarter notifications.",
    },
  ],
};
