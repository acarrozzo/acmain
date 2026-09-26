"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaletteItem } from "@/lib/nav";

/**
 * Jump anywhere by typing. Opens from the search pill or ⌘K / Ctrl+K.
 * Arrow keys move, Enter goes, Escape closes.
 */
export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => i.label.toLowerCase().includes(needle) || i.group.toLowerCase().includes(needle));
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  const go = (href: string) => {
    setOpen(false);
    if (/^https?:\/\//.test(href)) window.open(href, "_blank", "noopener");
    else router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[idx];
      if (r) go(r.href);
    }
  };

  return (
    <>
      <button type="button" className="search" onClick={() => setOpen(true)} aria-label="Search the site">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <span className="lbl">Search</span>
        <kbd>⌘K</kbd>
      </button>
      {open && (
        <div className="pal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="pal" role="dialog" aria-modal="true" aria-label="Jump to a page or project">
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Jump to a page or project…"
              aria-label="Search"
              autoComplete="off"
            />
            {results.length === 0 ? (
              <div className="empty">Nothing by that name. It may be archived.</div>
            ) : (
              <ul role="listbox">
                {results.map((r, i) => (
                  <li key={r.href + r.label} role="option" aria-selected={i === idx}>
                    <a
                      href={r.href}
                      className={i === idx ? "on" : undefined}
                      onMouseEnter={() => setIdx(i)}
                      onClick={(e) => { e.preventDefault(); go(r.href); }}
                    >
                      <span>{r.label}</span>
                      <span className="g">{r.group}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
