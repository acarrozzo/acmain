import { SiteNav } from "@/components/SiteNav";
import { OrbitalNav, type OrbitEntry, type OrbitWorld } from "@/components/OrbitalNav";
import { Particles } from "@/components/Particles";
import { AboutTeaser, BuildingStrip, NowStrip, WorldsRow } from "@/components/Home";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui";
import { navItems } from "@/components/nav";
import { person } from "@/content/person";
import {
  latestEntries,
  latestEntryInWorld,
  projectsInWorld,
  worlds,
  type EntryWithProject,
} from "@/lib/content";

function toOrbit(e: EntryWithProject | undefined): OrbitEntry | null {
  return e ? { date: e.date, title: e.title, project: e.project.name } : null;
}

export default function Home() {
  const orbitWorlds: OrbitWorld[] = worlds.map((w) => ({
    slug: w.slug,
    name: w.name,
    tagline: w.tagline,
    count: projectsInWorld(w).length,
    latest: toOrbit(latestEntryInWorld(w)),
  }));
  const latest = toOrbit(latestEntries(1)[0]);

  return (
    <main>
      <SiteNav items={navItems} />

      <section className="relative overflow-hidden">
        <div aria-hidden className="hero-photo pointer-events-none absolute inset-0" />
        <Particles />
        <div className="container-page relative flex min-h-dvh items-center pt-28 pb-16 md:min-h-0 md:pt-32 md:pb-12">
          <div className="grid w-full items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-10">
            <div className="max-w-xl">
              <Eyebrow>
                {person.name} · {person.location}
              </Eyebrow>
              <h1 className="mt-6 text-4xl leading-[1.06] md:text-5xl lg:text-[56px]">
                {person.hero.line}
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{person.hero.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/work"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hi"
                >
                  See the work
                </a>
                <a
                  href="#now"
                  className="rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  What&apos;s new
                </a>
              </div>
            </div>

            <div className="w-full">
              <OrbitalNav worlds={orbitWorlds} latest={latest} />
            </div>
          </div>
        </div>
      </section>

      <NowStrip />
      <BuildingStrip />
      <WorldsRow />
      <AboutTeaser />
      <Footer />
    </main>
  );
}
