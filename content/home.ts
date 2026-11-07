import type { CategoryId } from "./types";

/** Which layout each home section uses. The others stay available behind the switch until it is removed. */
export type SectionLayout = "list" | "lead" | "big" | "compact" | "index" | "lines";
export const SECTION_LAYOUTS: SectionLayout[] = ["list", "lead", "big", "compact", "index", "lines"];

export const home = {
  /** The H1. Links are written as [text](href). */
  h1: "I design and build products for [MNTN](https://www.mntn.com), on [QuickFrame AI](https://ai.quickframe.com). I also love making [games](/games), [music](/music) and other experiments.",
  /** The order of the sections and the layout each one starts with. */
  sections: [
    { category: "design" as CategoryId, layout: "list" as SectionLayout, more: "The work" },
    { category: "games" as CategoryId, layout: "list" as SectionLayout, more: "All games" },
    { category: "music" as CategoryId, layout: "list" as SectionLayout, more: "Listen" },
  ],
  /** The piece that opens a section in the Lead layout: a project slug, with a right-hand label. */
  leads: {
    design: { project: "newsday-interactives", label: "Emmys · 2017, 2019" },
    games: { project: "light-gray", label: "Playable" },
    music: { project: "ac-music", label: "70-some songs" },
  } as Record<CategoryId, { project: string; label: string }>,
  /** The about block under the lists: the face and a sentence or two. */
  about: "Anthony Carrozzo is a Senior Product Designer at [MNTN](https://www.mntn.com), on QuickFrame. Before that, twelve years at [Newsday](https://www.newsday.com), the last few as Director of UX & Design.",
  /** The one line of the old humor the site keeps. */
  wink: { lead: "Hey look at that.", rest: "You've reached the footer." },
  /** The system block: the site describing itself. */
  system: [
    { k: "Type", body: ["Fraunces, text and display", "JetBrains Mono, labels and numbers"] },
    { k: "Color", swatches: true, body: ["Six grays and one accent, chosen in the system above. Dark first; light is the same set re-lit."] },
    { k: "Measure", body: ["One 640px column. 15px text on a 1.55 line. 44px between sections, 10px between rows, 1px hairlines at 10% and 26%."] },
    { k: "Content", body: ["Person → three practices → projects → entries. Each is a file. A new project never needs a new layout."] },
    { k: "Parts", body: ["Row, Lead, Index, Lines, Preview, the solar system, the theme reveal. Seven parts, no more."] },
    { k: "Build", body: ["Next.js, React, Tailwind. Static pages, one token set, no tracking."] },
  ],
};

/** "[text](href)" → anchors. Used for the H1 and the about line. */
export function linkify(s: string): { text: string; href?: string }[] {
  const out: { text: string; href?: string }[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
}
