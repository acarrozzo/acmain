import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Btn, Crumbs, ExternalMark, Kicker, SectionHead, StatusChip, StatusGlyph, Tags, TypeTile } from "@/components/ui";
import { Story } from "@/components/Story";
import { Capsule, CapsuleGrid } from "@/components/Capsule";
import { EntryList, LogList } from "@/components/Entries";
import { Featured } from "@/components/Featured";
import { FilteredGrid, type Filter } from "@/components/Filters";
import { HeroCarousel, type Slide } from "@/components/HeroCarousel";
import { Workshop } from "@/components/Workshop";
import { OrbitalNav } from "@/components/OrbitalNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Mark } from "@/components/Mark";
import { Editor, NowPlaying, WorldsTiles, orbitData } from "@/components/Home";
import { SystemIndex } from "@/components/system/SystemIndex";
import { Playground } from "@/components/system/Playground";
import { Cell, Spec, Stat, Sub, UsedOn, Yes } from "@/components/system/Spec";
import { system, type CssToken } from "@/lib/system";
import { routeLabel } from "@/lib/routes";
import { fixture, fixtureBare, fixtureFeatured } from "@/lib/system-fixture";
import { navItems, paletteItems } from "@/lib/nav";
import { site } from "@/content/site";
import { person } from "@/content/person";
import { featured } from "@/content/featured";
import {
  allEntries,
  alsoInWorld,
  building,
  entriesOf,
  featuredItems,
  groupByStatus,
  initials,
  latestActivity,
  latestEntries,
  latestEntryInWorld,
  latestEntryOf,
  lastShipped,
  projectPath,
  projects,
  projectsInWorld,
  STATUS_LABEL,
  toCapsule,
  workshopTabs,
  worldById,
  worldPath,
  worlds,
  type Status,
} from "@/lib/content";
import { formatDate, formatMonth, monthKey } from "@/lib/format";
import sitemap from "@/app/sitemap";

export const metadata: Metadata = {
  title: "System",
  description: "The building blocks of the site: tokens, primitives, components, records and the logic between them.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "tokens", label: "Tokens" },
  { id: "type", label: "Type" },
  { id: "primitives", label: "Primitives" },
  { id: "playground", label: "Playground" },
  { id: "components", label: "Components" },
  { id: "sections", label: "Home sections" },
  { id: "patterns", label: "Patterns" },
  { id: "css", label: "CSS inventory" },
  { id: "model", label: "Content model" },
  { id: "records", label: "Records" },
  { id: "logic", label: "Logic" },
  { id: "routes", label: "Routes" },
  { id: "assets", label: "Assets" },
  { id: "files", label: "Files & stack" },
];

const STATUSES: Status[] = ["idea", "paper", "prototype", "playable", "live", "resting", "archived"];
/** Mirrors HOT in components/ui.tsx and BUILDING in lib/content.ts; both are private there. */
const HOT: Status[] = ["live", "playable", "prototype"];
const BUILDING: Status[] = ["prototype", "playable", "paper", "idea"];
const STATUS_FACTS: Record<Status, { glyph: string; filter: string; fly: string; moon: string }> = {
  idea: { glyph: "a dot", filter: "Building", fly: "muted", moon: "hollow ring" },
  paper: { glyph: "a stake", filter: "Building", fly: "muted", moon: "hollow ring" },
  prototype: { glyph: "a frame", filter: "Building", fly: "accent", moon: "ink-soft dot" },
  playable: { glyph: "a house", filter: "Playable", fly: "accent", moon: "ink-soft dot" },
  live: { glyph: "a lit house", filter: "Live", fly: "accent", moon: "accent, glowing" },
  resting: { glyph: "moss", filter: "Resting", fly: "muted at 55%", moon: "muted at 55%" },
  archived: { glyph: "a plaque", filter: "Resting", fly: "muted at 55%", moon: "muted at 55%" },
};

function tokenGroup(t: CssToken): string {
  const n = t.name;
  if (n.startsWith("--tint-")) return "World tints";
  if (/^--(paper|surface)/.test(n)) return "Surfaces";
  if (/^--(ink|muted)/.test(n)) return "Ink";
  if (n.startsWith("--line") || n === "--accent-line") return "Lines";
  if (n.startsWith("--accent") || n === "--glow") return "Accent";
  if (n.startsWith("--ease")) return "Motion";
  return "Effects (orbit, backdrops)";
}

function Sec({ id, kicker, title, dek, children }: { id: string; kicker: string; title?: string; dek?: string; children: ReactNode }) {
  return (
    <section id={id} className="ds-sec">
      <SectionHead kicker={kicker} title={title} dek={dek} />
      {children}
    </section>
  );
}

