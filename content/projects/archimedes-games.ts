import type { Project } from "../types";

export const archimedesGames: Project = {
  slug: "archimedes-games",
  name: "Archimedes Games",
  world: "games",
  kind: "Card games",
  status: "live",
  line: "Three original card games, designed, illustrated and produced independently.",
  hero: "/img/p/archimedes-games.webp",
  gallery: ["/img/p/archimedes-monster-party.webp", "/img/p/archimedes-house-deck.webp"],
  started: 2019,
  body: [
    "Archimedes Games is the physical side of the games world. Monster Party is a five-suit deck with fifty original monsters that plays every card game you already know. LG Tactics is a strategy-lite battle card game and a quiet introduction to the Light Gray story. The New York House Deck is a straight-up classic deck with strong, simple design and groovy illustrations.",
    "All three were funded on Kickstarter and are sold on Etsy. Archimedes keeps its own site, because it has its own customers.",
  ],
  links: [
    { label: "archimedesgames.com", href: "https://www.archimedesgames.com" },
    { label: "Etsy store", href: "https://www.etsy.com/shop/ArchimedesCreations" },
    { label: "Instagram", href: "https://www.instagram.com/archimedesgameco/" },
  ],
  entries: [
    {
      date: "2022-07",
      title: "New York House Deck",
      note: "A classic 52-card deck with groovy illustrations, funded on Kickstarter.",
      href: "https://www.kickstarter.com/projects/archimedesgames/new-york-house-deck",
    },
    {
      date: "2020-09",
      title: "LG Tactics",
      note: "A strategy-lite battle card game, funded on Kickstarter.",
      href: "https://www.kickstarter.com/projects/archimedesgames/lg-tactics-strategy-card-game",
    },
    {
      date: "2019-11",
      title: "Monster Party",
      note: "A five-suit deck with fifty original monsters. The first release, and a success thanks to you.",
      href: "https://www.kickstarter.com/projects/archimedesgames/monster-party-playing-cards-five-suit",
    },
  ],
};
