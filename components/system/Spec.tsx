import type { ReactNode } from "react";
import { routeLabel } from "@/lib/routes";

/** Chips for where something is used: app entries as routes, everything else by file. */
export function UsedOn({ items, empty = "unused" }: { items: string[]; empty?: string }) {
  const isRoute = (i: string) => i.startsWith("app/") || i.startsWith("/") || i === "layout" || i === "404";
  const routes = Array.from(new Set(items.filter(isRoute).map((i) => (i.startsWith("app/") ? routeLabel(i) : i)))).sort();
  const files = Array.from(new Set(items.filter((i) => !isRoute(i)).map(shortPath))).sort();
  if (routes.length + files.length === 0) return <span className="used"><span className="none">{empty}</span></span>;
  return (
    <span className="used">
      {routes.map((r) => (
        <span key={`r${r}`} className="route">
          {r}
        </span>
      ))}
      {files.map((f) => (
        <span key={f}>{f}</span>
      ))}
    </span>
  );
}

export function shortPath(f: string): string {
  return f.replace(/^components\//, "").replace(/\.tsx?$/, "");
}

/** A frame around one specimen: what it is, where it lives, where it is used, then the thing itself. */
export function Spec({
  id,
  name,
  file,
  note,
  usedOn,
  bare = false,
  paper = false,
  children,
}: {
  id?: string;
  name: string;
  file?: string;
  note?: ReactNode;
  usedOn?: string[];
  bare?: boolean;
  paper?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="spec" id={id}>
      <div className="spec-head">
        <b>{name}</b>
        {file && <span className="path">{file}</span>}
        {usedOn && <UsedOn items={usedOn} />}
        {note && <span className="note">{note}</span>}
      </div>
      <div className={["spec-body", bare ? "bare" : "", paper ? "paper" : ""].filter(Boolean).join(" ")}>{children}</div>
    </div>
  );
}

export function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div>
      <b>{n}</b>
      <span>{label}</span>
    </div>
  );
}

export function Cell({ label, children, style }: { label: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="ds-cell" style={style}>
      <span className="ds-lbl">{label}</span>
      {children}
    </div>
  );
}

export function Sub({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div className="ds-sub">
      <span className="kicker mut">{kicker}</span>
      {children}
    </div>
  );
}

export function Yes({ on }: { on: boolean }) {
  return on ? <span className="ok">✓</span> : <span className="no">–</span>;
}
