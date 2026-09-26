import { projectPath, type Entry, type EntryWithProject } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { ExternalMark, isExternal } from "./ui";

function Title({ entry }: { entry: Entry }) {
  if (!entry.href) return <b>{entry.title}</b>;
  const ext = isExternal(entry.href);
  return (
    <a href={entry.href} className="hover:text-accent" {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
      <b>{entry.title}</b>
      {ext && <ExternalMark />}
    </a>
  );
}

/** A project's changelog. */
export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="news">
      {entries.map((e, i) => (
        <li key={`${e.date}-${i}`}>
          <time dateTime={e.date} className="mono text-muted">
            {formatDate(e.date)}
          </time>
          <div>
            <span className="flex flex-wrap items-center">
              <Title entry={e} />
              {e.version && <span className="v">{e.version}</span>}
            </span>
            {e.note && <p>{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Entries across projects, for the log page. */
export function LogList({ entries }: { entries: EntryWithProject[] }) {
  return (
    <ol className="news">
      {entries.map((e, i) => (
        <li key={`${e.project.slug}-${e.date}-${i}`}>
          <time dateTime={e.date} className="mono text-muted">
            {formatDate(e.date)}
          </time>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <a href={projectPath(e.project)} className="kicker" style={{ letterSpacing: "0.1em" }}>
                {e.project.name}
              </a>
              <span className="kicker mut" style={{ letterSpacing: "0.1em" }}>
                {e.world.name}
              </span>
            </div>
            <span className="flex flex-wrap items-center">
              <Title entry={e} />
              {e.version && <span className="v">{e.version}</span>}
            </span>
            {e.note && <p>{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
