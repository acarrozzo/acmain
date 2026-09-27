import type { Project } from "../types";

export const productBuildersPodcast: Project = {
  slug: "product-builders-podcast",
  name: "Product Builders podcast",
  short: "Podcast guest",
  category: "design",
  kind: "Podcast",
  status: "live",
  line: "A guest spot on the Product Builders podcast about moving from print to digital design.",
  hero: "/img/p/podcast.webp",
  tags: ["Podcast", "Interview", "Print to digital"],
  mark: "PB",
  started: 2022,
  ended: 2022,
  facts: [
    { label: "Host", value: "Mark García, Majestyk" },
    { label: "Episode", value: "41 minutes" },
  ],
  body: [
    /* The two clips lead the page, side by side. Square social cuts, self-hosted: the archive site serves the originals too slowly to hotlink. Re-encoded at 1080 with x264 crf 26; the 35 MB originals are in assets/video-src. */
    { video: "/video/podcast-advantages-of-digital-design.mp4", poster: "/video/podcast-advantages-of-digital-design.webp", caption: "The advantages of digital design.", square: true },
    { video: "/video/podcast-improving-user-experience.mp4", poster: "/video/podcast-improving-user-experience.webp", caption: "Improving user experience.", square: true },
    "The Product Builders team had me on to talk about the advantages and challenges of digital design. I talked with Mark García, Chief Creative Officer at Majestyk, about transitioning from print to digital design and the pros and cons of each, recorded while I was Director of UX & Design at Newsday.",
    "The advantages are the ones anyone who has shipped a printed menu already knows. Print is linear. You design it, send it to the printer, and what comes back is final. Digital keeps forgiving you after launch. The example we used, a restaurant that changes its menu every season or every day, is not hypothetical to me, since I spent a year making menu boards. Then there is color. Hex codes and RGB instead of Pantones, calibrated presses and proofs, which is time and money nobody misses.",
    "The question that always comes up is whether designers should code. My answer at the time was enough to understand the process and speak the language, so you work alongside the engineers instead of handing things over a wall. The trap is the opposite one, thinking so hard about feasibility while you design that you stop designing anything interesting. Know how it gets built, then let the builders build it.",
    {
      label: "Update, 2026",
      aside:
        "The answer to that question has changed, and the tools changed it. With Claude and Cursor in the mix, a designer who understands how software is built can now ship the front-end as well as design it, and the gap between the mockup and the product has mostly closed. At MNTN that means PRs alongside the engineers. Around here it means one person building what used to take a team. The advice from 2022 still holds. It just pays off a lot more now.",
    },
    "The challenges are the fun part. Design used to run on feel, and now it has to run on evidence. At Newsday that meant A/B tests on everything, including the headline lists and the photos, and publishing what worked rather than what looked best. The other challenge is the pace. Trends and the technology under them change constantly, and staying current means pulling apart what the best platforms are doing and borrowing the parts worth keeping.",
    {
      image: "/img/p/podcast.webp",
      alt: "The Product Builders podcast episode art for Transitioning From Print to Digital Design, with Anthony Carrozzo.",
      plate: true,
      note: "The full episode is on Spotify and Apple Podcasts. This was really fun.",
      links: [
        { label: "Listen on Spotify", href: "https://open.spotify.com/episode/4sd2dWdnoW0n8angi8bJb5" },
        { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/11-transitioning-from-print-to-digital-design-with/id1590356523?i=1000576477848" },
      ],
    },
  ],
  cta: { label: "Listen", href: "https://open.spotify.com/episode/4sd2dWdnoW0n8angi8bJb5" },
  links: [
    { label: "Listen on Spotify", href: "https://open.spotify.com/episode/4sd2dWdnoW0n8angi8bJb5" },
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/11-transitioning-from-print-to-digital-design-with/id1590356523?i=1000576477848" },
    { label: "Majestyk's write-up", href: "https://www.majestykapps.com/blog/the-advantages-and-challenges-of-digital-design" },
  ],
  entries: [
    {
      date: "2022-08-17",
      title: "Transitioning From Print to Digital Design",
      note: "The episode goes out.",
      href: "https://open.spotify.com/episode/4sd2dWdnoW0n8angi8bJb5",
    },
  ],
};
