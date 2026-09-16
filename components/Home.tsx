import { person } from "@/content/person";
import { site } from "@/content/site";
import {
  building,
  latestEntries,
  projectPath,
  projectsInWorld,
  worldPath,
  worlds,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ProjectCard } from "./ProjectCard";
import { Art, SectionLabel } from "./ui";

function SectionHead({
  label,
  title,
  aside,
}: {
  label: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2 className="mt-3 max-w-2xl text-3xl leading-tight md:text-4xl">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
    >
      {children}
      <span className="transition-transform group-hover:translate-x-0.5">→</span>
    </a>
  );
}

/** The newest entries across every project. This is the pulse. */
export function NowStrip() {
  const entries = latestEntries(4);
  return (
    <section id="now" className="scroll-mt-20 border-t border-line py-16 md:py-20">
      <div className="container-page">
        <SectionHead
          label="Now"
          title="What's happening in the workshop."
          aside={<MoreLink href="/log">Everything, in order</MoreLink>}
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map((e, i) => (
            <li key={`${e.project.slug}-${e.date}-${i}`}>
              <a
                href={e.href && !e.href.startsWith("http") ? e.href : projectPath(e.project)}
                className="group flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <time dateTime={e.date} className="mono text-[11px] text-muted">
                    {formatDate(e.date)}
                  </time>
                  <span className="mt-1 text-[12px] font-medium text-accent">{e.project.name}</span>
                  <span className="mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {e.title}
                  </span>
                  {e.note && (
                    <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{e.note}</span>
                  )}
                  <span className="mt-auto pt-3 text-[11px] uppercase tracking-widest text-muted">
                    {e.world.name}
                  </span>
                </div>
                <Art
                  src={e.project.hero}
                  className="h-16 w-16 shrink-0 self-start rounded-xl"
                  position={e.project.slug === "coin-and-castle" ? "center top" : undefined}
                />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Projects with fresh work, straight from their status. */
export function BuildingStrip() {
  const list = building().slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section className="border-t border-line py-16 md:py-20">
      <div className="container-page">
        <SectionHead label="Currently building" title="The ones with fresh commits." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} showWorld compact />
          ))}
        </div>
      </div>
    </section>
  );
}

/** The three worlds, with a taste of what is inside each. */
export function WorldsRow() {
  return (
    <section className="border-t border-line py-16 md:py-20">
      <div className="container-page">
        <SectionHead label="Three worlds" title="Everything I make lives in one of these." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {worlds.map((w) => {
            const list = projectsInWorld(w);
            return (
              <a
                key={w.id}
                href={worldPath(w)}
                className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl tracking-tight">{w.name}</h3>
                  <span className="mono text-[11px] text-muted">
                    {list.length} {list.length === 1 ? "project" : "projects"}
                  </span>
                </div>
                <p className="text-sm text-muted">{w.tagline}</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">
                  {list.slice(0, 4).map((p) => (
                    <li key={p.slug}>{p.name}</li>
                  ))}
                  {list.length > 4 && <li className="text-muted">and more</li>}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-accent">
                  Enter <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Who is behind all this, briefly. */
export function AboutTeaser() {
  return (
    <section className="border-t border-line py-16 md:py-20">
      <div className="container-page grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="flex items-start gap-5">
          <img
            src={person.portrait}
            alt={person.name}
            width={72}
            height={72}
            loading="lazy"
            className="h-[72px] w-[72px] shrink-0 rounded-full border border-line-strong object-cover"
          />
          <div>
            <SectionLabel>About</SectionLabel>
            <div className="mt-2 text-lg font-semibold tracking-tight">{person.name}</div>
            <div className="text-sm text-muted">
              {person.role} · {person.location}
            </div>
          </div>
        </div>
        <div>
          <p className="max-w-xl text-xl leading-snug tracking-tight text-ink-soft md:text-2xl">
            {person.teaser}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/about"
              className="rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              More about me
            </a>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
