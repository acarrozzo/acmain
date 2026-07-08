export type Destination = {
  id: string;
  name: string;
  /** Short line shown under the name on cards. */
  tagline: string;
  /** Longer line surfaced by the orbital hub when focused. */
  description: string;
  cta: string;
  href: string;
};

/**
 * The primary destinations — the "worlds". Navigation is meant to stay
 * stable for years; new projects live *inside* these, not beside them.
 */
export const destinations: Destination[] = [
  {
    id: "product-design",
    name: "Product Design",
    tagline: "Software, systems & UX",
    description:
      "Modern product thinking — design systems, prototypes, and the software I build. Less “look what I made,” more “look at how I think.”",
    cta: "View the work",
    href: "/product-design",
  },
  {
    id: "games",
    name: "Games & Worlds",
    tagline: "Playable universes",
    description:
      "Light Gray RPG, Coin & Castle, AC Tower Defense, Archimedes Games, and whatever is being built next. Come play.",
    cta: "Play the games",
    href: "/games",
  },
  {
    id: "starter-box",
    name: "Starter Box",
    tagline: "A worldbuilding platform",
    description:
      "A system, an application, and a community for building worlds — with tutorials and examples to start from.",
    cta: "Start building",
    href: "/starter-box",
  },
  {
    id: "music-lab",
    name: "AC Music Lab",
    tagline: "Sound across decades",
    description:
      "A personal music archive — albums, experiments, and creative history spanning years of making sound.",
    cta: "Listen",
    href: "/music-lab",
  },
  {
    id: "design-archive",
    name: "Design Archive",
    tagline: "The foundation, 2000–2020",
    description:
      "The original hand-coded portfolio. Where the journey began — preserved as the foundation of everything since.",
    cta: "Enter the archive",
    href: "/design-archive",
  },
  {
    id: "updates",
    name: "Updates",
    tagline: "A living development log",
    description:
      "Current projects, progress, and behind-the-scenes thinking. The pulse that keeps the platform alive.",
    cta: "Follow along",
    href: "/updates",
  },
];

export const nav = [
  { label: "Product Design", href: "/product-design" },
  { label: "Games", href: "/games" },
  { label: "Worlds", href: "/starter-box" },
  { label: "AC Music Lab", href: "/music-lab" },
  { label: "Design Archive", href: "/design-archive" },
  { label: "Updates", href: "/updates" },
  { label: "About", href: "#about" },
];

export const hero = {
  line: "I design software, games, tools, systems, and worlds.",
  sub: "This is the central hub for my work — past, present, and in progress.",
};

export const currentlyBuilding = [
  {
    title: "Light Gray RPG — Multiplayer",
    status: "In progress",
    note: "Shared worlds, real-time play, and a persistent map.",
  },
  {
    title: "Starter Box v2",
    status: "In progress",
    note: "A faster, more open worldbuilding engine.",
  },
  {
    title: "Product Design case studies",
    status: "Writing",
    note: "Documenting how the systems were actually made.",
  },
];

export const featured = [
  { title: "Light Gray RPG", kind: "Game", href: "/games" },
  { title: "Starter Box", kind: "Platform", href: "/starter-box" },
  { title: "Design System", kind: "Product Design", href: "/product-design" },
  { title: "Coin & Castle", kind: "Game", href: "/games" },
];

export const about = {
  body:
    "I’m a designer with over twenty years spent making product design, software, games, interactive systems, music, and worldbuilding tools. Different mediums, one way of thinking: build thoughtful systems, keep them calm, and leave room to explore.",
};

export const community = [
  { label: "Updates log", href: "/updates" },
  { label: "Join a world", href: "/starter-box" },
  { label: "Get in touch", href: "mailto:acarrozzo@mountain.com" },
];
