import type { Project } from "../types";

export const acousticCore: Project = {
  slug: "acoustic-core",
  name: "Acoustic Core",
  category: "music",
  kind: "Project",
  status: "live",
  started: 2012,
  line: "Stripped down, turned up.",
  blurb: "Raw acoustic songs with an edge, where quiet meets intensity. One song so far, with its 2012 original kept for comparison.",
  hero: "/img/p/acoustic-core.webp",
  square: true,
  bar: "#4ade80",
  mark: "AC",
  tags: ["Acoustic", "Love song", "1 song"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [
    { label: "Songs", value: "1" },
    { label: "Demos kept", value: "1" },
  ],
  body: [
    {
      image: "/img/p/acoustic-core.webp",
      alt: "Home artwork",
      plate: true,
      note: "Not everything needs distortion to hit hard. These are the songs I wrote with just a guitar and nowhere to hide: acoustic at the core, but not soft about it.",
    },
    "One song so far: Home. The simplest love song, being home is being with you. The original recording from 2012 sits next to the new one, so you can compare the two.",
  ],
};
