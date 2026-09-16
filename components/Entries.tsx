import { projectPath, type Entry, type EntryWithProject } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ExternalMark, isExternal } from "./ui";

function Title({ entry }: { entry: Entry }) {
  if (!entry.href) return <span className="font-medium text-ink">{entry.title}</span>;
  const ext = isExternal(entry.href);
  return (
    <a
      href={entry.href}
      className="font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
      {...(ext ? { target: "_blank", rel: "noopener" } : {})}
    >
      {entry.title}
      {ext && <ExternalMark />}
    </a>
  );
}

/** Entries on a single project page. */
export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {entries.map((e, i) => (
        <li key={`${e.date}-${i}`} className="grid gap-1 py-4 sm:grid-cols-[130px_1fr] sm:gap-6">
          <time dateTime={e.date} className="mono text-[12px] text-muted sm:pt-0.5">
            {formatDate(e.date)}
          </time>
          <div>
            <Title entry={e} />
            {e.note && <p className="mt-1 text-sm leading-relaxed text-muted">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Entries across projects, for the log. */
export function LogList({ entries }: { entries: EntryWithProject[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {entries.map((e, i) => (
        <li key={`${e.project.slug}-${e.date}-${i}`} className="grid gap-1 py-4 sm:grid-cols-[130px_1fr] sm:gap-6">
          <time dateTime={e.date} className="mono text-[12px] text-muted sm:pt-0.5">
            {formatDate(e.date)}
          </time>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <a href={projectPath(e.project)} className="text-[12px] font-medium text-accent hover:underline">
                {e.project.name}
              </a>
              <span className="text-[11px] uppercase tracking-widest text-muted">{e.world.name}</span>
            </div>
            <div className="mt-0.5">
              <Title entry={e} />
            </div>
            {e.note && <p className="mt-1 text-sm leading-relaxed text-muted">{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
