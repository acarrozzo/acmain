/**
 * The four nouns. Everything on the site is one of these.
 *
 *   Person  — one. Anthony. See `content/person.ts`.
 *   World   — a few. A practice you'll still have in twenty years. See `content/worlds.ts`.
 *   Project — many. A thing with a name and a status. One file each in `content/projects/`.
 *   Entry   — endless. A dated thing that happened to a project. Lives on its project.
 *
 * The home page, world pages, project pages and the log are all rendered
 * from these records. Adding a project never touches a layout.
 */

export type WorldId = "design" | "games" | "music";

/** Where a project is in its life. Retirement is a status, not a deletion. */
export type Status =
  | "idea"
  | "paper"
  | "prototype"
  | "playable"
  | "live"
  | "resting"
  | "archived";

export type Link = { label: string; href: string };

/**
 * `date` is "YYYY-MM-DD", "YYYY-MM" or "YYYY" — use the precision you
 * actually know. Sorting is string order, which works for all three.
 */
export type Entry = {
  date: string;
  title: string;
  note?: string;
  href?: string;
};

export type Project = {
  slug: string;
  name: string;
  world: WorldId;
  /** Short noun shown above the name: "Game", "Case study", "Albums"… */
  kind: string;
  status: Status;
  /** One line. Shows on cards and as the page subtitle. */
  line: string;
  /** Paragraphs for the project page. */
  body?: string[];
  /** Hero image path under /public. Optional; a placeholder field stands in. */
  hero?: string;
  /** Extra images for the project page. */
  gallery?: string[];
  links?: Link[];
  started?: number;
  ended?: number;
  entries?: Entry[];
};

export type WorldSection = {
  title: string;
  items: { name: string; text: string }[];
};

export type World = {
  id: WorldId;
  /** URL segment: /work, /games, /music */
  slug: string;
  name: string;
  /** Nav label, when it differs from the name. */
  label?: string;
  tagline: string;
  /** Headline on the world page. */
  headline: string;
  intro: string[];
  /**
   * How the world page lists its projects: "featured" is a flat grid in
   * `featured` order (a portfolio); "status" groups them by where they are
   * in their life (a workshop).
   */
  listing: "featured" | "status";
  /** Ordered project slugs to show first. Anything not listed follows. */
  featured?: string[];
  /** Projects from other worlds that also belong on this page. */
  also?: string[];
  sections?: WorldSection[];
  elsewhere?: Link[];
};