function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="ds-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function SystemPage() {
  const data = system();
  const fileOf = (p: string) => data.files.find((f) => f.path === p);
  /**
   * Where something is used. For a whole file: its direct importers and every
   * route that reaches it. For one symbol: the files that import that symbol,
   * plus the routes that reach those files, so a primitive in ui.tsx is not
   * blamed on every page just because the masthead imports the file.
   */
  const usedOn = (p: string, sym?: string): string[] => {
    const f = fileOf(p);
    if (!f) return [];
    const out = new Set<string>();
    for (const i of f.importedBy) {
      if (sym && !i.symbols.includes(sym)) continue;
      out.add(i.by);
      if (sym && !i.by.startsWith("app/")) for (const r of fileOf(i.by)?.routes ?? []) out.add(r);
    }
    if (!sym) for (const r of f.routes) out.add(r);
    return Array.from(out);
  };

  const entries = allEntries();
  const games = worldById("games");
  const design = worldById("design");
  const gameFilters: Filter[] = [
    { id: "all", label: "All" },
    { id: "playable", label: "Playable", statuses: ["playable"] },
    { id: "live", label: "Live", statuses: ["live"] },
    { id: "building", label: "Building", statuses: ["prototype", "paper", "idea"] },
    { id: "resting", label: "Resting", statuses: ["resting", "archived"] },
  ];
  const fixtureSlides: Slide[] = [
    { kind: "img", src: fixture.hero!, alt: "Example artwork" },
    ...(fixture.gallery ?? []).map((src, i) => ({ kind: "img" as const, src, alt: `Example screenshot ${i + 2}` })),
    ...(fixture.galleryPending ?? []).map((label) => ({ kind: "tile" as const, label })),
  ];
  const fixtureCap = { ...toCapsule(fixture), href: "#components" };
  const bareCap = { ...toCapsule(fixtureBare), href: "#components" };
  const withHero = projects.find((p) => p.hero && !p.square)!;
  const squareOne = projects.find((p) => p.square) ?? withHero;
  const tileOne = projects.find((p) => !p.hero) ?? fixtureBare;
  const featuredWithFixture = [
    { ...fixtureFeatured, image: fixtureFeatured.image!, status: fixture.status, thumbKicker: "Games · Example" },
    ...featuredItems(),
  ];
  const orbit = orbitData();
  const art = projects.filter((p) => p.hero).map((p) => ({ label: p.name, src: p.hero! }));
  const sitemapRows = sitemap();
  const contentLib = fileOf("lib/content.ts");
  const tokenGroups = Array.from(new Set(data.css.tokens.map(tokenGroup)));
  const components = data.files.filter((f) => f.path.startsWith("components/") && !f.path.startsWith("components/system/"));
  const componentCount = components.reduce((n, f) => n + f.exports.filter((e) => e.kind === "component").length, 0);
  const routesList = [
    { file: "app/layout.tsx", what: "Root layout: the three fonts via next/font, the metadata template, ThemeScript before paint, globals.css." },
    { file: "app/page.tsx", what: "The front page: HeroOrbit, Featured & fresh, the workshop beside now playing and the editor, world tiles, three capsule grids." },
    { file: "app/[world]/page.tsx", what: "A world's door. listing: \"status\" (games, music) gets stats, a banner and filters; listing: \"featured\" (work) gets selected work, what I do and elsewhere.", params: worlds.map(worldPath) },
    { file: "app/[world]/[slug]/page.tsx", what: "A project: hero carousel, about, changelog, siblings, and the sticky side rail.", params: projects.map(projectPath) },
    { file: "app/log/page.tsx", what: "Every entry, newest first, grouped by month." },
    { file: "app/about/page.tsx", what: "The person, skills, the timeline, the site's story." },
    { file: "app/archive/page.tsx", what: "Points at the original acarrozzo.com." },
    { file: "app/system/page.tsx", what: "This page. Temporary, noindex, not in the sitemap." },
    { file: "app/not-found.tsx", what: "Nothing lives at this address." },
    { file: "app/sitemap.ts", what: `${sitemapRows.length} URLs computed from worlds and projects; lastModified from each project's newest day-precise entry.` },
    { file: "app/robots.ts", what: "Allow everything, point at the sitemap." },
  ];

  return (
    <>
      <Masthead />
      <main className="container-page">
        <Crumbs items={[{ label: "AC.", href: "/" }, { label: "System" }]} />
        <div className="pagehead">
          <Kicker>System · temporary · not indexed</Kicker>
          <h1>The building blocks.</h1>
          <p className="dek">
            Every token, class, primitive, component, record and query on the site, read from the source at build time so this page cannot drift from it. A workbench for understanding the system before changing it.
          </p>
          <p className="ds-note">
            To remove it later: delete <code>app/system</code>, <code>components/system</code>, <code>lib/system.ts</code>, <code>lib/system-fixture.ts</code>, the System entry in <code>lib/nav.ts</code>, and the &ldquo;System page&rdquo; block at the end of <code>globals.css</code>.
          </p>
          <div className="ds-stat">
            <Stat n={data.css.tokens.length} label="tokens" />
            <Stat n={data.css.totalClasses} label="css classes" />
            <Stat n={data.css.totalRules} label="css rules" />
            <Stat n={componentCount} label="components" />
            <Stat n={contentLib?.exports.filter((e) => e.kind === "function").length ?? 0} label="queries" />
            <Stat n={worlds.length} label="worlds" />
            <Stat n={projects.length} label="projects" />
            <Stat n={entries.length} label="entries" />
            <Stat n={sitemapRows.length} label="urls" />
            <Stat n={data.files.length} label="source files" />
          </div>
        </div>

        <div className="ds">
          <SystemIndex sections={SECTIONS} />
          <div>
            {/* ------------------------------------------------ Overview */}
            <Sec id="overview" kicker="Overview" title="Records in, pages out.">
              <p className="ds-note">
                Four nouns live as TypeScript records. A small library of pure functions derives every list, ordering and grouping from them. Components render what the functions return. Pages only compose components. Adding a project touches one file and never a layout.
              </p>
              <div className="ds-flow">
                <div>
                  <b>Records</b>
                  <span className="ds-mono">content/</span>
                  <p>
                    One person, {worlds.length} worlds, {projects.length} projects, {entries.length} entries, {featured.length} featured stories. Typed by <code className="ds-mono">types.ts</code>.
                  </p>
                </div>
                <div>
                  <b>Queries</b>
                  <span className="ds-mono">lib/content.ts · nav.ts · format.ts</span>
                  <p>Paths, orderings, groupings, the workshop tabs, the nav tree, the palette, date formatting. No React.</p>
                </div>
                <div>
                  <b>Components</b>
                  <span className="ds-mono">components/</span>
                  <p>{componentCount} components. The look is mostly hand-written classes in globals.css; Tailwind covers layout odds and ends.</p>
                </div>
                <div>
                  <b>Pages</b>
                  <span className="ds-mono">app/</span>
                  <p>{routesList.length} entries. Every route is static. Client JavaScript is limited to carousels, tabs, filters, the palette, the flyouts, the orbit and the theme toggle.</p>
                </div>
              </div>
              <p className="ds-note">
                Chips on every specimen say where it is used: <span className="used"><span className="route">/route</span></span> is a page that reaches the file through imports, <span className="used"><span>File</span></span> is a file that imports the symbol directly.
              </p>
            </Sec>

            {/* ------------------------------------------------ Tokens */}
            <Sec id="tokens" kicker="Tokens" title="One accent per theme; everything else derives." dek="app/globals.css">
              <p className="ds-note">
                Tokens are plain CSS custom properties on <code>:root</code> (light) and <code>.dark</code>. <code>ThemeScript</code> adds <code>.dark</code> before first paint, dark being the default; <code>ThemeToggle</code> flips the class and remembers the choice in <code>localStorage</code> under <code>ac-theme</code>. <code>@theme inline</code> maps a subset onto Tailwind utilities. No <code>dark:</code> variants are used anywhere, so a swatch is the whole story. Each swatch shows light on the top-left, dark on the bottom-right.
              </p>
              {tokenGroups.map((g) => (
                <Sub key={g} kicker={g}>
                  <div className="swatches">
                    {data.css.tokens
                      .filter((t) => tokenGroup(t) === g)
                      .map((t) => (
                        <div key={t.name} className="swatch">
                          <div className="sw" style={{ "--l": t.lightResolved, "--d": t.darkResolved } as CSSProperties} />
                          <div>
                            <b>{t.name}</b>
                            <small title={t.light}>light · {t.light}</small>
                            <small title={t.dark}>dark · {t.dark ?? "same"}</small>
                            {t.utilities.length > 0 && <small className="u">{t.utilities.join(" · ")}</small>}
                            <small>
                              {t.uses} {t.uses === 1 ? "reference" : "references"}
                              {t.group ? ` · ${t.group}` : ""}
                            </small>
                          </div>
                        </div>
                      ))}
                  </div>
                </Sub>
              ))}
              <Sub kicker="@theme inline · what Tailwind can see">
                <Table head={["Theme name", "Value", "Utilities"]}>
                  {data.css.aliases.map((a) => (
                    <tr key={a.name}>
                      <td className="ds-mono">{a.name}</td>
                      <td className="ds-mono dim">{a.value}</td>
                      <td className="ds-mono">{data.css.tokens.find((t) => t.alias === a.name)?.utilities.join(" · ") ?? (a.name.startsWith("--font") ? a.name.replace("--", "") : "")}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker="Set per page, not in :root">
                <dl className="ds-kv">
                  <dt>--bd-dark / --bd-light</dt>
                  <dd>
                    The backdrop photo pair, set inline by <code className="ds-mono">Backdrop</code> from <code className="ds-mono">site.backdrop</code> or a world&apos;s own <code className="ds-mono">backdrop</code>.
                  </dd>
                  <dt>--lx --ly --shx --shy</dt>
                  <dd>Per-orb light direction and shadow offset, written every frame by the orbit loop so each world stays lit from the hub.</dd>
                  <dt>--l / --d</dt>
                  <dd>Only on this page: the two halves of a swatch.</dd>
                </dl>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Type */}
            <Sec id="type" kicker="Type" title="Three faces, one scale." dek="app/layout.tsx · globals.css">
              <div className="ds-type">
                <div>
                  <div className="sample disp" style={{ fontWeight: 500 }}>
                    Fraunces
                  </div>
                  <small>--font-display · next/font, opsz axis</small>
                  <small>h1 h2 h3 · .disp · type tiles · wordmark</small>
                  <small>weights 500, 600</small>
                </div>
                <div>
                  <div className="sample">Instrument Sans</div>
                  <small>--font-sans · next/font</small>
                  <small>body, UI, buttons, chips, nav</small>
                  <small>weights 400 to 700</small>
                </div>
                <div>
                  <div className="sample" style={{ fontFamily: "var(--font-mono)", fontSize: 17 }}>
                    JetBrains Mono
                  </div>
                  <small>--font-mono · next/font</small>
                  <small>.mono: dates, versions, counters</small>
                  <small>weights 400, 500 · tabular numerals</small>
                </div>
              </div>
              <div className="ds-scale" style={{ marginTop: 14 }}>
                <div>
                  <div className="k">
                    <b>.pagehead h1</b>clamp(38px, 6vw, 68px) · sub-page heads
                  </div>
                  <div className="pagehead" style={{ padding: 0 }}>
                    <h1>The building blocks.</h1>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.hero-band h1</b>clamp(30px, 3.6vw, 46px) · the opening line
                  </div>
                  <div className="hero-band" style={{ padding: 0, display: "block" }}>
                    <h1>Hey. I&apos;m Anthony. I design and build software, games and music.</h1>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.banner h2</b>32px · world page featured banner
                  </div>
                  <div className="banner" style={{ display: "block", border: 0, margin: 0, background: "none" }}>
                    <h2>Light Gray RPG</h2>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.sec-head h2</b>22px · section titles
                  </div>
                  <div className="sec-head" style={{ padding: 0 }}>
                    <h2>Everything I make lives in one of these.</h2>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.preview h3</b>20px · workshop preview
                  </div>
                  <div className="preview" style={{ position: "static", border: 0, background: "none" }}>
                    <h3>Light Gray RPG</h3>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.cap h3</b>19px · capsule titles
                  </div>
                  <div className="cap" style={{ border: 0, background: "none" }}>
                    <h3>Light Gray RPG</h3>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.pagehead .dek</b>17px · ink-soft · 66ch
                  </div>
                  <div className="pagehead" style={{ padding: 0 }}>
                    <p className="dek">Every dated thing that has happened to a project, newest first.</p>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.copy</b>16px / 1.65 · ink-soft · 66ch · project bodies
                  </div>
                  <div className="copy">
                    <p>Light Gray started as a way to learn PHP and got out of hand: close to a thousand locations, more than fifty quests.</p>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>body</b>15px / 1.5 · ink
                  </div>
                  <div>The default text size. Cards and rails step down to 13 and 13.5.</div>
                </div>
                <div>
                  <div className="k">
                    <b>.kicker · .kicker.mut</b>11px · 700 · .18em · uppercase
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Kicker>Featured &amp; fresh</Kicker>
                    <Kicker muted>Games · Game</Kicker>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.mast-nav .tab</b>13px · 700 · .14em · uppercase
                  </div>
                  <div className="mast-nav" style={{ justifyContent: "flex-start", border: 0, padding: 0 }}>
                    <ul>
                      <li>
                        <a className="tab" href="#type">
                          Games
                        </a>
                      </li>
                      <li>
                        <a className="tab on" href="#type">
                          Active
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.mono</b>12px · tabular numerals
                  </div>
                  <div className="mono">2026-09-26 · v0.1.8 · 3 / 4</div>
                </div>
                <div>
                  <div className="k">
                    <b>.stats</b>muted, with ink numbers
                  </div>
                  <div className="stats mono">
                    <span>
                      <b>6</b> projects
                    </span>
                    <span>
                      <b>2</b> live or playable
                    </span>
                  </div>
                </div>
                <div>
                  <div className="k">
                    <b>.crumbs</b>12.5px · muted
                  </div>
                  <Crumbs items={[{ label: "AC.", href: "/" }, { label: "Games", href: "/games" }, { label: "Light Gray RPG" }]} />
                </div>
                <div>
                  <div className="k">
                    <b>.moon-txt · .orb-label</b>10px and 15px · the orbit
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="orb-label text-[15px] font-semibold leading-tight tracking-tight">Games</span>
                    <span className="moon-txt" style={{ opacity: 1 }}>
                      Light Gray
                    </span>
                  </div>
                </div>
              </div>
            </Sec>

            {/* ------------------------------------------------ Primitives */}
            <Sec id="primitives" kicker="Primitives" title="The small parts everything else is built from." dek="components/ui.tsx">
              <Spec name="StatusGlyph" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "StatusGlyph")} note="Status drawn as a mark that grows. Carries data-status so CSS can tint it in the flyout.">
                <div className="ds-row">
                  {STATUSES.map((s) => (
                    <Cell key={s} label={`${s} · ${STATUS_FACTS[s].glyph}`}>
                      <div className="ds-glyph" data-hot={HOT.includes(s)}>
                        <StatusGlyph status={s} />
                      </div>
                    </Cell>
                  ))}
                </div>
              </Spec>
              <Spec name="StatusChip" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "StatusChip")} note="Glyph plus label. live, playable and prototype get the accent (.chip.hot); onImage is the white-on-photo variant.">
                <div className="ds-row">
                  {STATUSES.map((s) => (
                    <StatusChip key={s} status={s} />
                  ))}
                </div>
                <div className="ds-row">
                  <div className="ds-photo">
                    {STATUSES.map((s) => (
                      <StatusChip key={s} status={s} onImage />
                    ))}
                  </div>
                </div>
              </Spec>
              <Spec name="Tags" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "Tags")} note="Two to four short words. The world sets the tint: .t-games, .t-music, .t-design.">
                <div className="ds-row">
                  {worlds.map((w) => (
                    <Cell key={w.id} label={`.tags.t-${w.id}`}>
                      <Tags items={projectsInWorld(w)[0]?.tags ?? ["Tag", "Tag"]} world={w.id} />
                    </Cell>
                  ))}
                </div>
              </Spec>
              <Spec name="TypeTile" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "TypeTile")} note="Stands in for artwork that does not exist yet. Letters come from project.mark or initials(project).">
                <div className="ds-row top">
                  {[fixtureBare, ...projects.filter((p) => !p.hero).slice(0, 2), projects.find((p) => p.slug === "light-gray")!].map((p) => (
                    <Cell key={p.slug} label={`${p.name} → ${initials(p)}`} style={{ width: 200 }}>
                      <div className="w-full">
                        <TypeTile mark={initials(p)} className="cap-img" />
                      </div>
                    </Cell>
                  ))}
                  <Cell label="custom note" style={{ width: 200 }}>
                    <div className="w-full">
                      <TypeTile mark="BT" note="screenshot coming" className="cap-img" />
                    </div>
                  </Cell>
                </div>
              </Spec>
              <Spec name="Kicker" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "Kicker")} note="The small caps label above things. Accent by default, muted on request.">
                <div className="ds-row">
                  <Cell label="default">
                    <Kicker>Featured &amp; fresh</Kicker>
                  </Cell>
                  <Cell label="muted">
                    <Kicker muted>Games · Game</Kicker>
                  </Cell>
                </div>
              </Spec>
              <Spec name="SectionHead" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "SectionHead")} note="Kicker, optional headline, and a link or a note on the right. rule=true draws the 2px ink rule on top.">
                <SectionHead kicker="With a title and a link" title="Playable, on paper, on the table." more="All games →" moreHref="#primitives" />
                <SectionHead kicker="With a dek instead" title="What changed, and when." dek="newest first" />
                <SectionHead kicker="Kicker only, no rule" rule={false} />
              </Spec>
              <Spec name="Crumbs" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "Crumbs")}>
                <Crumbs items={[{ label: "AC.", href: "/" }, { label: "Games", href: "/games" }, { label: "Light Gray RPG" }]} />
              </Spec>
              <Spec name="Btn" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "Btn")} note="A link styled as a button. No href or disabled renders a span. External hrefs open in a new tab and get the ExternalMark.">
                <div className="ds-row">
                  <Cell label="default">
                    <Btn href="#primitives">See the project</Btn>
                  </Cell>
                  <Cell label="primary">
                    <Btn href="#primitives" primary>
                      Play
                    </Btn>
                  </Cell>
                  <Cell label="small">
                    <Btn href="#primitives" small>
                      Enter →
                    </Btn>
                  </Cell>
                  <Cell label="ghost">
                    <Btn href="#primitives" ghost>
                      Ghost
                    </Btn>
                  </Cell>
                  <Cell label="disabled">
                    <Btn disabled>Play · opens in a few months</Btn>
                  </Cell>
                  <Cell label="external">
                    <Btn href="https://www.archimedesgames.com">Visit Archimedes</Btn>
                  </Cell>
                  <Cell label="onImage">
                    <div className="ds-photo">
                      <Btn href="#primitives" primary small>
                        Read the changelog
                      </Btn>
                      <Btn href="#primitives" small onImage>
                        All games
                      </Btn>
                    </div>
                  </Cell>
                </div>
              </Spec>
              <Spec name="ExternalMark · isExternal" file="components/ui.tsx" usedOn={usedOn("components/ui.tsx", "ExternalMark")} note="The ↗ after any link that leaves the site, and the test that decides.">
                <div className="ds-row">
                  <span>
                    LinkedIn
                    <ExternalMark />
                  </span>
                  <span className="ds-mono dim">isExternal(&quot;https://…&quot;) → true · isExternal(&quot;/games&quot;) → false</span>
                </div>
              </Spec>
            </Sec>

            {/* ------------------------------------------------ Playground */}
            <Sec id="playground" kicker="Playground" title="Flip the props, watch every part react." dek="components/system/Playground.tsx">
              <div className="spec">
                <div className="spec-body">
                  <Playground art={art} />
                </div>
              </div>
            </Sec>

            {/* ------------------------------------------------ Components */}
            <Sec id="components" kicker="Components" title="Every component, with real records and the fixture." dek="components/">
              <Spec name="Capsule · CapsuleGrid" file="components/Capsule.tsx" usedOn={usedOn("components/Capsule.tsx")} note="The project card. Takes CapsuleData from toCapsule(project), which is serializable so the same card renders on the server and inside client tabs and filters.">
                <div className="grid3">
                  <Capsule p={toCapsule(withHero)} />
                  <Capsule p={toCapsule(squareOne)} />
                  <Capsule p={tileOne === fixtureBare ? bareCap : toCapsule(tileOne)} />
                </div>
                <div className="ds-row" style={{ marginTop: 14 }}>
                  <span className="ds-lbl">real: 16:9 hero · square + bar · type tile</span>
                </div>
                <div className="grid3" style={{ marginTop: 14 }}>
                  <Capsule p={fixtureCap} />
                  <Capsule p={bareCap} />
                </div>
                <div className="ds-row" style={{ marginTop: 14 }}>
                  <span className="ds-lbl">fixture: every field · required fields only</span>
                </div>
              </Spec>
              <Spec name="EntryList" file="components/Entries.tsx" usedOn={usedOn("components/Entries.tsx", "EntryList")} note="A project's changelog. Fixture entries: full precision with note, link and version; month precision with an internal link; year precision alone.">
                <EntryList entries={entriesOf(fixture)} />
              </Spec>
              <Spec name="LogList" file="components/Entries.tsx" usedOn={usedOn("components/Entries.tsx", "LogList")} note="Entries across projects, with the project and world as kickers. The four newest on the site:">
                <LogList entries={latestEntries(4)} />
              </Spec>
              <Spec name="Featured" file="components/Featured.tsx" usedOn={usedOn("components/Featured.tsx")} note="Featured & fresh. Auto-advances every six seconds with play/pause, a counter and a progress bar; pauses in a hidden tab, starts paused under reduced motion. First item is the fixture, then the real four.">
                <Featured items={featuredWithFixture} />
              </Spec>
              <Spec name="FilteredGrid" file="components/Filters.tsx" usedOn={usedOn("components/Filters.tsx")} note="Filter chips over a capsule grid. A filter is a set of statuses or kinds; the world page drops filters that would be empty. Games, with every filter:">
                <FilteredGrid items={[...projectsInWorld(games), ...alsoInWorld(games)].map(toCapsule)} filters={gameFilters} />
              </Spec>
              <Spec name="HeroCarousel" file="components/HeroCarousel.tsx" usedOn={usedOn("components/HeroCarousel.tsx")} note="A project's hero with its screenshot strip. Slides are images or pending tiles (galleryPending). The fixture: hero, one gallery image, two pending.">
                <div style={{ maxWidth: 720 }}>
                  <HeroCarousel slides={fixtureSlides} />
                </div>
              </Spec>
              <Spec name="Workshop" file="components/Workshop.tsx" usedOn={usedOn("components/Workshop.tsx")} note="In the workshop: tabs from workshopTabs() with a hover preview. Real data.">
                <Workshop tabs={workshopTabs()} />
              </Spec>
              <Spec name="OrbitalNav" file="components/OrbitalNav.tsx" usedOn={usedOn("components/OrbitalNav.tsx")} note="Three worlds drift around the hub with their projects as moons. One requestAnimationFrame loop, asleep off-screen and under reduced motion. Geometry constants sit at the top of the file: BOX 560, RING 33%, moon radius 78 → 106, periods 150s / 58s 46s 64s. Below md it is three cards.">
                <OrbitalNav worlds={orbit} />
              </Spec>
              <Spec name="Masthead · MastheadClient" file="components/Masthead.tsx" usedOn={usedOn("components/Masthead.tsx")} note="At the top of this page. Server wrapper builds navItems and paletteItems; the client half owns the flyouts (hover or focus a world tab; Escape closes; none on touch or once the nav wraps) and the active tab. A static flyout row is in the playground.">
                <p className="ds-note">
                  Flyouts need <code>(hover: hover) and (min-width: 901px)</code>. Open delay 70ms, close delay 140ms. The tree comes from <code>navItems</code>, own projects first, guests from other worlds under a hairline.
                </p>
              </Spec>
              <Spec name="CommandPalette" file="components/CommandPalette.tsx" usedOn={usedOn("components/CommandPalette.tsx")} note="⌘K or the search pill. Filters paletteItems by label or group; arrows move, Enter goes, Escape closes. External hrefs open in a new tab.">
                <p className="ds-note">
                  {paletteItems.length} items: {navItems.length} pages and {projects.length} projects grouped by world. Try it from the masthead above.
                </p>
              </Spec>
              <Spec name="ThemeToggle · ThemeScript" file="components/ThemeToggle.tsx" usedOn={usedOn("components/ThemeToggle.tsx")} note="Flips .dark on <html>, sets data-theme, saves ac-theme. ThemeScript runs inline in <head> before paint so there is no flash. This instance is live:">
                <div className="ds-row">
                  <ThemeToggle />
                  <span className="ds-mono dim">Tailwind classes, not a globals.css rule: the only primitive styled that way.</span>
                </div>
              </Spec>
              <Spec name="Mark" file="components/Mark.tsx" usedOn={usedOn("components/Mark.tsx")} note="The A, inlined from public/img/ac-mark.svg through mark-path.ts. Inherits fill from CSS; .mark-icon is 80px (60 below 900px), the footer wordmark is 26px.">
                <div className="ds-row">
                  <Cell label=".mark-icon · 80">
                    <Mark />
                  </Cell>
                  <Cell label="40px, accent">
                    <Mark className="h-10 w-10 fill-accent" />
                  </Cell>
                  <Cell label=".foot .word · 26">
                    <span className="foot" style={{ margin: 0, padding: 0, border: 0, display: "inline-block" }}>
                      <span className="word">
                        <Mark className="" />
                        <span>
                          AC<span>.</span>
                        </span>
                      </span>
                    </span>
                  </Cell>
                </div>
              </Spec>
              <Spec name="Backdrop" file="components/Backdrop.tsx" usedOn={usedOn("components/Backdrop.tsx")} note="The photo ghosted behind the top of every page and dissolved before the fold (.page-photo: 1100px tall, 16% opacity light, 24% dark, masked to transparent). A world can bring its own pair.">
                <div className="ds-thumbs">
                  <div className="ds-thumb">
                    <img src={site.backdrop.light} alt="" loading="lazy" />
                    <div>
                      <b>site.backdrop.light</b>
                      {site.backdrop.light}
                    </div>
                  </div>
                  <div className="ds-thumb">
                    <img src={site.backdrop.dark} alt="" loading="lazy" />
                    <div>
                      <b>site.backdrop.dark</b>
                      {site.backdrop.dark}
                    </div>
                  </div>
                  {worlds.filter((w) => w.backdrop).map((w) => (
                    <div key={w.id} className="ds-thumb">
                      <img src={w.backdrop!.dark} alt="" loading="lazy" />
                      <div>
                        <b>{w.name} · own backdrop</b>
                        {w.backdrop!.dark}
                      </div>
                    </div>
                  ))}
                </div>
                {worlds.every((w) => !w.backdrop) && <p className="ds-note">No world overrides the site backdrop yet.</p>}
              </Spec>
              <Spec name="Footer" file="components/Footer.tsx" usedOn={usedOn("components/Footer.tsx")} note="At the bottom of this page. Composed like the original site's footer: headline, subhead, the nav, the site story, the portrait, the contact line, the small print. Copy is site.footer; the portrait is person.portrait.">
                <p className="ds-note">
                  Reads <code>navItems</code>, so the System tab is down there too until it is removed.
                </p>
              </Spec>
              <Spec name="useCarousel · PlayPause" file="components/useCarousel.tsx" usedOn={usedOn("components/useCarousel.tsx")} note="The hook behind Featured and HeroCarousel: index, show(n), playing, toggle, progress 0 to 1. Pauses on visibilitychange; starts paused under prefers-reduced-motion. PlayPause is in the playground.">
                <p className="ds-note">Durations: Featured 6000ms, HeroCarousel 5000ms, both props.</p>
              </Spec>
            </Sec>

            {/* ------------------------------------------------ Home sections */}
            <Sec id="sections" kicker="Home sections" title="The front page's modules, each a function of the records." dek="components/Home.tsx">
              <div className="cols" style={{ marginTop: 14 }}>
                <div>
                  <Spec name="WorldsTiles" file="components/Home.tsx" usedOn={usedOn("components/Home.tsx", "WorldsTiles")} note="Three worlds: image, project count, tagline, first three names." bare>
                    <div style={{ padding: 14 }}>
                      <WorldsTiles />
                    </div>
                  </Spec>
                  <Spec name="WorldGrid" file="components/Home.tsx" usedOn={usedOn("components/Home.tsx", "WorldGrid")} note="SectionHead plus the first n capsules of a world in featured order. The home page calls it three times: games 6, design 3, music 3.">
                    <div className="grid3">
                      {projectsInWorld(design)
                        .slice(0, 3)
                        .map(toCapsule)
                        .map((c) => (
                          <Capsule key={c.slug} p={c} />
                        ))}
                    </div>
                  </Spec>
                  <Spec name="HeroOrbit · FeaturedSection · WorkshopSection" file="components/Home.tsx" usedOn={usedOn("components/Home.tsx", "HeroOrbit")} note="Thin wrappers: HeroOrbit is the person's line beside OrbitalNav(orbitData()); FeaturedSection is a SectionHead over Featured(featuredItems()); WorkshopSection is Workshop(workshopTabs()). All three are shown above as their components.">
                    <p className="ds-note">
                      Hero copy comes from <code>person.hero</code>; the kicker is <code>person.location</code> and <code>person.since</code>.
                    </p>
                  </Spec>
                </div>
                <aside className="flex flex-col">
                  <Spec name="NowPlaying" file="components/Home.tsx" usedOn={usedOn("components/Home.tsx", "NowPlaying")} note="Hand-picked in person.nowPlaying until AC Music has a feed.">
                    <NowPlaying />
                  </Spec>
                  <Spec name="Editor" file="components/Home.tsx" usedOn={usedOn("components/Home.tsx", "Editor")} note="person.portrait and person.editorBlurb.">
                    <Editor />
                  </Spec>
                </aside>
              </div>
            </Sec>

            {/* ------------------------------------------------ Patterns */}
            <Sec id="patterns" kicker="Patterns" title="Compositions that are only markup and a class." dek="globals.css · used inline in pages">
              <p className="ds-note">These have no component of their own. A page writes the markup and globals.css does the rest. Rendered here with the fixture.</p>
              <Spec name=".pagehead + .stats" file="app/[world]/page.tsx" note="Kicker, h1, dek, then the mono stat line on status-listing worlds.">
                <div className="pagehead" style={{ padding: 0 }}>
                  <Kicker>Games · in the browser, on paper, on the table</Kicker>
                  <h1>{games.headline}</h1>
                  <p className="dek">{games.intro.join(" ")}</p>
                  <div className="stats mono">
                    <span>
                      <b>{projectsInWorld(games).length}</b> projects
                    </span>
                    <span>
                      <b>{projectsInWorld(games).filter((p) => p.status === "playable" || p.status === "live").length}</b> live or playable
                    </span>
                    <span>
                      <b>{projectsInWorld(games).filter((p) => p.status === "prototype").length}</b> building
                    </span>
                  </div>
                </div>
              </Spec>
              <Spec name=".banner" file="app/[world]/page.tsx" note="The featured project on a status-listing world: the first slug in the world's featured order." bare>
                <div style={{ padding: 14 }}>
                  <div className="banner" style={{ marginBottom: 0 }}>
                    <div className="img">
                      <img src={fixture.hero} alt="" />
                    </div>
                    <div className="b">
                      <Kicker>
                        Featured · {fixture.version} · updated {formatDate(latestEntryOf(fixture)!.date)}
                      </Kicker>
                      <h2>{fixture.name}</h2>
                      <p>{fixture.blurb}</p>
                      <div className="flex items-center gap-3">
                        <StatusChip status={fixture.status} />
                      </div>
                      <Tags items={fixture.tags ?? []} world={fixture.world} />
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Btn href="#patterns" primary>
                          See the project
                        </Btn>
                        <Btn href={fixture.cta?.href} disabled={!fixture.cta?.href}>
                          {fixture.cta?.label}
                        </Btn>
                      </div>
                    </div>
                  </div>
                </div>
              </Spec>
              <Spec name=".rail" file="app/[world]/[slug]/page.tsx" note="The project page's sticky side column: blurb, a dl of status, version, last tended, years, world and any facts; tags; the cta and links.">
                <div style={{ maxWidth: 340 }}>
                  <aside className="rail" style={{ position: "static" }}>
                    <p>{fixture.blurb}</p>
                    <dl>
                      <dt>Status</dt>
                      <dd>
                        <StatusChip status={fixture.status} />
                      </dd>
                      <dt>Version</dt>
                      <dd className="mono">{fixture.version}</dd>
                      <dt>Last tended</dt>
                      <dd className="mono">{formatDate(latestEntryOf(fixture)!.date)}</dd>
                      <dt>Years</dt>
                      <dd className="mono">{fixture.started}–</dd>
                      <dt>World</dt>
                      <dd>
                        <a href="/games" className="text-accent">
                          Games
                        </a>
                      </dd>
                      {fixture.facts?.map((f) => (
                        <span key={f.label} className="contents">
                          <dt>{f.label}</dt>
                          <dd>{f.value}</dd>
                        </span>
                      ))}
                    </dl>
                    <Tags items={fixture.tags ?? []} world={fixture.world} />
                    <div className="acts">
                      <Btn primary disabled>
                        {fixture.cta?.label}
                      </Btn>
                      {fixture.links?.map((l) => (
                        <Btn key={l.href} href={l.href}>
                          {l.label}
                        </Btn>
                      ))}
                    </div>
                  </aside>
                </div>
              </Spec>
              <Spec name=".what" file="app/[world]/page.tsx · about · archive" note="Two-column definition grid: a bold name over a muted line. World sections, skills, what's in the archive.">
                <div className="what">
                  {design.sections?.[0]?.items.slice(0, 2).map((it) => (
                    <div key={it.name}>
                      <b>{it.name}</b>
                      <p>{it.text}</p>
                    </div>
                  ))}
                </div>
              </Spec>
              <Spec name=".module + .mod-head + .tabs" file="components/Home.tsx · Workshop.tsx" note="A broadsheet module: 2px ink rule, a kicker head with something on the right, then content. Tabs are the pill row.">
                <section className="module">
                  <div className="mod-head">
                    <Kicker>In the workshop</Kicker>
                    <div className="tabs" role="tablist">
                      <button type="button" role="tab" aria-selected="true" className="on">
                        Fresh commits
                      </button>
                      <button type="button" role="tab" aria-selected="false">
                        Building
                      </button>
                      <button type="button" role="tab" aria-selected="false">
                        Live
                      </button>
                    </div>
                  </div>
                  <p className="ds-note" style={{ margin: 0 }}>
                    Module body.
                  </p>
                </section>
              </Spec>
              <Spec name=".filters" file="components/Filters.tsx" note="Outlined pills; the active one fills with the accent.">
                <div className="filters" style={{ paddingBottom: 0 }}>
                  <button type="button" className="on">
                    All
                  </button>
                  <button type="button">Playable</button>
                  <button type="button">Live</button>
                  <button type="button">Building</button>
                  <button type="button">Resting</button>
                </div>
              </Spec>
              <Spec name=".news" file="components/Entries.tsx" note="The changelog list: a 110px mono date column, then title, version chip and note. EntryList and LogList above are this.">
                <p className="ds-note" style={{ margin: 0 }}>
                  See EntryList and LogList in Components.
                </p>
              </Spec>
              <Spec name=".copy" file="app/[world]/[slug]/page.tsx · about" note="Reading measure for body paragraphs.">
                <Story blocks={fixture.body ?? []} />
              </Spec>
            </Sec>

            {/* ------------------------------------------------ CSS inventory */}
            <Sec id="css" kicker="CSS inventory" title="Every rule in globals.css, grouped as the file groups them." dek={`${data.css.totalRules} rules · ${data.css.totalClasses} classes · ${data.css.totalKeyframes} keyframes`}>
              <p className="ds-note">
                Parsed from the file at build time. <b>Used on</b> lists the tsx files whose string literals contain the class name, so it is a fast, slightly generous trace: a match on a short class like <code>.on</code> or <code>.t</code> can be a coincidence. Rules under an <code>@media</code> show the query beside the selector. State hooks are <code>data-*</code> attributes the selectors key off.
              </p>
              <Sub kicker="Media queries">
                <div className="ds-row" style={{ marginTop: 6 }}>
                  {data.css.media.map((m) => (
                    <span key={m} className="chip">
                      {m}
                    </span>
                  ))}
                </div>
              </Sub>
              {data.css.sections.map((s) => (
                <Sub key={s.title} kicker={`${s.title} · ${s.rules.length} rules${s.keyframes.length ? ` · ${s.keyframes.length} keyframes` : ""}`}>
                  {s.note && <p className="ds-note">{s.note}</p>}
                  {s.classes.length > 0 && (
                    <Table head={["Class", "Rules", "State hooks", "Used on"]}>
                      {s.classes.map((c) => {
                        const states = Array.from(new Set(s.rules.filter((r) => r.roots.includes(c.name)).flatMap((r) => r.states)));
                        return (
                          <tr key={c.name}>
                            <td className="ds-mono">.{c.name}</td>
                            <td className="dim">{c.rules}</td>
                            <td className="ds-mono dim">{states.join(" ")}</td>
                            <td>
                              <UsedOn items={c.usedOn} empty="no tsx match" />
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                  )}
                  <details className="ds-det">
                    <summary>
                      Show the {s.rules.length} rules{s.keyframes.length ? ` and ${s.keyframes.length} keyframes` : ""}
                    </summary>
                    {s.rules.map((r, i) => (
                      <div key={i} className="ds-rule">
                        <div className="sel">
                          <span>{r.selector}</span>
                          {r.media && <span className="md">@media {r.media}</span>}
                          {r.note && <span className="cm">{r.note}</span>}
                        </div>
                        <div className="dec">{r.decls.map((d) => `${d.prop}: ${d.value};`).join(" ")}</div>
                      </div>
                    ))}
                    {s.keyframes.map((k) => (
                      <div key={k.name} className="ds-rule">
                        <div className="sel">
                          <span>@keyframes {k.name}</span>
                        </div>
                        <div className="dec">{k.body}</div>
                      </div>
                    ))}
                  </details>
                </Sub>
              ))}
            </Sec>

            {/* ------------------------------------------------ Content model */}
            <Sec id="model" kicker="Content model" title="Four nouns, typed once." dek="content/types.ts">
              <p className="ds-note">{fileOf("content/types.ts")?.doc}</p>
              {data.types.map((t) => (
                <Sub key={t.name} kicker={t.name}>
                  {t.doc && <p className="ds-note">{t.doc}</p>}
                  {t.union.length > 0 && (
                    <div className="ds-row" style={{ marginTop: 8 }}>
                      {t.union.map((u) => (
                        <span key={u} className="chip">
                          {t.name === "Status" && <StatusGlyph status={u as Status} />}
                          {u}
                        </span>
                      ))}
                    </div>
                  )}
                  {t.alias && <p className="ds-mono">{t.alias}</p>}
                  {t.fields.length > 0 && (
                    <Table head={["Field", "Type", "Required", "Meaning"]}>
                      {t.fields.map((f) => (
                        <tr key={f.name}>
                          <td className="ds-mono">{f.name}</td>
                          <td className="ds-mono dim">{f.type}</td>
                          <td>
                            <Yes on={!f.optional} />
                          </td>
                          <td className="dim">{f.doc}</td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </Sub>
              ))}
              <Sub kicker="Where each noun lives">
                <Table head={["Noun", "How many", "File", "Renders"]}>
                  <tr>
                    <td>Person</td>
                    <td>one</td>
                    <td className="ds-mono">content/person.ts</td>
                    <td className="dim">masthead name, hero line, editor box, now playing, about page</td>
                  </tr>
                  <tr>
                    <td>World</td>
                    <td>{worlds.length}</td>
                    <td className="ds-mono">content/worlds.ts</td>
                    <td className="dim">nav tabs and flyouts, orbs, world tiles, the three doors</td>
                  </tr>
                  <tr>
                    <td>Project</td>
                    <td>{projects.length}</td>
                    <td className="ds-mono">content/projects/&lt;slug&gt;.ts, registered in index.ts</td>
                    <td className="dim">capsules, moons, workshop rows, project pages</td>
                  </tr>
                  <tr>
                    <td>Entry</td>
                    <td>{entries.length}</td>
                    <td className="ds-mono">on its project: entries: []</td>
                    <td className="dim">the hub caption, changelogs, /log, workshop tabs, sitemap lastModified</td>
                  </tr>
                  <tr>
                    <td>Featured</td>
                    <td>{featured.length}</td>
                    <td className="ds-mono">content/featured.ts</td>
                    <td className="dim">the home carousel</td>
                  </tr>
                  <tr>
                    <td>Site</td>
                    <td>one</td>
                    <td className="ds-mono">content/site.ts</td>
                    <td className="dim">metadata, footer version line, backdrop pair, archive link, email</td>
                  </tr>
                </Table>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Records */}
            <Sec id="records" kicker="Records" title="Everything on the site, as data.">
              <Sub kicker={`Worlds · ${worlds.length}`}>
                <Table head={["id", "slug", "name · label", "listing", "featured order", "also", "hero", "backdrop", "sections", "elsewhere"]}>
                  {worlds.map((w) => (
                    <tr key={w.id}>
                      <td className="ds-mono">{w.id}</td>
                      <td className="ds-mono">/{w.slug}</td>
                      <td>
                        {w.name}
                        {w.label ? ` · ${w.label}` : ""}
                      </td>
                      <td className="ds-mono">{w.listing}</td>
                      <td className="ds-mono dim">{w.featured?.join(", ")}</td>
                      <td className="ds-mono dim">{w.also?.join(", ") ?? "–"}</td>
                      <td className="ds-mono dim">{w.hero ?? "–"}</td>
                      <td className="dim">{w.backdrop ? "own" : "site"}</td>
                      <td className="dim">{w.sections?.length ?? 0}</td>
                      <td className="dim">{w.elsewhere?.length ?? 0}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker={`Projects · ${projects.length}`}>
                <Table head={["Project", "world", "kind", "status", "version", "art", "gallery", "pending", "tags", "entries", "latest", "years", "cta", "links", "facts", "bar", "sq"]}>
                  {projects.map((p) => {
                    const latest = latestEntryOf(p);
                    return (
                      <tr key={p.slug}>
                        <td>
                          <a href={projectPath(p)} className="font-semibold hover:text-accent">
                            {p.name}
                          </a>
                          <div className="ds-mono dim">{p.slug}</div>
                        </td>
                        <td className="ds-mono">{p.world}</td>
                        <td className="dim">{p.kind}</td>
                        <td>
                          <StatusChip status={p.status} />
                        </td>
                        <td className="ds-mono dim">{p.version ?? "–"}</td>
                        <td>{p.hero ? <Yes on /> : <span className="ds-mono">tile {initials(p)}</span>}</td>
                        <td className="dim">{p.gallery?.length ?? 0}</td>
                        <td className="dim">{p.galleryPending?.length ?? 0}</td>
                        <td className="dim">{p.tags?.length ?? 0}</td>
                        <td className="dim">{p.entries?.length ?? 0}</td>
                        <td className="ds-mono dim">{latest?.date ?? "–"}</td>
                        <td className="ds-mono dim">{p.started ? `${p.started}–${p.ended ?? ""}` : "–"}</td>
                        <td className="dim">{p.cta ? (p.cta.href ? "link" : "disabled") : "–"}</td>
                        <td className="dim">{p.links?.length ?? 0}</td>
                        <td className="dim">{p.facts?.length ?? 0}</td>
                        <td>{p.bar ? <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: p.bar }} /> : <span className="no">–</span>}</td>
                        <td>
                          <Yes on={Boolean(p.square)} />
                        </td>
                      </tr>
                    );
                  })}
                </Table>
              </Sub>
              <Sub kicker={`Entries · ${entries.length} · newest first`}>
                <Table head={["date", "project", "world", "title", "version", "link", "note"]}>
                  {entries.map((e, i) => (
                    <tr key={`${e.project.slug}-${e.date}-${i}`}>
                      <td className="ds-mono">{e.date}</td>
                      <td>{e.project.name}</td>
                      <td className="dim">{e.world.name}</td>
                      <td>{e.title}</td>
                      <td className="ds-mono dim">{e.version ?? "–"}</td>
                      <td className="ds-mono dim">{e.href ? (e.href.startsWith("http") ? "external" : e.href) : "–"}</td>
                      <td className="dim">{e.note ?? ""}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker={`Featured · ${featured.length} · ${featuredItems().length} resolve to an image`}>
                <Table head={["project", "image", "kicker", "title", "date", "primary", "secondary"]}>
                  {featured.map((f) => (
                    <tr key={f.project + f.title}>
                      <td className="ds-mono">{f.project}</td>
                      <td className="ds-mono dim">{f.image ? `${f.image} (override)` : (projects.find((p) => p.slug === f.project)?.hero ?? "none · dropped")}</td>
                      <td className="dim">{f.kicker}</td>
                      <td>{f.title}</td>
                      <td className="ds-mono dim">{f.date}</td>
                      <td className="dim">
                        {f.primary.label} → {f.primary.href}
                      </td>
                      <td className="dim">{f.secondary ? `${f.secondary.label} → ${f.secondary.href}` : "–"}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker="Person and site">
                <dl className="ds-kv">
                  <dt>person.name · title · role</dt>
                  <dd>
                    {person.name} · {person.title} · {person.role}
                  </dd>
                  <dt>person.location · since</dt>
                  <dd>
                    {person.location} · {person.since}
                  </dd>
                  <dt>person.portrait</dt>
                  <dd className="ds-mono">{person.portrait}</dd>
                  <dt>person.hero.line</dt>
                  <dd>{person.hero.line}</dd>
                  <dt>person.nowPlaying</dt>
                  <dd>
                    {person.nowPlaying.title} · {person.nowPlaying.by} · {person.nowPlaying.note}
                  </dd>
                  <dt>person.timeline</dt>
                  <dd>{person.timeline.length} places</dd>
                  <dt>site.title · tagline</dt>
                  <dd>
                    {site.title} · {site.tagline}
                  </dd>
                  <dt>site.url</dt>
                  <dd className="ds-mono">{site.url}</dd>
                  <dt>site.version · since</dt>
                  <dd className="ds-mono">
                    {site.version} · {site.since}
                  </dd>
                  <dt>site.backdrop</dt>
                  <dd className="ds-mono">
                    {site.backdrop.dark} · {site.backdrop.light}
                  </dd>
                  <dt>site.archiveUrl</dt>
                  <dd className="ds-mono">{site.archiveUrl}</dd>
                  <dt>site.email</dt>
                  <dd className="ds-mono">{site.email}</dd>
                </dl>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Logic */}
            <Sec id="logic" kicker="Logic" title="The functions between the records and the pages." dek="lib/content.ts · lib/nav.ts · lib/format.ts">
              <Sub kicker="Status: one word, seven consequences">
                <p className="ds-note">
                  A project&apos;s status decides its glyph, whether its chip is hot, whether it counts as building, which group and filter it lands in on a world page, which workshop tabs hold it, and how the flyout and the orbit colour it. The sets live in four places: HOT in ui.tsx, BUILDING and groupByStatus in content.ts, the filters in the world page, and data-status rules in globals.css.
                </p>
                <Table head={["status", "label", "glyph", "chip hot", "building()", "groupByStatus", "world filter", "workshop tabs", "flyout glyph", "moon face"]}>
                  {STATUSES.map((s) => {
                    const tabs = ["Fresh commits", BUILDING.includes(s) ? "Building" : "", s === "live" ? "Live" : "", s === "resting" || s === "archived" ? "Resting" : ""].filter(Boolean);
                    if (s === "archived") tabs.shift();
                    return (
                      <tr key={s}>
                        <td className="ds-mono">{s}</td>
                        <td>
                          <StatusChip status={s} />
                        </td>
                        <td className="dim">{STATUS_FACTS[s].glyph}</td>
                        <td>
                          <Yes on={HOT.includes(s)} />
                        </td>
                        <td>
                          <Yes on={BUILDING.includes(s)} />
                        </td>
                        <td className="dim">{groupByStatus([{ ...fixtureBare, status: s }])[0]?.label}</td>
                        <td className="dim">{STATUS_FACTS[s].filter}</td>
                        <td className="dim">{tabs.join(", ")}</td>
                        <td className="dim">{STATUS_FACTS[s].fly}</td>
                        <td className="dim">{STATUS_FACTS[s].moon}</td>
                      </tr>
                    );
                  })}
                </Table>
              </Sub>
              <Sub kicker={`lib/content.ts · ${contentLib?.exports.length ?? 0} exports`}>
                <Table head={["Export", "Kind", "Signature", "What", "Used by"]}>
                  {contentLib?.exports.map((e) => (
                    <tr key={e.name + e.line}>
                      <td className="ds-mono">{e.name}</td>
                      <td className="dim">{e.reexport ? "re-export" : e.kind}</td>
                      <td className="ds-mono dim">{e.signature}</td>
                      <td className="dim">{e.doc}</td>
                      <td>
                        <UsedOn items={contentLib.importedBy.filter((i) => i.symbols.includes(e.name)).map((i) => i.by)} empty="–" />
                      </td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker="Live outputs · what the queries return today">
                <Table head={["Call", "Returns"]}>
                  <tr>
                    <td className="ds-mono">lastShipped()</td>
                    <td className="ds-mono">{lastShipped()}</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">latestEntries(3)</td>
                    <td className="dim">{latestEntries(3).map((e) => `${e.date} · ${e.project.name}: ${e.title}`).join(" — ")}</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">building()</td>
                    <td className="ds-mono dim">{building().map((p) => p.slug).join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">latestActivity()</td>
                    <td className="ds-mono dim">{latestActivity().map((p) => p.slug).join(", ")}</td>
                  </tr>
                  {workshopTabs().map((t) => (
                    <tr key={t.id}>
                      <td className="ds-mono">workshopTabs() → {t.label}</td>
                      <td className="ds-mono dim">{t.items.map((i) => i.slug).join(", ")}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="ds-mono">featuredItems()</td>
                    <td className="dim">{featuredItems().map((f) => f.title).join(" — ")}</td>
                  </tr>
                  {worlds.map((w) => (
                    <tr key={`in-${w.id}`}>
                      <td className="ds-mono">projectsInWorld({w.id})</td>
                      <td className="ds-mono dim">{projectsInWorld(w).map((p) => p.slug).join(", ")}</td>
                    </tr>
                  ))}
                  {worlds.map((w) => (
                    <tr key={`also-${w.id}`}>
                      <td className="ds-mono">alsoInWorld({w.id})</td>
                      <td className="ds-mono dim">{alsoInWorld(w).map((p) => p.slug).join(", ") || "–"}</td>
                    </tr>
                  ))}
                  {worlds.map((w) => (
                    <tr key={`latest-${w.id}`}>
                      <td className="ds-mono">latestEntryInWorld({w.id})</td>
                      <td className="dim">{(() => { const e = latestEntryInWorld(w); return e ? `${e.date} · ${e.project.name}: ${e.title}` : "–"; })()}</td>
                    </tr>
                  ))}
                  {worlds.map((w) => (
                    <tr key={`group-${w.id}`}>
                      <td className="ds-mono">groupByStatus(projectsInWorld({w.id}))</td>
                      <td className="ds-mono dim">{groupByStatus(projectsInWorld(w)).map((g) => `${g.label} [${g.projects.map((p) => p.slug).join(", ")}]`).join(" · ")}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="ds-mono">initials(p)</td>
                    <td className="ds-mono dim">{projects.map((p) => `${p.slug} → ${initials(p)}`).join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">STATUS_LABEL</td>
                    <td className="ds-mono dim">{STATUSES.map((s) => `${s}: ${STATUS_LABEL[s]}`).join(", ")}</td>
                  </tr>
                </Table>
              </Sub>
              <Sub kicker="lib/format.ts · dates at three precisions">
                <Table head={["Call", "Returns", "Used for"]}>
                  <tr>
                    <td className="ds-mono">formatDate(&quot;2026-09-11&quot;) · (&quot;2026-09&quot;) · (&quot;2018&quot;)</td>
                    <td className="ds-mono">
                      {formatDate("2026-09-11")} · {formatDate("2026-09")} · {formatDate("2018")}
                    </td>
                    <td className="dim">every visible date</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">formatMonth(&quot;2026-09-11&quot;) · monthKey(&quot;2026-09-11&quot;)</td>
                    <td className="ds-mono">
                      {formatMonth("2026-09-11")} · {monthKey("2026-09-11")}
                    </td>
                    <td className="dim">grouping /log by month</td>
                  </tr>
                  <tr>
                    <td className="ds-mono">sorting</td>
                    <td className="dim">plain string order on the date, which works for all three precisions</td>
                    <td className="dim">entriesOf, allEntries, byActivity</td>
                  </tr>
                </Table>
              </Sub>
              <Sub kicker="lib/nav.ts · navItems, the site tree">
                <ul className="ds-tree">
                  {navItems.map((n) => (
                    <li key={n.href}>
                      <b>{n.label}</b> <span className="ds-mono dim">{n.href}</span>
                      {n.children && n.children.length > 0 && (
                        <ul>
                          {n.children.map((c) => (
                            <li key={c.href}>
                              <a href={c.href}>
                                <StatusGlyph status={c.status} />
                                {c.label}
                              </a>
                              {c.from && <span className="f">guest from {c.from}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="ds-note">
                  Read by the masthead (tabs and flyouts), the footer and the command palette. <code>paletteItems</code> is {paletteItems.length} entries: {Array.from(new Set(paletteItems.map((p) => p.group))).map((g) => `${g} ${paletteItems.filter((p) => p.group === g).length}`).join(", ")}.
                </p>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Routes */}
            <Sec id="routes" kicker="Routes" title="Every page is static." dek="app/ · next.config.mjs">
              <Table head={["Route", "File", "What", "Components", "Generated"]}>
                {routesList.map((r) => {
                  const f = fileOf(r.file);
                  const comps = f?.imports.filter((i) => i.from.startsWith("components/")).flatMap((i) => i.symbols) ?? [];
                  return (
                    <tr key={r.file}>
                      <td className="ds-mono">
                        <a href={r.params?.[0] ?? (r.file.includes("page.tsx") || r.file.includes("not-found") ? `/${r.file.replace(/^app\//, "").replace(/\/?page\.tsx$/, "").replace("not-found.tsx", "nothing-here")}` : undefined)} className="hover:text-accent">
                          {routeLabel(r.file)}
                        </a>
                      </td>
                      <td className="ds-mono dim">{r.file}</td>
                      <td className="dim">{r.what}</td>
                      <td className="ds-mono dim">{comps.join(", ")}</td>
                      <td className="ds-mono dim">{r.params ? r.params.join(", ") : ""}</td>
                    </tr>
                  );
                })}
              </Table>
              <Sub kicker={`Redirects · ${data.redirects.length} · next.config.mjs`}>
                <Table head={["From", "To", "Permanent"]}>
                  {data.redirects.map((r) => (
                    <tr key={r.source}>
                      <td className="ds-mono">{r.source}</td>
                      <td className="ds-mono">{r.destination}</td>
                      <td>
                        <Yes on={r.permanent} />
                      </td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker={`Sitemap · ${sitemapRows.length} URLs`}>
                <Table head={["URL", "Priority", "Change", "Last modified"]}>
                  {sitemapRows.map((s) => (
                    <tr key={s.url}>
                      <td className="ds-mono">{s.url.replace(site.url, "")}</td>
                      <td className="dim">{s.priority}</td>
                      <td className="dim">{s.changeFrequency}</td>
                      <td className="ds-mono dim">{s.lastModified ? new Date(s.lastModified).toISOString().slice(0, 10) : "–"}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
              <Sub kicker="Metadata">
                <dl className="ds-kv">
                  <dt>title template</dt>
                  <dd className="ds-mono">
                    %s · {site.title} · default &ldquo;{site.title} · {site.tagline}&rdquo;
                  </dd>
                  <dt>metadataBase</dt>
                  <dd className="ds-mono">{site.url}</dd>
                  <dt>openGraph</dt>
                  <dd className="dim">website, siteName, title, description; a project page adds its hero as the image. No site-wide OG image yet.</dd>
                  <dt>twitter</dt>
                  <dd className="dim">summary_large_image</dd>
                  <dt>this page</dt>
                  <dd className="dim">robots noindex, nofollow; not in the sitemap.</dd>
                </dl>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Assets */}
            <Sec id="assets" kicker="Assets" title="What is in public, and who points at it." dek={`public/ · ${data.assets.length} files · ${Math.round(data.assets.reduce((n, a) => n + a.bytes, 0) / 1024)} KB`}>
              <div className="ds-thumbs">
                {data.assets.map((a) => (
                  <div key={a.path} className={`ds-thumb ${a.referencedBy.length === 0 ? "orphan" : ""}`}>
                    <img src={a.path} alt="" loading="lazy" className={a.svg ? "svg" : undefined} />
                    <div>
                      <b>{a.path.replace("/img/", "")}</b>
                      {Math.round(a.bytes / 1024)} KB
                      <br />
                      {a.referencedBy.length ? a.referencedBy.map((r) => r.replace(/^content\/(projects\/)?/, "").replace(/\.tsx?$/, "")).join(", ") : <span className="ds-warn">not referenced</span>}
                    </div>
                  </div>
                ))}
              </div>
              <Sub kicker="Artwork coverage per project">
                <Table head={["Project", "hero", "square", "gallery", "pending tiles", "in featured", "world hero"]}>
                  {projects.map((p) => (
                    <tr key={p.slug}>
                      <td>{p.name}</td>
                      <td>{p.hero ? <span className="ds-mono dim">{p.hero.replace("/img/p/", "")}</span> : <span className="ds-warn">type tile {initials(p)}</span>}</td>
                      <td>
                        <Yes on={Boolean(p.square)} />
                      </td>
                      <td className="ds-mono dim">{p.gallery?.map((g) => g.replace("/img/p/", "")).join(", ") || "–"}</td>
                      <td className="dim">{p.galleryPending?.join(", ") || "–"}</td>
                      <td>
                        <Yes on={featured.some((f) => f.project === p.slug)} />
                      </td>
                      <td className="ds-mono dim">{worlds.find((w) => w.hero === p.hero && p.hero)?.name ?? ""}</td>
                    </tr>
                  ))}
                </Table>
              </Sub>
            </Sec>

            {/* ------------------------------------------------ Files */}
            <Sec id="files" kicker="Files & stack" title="Every source file, what it exports, and who imports it." dek={`${data.files.length} files · node ${data.node}`}>
              <div className="ds-files">
                {data.files.map((f) => (
                  <div key={f.path} className="ds-file">
                    <div className="p">
                      <span>{f.path}</span>
                      {f.client && <i>client</i>}
                      <span className="n">{f.lines} lines</span>
                      {f.exports.length > 0 && <span className="n">exports {f.exports.filter((e) => !e.reexport).map((e) => e.name).join(", ")}</span>}
                      <UsedOn items={f.importedBy.map((i) => i.by)} empty={f.path.startsWith("app/") || f.path === "next.config.mjs" ? "entry" : "not imported"} />
                    </div>
                    {f.doc && <div className="doc">{f.doc}</div>}
                  </div>
                ))}
              </div>
              <Sub kicker="package.json">
                <dl className="ds-kv">
                  {Object.entries(data.pkg.deps).map(([k, v]) => (
                    <span key={k} className="contents">
                      <dt>{k}</dt>
                      <dd className="ds-mono">{v}</dd>
                    </span>
                  ))}
                  {Object.entries(data.pkg.devDeps).map(([k, v]) => (
                    <span key={k} className="contents">
                      <dt>{k} · dev</dt>
                      <dd className="ds-mono">{v}</dd>
                    </span>
                  ))}
                  {Object.entries(data.pkg.scripts).map(([k, v]) => (
                    <span key={k} className="contents">
                      <dt>npm run {k}</dt>
                      <dd className="ds-mono">{v}</dd>
                    </span>
                  ))}
                </dl>
              </Sub>
            </Sec>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

