"use client";

import { useSyncExternalStore } from "react";
import { person } from "@/content/person";

/**
 * TEMPORARY. A headshot picker for choosing the new portrait. Renders the
 * portrait plus a small prev/next strip; the choice is shared across every
 * instance on the page and remembered in localStorage so it survives
 * navigating between the about page and the footer on other pages.
 *
 * To remove once a headshot is chosen:
 *   1. Set person.portrait (content/person.ts) to the winner.
 *   2. Replace <TempHeadshot> in app/about/page.tsx and components/Footer.tsx
 *      with the plain <img src={person.portrait}> they had before.
 *   3. Delete this file, the .hs-* rules in globals.css, and the losing
 *      files in public/img/headshots.
 */
const OPTIONS: { src: string; label: string }[] = [
  { src: person.portrait, label: "current" },
  { src: "/img/headshots/ac-headshot-1.webp", label: "studio 1" },
  { src: "/img/headshots/ac-headshot-2.webp", label: "studio 2" },
  { src: "/img/headshots/ac-headshot-3.webp", label: "studio 3" },
  { src: "/img/headshots/ac-headshot-4.webp", label: "studio 4" },
  { src: "/img/headshots/ac-headshot-5.webp", label: "studio 5" },
  { src: "/img/headshots/img-1498.webp", label: "phone 1498" },
  { src: "/img/headshots/img-1500.webp", label: "phone 1500" },
];

const KEY = "ac-headshot-pick";
const listeners = new Set<() => void>();

function read(): number {
  try {
    const n = Number(window.localStorage.getItem(KEY));
    return Number.isInteger(n) && n >= 0 && n < OPTIONS.length ? n : 0;
  } catch {
    return 0;
  }
}
function write(n: number) {
  try {
    window.localStorage.setItem(KEY, String(n));
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}

export function TempHeadshot({
  className,
  size,
  strip = "under",
}: {
  className?: string;
  size: number;
  /** Where the control strip goes relative to the image. */
  strip?: "under" | "over" | "none";
}) {
  const i = useSyncExternalStore(subscribe, read, () => 0);
  const step = (d: number) => write((i + d + OPTIONS.length) % OPTIONS.length);
  const o = OPTIONS[i];
  const controls = (
    <div className="hs-strip mono" aria-live="polite">
      <button type="button" onClick={() => step(-1)} aria-label="Previous headshot">
        ‹
      </button>
      <span>
        {i} / {OPTIONS.length - 1}
      </span>
      <button type="button" onClick={() => step(1)} aria-label="Next headshot">
        ›
      </button>
    </div>
  );
  return (
    <div className="hs-wrap">
      {strip === "over" && controls}
      <img
        src={o.src}
        alt={person.name}
        width={size}
        height={size}
        className={className ? `hs-img ${className}` : "hs-img"}
        onClick={() => step(1)}
        title={`${i} / ${OPTIONS.length - 1} · ${o.label}. Click for the next headshot`}
      />
      {strip === "under" && controls}
    </div>
  );
}
