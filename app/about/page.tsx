import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Crumbs, ExternalMark, Kicker, SectionHead } from "@/components/ui";
import { person } from "@/content/person";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${person.name}: ${person.role}, designer for over twenty years, maker of games and music.`,
};

export default function AboutPage() {
  return (
    <>
      <Masthead />
      <main className="container-page">
        <Crumbs items={[{ label: "AC.", href: "/" }, { label: "About" }]} />
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
          <div className="pagehead">
            <Kicker>About</Kicker>
            <h1>Hey, what&apos;s up.</h1>
            <div className="copy">
              {person.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="flex flex-col gap-5 pt-10">
            <img src={person.portrait} alt={person.name} width={200} height={200} className="h-40 w-40 rounded-2xl border border-line-strong object-cover md:h-52 md:w-52" />
            <div className="text-sm">
              <div className="font-semibold">{person.name}</div>
              <div className="text-muted">{person.role}</div>
              <div className="text-muted">{person.location}</div>
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                {site.email}
              </a>
              <a href={person.linkedin} target="_blank" rel="noopener" className="text-ink-soft hover:text-accent">
                LinkedIn
                <ExternalMark />
              </a>
            </div>
          </aside>
        </div>

        <section className="sec">
          <div className="what">
            <div>
              <b>Skills that pay the bills</b>
              <p>{person.skills.pay}</p>
            </div>
            <div>
              <b>Skills that don&apos;t pay any bills whatsoever</b>
              <p>{person.skills.dontPay}</p>
            </div>
          </div>
        </section>

        <section className="sec">
          <SectionHead kicker="The places" title={`${person.since} to now, at a handful of equally amazing places.`} />
          <ol className="news max-w-3xl">
            {person.timeline.map((t) => (
              <li key={t.year + t.name}>
                <span className="mono text-muted">{t.year}</span>
                <div>
                  <b>{t.name}</b>
                  <p>{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="sec">
          <SectionHead kicker="About this site" />
          <div className="copy">
            {person.siteStory.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <a href="/archive" className="text-accent hover:underline">
                Visit the archive →
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
