import type { CapsuleData } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { StatusChip, Tags, TypeTile } from "./ui";

/** The project card. Renders on the server and inside client components alike. */
export function Capsule({ p }: { p: CapsuleData }) {
  return (
    <a href={p.href} className="cap">
      {p.hero ? (
        <div className={`cap-img ${p.square ? "sq" : ""}`}>
          <img src={p.hero} alt="" loading="lazy" decoding="async" style={p.pos ? { objectPosition: p.pos } : undefined} />
        </div>
      ) : (
        <TypeTile mark={p.mark} className="cap-img" />
      )}
      <div className="cap-body">
        <div className="cap-top">
          <StatusChip status={p.status} />
          {p.date && <span className="mono">{formatDate(p.date)}</span>}
        </div>
        <h3>{p.name}</h3>
        <p>{p.line}</p>
        <Tags items={p.tags} category={p.category} />
        {p.bar && <div className="bar" style={{ background: p.bar }} />}
      </div>
    </a>
  );
}

export function CapsuleGrid({ items }: { items: CapsuleData[] }) {
  return (
    <div className="grid3">
      {items.map((p) => (
        <Capsule key={p.slug} p={p} />
      ))}
    </div>
  );
}
