import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { CapsuleGrid } from "@/components/Capsule";
import { FilteredGrid, type Filter } from "@/components/Filters";
import { Btn, Crumbs, ExternalMark, Kicker, SectionHead, StatusChip, Tags } from "@/components/ui";
import { person } from "@/content/person";
import { site } from "@/content/site";
import {
  alsoInCategory,
  latestEntryOf,
  projectPath,
  projectsInCategory,
  toCapsule,
  categoryBySlug,
  categories,
  type Project,
} from "@/lib/content";
import { formatDate } from "@/lib/format";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return categories.map((w) => ({ category: w.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const w = categoryBySlug(category);
  if (!w) return {};
  return { title: w.label ?? w.name, description: w.headline };
}

function count(list: Project[], pred: (p: Project) => boolean) {
  return list.filter(pred).length;
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const w = categoryBySlug(category);
  if (!w) notFound();

  const mine = projectsInCategory(w);
  const also = alsoInCategory(w);
  const lead = mine[0];

  const allFilters: Filter[] = [
    { id: "all", label: "All" },
    { id: "playable", label: "Playable", statuses: ["playable"] },
    { id: "live", label: "Live", statuses: ["live"] },
    { id: "building", label: "Building", statuses: ["prototype", "paper", "idea"] },
    { id: "resting", label: "Resting", statuses: ["resting", "archived"] },
  ];
  const filters = allFilters.filter((f) => !f.statuses || mine.some((p) => f.statuses!.includes(p.status)));

  return (
    <>
      <Masthead backdrop={w.backdrop} />
      <main className="container-page">
        <Crumbs items={[{ label: "AC.", href: "/" }, { label: w.label ?? w.name }]} />

        {w.listing === "status" ? (
          <>
            <div className="pagehead">
              <Kicker>
                {w.name} · {w.tagline.toLowerCase()}
              </Kicker>
              <h1>{w.headline}</h1>
              <p className="dek">{w.intro.join(" ")}</p>
              <div className="stats mono">
                <span>
                  <b>{mine.length}</b> projects
                </span>
                <span>
                  <b>{count(mine, (p) => p.status === "playable" || p.status === "live")}</b> live or playable
                </span>
                <span>
                  <b>{count(mine, (p) => p.status === "prototype")}</b> building
                </span>
                <span>
                  <b>{count(mine, (p) => p.status === "resting" || p.status === "archived")}</b> resting
                </span>
              </div>
            </div>

            {lead && (
              <div className="banner">
                <div className="img">
                  {lead.hero ? <img src={lead.hero} alt="" /> : <div className="type-tile h-full" />}
                </div>
                <div className="b">
                  <Kicker>
                    Featured{lead.version ? ` · ${lead.version}` : ""}
                    {latestEntryOf(lead) ? ` · updated ${formatDate(latestEntryOf(lead)!.date)}` : ""}
                  </Kicker>
                  <h2>{lead.name}</h2>
                  <p>{lead.blurb ?? lead.line}</p>
                  <div className="flex items-center gap-3">
                    <StatusChip status={lead.status} />
                  </div>
                  <Tags items={lead.tags ?? []} category={lead.category} />
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Btn href={projectPath(lead)} primary>
                      See the project
                    </Btn>
                    {lead.cta?.href && <Btn href={lead.cta.href}>{lead.cta.label}</Btn>}
                  </div>
                </div>
              </div>
            )}

            <FilteredGrid items={[...mine, ...also].map(toCapsule)} filters={filters} />
          </>
        ) : (
          <>
            <div className="pagehead">
              <Kicker>
                {w.name} · {w.tagline.toLowerCase()}
              </Kicker>
              <h1>{w.headline}</h1>
              {w.intro.map((p, i) => (
                <p key={i} className="dek">
                  {p}
                </p>
              ))}
              <div className="flex flex-wrap gap-2">
                <span className="self-center font-semibold text-accent">{site.email}</span>
                <Btn href={person.linkedin}>LinkedIn</Btn>
              </div>
            </div>

            <section className="flex flex-col">
              <SectionHead kicker="Selected work" dek="Imagery first. The QuickFrame write-ups are on the way." />
              <CapsuleGrid items={[...mine, ...also].map(toCapsule)} />
            </section>

            {w.sections?.map((s) => (
              <section key={s.title} className="sec">
                <SectionHead kicker={s.title} />
                <div className="what">
                  {s.items.map((it) => (
                    <div key={it.name}>
                      <b>{it.name}</b>
                      <p>{it.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {w.elsewhere && (
              <section className="sec">
                <SectionHead kicker="Elsewhere" />
                <ul className="flex flex-col gap-2">
                  {w.elsewhere.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener" className="text-ink-soft underline-offset-4 hover:text-accent hover:underline">
                        {l.label}
                        <ExternalMark />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
