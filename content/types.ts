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

/** A ghosted photo behind the top of a page, one per theme. */
export type Backdrop = { dark: string; light: string };

/**
 * `date` is "YYYY-MM-DD", "YYYY-MM" or "YYYY" — use the precision you
 * actually know. Sorting is string order, which works for all three.
 */
export type Entry = {
  date: string;
  title: string;
  note?: string;
  href?: string;
  /** Shown as a small chip on the changelog, e.g. "v0.1.8". */
  version?: string;
};

export type Fact = { label: string; value: string };

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
  /** Hero image path under /public. Optional; a typographic tile stands in. */
  hero?: string;
  /** Extra images for the project page's screenshot strip. */
  gallery?: string[];
  /** Named screenshots that do not exist yet; shown as typographic tiles. */
  galleryPending?: string[];
  links?: Link[];
  /** The main action when it exists (Play, Listen, Buy). No href = not yet. */
  cta?: { label: string; href?: string };
  started?: number;
  ended?: number;
  entries?: Entry[];
  /** Two to four short words shown as chips on the capsule. */
  tags?: string[];
  /** Letters for the typographic tile when there is no hero. Default: initials. */
  mark?: string;
  /** Square artwork (albums) instead of 16:9. */
  square?: boolean;
  /** A thin accent bar under the card body, e.g. a persona color. */
  bar?: string;
  /** Current version label, e.g. "v0.1.8". */
  version?: string;
  /** Short paragraph for the project page's side rail. Defaults to `line`. */
  blurb?: string;
  /** Extra rows for the side rail: Stack, Players, Where to buy… */
  facts?: Fact[];
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
   * in their life (a workshop), with filters and a featured banner.
   */
  listing: "featured" | "status";
  /** Ordered project slugs to show first. Anything not listed follows. */
  featured?: string[];
  /** Projects from other worlds that also belong on this page. */
  also?: string[];
  /** Image for the world's tile on the home page. */
  hero?: string;
  /** This world's own backdrop, on its door and its project pages. Defaults to the site's. */
  backdrop?: Backdrop;
  sections?: WorldSection[];
  elsewhere?: Link[];
};

/** A hand-picked story for the home page carousel. */
export type Featured = {
  /** The project it belongs to; supplies the image and status. */
  project: string;
  /** Override the image. */
  image?: string;
  kicker: string;
  title: string;
  dek: string;
  date: string;
  primary: Link;
  secondary?: Link;
};
