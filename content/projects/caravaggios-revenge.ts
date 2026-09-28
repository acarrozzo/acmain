import type { Project } from "../types";

export const caravaggiosRevenge: Project = {
  slug: "caravaggios-revenge",
  name: "Caravaggio's Revenge",
  category: "music",
  kind: "Project",
  status: "live",
  started: 2000,
  line: "Baroque heat, modern bones.",
  blurb: "Dramatic, painterly songs with bold contrasts and bright edges. The biggest set at AC Music, and the one with the most original demos still attached.",
  hero: "/img/p/caravaggios-revenge.webp",
  square: true,
  bar: "#d32f2f",
  mark: "CR",
  tags: ["Alt-rock", "Dark", "9 songs"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [
    { label: "Songs", value: "9" },
    { label: "Demos kept", value: "6" },
  ],
  body: [
    {
      image: "/img/p/caravaggios-revenge.webp",
      alt: "Suicide Booth artwork: a lone figure sinking through dark water, sharks circling above",
      plate: true,
      note: "I wrote these songs at a time when I needed drama. Baroque heat, modern anxiety: the light was always too bright or missing completely. These tracks were born from that contrast, and AI finally gave them the orchestration I always heard in my head at 2am.",
    },
    "Nine songs so far: Suicide Booth, Should I Press the Button, Child Alive, U, Changes, Feel This, Only Photographs, Give Me and Paydenpayne. Six of them keep the original recording from around 2000 next to the new production, so you can hear the sketch and the finished thing back to back.",
    {
      image: "/img/p/caravaggios-revenge-button.webp",
      alt: "Should I Press the Button artwork",
      plate: true,
      note: "Should I Press the Button. A war song that starts in a crack alley and ends at countdown.",
    },
    {
      image: "/img/p/caravaggios-revenge-child-alive.webp",
      alt: "Child Alive artwork",
      plate: true,
      note: "Child Alive. Love isn't enough. Septimus Adams has an ambient ghost remix of this one.",
    },
    {
      image: "/img/p/caravaggios-revenge-u.webp",
      alt: "U artwork",
      plate: true,
      note: "U. One pronoun, delivered with maximum force.",
    },
    {
      image: "/img/p/caravaggios-revenge-changes.webp",
      alt: "Changes artwork",
      plate: true,
      note: "Changes. Jet-lagged and disoriented. Everything shifted while you were away.",
    },
  ],
};
