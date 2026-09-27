import type { Project } from "../types";

export const newsdayInteractives: Project = {
  slug: "newsday-interactives",
  name: "Newsday interactives",
  short: "Interactives",
  category: "design",
  kind: "Editorial",
  status: "live",
  line: "Investigative journalism that needed more than an article template. Two of them won Emmys.",
  hero: "/img/p/newsday-interactives.webp",
  tags: ["Investigative", "Emmy", "Video"],
  body: [
    "The bread and butter of my Newsday years: custom interactives for the stories that deserved extra flare. Two of them won New York Emmys. The Fighter & The Father is a dual-video documentary about MMA champion Chris Weidman where you swap between two synced feeds. Long Island Divided is a three-year investigation into housing discrimination: undercover testers of different races were sent to the same real estate agents, and the story lays out, on camera, how differently they were treated. Pathway to Power, a years-in-the-making investigation into Long Island corruption, got a chapter-select interface, video and graphics that I designed and coded.",
    "Also: Life After Football, MS-13 Killing Fields, Long Island at the Crossroads, Zombie Homes, an investigation into Nassau's tax system, a marathon tracker, and a pizza smackdown, because sometimes the news is pizza.",
  ],
  links: [
    { label: "Long Island Divided", href: "https://projects.newsday.com/long-island/real-estate-agents-investigation/" },
  ],
  entries: [
    {
      date: "2019-11",
      title: "Long Island Divided publishes",
      note: "Three years of undercover testing of real estate agents, told with video, maps and the testers' own recordings. Later a second New York Emmy.",
      href: "https://projects.newsday.com/long-island/real-estate-agents-investigation/",
    },
    {
      date: "2017",
      title: "A New York Emmy for The Fighter & The Father",
      note: "A trip into the city for the 60th New York Emmy Awards, and a shiny trophy to boot.",
    },
  ],
};
