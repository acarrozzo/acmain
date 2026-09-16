import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ExternalMark, PageHeader, SectionLabel } from "@/components/ui";
import { navItems } from "@/components/nav";
import { site } from "@/content/site";
import {
  alsoInWorld,
  groupByStatus,
  projectsInWorld,
  worldBySlug,
  worlds,
} from "@/lib/content";

type Params = Promise<{ world: string }>;

export function generateStaticParams() {
  return worlds.map((w) => ({ world: w.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { world } = await params;
  const w = worldBySlug(world);
  if (!w) return {};
  return { title: w.label ?? w.name, description: w.headline };
}

export default async function WorldPage({ params }: { params: Params }) {
  const { world } = await params;
  const w = worldBySlug(world);
  if (!w) notFound();

  const mine = projectsInWorld(w);
  const also = alsoInWorld(w);

  return (
    <main>
      <SiteNav items={navItems} />
      <PageHeader eyebrow={w.name} title={w.headline} intro={w.intro} />

      {w.listing === "featured" ? (
        <section className="container-page pb-16 md:pb-20">
          <SectionLabel>Selected work</SectionLabel>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
            {also.map((p) => (
              <ProjectCard key={p.slug} project={p} showWorld />
            ))}
          </div>
        </section>
      ) : (
        <div className="container-page flex flex-col gap-14 pb-16 md:pb-20">
          {groupByStatus(mine).map((g) => (
            <section key={g.label}>
              <SectionLabel>{g.label}</SectionLabel>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.projects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </section>
          ))}
          {also.length > 0 && (
            <section>
              <SectionLabel>Also lives here</SectionLabel>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {also.map((p) => (
                  <ProjectCard key={p.slug} project={p} showWorld />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {w.sections?.map((s) => (
        <section key={s.title} className="border-t border-line py-16 md:py-20">
          <div className="container-page">
            <SectionLabel>{s.title}</SectionLabel>
            <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {s.items.map((it) => (
                <div key={it.name}>
                  <dt className="text-lg font-semibold tracking-tight">{it.name}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{it.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}

      {(w.elsewhere || w.id === "design") && (
        <section className="border-t border-line py-16 md:py-20">
          <div className="container-page grid gap-10 md:grid-cols-2">
            {w.elsewhere && (
              <div>
                <SectionLabel>Elsewhere</SectionLabel>
                <ul className="mt-5 flex flex-col gap-2">
                  {w.elsewhere.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener"
                        className="text-ink-soft underline-offset-4 hover:text-accent hover:underline"
                      >
                        {l.label}
                        <ExternalMark />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {w.id === "design" && (
              <div>
                <SectionLabel>Get in touch</SectionLabel>
                <p className="mt-5 max-w-md text-lg leading-snug tracking-tight text-ink-soft">
                  The best way to reach me is email. I read all of it.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hi"
                >
                  {site.email}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
