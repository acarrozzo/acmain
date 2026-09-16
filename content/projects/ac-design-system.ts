import type { Project } from "../types";

export const acDesignSystem: Project = {
  slug: "ac-design-system",
  name: "AC Design System",
  world: "design",
  kind: "Design system",
  status: "prototype",
  started: 2023,
  line: "The system under this site: tokens in Figma and in code, one accent, two themes.",
  hero: "/img/p/ac-design-system.webp",
  body: [
    "For years my CSS was my style guide. In 2023 I started building the system properly in Figma, with styles, components and variants, so new pages and ideas could be prototyped fast.",
    "The 2026 version lives in code too: a token set where one accent, in two lightnesses, tints the whole platform, and a content model with four nouns, Person, World, Project and Entry, where a new project is one record and never a new layout. This site is the reference implementation.",
  ],
  entries: [
    {
      date: "2026-09-16",
      title: "Four nouns",
      note: "Person, World, Project, Entry. The content model that renders this site.",
    },
    {
      date: "2023",
      title: "The Figma system",
      note: "Styles, components and variants for fast prototyping.",
    },
  ],
};
