import type { World } from "./types";

/**
 * A world is a practice, not a project. Three is deliberate. If a fourth
 * appears it should feel like a life change, not a new side project.
 */
export const worlds: World[] = [
  {
    id: "design",
    slug: "work",
    name: "Design",
    label: "Work",
    tagline: "Product design, design systems, front-end",
    headline: "Product design, design systems, and the front-end to make them real.",
    intro: [
      "I'm a Senior Product Designer at MNTN, working on QuickFrame AI. Before that, twelve years at Newsday, where I went from lead UI designer to Director of UX & Design and shipped three redesigns of one of the biggest regional news sites in the country.",
      "I hand-coded front-ends before it was called engineering, and I still do. These days that means Figma and React in the same week, PRs alongside the engineers, and a multiplayer game on the side to keep the range honest.",
    ],
    listing: "featured",
    featured: [
      "quickframe-ai",
      "quickframe-marketplace",
      "newsday-com",
      "newsday-special-projects",
      "ac-design-system",
    ],
    also: ["light-gray"],
    sections: [
      {
        title: "What I do",
        items: [
          {
            name: "Product design, end to end",
            text: "Goals with stakeholders, research and user testing, wireframes, design, front-end, QA, beta, launch, and the A/B loop that never ends.",
          },
          {
            name: "Design systems",
            text: "Styles, components and variants in Figma; tokens, themes and components in code. This site runs on one: a single accent, two lightnesses, and a content model where a new project never needs a new layout.",
          },
          {
            name: "Front-end and AI-assisted engineering",
            text: "React, Next.js, TypeScript. Shipping PRs at work, and building a server-authoritative multiplayer RPG at home with the same tools.",
          },
          {
            name: "Video",
            text: "AI music videos and ad creative with QuickFrame. Thirty years of making music turns out to be useful here.",
          },
        ],
      },
    ],
    elsewhere: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/acarrozzo/" },
      {
        label: "Product Builders podcast: print to digital design",
        href: "https://open.spotify.com/episode/4sd2dWdnoW0n8angi8bJb5",
      },
    ],
  },
  {
    id: "games",
    slug: "games",
    name: "Games",
    tagline: "In the browser, on paper, on the table",
    headline:
      "Games I've been making for twenty years: in my head, on paper, on the table, and in the browser.",
    intro: [
      "Some are playable today. Some are being rebuilt as real web applications. One is a system for making the rest. The physical ones have their own store.",
    ],
    listing: "status",
    featured: [
      "light-gray",
      "coin-and-castle",
      "tiny-kingdom-manager",
      "archimedes-games",
      "starter-box",
      "tower-test",
    ],
  },
  {
    id: "music",
    slug: "music",
    name: "Music",
    tagline: "Thirty years of songs",
    headline: "Thirty years of songs, three albums, one band, and a lot of personas.",
    intro: [
      "Most of it lives at AC Music, where the songs finally sound the way I heard them. The albums are on the streaming services. The band is a fond memory with a four-song demo.",
    ],
    listing: "status",
    featured: ["ac-music", "ss4st", "bftz"],
  },
];
