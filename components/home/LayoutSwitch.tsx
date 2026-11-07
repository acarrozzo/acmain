"use client";

import { useEffect, useState } from "react";
import { SECTION_LAYOUTS, type SectionLayout } from "@/content/home";

/**
 * TEMPORARY. Lets each home section be viewed in any of its layouts. The
 * section renders every layout; this flips `data-layout` on it and remembers
 * the choice. Delete this file and the extra layouts once a layout is chosen.
 */
export function LayoutSwitch({ id, initial }: { id: string; initial: SectionLayout }) {
  const key = `ac-layout-${id}`;
  const [cur, setCur] = useState<SectionLayout>(initial);
  useEffect(() => {
    let v = initial;
    try { const s = localStorage.getItem(key) as SectionLayout | null; if (s && SECTION_LAYOUTS.includes(s)) v = s; } catch {}
    setCur(v);
    document.getElementById(id)?.setAttribute("data-layout", v);
  }, [id, initial, key]);
  function pick(v: SectionLayout) {
    setCur(v);
    document.getElementById(id)?.setAttribute("data-layout", v);
    try { localStorage.setItem(key, v); } catch {}
  }
  return (
    <span className="h-sw" title="Temporary: this section's layout">
      {SECTION_LAYOUTS.map((l) => (
        <button key={l} type="button" aria-pressed={cur === l} onClick={() => pick(l)}>{l === "compact" ? "compact" : l}</button>
      ))}
    </span>
  );
}
