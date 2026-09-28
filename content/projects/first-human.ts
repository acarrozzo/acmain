import type { Project } from "../types";

export const firstHuman: Project = {
  slug: "first-human",
  name: "First Human",
  category: "music",
  kind: "Project",
  status: "live",
  line: "Before language, there was groove.",
  blurb: "Primal, instinctual songs stripped to the bone and built back up. One song so far.",
  square: true,
  bar: "#ea580c",
  mark: "FH",
  tags: ["Hip-hop", "Comedy", "1 song"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [{ label: "Songs", value: "1" }],
  body: [
    "First Human is the project that predates the rest. No genre loyalty, no learned behavior, just the raw impulse to move, connect, and survive. These songs live somewhere between memory and instinct.",
    "One song so far: Fine Specimen (10,000 BC), in which modern man imagines himself in prehistoric peak condition.",
  ],
};
