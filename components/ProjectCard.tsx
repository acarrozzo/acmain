import { latestEntryOf, projectPath, worldById, type Project } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Art, StatusPill } from "./ui";

export function ProjectCard({
  project: p,
  showWorld = false,
  compact = false,
}: {
  project: Project;
  showWorld?: boolean;
  compact?: boolean;
}) {
  const latest = latestEntryOf(p);
  const world = worldById(p.world);
  return (
    <a
      href={projectPath(p)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-accent"
    >
      <Art
        src={p.hero}
        alt=""
        className={compact ? "aspect-[16/9]" : "aspect-[16/10]"}
        position={p.slug === "coin-and-castle" ? "center top" : undefined}
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-widest text-muted">
            {p.kind}
            {showWorld && ` · ${world.name}`}
          </span>
          <StatusPill status={p.status} />
        </div>
        <h3 className="text-xl leading-tight tracking-tight">
          {p.name}
          <span className="ml-1.5 inline-block translate-x-0 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{p.line}</p>
        {latest && (
          <p className="mono mt-auto pt-2 text-[11px] text-muted">
            {formatDate(latest.date)} · {latest.title}
          </p>
        )}
      </div>
    </a>
  );
}
