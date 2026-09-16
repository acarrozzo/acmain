import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { LogList } from "@/components/Entries";
import { PageHeader, SectionLabel } from "@/components/ui";
import { navItems } from "@/components/nav";
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
    <main>
      <SiteNav items={navItems} />
      <PageHeader
        eyebrow="Log"
        title="Everything, in order."
        intro={[
          "Every dated thing that has happened to a project, newest first. This page writes itself: an entry lives on its project, and the project lives in its world.",
        ]}
      />
      <div className="container-page flex flex-col gap-12 pb-16 md:pb-20">
        {groups.map((g) => (
          <section key={g.key} className="grid gap-4 md:grid-cols-[160px_1fr]">
            <h2 className="mono text-sm text-muted md:pt-4">{g.label}</h2>
            <div className="max-w-2xl">
              <LogList entries={g.entries} />
            </div>
          </section>
        ))}
        {groups.length === 0 && <SectionLabel>Nothing yet. Give it a minute.</SectionLabel>}
      </div>
      <Footer />
    </main>
  );
}
