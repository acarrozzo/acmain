import type { Featured, Project } from "@/content/types";

/**
 * Example records for the /system page. `fixture` fills every optional
 * field so every branch of Capsule, the rail, the changelog and the
 * carousel renders; `fixtureBare` has only the required ones. Neither is
 * registered in `content/projects/index.ts`, so nothing else sees them.
 */
export const fixture: Project = {
  slug: "example",
  name: "Example Project With A Long Name",
  short: "Example",
  world: "games",
  kind: "Game",
  status: "prototype",
  line: "One line that shows on cards and as the page subtitle.",
  body: [
    "The first paragraph of the project page body. It sits in the .copy measure at 16px with a 1.65 line height, and wraps at 66 characters.",
    "A second paragraph, to show the paragraph spacing.",
    {
      image: "/img/p/light-gray-forest.webp",
      alt: "An example figure.",
      caption: "A figure in a story: the screenshot in a window on a themed stage. Click it to open the page's figures as a lightbox carousel.",
    },
  ],
  hero: "/img/p/light-gray-forest.webp",
  gallery: ["/img/p/light-gray.webp"],
  galleryPending: ["Battle", "Inventory"],
  links: [
    { label: "An internal link", href: "/games" },
    { label: "An external link", href: "https://example.com" },
  ],
  cta: { label: "Play · not yet" },
  started: 2024,
  entries: [
    {
      date: "2026-09-26",
      title: "An entry with everything",
      note: "A note under the title, external link, version chip.",
      href: "https://example.com",
      version: "v1.2.3",
    },
    { date: "2026-08", title: "A month-precision entry with an internal link", href: "/log" },
    { date: "2025", title: "A year-precision entry, no note, no link" },
  ],
  tags: ["Tag one", "Tag two", "Tag three", "Tag four"],
  mark: "EX",
  bar: "#d32f2f",
  version: "v1.2.3",
  blurb: "A short paragraph for the side rail, distinct from the line.",
  facts: [
    { label: "Stack", value: "Next.js · Socket.IO" },
    { label: "Players", value: "Six" },
  ],
};

/** Only the required fields: no artwork, no entries, no tags. */
export const fixtureBare: Project = {
  slug: "bare",
  name: "Bare Minimum",
  world: "music",
  kind: "Sketch",
  status: "idea",
  line: "Required fields only: the type tile stands in, no date, no tags.",
};

/** A featured story pointed at the fixture. */
export const fixtureFeatured: Featured = {
  project: "example",
  image: "/img/p/light-gray-forest.webp",
  kicker: "Games · Example · v1.2.3",
  title: "A featured story with everything",
  dek: "The dek: one or two sentences under the title. Hidden below 900px.",
  date: "2026-09-26",
  primary: { label: "Primary action", href: "#components" },
  secondary: { label: "Secondary", href: "#components" },
};
