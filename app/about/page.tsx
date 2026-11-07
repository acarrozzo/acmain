import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { person } from "@/content/person";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${person.name}: ${person.role}, designer for over twenty years, maker of games and music.`,
};

function Timeline({ items }: { items: { year: string; name: string; text: string }[] }) {
  return (
    <ol className="h-news">
      {items.map((t) => (
        <li key={t.year + t.name}>
          <time>{t.year}</time>
          <div><span className="h-t"><b>{t.name}</b></span><p>{t.text}</p></div>
        </li>
      ))}
    </ol>
  );
}

/** The long version: the story, the skills, the jobs, the schools, and how this site works. */
export default function AboutPage() {
  return (
    <>
      <Masthead />
      <main className="home h-top">
        <nav className="h-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><span>About</span></nav>
        <div className="h-who-card">
          <img src={person.portrait} alt={person.name} width={120} height={120} />
          <div>
            <h1 className="h-page-h1">Hey, what&apos;s up.</h1>
            <p className="h-role">{person.role} · {person.location}</p>
            <div className="h-btns"><a href={person.linkedin} target="_blank" rel="noopener">LinkedIn</a><span>{site.email}</span></div>
          </div>
        </div>
        <div className="h-copy">
          {person.about.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <section className="h-sec">
          <div className="h-sh"><h2>Skills</h2></div>
          <div className="h-what">
            <div><b>Skills that pay the bills</b><p>{person.skills.pay}</p></div>
            <div><b>Skills that don&apos;t pay any bills whatsoever</b><p>{person.skills.dontPay}</p></div>
          </div>
        </section>

        <section className="h-sec">
          <div className="h-sh"><h2>Employment</h2><span className="h-cnt"><span>newest first</span></span></div>
          <Timeline items={[...person.timeline].reverse()} />
        </section>

        <section className="h-sec">
          <div className="h-sh"><h2>Education</h2></div>
          <Timeline items={person.education} />
        </section>

        <section className="h-sec">
          <div className="h-sh"><h2>About this site</h2><span className="h-cnt"><a href="/archive">The archive →</a></span></div>
          <div className="h-copy h-copy-s">
            {person.siteStory.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
