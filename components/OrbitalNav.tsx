"use client";

import { useRef, useState } from "react";
import { formatDate } from "@/lib/format";

export type OrbitEntry = { date: string; title: string; project: string };
export type OrbitWorld = {
  slug: string;
  name: string;
  tagline: string;
  count: number;
  latest: OrbitEntry | null;
};

type Props = {
  worlds: OrbitWorld[];
  /** The newest entry anywhere on the site: what the hub shows at rest. */
  latest: OrbitEntry | null;
};

// Three worlds, evenly spaced: one at the top, two below. The hub in the
// middle is never empty — at rest it shows the newest thing on the site,
// and hovering a world swaps in the newest thing in that world.
const R = 38; // orbit radius, % from center
const ANGLES = [-90, 30, 150];

export function OrbitalNav({ worlds, latest }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const focused = active !== null ? worlds[active] : null;
  const hub = focused
    ? { key: focused.slug, label: focused.name, entry: focused.latest, fallback: focused.tagline }
    : { key: "now", label: "Now", entry: latest, fallback: "Always building." };

  const onMove = (e: React.MouseEvent) => {
    const el = parallax.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
  };

  const onLeave = () => {
    setActive(null);
    if (parallax.current) parallax.current.style.transform = "";
  };

  return (
    <div className="relative w-full">
      {/* ---------- Desktop: the constellation ---------- */}
      <div
        className="relative hidden aspect-square w-full max-w-[540px] md:ml-auto md:block"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          ref={parallax}
          className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
        >
          <div className="orbit-nebula absolute -inset-[20%]" />
          {[100, 62].map((s) => (
            <div
              key={s}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
              style={{ width: `${s}%`, height: `${s}%` }}
            />
          ))}
          <div className="orbit-ring-spin absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        <div className="orbit-sun pointer-events-none absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2" />

        {worlds.map((w, i) => {
          const ang = ((ANGLES[i] ?? 0) * Math.PI) / 180;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const x = 50 + R * cos;
          const y = 50 + R * sin;
          const isActive = active === i;
          const dim = active !== null && !isActive;

          return (
            <div
              key={w.slug}
              className="absolute z-[5] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="orbit-float" style={{ animationDelay: `${i * 0.9}s` }}>
                <a
                  href={`/${w.slug}`}
                  className="orb-btn relative"
                  style={{ animationDelay: `${0.4 + i * 0.09}s` }}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${w.name}: ${w.tagline}`}
                >
                  <div
                    className="orb"
                    data-active={isActive}
                    data-dim={dim}
                    style={
                      {
                        "--lx": `${(50 - cos * 26).toFixed(1)}%`,
                        "--ly": `${(50 - sin * 26).toFixed(1)}%`,
                        "--shx": `${(cos * 9).toFixed(1)}px`,
                        "--shy": `${(sin * 9 + 6).toFixed(1)}px`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="orb-label text-[15px] font-semibold leading-tight tracking-tight">
                      {w.name}
                    </span>
                    <span className="orb-sub text-[11px]">
                      {w.count} {w.count === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <span
                    className="orb-cta pointer-events-none z-30 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold"
                    data-show={isActive}
                    aria-hidden
                  >
                    Enter →
                  </span>
                </a>
              </div>
            </div>
          );
        })}

        {/* center hub — what's new, here or in the focused world */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] w-[44%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div key={hub.key} className="hub-in">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              {hub.label}
            </div>
            {hub.entry ? (
              <>
                <div className="mono mt-2 text-[11px] text-muted">
                  {formatDate(hub.entry.date)} · {hub.entry.project}
                </div>
                <div className="mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                  {hub.entry.title}
                </div>
              </>
            ) : (
              <div className="mt-2 text-sm text-muted">{hub.fallback}</div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Mobile: three cards ---------- */}
      <div className="flex flex-col gap-3 md:hidden">
        {worlds.map((w) => (
          <a
            key={w.slug}
            href={`/${w.slug}`}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-surface p-5"
          >
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted">{w.tagline}</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-ink">{w.name}</div>
              {w.latest && (
                <div className="mono mt-1.5 truncate text-[11px] text-muted">
                  {formatDate(w.latest.date)} · {w.latest.title}
                </div>
              )}
            </div>
            <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
