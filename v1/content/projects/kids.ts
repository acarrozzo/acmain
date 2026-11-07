import type { Project } from "../types";

export const kids: Project = {
  slug: "kids",
  name: "Kids",
  category: "music",
  kind: "Project",
  status: "live",
  line: "Songs for my little ones.",
  blurb: "Songs written for Abby and Alex, full of adventure, magic, and love. Four are up, two more are on the way.",
  hero: "/img/p/kids.webp",
  square: true,
  bar: "#f59e0b",
  mark: "Ki",
  tags: ["For Abby & Alex", "Adventure", "6 songs"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [{ label: "Songs", value: "4, two on the way" }],
  body: [
    {
      image: "/img/p/kids.webp",
      alt: "Abby Dabby Do (Magic On the Move) artwork",
      plate: true,
      note: "These started as songs for Abby and Alex specifically. Some are silly, some are earnest, most are both. They'll probably be embarrassed by them someday, and I hope they play them at my funeral.",
    },
    "Up now: Abby Dabby Do (Magic On the Move), a superhero theme for a little girl with magic in her pocket; The Three Keys (Alex's Quest), treasure maps, leopards and moon missions; Captain Alex and the Backyard Galaxy, a cardboard rocket to the moon and back before dinner; and The Carrozzo Song, a family roll call, because names are the first kind of love.",
    "Coming soon: Alex Bo Balex, a grand, silly, animated adventure, and Alex Anderones.",
  ],
};
