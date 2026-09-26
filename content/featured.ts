import type { Featured } from "./types";

/**
 * Featured & fresh: the home page carousel. Four hand-picked stories,
 * one per moment worth pointing at. Reorder or replace as things ship.
 */
export const featured: Featured[] = [
  {
    project: "light-gray",
    kicker: "Games · Light Gray RPG · v0.1.8",
    title: "The Mountains are in",
    dek: "Four new maps and a one-room Star City to seed the next region. Public multiplayer opens in a few months.",
    date: "2026-09-11",
    primary: { label: "Read the changelog", href: "/games/light-gray" },
    secondary: { label: "All games", href: "/games" },
  },
  {
    project: "archimedes-games",
    kicker: "Games · Archimedes Games · physical",
    title: "Three decks, one table",
    dek: "Monster Party, LG Tactics and the New York House Deck: designed, illustrated and produced independently. Funded on Kickstarter, sold on Etsy.",
    date: "2022-07",
    primary: { label: "Visit Archimedes", href: "https://www.archimedesgames.com" },
    secondary: { label: "All games", href: "/games" },
  },
  {
    project: "ac-music",
    image: "/img/p/ss4st.webp",
    kicker: "Music · AC Music · 29 tracks",
    title: "Thirty years of songs, finally heard",
    dek: "Nine personas, Suno as the studio, the original demos kept for comparison. Not for the industry. For the family.",
    date: "2026-04-14",
    primary: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
    secondary: { label: "All music", href: "/music" },
  },
  {
    project: "newsday-special-projects",
    kicker: "Design · Newsday · case study",
    title: "The one that won an Emmy",
    dek: "The Fighter & The Father: a dual-video documentary you can swap mid-scene. Plus Pathway to Power, and a pizza smackdown, because sometimes the news is pizza.",
    date: "2017",
    primary: { label: "Read the case study", href: "/work/newsday-special-projects" },
    secondary: { label: "See the work", href: "/work" },
  },
];
