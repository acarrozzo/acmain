import type { Project } from "../types";

export const saintAnthony: Project = {
  slug: "saint-anthony",
  name: "Saint Anthony",
  category: "music",
  kind: "Project",
  status: "live",
  line: "Songs from the quiet room.",
  blurb: "Soft-spoken compositions with devotional harmony and slow glow. In practice: freestyle hip-hop, spoken word, and the occasional satirical rock song.",
  hero: "/img/p/saint-anthony.webp",
  square: true,
  bar: "#1976d2",
  mark: "SA",
  tags: ["Hip-hop", "Spoken word", "6 songs"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [{ label: "Songs", value: "6" }],
  body: [
    {
      image: "/img/p/saint-anthony.webp",
      alt: "She Knows artwork",
      plate: true,
      note: "Saint Anthony is the name I give to the quiet version of myself, the one who writes slowly and means every word. These songs came from long nights and borrowed pianos, and they still ask the same questions they always did.",
    },
    "Six songs: She Knows, a freestyle odyssey from winter streets to cosmic metaphors; Soda Pop!, a satirical ode to America's forbidden sweetness; Blessed, gratitude as groove; AC1, a visitor from Alpha Centauri reflecting on your strange little world; Weird, a permission slip to be strange, delivered at maximum speed; and The Healthiest Dessert, courtship as calorie-free indulgence.",
    {
      image: "/img/p/saint-anthony-soda-pop.webp",
      alt: "Soda Pop! artwork",
      plate: true,
      note: "Soda Pop! Welcome to America. We got problems, and we got soda rights.",
    },
  ],
};
