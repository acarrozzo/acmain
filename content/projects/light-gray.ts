import type { Project } from "../types";

export const lightGray: Project = {
  slug: "light-gray",
  name: "Light Gray RPG",
  world: "games",
  kind: "Game",
  status: "playable",
  line: "A turn-based browser RPG I've been building for over a decade, now multiplayer.",
  hero: "/img/p/light-gray.webp",
  gallery: ["/img/p/light-gray-forest.webp"],
  body: [
    "Light Gray started as a way to learn PHP and got out of hand: close to a thousand locations, more than fifty quests, guilds, spells, mounts, pets, crafting, an ocean you can go under and a mountain range you can go over. No level cap. Playable on a phone in a waiting room.",
    "The current version is a from-scratch rebuild: Next.js and Socket.IO, server-authoritative, with parties of up to six, live chat and presence. The rule for the rebuild is simple. Keep the game's identity: its gray, restrained look, its readable numbers, its hand-authored weirdness. Replace everything fragile underneath.",
    "Public multiplayer play opens in a few months. The world's history, set fifty years before the game begins, is being written as The Book of Pax. A cranky angel is involved.",
  ],
  entries: [
    {
      date: "2026-09-12",
      title: "v0.1.8 on Fly",
      note: "Deploy fix, and buying character points straight from the level-up box.",
    },
    {
      date: "2026-09-11",
      title: "The Mountains are in",
      note: "Four new maps, plus a one-room Star City to seed the next region.",
    },
    {
      date: "2026-09-09",
      title: "Party UI, thinner and clearer",
      note: "Leader and follower states, and a slimmer party bar.",
    },
    {
      date: "2026-09-08",
      title: "Regen, buffs, and one item panel",
      note: "A big consolidation of spell, skill and item displays, plus teleport and retreat rules.",
    },
  ],
};
