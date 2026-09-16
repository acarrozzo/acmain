import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { EntryList } from "@/components/Entries";
import { Art, ExternalMark, SectionLabel, StatusPill, isExternal } from "@/components/ui";
import { navItems } from "@/components/nav";
import {
  entriesOf,
  getProject,
  projectPath,
  projects,
  projectsInWorld,
  worldById,
  worldPath,
} from "@/lib/content";

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
  const siblings = projectsInWorld(w).filter((s) => s.slug !== p.slug).slice(0, 3);
  const years =
    p.started && p.ended
      ? `${p.started}–${p.ended}`
      : p.started
        ? `${p.started}–`
        : null;

  return (
    <main>
      <SiteNav items={navItems} />
      <article>
        <header className="container-page pt-32 md:pt-40">
          <a href={worldPath(w)} className="text-sm text-muted hover:text-ink">
            ← {w.name}
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted">{p.kind}</span>
            <StatusPill status={p.status} />
            {years && <span className="mono text-[11px] text-muted">{years}</span>}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{p.name}</h1>
          <p className="mt-5 max-w-2xl text-xl leading-snug text-ink-soft md:text-2xl">{p.line}</p>
          {p.links && p.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3">
              {p.links.map((l, i) => {
                const ext = isExternal(l.href);
                const primary = i === 0;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    {...(ext ? { target: "_blank", rel: "noopener" } : {})}
                    className={
                      primary
                        ? "rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hi"
                        : "rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
                    }
                  >
                    {l.label}
                    {ext && <ExternalMark />}
                  </a>
                );
              })}
            </div>
          )}
        </header>

        {p.hero && (
          <div className="container-page mt-12">
            <Art
              src={p.hero}
              alt={p.name}
              className="aspect-[16/9] rounded-2xl border border-line"
              position={p.slug === "coin-and-castle" ? "center top" : undefined}
            />
          </div>
        )}

        {p.body && (
          <section className="container-page mt-12 md:mt-16">
            <div className="copy max-w-2xl text-lg leading-relaxed text-ink-soft">
              {p.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {p.gallery && p.gallery.length > 0 && (
          <section className="container-page mt-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {p.gallery.map((src) => (
                <Art key={src} src={src} alt="" className="aspect-[16/10] rounded-2xl border border-line" />
              ))}
            </div>
          </section>
        )}

        {entries.length > 0 && (
          <section className="container-page mt-16 md:mt-20">
            <SectionLabel>Log</SectionLabel>
            <div className="mt-5 max-w-2xl">
              <EntryList entries={entries} />
            </div>
          </section>
        )}

        {siblings.length > 0 && (
          <section className="container-page mt-16 pb-16 md:mt-20 md:pb-20">
            <SectionLabel>More in {w.name}</SectionLabel>
            <ul className="mt-5 flex flex-wrap gap-3">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <a
                    href={projectPath(s)}
                    className="inline-block rounded-full border border-line-strong px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={worldPath(w)}
                  className="inline-block rounded-full border border-line-strong px-4 py-2 text-sm text-accent transition-colors hover:border-accent"
                >
                  All of {w.name} →
                </a>
              </li>
            </ul>
          </section>
        )}
      </article>
      <Footer />
    </main>
  );
}
