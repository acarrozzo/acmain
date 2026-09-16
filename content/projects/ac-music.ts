import type { Project } from "../types";

export const acMusic: Project = {
  slug: "ac-music",
  name: "AC Music",
  world: "music",
  kind: "Archive app",
  status: "live",
  line: "Thirty years of songs, finally heard the way I always imagined them.",
  hero: "/img/p/ac-music.webp",
  body: [
    "Songs started on guitar, moved to four-track recorders, then digital demos, and mostly stayed there. Not because they weren't good enough, but because I wasn't trying to be in the industry. AI finally let me hear them fully produced: I bring the melody, the lyrics and the intention, and Suno brings the studio. Where an original demo exists I kept it, so you can compare the sketch with the finished thing.",
    "The catalog is split into personas: Caravaggio's Revenge, Saint Anthony, Acoustic Core, Septimus Adams, First Human, ss4st, Banned from the Zoo, and a set of songs for my kids. It's not for streaming numbers. It's for the family, and for the version of me that kept writing anyway.",
  ],
  links: [{ label: "Listen at AC Music", href: "https://acmusic.vercel.app" }],
  entries: [
    {
      date: "2026-04-14",
      title: "New tracks and real artwork",
      note: "More of Caravaggio's Revenge, lyric fixes, reordered sets.",
      href: "https://acmusic.vercel.app",
    },
  ],
};
