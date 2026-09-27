import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Crumbs, ExternalMark, Kicker, SectionHead } from "@/components/ui";
import { person } from "@/content/person";
import { site } from "@/content/site";
import { TempHeadshot } from "@/components/TempHeadshot";

export const metadata: Metadata = {
  title: "About",
  description: `${person.name}: ${person.role}, designer for over twenty years, maker of games and music.`,
};

/** Name, role, place, and the two ways to reach me. Sits under the portrait at every width. */
function Card() {
  return (
    <div className="about-card">
      <div className="text-sm">
        <div className="font-semibold">{person.name}</div>
        <div className="text-muted">{person.role}</div>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <span className="text-accent">{site.email}</span>
        <a href={person.linkedin} target="_blank" rel="noopener" className="text-ink-soft hover:text-accent">
          LinkedIn
          <ExternalMark />
        </a>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Masthead />
      <main className="container-page">
        <Crumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px] md:gap-16">
          <div className="pagehead">
            <Kicker>About</Kicker>
            <h1>Hey, what&apos;s up.</h1>
            <div className="copy">
              {/* Below md the portrait and the card float right inside the copy, as on the original site. */}
              <div className="about-float md:hidden">
                {/* TEMP: headshot picker; was <img src={person.portrait} alt={person.name} width={100} height={100} className="about-face" /> */}
                <TempHeadshot size={100} className="about-face" />
                <Card />
              </div>
              {person.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="hidden flex-col gap-5 pt-10 md:flex">
            {/* TEMP: headshot picker; was <img src={person.portrait} alt={person.name} width={200} height={200} className="h-52 w-52 rounded-full border border-line-strong object-cover" /> */}
            <TempHeadshot size={200} className="h-52 w-52 rounded-full border border-line-strong object-cover" />
            <Card />
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
          <SectionHead kicker="Employment history" />
          {/* Content is chronological; the page reads newest first. */}
          <ol className="news max-w-3xl">
            {[...person.timeline].reverse().map((t) => (
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
          <SectionHead kicker="Education" />
          <ol className="news max-w-3xl">
            {person.education.map((t) => (
              <li key={t.name}>
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
