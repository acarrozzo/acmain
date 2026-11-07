import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/Entries";
import { Preview } from "@/components/home/Preview";
import { CompactRows } from "@/components/home/Sections";
import { Fig, Gallery, Story, Vid } from "@/components/Story";
import { isFigure, isVideo, type Video } from "@/content/types";
import {
  entriesOf,
  getProject,
  latestEntryOf,
  projects,
  projectsInCategory,
  projectPath,
  categoryById,
  categoryPath,
  STATUS_LABEL,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

type Params = Promise<{ category: string; slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ category: categoryById(p.category).slug, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const p = getProject(category, slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.line,
    openGraph: p.hero ? { images: [p.hero] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const p = getProject(category, slug);
  if (!p) notFound();

  const w = categoryById(p.category);
  const entries = entriesOf(p);
  const latest = latestEntryOf(p);
  const siblingProjects = projectsInCategory(w).filter((s) => s.slug !== p.slug).slice(0, 4);

  /** The screenshot strip: the hero first, then the gallery. */
  const slides: { src: string; caption?: string }[] = [
    ...(p.hero ? [{ src: p.hero, caption: "Artwork" }] : []),
    ...(p.gallery ?? []).map((src, i) => ({ src, caption: `Screen ${i + 2}` })),
  ];
  const years = p.started && p.ended ? `${p.started}–${p.ended}` : p.started ? `${p.started}–` : null;

  /**
   * A body with figures or clips is a story: it tells its story inline and
   * skips the screenshot strip. When it opens on a figure, that figure leads
   * the page; when it opens on clips, they lead as a row.
   */
  const body = p.body ?? [];
  const inline = body.some((b) => isFigure(b) || isVideo(b));
  const first = body[0];
  const lead = inline && first && isFigure(first) ? first : null;
  const leadVids: Video[] = [];
  if (inline && !lead) for (const b of body) { if (isVideo(b)) leadVids.push(b); else break; }
  const blocks = lead ? body.slice(1) : body.slice(leadVids.length);
  const figures = body.filter(isFigure);

  const facts: { k: string; v: React.ReactNode }[] = [
    { k: "Status", v: STATUS_LABEL[p.status] },
    ...(p.version ? [{ k: "Version", v: p.version }] : []),
    ...(latest ? [{ k: "Last tended", v: formatDate(latest.date) }] : []),
    ...(years ? [{ k: "Years", v: years }] : []),
    { k: "Category", v: <a href={categoryPath(w)}>{w.name}</a> },
    ...(p.facts ?? []).map((f) => ({ k: f.label, v: f.value })),
  ];

  return (
    <>
      <Masthead />
      <main className="home h-top">
        <nav className="h-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><a href={categoryPath(w)}>{w.label ?? w.name}</a><i>/</i><span>{p.name}</span></nav>
        <div className="h-pk"><span>{p.kind}</span>{years && <><i>·</i><span>{years}</span></>}{p.version && <><i>·</i><span>{p.version}</span></>}</div>
        <h1 className="h-page-h1">{p.name}</h1>
        <p className="h-intro">{p.blurb ?? p.line}</p>
        {(p.cta || (p.links && p.links.length > 0)) && (
          <div className="h-btns">
            {p.cta && (p.cta.href ? <a className="h-pri" href={p.cta.href}>{p.cta.label}</a> : <span>{p.cta.label}</span>)}
            {p.links?.filter((l) => l.href !== p.cta?.href).map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
        )}

        <Gallery figures={figures}>
          <div className="h-plate">
            {lead ? (
              <Fig f={lead} lead />
            ) : leadVids.length > 0 ? (
              <div className={leadVids.length > 1 ? "vid-row" : undefined}>
                {leadVids.map((v) => <Vid key={v.video} v={v} />)}
              </div>
            ) : p.hero ? (
              <button type="button" className={`h-th${p.square ? " h-sq" : ""}`} aria-label={`Preview ${p.name}`} data-preview={p.hero} data-name={p.name} data-sub={`${w.name} · ${p.line}`} data-href={projectPath(p)}>
                <img src={p.hero} alt="" />
              </button>
            ) : null}
          </div>

          {blocks && blocks.length > 0 && (
            <section className="h-sec">
              <div className="h-sh"><h2>{p.category === "games" ? "About this game" : "About"}</h2></div>
              <div className="h-body"><Story blocks={blocks} /></div>
            </section>
          )}
        </Gallery>

        <dl className="h-facts">
          {facts.map((f) => <span key={f.k} className="contents"><dt>{f.k}</dt><dd>{f.v}</dd></span>)}
        </dl>

        {slides.length > 1 && !inline && (
          <section className="h-sec">
            <div className="h-sh"><h2>Screens</h2><span className="h-cnt"><span>{slides.length}</span></span></div>
            <div className="h-rows">
              {slides.map((sl) => (
                <div key={sl.src} className="h-row">
                  <button type="button" className="h-th" aria-label={`Preview ${sl.caption ?? p.name}`} data-preview={sl.src} data-name={p.name} data-sub={`${w.name} · ${sl.caption ?? ""}`} data-href={projectPath(p)}>
                    <img src={sl.src} alt="" loading="lazy" />
                  </button>
                  <span className="h-tx"><span>{sl.caption ?? ""}</span></span>
                </div>
              ))}
            </div>
          </section>
        )}

        {entries.length > 0 && (
          <section className="h-sec">
            <div className="h-sh"><h2>Changelog</h2><span className="h-cnt"><span>newest first</span></span></div>
            <EntryList entries={entries} />
          </section>
        )}

        {siblingProjects.length > 0 && (
          <section className="h-sec">
            <div className="h-sh"><h2>More in {w.name}</h2><span className="h-cnt"><a href={categoryPath(w)}>All of {w.name} →</a></span></div>
            <CompactRows list={siblingProjects} cat={w} />
          </section>
        )}
      </main>
      <Footer />
      <Preview />
    </>
  );
}
