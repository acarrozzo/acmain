"use client";

import { useEffect, useState } from "react";

/**
 * Font selector — a temporary rig (in the footer) for testing the platform's
 * heading font live. The choice persists to localStorage and is applied before
 * paint by ThemeScript. Remove before launch.
 */

const FONTS = [
  { id: "fraunces", label: "Fraunces" },
  { id: "playfair", label: "Playfair Display" },
  { id: "cormorant", label: "Cormorant" },
  { id: "libre", label: "Libre Baskerville" },
  { id: "spectral", label: "Spectral" },
  { id: "dmserif", label: "DM Serif Display" },
  { id: "inter", label: "Inter" },
  { id: "helvetica", label: "Helvetica" },
  { id: "georgia", label: "Georgia" },
  { id: "system", label: "System" },
  { id: "mono", label: "Mono" },
];

const fieldCls =
  "flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-line-strong";
const selectCls =
  "cursor-pointer bg-transparent text-xs text-ink focus:outline-none";

export function StudioControls() {
  const [font, setFont] = useState("fraunces");

  useEffect(() => {
    const e = document.documentElement;
    setFont(e.dataset.font || "fraunces");
  }, []);

  const applyFont = (v: string) => {
    setFont(v);
    document.documentElement.dataset.font = v;
    try {
      localStorage.setItem("ac-font", v);
    } catch {}
  };

  return (
    <label className={fieldCls} title="Heading font">
      <span aria-hidden className="mark text-sm leading-none text-ink">
        Aa
      </span>
      <select
        aria-label="Heading font"
        value={font}
        onChange={(e) => applyFont(e.target.value)}
        className={selectCls}
      >
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  );
}
