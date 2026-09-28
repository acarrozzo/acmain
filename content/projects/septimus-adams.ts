import type { Project } from "../types";

export const septimusAdams: Project = {
  slug: "septimus-adams",
  name: "Septimus Adams",
  category: "music",
  kind: "Project",
  status: "live",
  line: "Drop in. Drift deep. Don't stop.",
  blurb: "Dance-club remixes of songs from the other projects: hypnotic, chill, and built to move.",
  hero: "/img/p/septimus-adams.webp",
  square: true,
  bar: "#c026d3",
  mark: "SAd",
  tags: ["Remixes", "Synthpop", "3 songs"],
  cta: { label: "Listen at AC Music", href: "https://anthonymusic.vercel.app/" },
  facts: [{ label: "Songs", value: "3" }],
  body: [
    {
      image: "/img/p/septimus-adams.webp",
      alt: "Complete (synthpop dance remix) artwork",
      plate: true,
      note: "Septimus Adams is the side of me that lives on the dance floor at 2am. These are the remixes that hit different: synthpop, hypnotic grooves, club bangers with soul. If Saint Anthony writes from the quiet room, Septimus Adams writes from the strobe-lit dark.",
    },
    "Three tracks: Complete (synthpop dance remix), finding the entire universe in someone's gaze; Child Alive (ambient ghost remix), a trip-hop reworking of the Caravaggio's Revenge song; and I Plant a Tree, minimal, patient and grateful, growing in real time.",
    {
      image: "/img/p/septimus-adams-child-alive.webp",
      alt: "Child Alive (ambient ghost remix) artwork",
      plate: true,
      note: "Child Alive (ambient ghost remix). Same words, a very different room.",
    },
  ],
};
