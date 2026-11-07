import { projectPath, type Entry, type EntryWithProject } from "@/lib/content";
import { formatDate } from "@/lib/format";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function Title({ entry }: { entry: Entry }) {
  if (!entry.href) return <b>{entry.title}</b>;
  const ext = isExternal(entry.href);
  return (
    <a href={entry.href} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
      <b>{entry.title}</b>
      {ext && <span className="h-ext" aria-hidden="true"> ↗</span>}
    </a>
  );
}

/** A project's changelog: date, title, version, note. */
export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="h-news">
      {entries.map((e, i) => (
        <li key={`${e.date}-${i}`}>
          <time dateTime={e.date}>{formatDate(e.date)}</time>
          <div>
            <span className="h-t"><Title entry={e} />{e.version && <span className="h-v">{e.version}</span>}</span>
            {e.note && <p>{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Entries across projects, for the log page: the project and practice above each title. */
export function LogList({ entries }: { entries: EntryWithProject[] }) {
  return (
    <ol className="h-news">
      {entries.map((e, i) => (
        <li key={`${e.project.slug}-${e.date}-${i}`}>
          <time dateTime={e.date}>{formatDate(e.date)}</time>
          <div>
            <span className="h-who"><a href={projectPath(e.project)}>{e.project.name}</a><i>{e.category.name}</i></span>
            <span className="h-t"><Title entry={e} />{e.version && <span className="h-v">{e.version}</span>}</span>
            {e.note && <p>{e.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
