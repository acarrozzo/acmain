import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { LogList } from "@/components/Entries";
import { allEntries } from "@/lib/content";
import { formatMonth, monthKey } from "@/lib/format";

export const metadata: Metadata = {
  title: "Log",
  description: "Every dated thing that has happened to a project, newest first.",
};

/** Every entry on every project, newest first, grouped by month. */
export default function LogPage() {
  const entries = allEntries();
  const groups: { key: string; label: string; entries: typeof entries }[] = [];
  for (const e of entries) {
    const key = monthKey(e.date);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.entries.push(e);
    else groups.push({ key, label: formatMonth(e.date), entries: [e] });
  }

  return (
    <>
      <Masthead />
      <main className="home h-top">
        <nav className="h-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><span>Log</span></nav>
        <h1 className="h-page-h1">Everything, in order.</h1>
        <p className="h-intro">Every dated thing that has happened to a project, newest first. An entry lives on its project, and the project lives in its practice, so this page writes itself.</p>
        {groups.map((g) => (
          <section key={g.key} className="h-sec">
            <div className="h-sh"><h2>{g.label}</h2><span className="h-cnt"><span>{g.entries.length}</span></span></div>
            <LogList entries={g.entries} />
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
