"use client";

import { useState } from "react";
import type { CapsuleData, Status } from "@/lib/content";
import { CapsuleGrid } from "./Capsule";

export type Filter = { id: string; label: string; statuses?: Status[]; kinds?: string[] };

/** Filter chips over a capsule grid. */
export function FilteredGrid({ items, filters }: { items: CapsuleData[]; filters: Filter[] }) {
  const [active, setActive] = useState(filters[0]?.id ?? "all");
  const f = filters.find((x) => x.id === active);
  const shown = items.filter((p) => {
    if (!f) return true;
    if (f.statuses && !f.statuses.includes(p.status)) return false;
    if (f.kinds && !f.kinds.includes(p.kind)) return false;
    return true;
  });
  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((x) => (
          <button key={x.id} type="button" className={x.id === active ? "on" : undefined} aria-pressed={x.id === active} onClick={() => setActive(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      {shown.length > 0 ? <CapsuleGrid items={shown} /> : <p className="text-sm text-muted">Nothing here yet.</p>}
    </>
  );
}
