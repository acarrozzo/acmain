import { SiteNav } from "@/components/SiteNav";
import { OrbitalNav } from "@/components/OrbitalNav";
import { Particles } from "@/components/Particles";
import { CompactOverview } from "@/components/CompactOverview";
import { HomeSections } from "@/components/Sections";
import { hero } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <SiteNav />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="hero-photo pointer-events-none absolute inset-0"
        />
        <Particles />
        <div className="container-page relative flex min-h-dvh items-center pt-28 pb-20 md:min-h-0 md:pt-24 md:pb-8">
          <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-10">
            {/* Hero text — left on desktop, on top on mobile */}
            <div className="max-w-xl">
              <p className="mb-6 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
                <span
                  className="h-2 w-2 rounded-full bg-accent"
                  style={{ boxShadow: "0 0 12px var(--glow)" }}
                />
                Creative operating system
              </p>
              <h1 className="text-4xl font-bold leading-[1.03] tracking-tight text-ink md:text-5xl lg:text-6xl">
                {hero.line}
              </h1>
              <p className="mt-6 max-w-md text-lg font-normal leading-relaxed text-muted">
                {hero.sub}
              </p>
              <p className="mt-8 hidden text-sm text-muted md:block">
                Please explore.
              </p>
            </div>

            {/* Orbit — right on desktop */}
            <div className="w-full">
              <OrbitalNav />
            </div>
          </div>
        </div>
      </section>

      <CompactOverview />

      <HomeSections />
    </main>
  );
}
