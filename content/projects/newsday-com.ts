import type { Project } from "../types";

export const newsdayCom: Project = {
  slug: "newsday-com",
  name: "Newsday.com",
  world: "design",
  kind: "Case study",
  status: "live",
  started: 2011,
  line: "Three redesigns of one of the biggest regional news sites in the country, and the module system behind the last one.",
  hero: "/img/p/newsday-com.webp",
  body: [
    "In over ten years at Newsday I was involved in at least three complete redesigns of newsday.com. For the 2020 redesign I spearheaded the module system that gives editors the flexibility to adapt the homepage to any news situation, from a quiet Tuesday to election night.",
    "Every step of it: goals with stakeholders, research and user testing, wireframes, design, front-end development, QA, beta, launch, and the loop of A/B tests afterward that never ends. Also NewsdayTV, a streaming news interface built to feel like the services people already use; Sports Central, a results tool for schools and coaches; Faces of Long Island; and the election-night data takeovers.",
    "It's not sexy, but the A/B program is the part I'd defend hardest. Adding numbers to a headline list hurt click-through. Adding photos helped. We shipped the photos.",
  ],
  links: [{ label: "newsday.com", href: "https://www.newsday.com" }],
  entries: [
    {
      date: "2020",
      title: "The module system ships",
      note: "The 2020 newsday.com redesign, with a homepage editors can rebuild for any news situation.",
    },
  ],
};
