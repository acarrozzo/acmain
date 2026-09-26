import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/Entries";
import { CapsuleGrid } from "@/components/Capsule";
import { HeroCarousel, type Slide } from "@/components/HeroCarousel";
import { Btn, Crumbs, Kicker, SectionHead, StatusChip, Tags } from "@/components/ui";
import {
  entriesOf,
  getProject,
  latestEntryOf,
  projects,
  projectsInWorld,
  toCapsule,
  worldById,
  worldPath,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

type Params = Promise<{ world: string; slug: string }>;

export function generateStaticParams() {
  return projects.map((p) => ({ world: worldById(p.world).slug, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { world, slug } = await params;
  const p = getProject(world, slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.line,
    openGraph: p.hero ? { images: [p.hero] } : undefined,
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { world, slug } = await params;
  const p = getProject(world, slug);
  if (!p) notFound();

  const w = worldById(p.world);
  const entries = entriesOf(p);
  const latest = latestEntryOf(p);
  const siblings = projectsInWorld(w).filter((s) => s.slug !== p.slug).slice(0, 3).map(toCapsule);

  const slides: Slide[] = [
    ...(p.hero ? [{ kind: "img" as const, src: p.hero, alt: `${p.name} artwork` }] : []),
    ...(p.gallery ?? []).map((src, i) => ({ kind: "img" as const, src, alt: `${p.name} screenshot ${i + 2}` })),
    ...(p.galleryPending ?? []).map((label) => ({ kind: "tile" as const, label })),
  ];
  const years = p.started && p.ended ? `${p.started}–${p.ended}` : p.started ? `${p.started}–` : null;

  return (
    <>
      <Masthead backdrop={w.backdrop} />
      <main className="container-page">
        <Crumbs items={[{ label: "AC.", href: "/" }, { label: w.label ?? w.name, href: worldPath(w) }, { label: p.name }]} />
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
          <div className="flex flex-col">
            {slides.length > 0 ? <HeroCarousel slides={slides} /> : <div className="type-tile hero" />}

            {p.body && (
              <section className="sec">
                <SectionHead kicker={p.world === "games" ? "About this game" : "About"} />
                <div className="copy">
                  {p.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>
            )}

            {entries.length > 0 && (
              <section className="sec">
                <SectionHead kicker="Changelog" title="What changed, and when." dek="newest first" />
                <EntryList entries={entries} />
              </section>
            )}

            {siblings.length > 0 && (
              <section className="sec">
                <SectionHead kicker={`More in ${w.name}`} more={`All of ${w.name} →`} moreHref={worldPath(w)} />
                <CapsuleGrid items={siblings} />
              </section>
            )}
          </div>

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
              <dt>World</dt>
              <dd>
                <a href={worldPath(w)} className="text-accent">
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
            <Tags items={p.tags ?? []} world={p.world} />
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
      </main>
      <Footer />
    </>
  );
}
