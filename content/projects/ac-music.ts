import type { Project } from "../types";

export const acMusic: Project = {
  slug: "ac-music",
  name: "AC Music",
  category: "music",
  kind: "Archive app",
  status: "live",
  line: "Thirty years of songs, finally heard the way I always imagined them.",
  hero: "/img/p/ac-music.webp",
  square: true,
  bar: "#d32f2f",
  tags: ["9 projects", "Suno", "Compare versions"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  body: [
    "Songs started on guitar, moved to four-track recorders, then digital demos, and mostly stayed there. Not because they weren't good enough, but because I wasn't trying to be in the industry. AI finally let me hear them fully produced: I bring the melody, the lyrics and the intention, and Suno brings the studio. Where an original demo exists I kept it, so you can compare the sketch with the finished thing.",
    "The catalog is split into projects, each with its own page here: Caravaggio's Revenge, Saint Anthony, Septimus Adams, Acoustic Core, First Human, a set of songs for my kids, a few that don't belong anywhere, and empty rooms waiting for ss4st and Banned from the Zoo. It's not for streaming numbers. It's for the family, and for the version of me that kept writing anyway.",
  ],
  links: [{ label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" }],
  entries: [
    {
      date: "2026-04-14",
      title: "New tracks and real artwork",
      note: "More of Caravaggio's Revenge, lyric fixes, reordered sets.",
      href: "https://anthonymusic.vercel.app/",
    },
  ],
};
