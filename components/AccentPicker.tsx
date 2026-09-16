"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AA,
  DEFAULT_DARK,
  DEFAULT_LIGHT,
  palette,
  type Swatch,
} from "@/lib/accents";

/**
 * Accent selector — a temporary rig (header, far left) for choosing the
 * platform's highlight colour.
 *
 * Light and dark are chosen INDEPENDENTLY: clicking a swatch retints only the
 * theme currently on screen, so light mode can run a lighter or darker value
 * than dark mode rather than being locked to a matched pair. Flip the theme
 * toggle and the grid re-targets the other slot.
 *
 * It writes --acc-l/--acc-hi-l/--particle-l (or the -d trio) as inline styles
 * on <html>. Those beat the :root defaults in globals.css, and everything
 * downstream (glow, nebula, sun, soft fills, particle canvas) is color-mix'd
 * off them, so the whole platform retints on click.
 *
 * Persists to localStorage under 'ac-accent'; ThemeScript replays it before
 * paint. Remove before launch, along with StudioControls.
 */

type Stored = { light?: Swatch; dark?: Swatch };

const KEY = "ac-accent";

function read(): Stored {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sel, setSel] = useState<Stored>({});
  const wrap = useRef<HTMLDivElement>(null);

  // The theme toggle mutates the <html> class directly rather than going
  // through React, so observe the attribute instead of trying to share state.
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setIsDark(el.classList.contains("dark"));
    sync();
    setSel(read());
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const apply = useCallback(
    (s: Swatch) => {
      const el = document.documentElement;
      const k = isDark ? "d" : "l";
      el.style.setProperty(`--acc-${k}`, s.hex);
      el.style.setProperty(`--acc-hi-${k}`, s.hi);
      el.style.setProperty(`--particle-${k}`, s.particle);
      const next: Stored = { ...read(), [isDark ? "dark" : "light"]: s };
      setSel(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
    },
    [isDark],
  );

  const reset = () => {
    const el = document.documentElement;
    for (const p of ["l", "d"])
      for (const v of ["--acc-", "--acc-hi-", "--particle-"])
        el.style.removeProperty(`${v}${p}`);
    setSel({});
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  const active = isDark
    ? (sel.dark ?? DEFAULT_DARK)
    : (sel.light ?? DEFAULT_LIGHT);
  const ratio = isDark ? active.crD : active.crL;
  const passes = ratio >= AA;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Accent colour"
        aria-expanded={open}
        aria-haspopup="true"
        title="Accent colour"
        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong"
      >
        <span
          className="h-4 w-4 rounded-full border border-line-strong"
          style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--glow)" }}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Accent colour"
          className="absolute left-0 top-11 z-50 max-h-[70vh] w-[248px] overflow-y-auto rounded-2xl border border-line bg-surface p-3 shadow-2xl"
        >
          <div className="mb-2.5 flex items-baseline justify-between gap-2 px-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              Accent
            </span>
            {/* Names the slot being edited — the grid targets one theme at a time. */}
            <span className="text-[10px] text-muted">
              editing{" "}
              <span className="text-ink">{isDark ? "dark" : "light"}</span> mode
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {palette.map((row) => (
              <div key={row.label} className="flex items-center gap-1.5">
                <span className="w-[52px] shrink-0 truncate text-[10px] text-muted">
                  {row.label}
                </span>
                <div className="flex gap-1">
                  {row.swatches.map((s) => {
                    const on = active.hex === s.hex;
                    const ok = (isDark ? s.crD : s.crL) >= AA;
                    return (
                      <button
                        key={s.hex}
                        type="button"
                        onClick={() => apply(s)}
                        aria-label={`${row.label} ${s.hex}${ok ? "" : " — below AA"}`}
                        aria-pressed={on}
                        title={`${s.hex} — ${(isDark ? s.crD : s.crL).toFixed(2)}:1${ok ? "" : " (below AA)"}`}
                        className="relative h-[22px] w-[22px] rounded-md transition-transform hover:scale-110"
                        style={{
                          background: s.hex,
                          // Dim, don't disable: sub-AA swatches stay pickable,
                          // they just stop competing for attention.
                          opacity: ok ? 1 : 0.34,
                          outline: on ? "2px solid var(--ink)" : "none",
                          outlineOffset: "1.5px",
                          boxShadow: "inset 0 0 0 1px var(--line-strong)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line px-0.5 pt-2">
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ background: active.hex, boxShadow: "inset 0 0 0 1px var(--line-strong)" }}
              />
              <code className="text-ink">{active.hex}</code>
              <span className={passes ? "" : "text-[color:var(--red)]"}>
                {ratio.toFixed(1)}:1
              </span>
            </span>
            <button
              type="button"
              onClick={reset}
              className="text-[11px] text-muted underline underline-offset-2 transition-colors hover:text-ink"
            >
              reset
            </button>
          </div>
          <p className="mt-1.5 px-0.5 text-[10px] leading-relaxed text-muted">
            Dimmed swatches fall below AA ({AA}:1) in this mode — still
            selectable.
          </p>
        </div>
      )}
    </div>
  );
}
