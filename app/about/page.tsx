import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { Eyebrow, ExternalMark, SectionLabel } from "@/components/ui";
import { navItems } from "@/components/nav";
import { person } from "@/content/person";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${person.name}: ${person.role}, designer for over twenty years, maker of games and music.`,
};

export default function AboutPage() {
  return (
    <main>
      <SiteNav items={navItems} />

      <section className="container-page pt-32 md:pt-40">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.05] md:text-6xl">Hey, what&apos;s up.</h1>
            <div className="copy mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {person.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="flex flex-col gap-5 md:pt-10">
            <img
              src={person.portrait}
              alt={person.name}
              width={200}
              height={200}
              className="h-40 w-40 rounded-2xl border border-line-strong object-cover md:h-52 md:w-52"
            />
            <div className="text-sm">
              <div className="font-semibold">{person.name}</div>
              <div className="text-muted">{person.role}</div>
              <div className="text-muted">{person.location}</div>
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener"
                className="text-ink-soft hover:text-accent"
              >
                LinkedIn
                <ExternalMark />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-page mt-16 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-12">
        <div>
          <SectionLabel>Skills that pay the bills</SectionLabel>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{person.skills.pay}</p>
        </div>
        <div>
          <SectionLabel>Skills that don&apos;t pay any bills whatsoever</SectionLabel>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{person.skills.dontPay}</p>
        </div>
      </section>

      <section className="border-t border-line mt-16 py-16 md:mt-20 md:py-20">
        <div className="container-page">
          <SectionLabel>The places</SectionLabel>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight md:text-4xl">
            {person.since} to now, at a handful of equally amazing places.
          </h2>
          <ol className="mt-10 max-w-3xl border-l border-line-strong">
            {person.timeline.map((t) => (
              <li key={t.year + t.name} className="relative grid gap-1 py-4 pl-8 sm:grid-cols-[72px_1fr] sm:gap-6">
                <span
                  className={`absolute -left-[5px] top-[26px] h-[9px] w-[9px] rounded-full border border-accent ${
                    t.year === "Now" ? "bg-accent" : "bg-paper"
                  }`}
                />
                <span className="mono pt-0.5 text-[12px] text-muted">{t.year}</span>
                <div>
                  <div className="font-semibold tracking-tight">{t.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionLabel>About this site</SectionLabel>
          <div className="copy max-w-2xl text-lg leading-relaxed text-ink-soft">
            {person.siteStory.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <a href="/archive" className="text-accent hover:underline">
                Visit the archive →
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
