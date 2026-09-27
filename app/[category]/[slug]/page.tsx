import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Mark } from "@/components/Mark";
import { EntryList } from "@/components/Entries";
import { CapsuleGrid } from "@/components/Capsule";
import { HeroCarousel, type Slide } from "@/components/HeroCarousel";
import { Fig, Gallery, Story, Vid } from "@/components/Story";
import { isFigure, isVideo, type Video } from "@/content/types";
import { Btn, Crumbs, Kicker, SectionHead, StatusChip, Tags } from "@/components/ui";
import {
  entriesOf,
  getProject,
  latestEntryOf,
  projects,
  projectsInCategory,
  toCapsule,
  categoryById,
  categoryPath,
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
  const siblings = projectsInCategory(w).filter((s) => s.slug !== p.slug).slice(0, 3).map(toCapsule);

  const slides: Slide[] = [
    ...(p.hero ? [{ kind: "img" as const, src: p.hero, alt: `${p.name} artwork` }] : []),
    ...(p.gallery ?? []).map((src, i) => ({ kind: "img" as const, src, alt: `${p.name} screenshot ${i + 2}` })),
    ...(p.galleryPending ?? []).map((label) => ({ kind: "tile" as const, label })),
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

  return (
    <>
      <Masthead backdrop={w.backdrop} />
      <main className="container-page">
        <Crumbs items={[{ label: "Home", href: "/" }, { label: w.label ?? w.name, href: categoryPath(w) }, { label: p.name }]} />
        <div className="pagehead">
          <div className="flex flex-wrap items-center gap-3">
            <Kicker>{p.kind}</Kicker>
            <StatusChip status={p.status} />
            <span className="mono text-muted">
              {[p.version, latest ? `last tended ${formatDate(latest.date)}` : null, years].filter(Boolean).join(" · ")}
            </span>
          </div>
          <h1>{p.name}</h1>
          <p className="dek">{p.line}</p>
        </div>

        <div className="proj">
          <Gallery figures={figures}>
            <div className="flex flex-col">
              {lead ? (
                <Fig f={lead} lead />
              ) : leadVids.length > 0 ? (
                <div className={leadVids.length > 1 ? "vid-row" : undefined}>
                  {leadVids.map((v) => (
                    <Vid key={v.video} v={v} />
                  ))}
                </div>
              ) : slides.length > 0 && !inline ? (
                <HeroCarousel slides={slides} />
              ) : inline ? null : (
                <div className="type-tile hero" />
              )}

              {blocks && blocks.length > 0 && (
                <section className="sec">
                  <SectionHead kicker={p.category === "games" ? "About this game" : "About"} />
                  <Story blocks={blocks} />
                </section>
              )}

              {entries.length > 0 && (
                <section className="sec">
                  <SectionHead kicker="Changelog" title="What changed, and when." dek="newest first" />
                  <EntryList entries={entries} />
                </section>
              )}
            </div>
          </Gallery>

          <aside className="rail">
            <p>{p.blurb ?? p.line}</p>
            <dl>
              <dt>Status</dt>
              <dd>
                <StatusChip status={p.status} />
              </dd>
              {p.version && (
                <>
                  <dt>Version</dt>
                  <dd className="mono">{p.version}</dd>
                </>
              )}
              {latest && (
                <>
                  <dt>Last tended</dt>
                  <dd className="mono">{formatDate(latest.date)}</dd>
                </>
              )}
              {years && (
                <>
                  <dt>Years</dt>
                  <dd className="mono">{years}</dd>
                </>
              )}
              <dt>Category</dt>
              <dd>
                <a href={categoryPath(w)} className="text-accent">
                  {w.name}
                </a>
              </dd>
              {p.facts?.map((f) => (
                <span key={f.label} className="contents">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </span>
              ))}
            </dl>
            <Tags items={p.tags ?? []} category={p.category} />
            {(p.cta || (p.links && p.links.length > 0)) && (
              <div className="acts">
                {p.cta && (
                  <Btn href={p.cta.href} primary disabled={!p.cta.href}>
                    {p.cta.label}
                  </Btn>
                )}
                {p.links?.map((l) => (
                  <Btn key={l.href} href={l.href}>
                    {l.label}
                  </Btn>
                ))}
              </div>
            )}
          </aside>
        </div>

        {inline && (
          <div className="fin" aria-hidden="true">
            <Mark className="fin-mark" />
          </div>
        )}

        {siblings.length > 0 && (
          <section className="sec sec-after">
            <SectionHead kicker={`More in ${w.name}`} more={`All of ${w.name} →`} moreHref={categoryPath(w)} />
            <CapsuleGrid items={siblings} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
