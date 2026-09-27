import { person } from "@/content/person";
import { site } from "@/content/site";
import {
  featuredItems,
  latestEntryInWorld,
  latestEntryOf,
  projectBySlug,
  projectPath,
  projectsInWorld,
  STATUS_LABEL,
  toCapsule,
  workshopTabs,
  worldPath,
  worlds,
  type EntryWithProject,
  type Project,
  type World,
} from "@/lib/content";
import { Featured } from "./Featured";
import { Workshop } from "./Workshop";
import { CapsuleGrid } from "./Capsule";
import { Kicker, SectionHead } from "./ui";
import { OrbitalNav, type OrbitEntry, type OrbitProject, type OrbitWorld } from "./OrbitalNav";

/** Featured & fresh. */
export function FeaturedSection() {
  const items = featuredItems();
  if (items.length === 0) return null;
  return (
    <section className="featured scroll-mt-6" id="featured">
      <SectionHead kicker="Featured & fresh" rule={false} />
      <Featured items={items} />
    </section>
  );
}

function Module({ kicker, right, children }: { kicker: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="module">
      <div className="mod-head">
        <Kicker>{kicker}</Kicker>
        {right}
      </div>
      {children}
    </section>
  );
}

export function NowPlaying() {
  const np = person.nowPlaying;
  return (
    <Module kicker="Now playing" right={<span className="mono text-muted">from AC Music</span>}>
      <div className="playing">
        <img src={np.art} alt="" loading="lazy" />
        <div>
          <b>{np.title}</b>
          <span>
            {np.by} · {np.note}
          </span>
        </div>
        <a className="play" href={np.href} target="_blank" rel="noopener" aria-label={`Play ${np.title} at AC Music`}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 4l14 8-14 8z" />
          </svg>
        </a>
      </div>
    </Module>
  );
}

export function Editor() {
  return (
    <Module kicker="About the editor">
      <div className="editor">
        <img src={person.portrait} alt={person.name} loading="lazy" />
        <div>
          <p>{person.editorBlurb}</p>
          <div className="links">
            <a href="/about">The long version →</a>
            <span>{site.email}</span>
          </div>
        </div>
      </div>
    </Module>
  );
}

export function WorldsTiles() {
  return (
    <section className="sec">
      <SectionHead kicker="Three worlds" title="Everything I make lives in one of these." />
      <div className="worlds">
        {worlds.map((w) => {
          const list = projectsInWorld(w);
          return (
            <a key={w.id} href={worldPath(w)} className="world">
              {w.hero && <img src={w.hero} alt="" loading="lazy" />}
              <div className="ov" />
              <div className="txt">
                <Kicker>
                  {list.length} {list.length === 1 ? "project" : "projects"}
                </Kicker>
                <h3>{w.name}</h3>
                <p>{w.tagline}</p>
                <span className="who">{list.slice(0, 3).map((p) => p.name).join(" · ")}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function WorldGrid({ world, count, title, more }: { world: World; count: number; title: string; more: string }) {
  const items = projectsInWorld(world).slice(0, count).map(toCapsule);
  return (
    <section className="sec">
      <SectionHead kicker={world.name} title={title} more={more} moreHref={worldPath(world)} />
      <CapsuleGrid items={items} />
    </section>
  );
}

export function WorkshopSection() {
  return <Workshop tabs={workshopTabs()} />;
}

/** The orbit's data: three worlds with their moons. */
export function orbitData(): OrbitWorld[] {
  const toOrbit = (e: EntryWithProject | undefined): OrbitEntry | null =>
    e ? { date: e.date, title: e.title, project: e.project.name } : null;
  const toMoon = (p: Project): OrbitProject => {
    const e = latestEntryOf(p);
    return {
      slug: p.slug,
      name: p.name,
      short: p.short ?? p.name,
      href: projectPath(p),
      kind: p.kind,
      status: p.status,
      statusLabel: STATUS_LABEL[p.status],
      line: p.line,
      latest: e ? { date: e.date, title: e.title, project: p.name } : null,
    };
  };
  return worlds.map((w) => ({
    slug: w.slug,
    name: w.name,
    tagline: w.tagline,
    count: projectsInWorld(w).length,
    latest: toOrbit(latestEntryInWorld(w)),
    projects: projectsInWorld(w).map(toMoon),
  }));
}

/** The opening band: who this is, in one line, beside the orbit of three worlds. */
export function HeroOrbit() {
  const orbitWorlds = orbitData();
  return (
    <section className="hero-band">
      <div className="flex flex-col gap-5">
        <Kicker>
          {person.location} · designing since {person.since}
        </Kicker>
        <h1>{person.hero.line}</h1>
        <p className="sub">{person.hero.sub}</p>
        <div className="acts">
          <a href="/work" className="btn pri">
            See the work
          </a>
          <a href="#featured" className="btn">
            What&apos;s new
          </a>
        </div>
      </div>
      <div className="w-full">
        <OrbitalNav worlds={orbitWorlds} />
      </div>
    </section>
  );
}

export function worldOf(slug: string) {
  return projectBySlug(slug);
}
