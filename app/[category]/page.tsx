import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { Preview } from "@/components/home/Preview";
import { CompactRows, Rows } from "@/components/home/Sections";
import { person } from "@/content/person";
import { site } from "@/content/site";
import { alsoInCategory, projectsInCategory, categoryBySlug, categories } from "@/lib/content";

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

/** A practice: its headline, a line or two, then every project as a row. Guests from other practices follow. */
export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const w = categoryBySlug(category);
  if (!w) notFound();
  const mine = projectsInCategory(w);
  const also = alsoInCategory(w);

  return (
    <>
      <Masthead />
      <main className="home h-top">
        <nav className="h-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><span>{w.label ?? w.name}</span></nav>
        <h1 className="h-page-h1">{w.headline}</h1>
        {w.intro.map((t, i) => <p key={i} className="h-intro">{t}</p>)}
        {w.id === "design" && (
          <div className="h-btns"><a href={person.linkedin} target="_blank" rel="noopener">LinkedIn</a><span>{site.email}</span></div>
        )}

        <section className="h-sec">
          <div className="h-sh"><h2>{w.name}</h2><span className="h-cnt"><span>{mine.length}</span></span></div>
          <Rows list={mine} cat={w} />
        </section>

        {also.length > 0 && (
          <section className="h-sec">
            <div className="h-sh"><h2>Also here</h2><span className="h-cnt"><span>{also.length}</span></span></div>
            <CompactRows list={also} cat={w} />
          </section>
        )}

        {w.sections?.map((s) => (
          <section key={s.title} className="h-sec">
            <div className="h-sh"><h2>{s.title}</h2></div>
            <div className="h-what">
              {s.items.map((it) => (
                <div key={it.name}><b>{it.name}</b><p>{it.text}</p></div>
              ))}
            </div>
          </section>
        ))}

        {w.elsewhere && (
          <section className="h-sec">
            <div className="h-sh"><h2>Elsewhere</h2></div>
            <div className="h-btns">
              {w.elsewhere.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>)}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Preview />
    </>
  );
}
