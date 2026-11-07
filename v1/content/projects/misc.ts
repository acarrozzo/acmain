import type { Project } from "../types";

export const misc: Project = {
  slug: "misc",
  name: "Misc",
  category: "music",
  kind: "Project",
  status: "live",
  line: "Songs without a home.",
  blurb: "The ones that don't belong to a specific era or project. Every catalog has a few. These are mine.",
  square: true,
  bar: "#6b7280",
  mark: "Mi",
  tags: ["Odds and ends", "3 songs"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [{ label: "Songs", value: "3" }],
  body: [
    "Every catalog has songs that don't belong to a specific era or project. These are mine.",
    "Three so far: Because of You, a love song written for Linda, through Carmine's voice; I'm a Fire Truck, the most elaborate pickup line ever committed to tape; and Numbers, love geometry and the third-wheel problem, from the drummer's corner.",
  ],
};
