import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { SystemBlock } from "@/components/home/Blocks";
import { ACCENTS } from "@/lib/accents";

export const metadata: Metadata = {
  title: "System",
  description: "How this site is built: type, color, measure, the content model and its parts.",
};

/** The site describing itself: the home's system block, then the specimens behind it. */
export default function SystemPage() {
  return (
    <>
      <Masthead />
      <main className="home h-top">
        <SystemBlock />
        <section className="h-sys">
          <div className="h-sh"><span className="h-k">Accents</span></div>
          <div className="h-sysg">
            {ACCENTS.map(([name, dark, light]) => (
              <div key={name}>
                <span className="h-k">{name}</span>
                <div className="h-swl"><i style={{ background: dark }} title={`${name}, dark`} /><i style={{ background: light }} title={`${name}, light`} /></div>
                <p>{dark} on dark · {light} on light</p>
              </div>
            ))}
          </div>
        </section>
        <section className="h-sys">
          <div className="h-sh"><span className="h-k">Type</span></div>
          <div className="h-sysg">
            <div><span className="h-k">Display</span><p className="h-td">The quick brown fox jumps over the lazy dog.</p><p>Fraunces, 25px, one weight.</p></div>
            <div><span className="h-k">Text</span><p style={{ color: "var(--ink)" }}>The quick brown fox jumps over the lazy dog.</p><p>Fraunces, 16px on a 1.55 line.</p></div>
            <div><span className="h-k">Labels</span><p className="h-tm">THE QUICK BROWN FOX · 0123456789</p><p>JetBrains Mono, 11px, letter-spaced, uppercase.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
