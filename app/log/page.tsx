import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { LogList } from "@/components/Entries";
import { Crumbs, Kicker } from "@/components/ui";
import { allEntries } from "@/lib/content";
import { formatMonth, monthKey } from "@/lib/format";

export const metadata: Metadata = {
  title: "Log",
  description: "Every dated thing that has happened to a project, newest first.",
};

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
      <main className="container-page">
        <Crumbs items={[{ label: "AC.", href: "/" }, { label: "Log" }]} />
        <div className="pagehead">
          <Kicker>The log · everything, in order</Kicker>
          <h1>Everything, in order.</h1>
          <p className="dek">
            Every dated thing that has happened to a project, newest first. This page writes itself: an entry lives on its project, and the project lives in its category.
          </p>
        </div>
        <div className="flex flex-col gap-10 pb-4">
          {groups.map((g) => (
            <section key={g.key} className="grid gap-3 md:grid-cols-[160px_1fr]">
              <h2 className="mono text-muted md:pt-3">{g.label}</h2>
              <div className="max-w-3xl">
                <LogList entries={g.entries} />
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
