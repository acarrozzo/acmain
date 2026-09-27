"use client";

import { useEffect, useRef, useState } from "react";
import type { Status } from "@/content/types";

export type OrbitEntry = { date: string; title: string; project: string };

/** A project as a moon: what its dot, its label and the hub caption need. */
export type OrbitProject = {
  slug: string;
  name: string;
  short: string;
  href: string;
  kind: string;
  status: Status;
  statusLabel: string;
  line: string;
  latest: OrbitEntry | null;
};

export type OrbitCategory = {
  slug: string;
  name: string;
  tagline: string;
  count: number;
  latest: OrbitEntry | null;
  projects: OrbitProject[];
};

type Props = {
  categories: OrbitCategory[];
};

/*
 * Three categories drift clockwise around the hub, one revolution every couple of
 * minutes. Each category is a small system: the orb, and its projects orbiting
 * it as tiny moons, also clockwise. Hover (or focus) a category and everything
 * eases to a stop while the camera pushes in on it: the orb grows, the moons
 * spread out and grow into labelled orbs you can click. Let go and it all
 * drifts again. The hub in the middle says hello at rest: a category fills it
 * with the newest thing there, and a moon swaps in that project.
 *
 * Moon geometry is in px at the box's full width (BOX) and scales with the
 * box; the category ring is in % of the box.
 */
const BOX = 560;
const RING = 33; // category ring radius, % of the box
const ANGLES = [-90, 30, 150]; // where the categories start, degrees
const CATEGORY_PERIOD = 150; // seconds per revolution of the categories
const MOON_R_REST = 78; // moon orbit radius, from the category's centre
const MOON_R_ZOOM = 106;
const MOON = 60; // a zoomed moon's diameter
const SYS = 2 * (MOON_R_ZOOM + MOON / 2); // the hit circle: the zoomed system
// Seconds per revolution of each category's moons. No two alike, so they never
// line up. Positive is clockwise; keep it that way.
const PERIODS = [58, 46, 64];
const SEEDS = [-1.2, 0.5, 2.3];
// Leaving a system waits this long before collapsing, so a pointer crossing a
// gap between two of its parts does not flicker it.
const LEAVE_GRACE = 110;

const TAU = 2 * Math.PI;
type Sim = { theta: number; omega: number; r: number };

export function OrbitalNav({ categories }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [moon, setMoon] = useState<OrbitProject | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const sysEls = useRef<(HTMLDivElement | null)[]>([]);
  const orbEls = useRef<(HTMLDivElement | null)[]>([]);
  const moonEls = useRef<(HTMLDivElement | null)[][]>([]);
  const ringEls = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const categoriesRef = useRef(categories);
  /** How far the category ring has turned, radians. Read at render for the hub's lean. */
  const phiRef = useRef(0);
  const kick = useRef<() => void>(() => {});
  const leaveTimer = useRef<number | undefined>(undefined);
  activeRef.current = active;
  categoriesRef.current = categories;

  // The orbit loop. One frame moves the categories and every moon; it stops
  // while the box is off-screen, and under reduced motion it settles in a
  // single pass.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ring = { omega: TAU / CATEGORY_PERIOD };
    const sims: Sim[] = categoriesRef.current.map((_, i) => ({
      theta: 0,
      omega: TAU / (PERIODS[i] ?? 60),
      r: MOON_R_REST,
    }));
    let unit = 1;
    let raf = 0;
    let last = 0;
    let visible = true;

    const frame = (t: number) => {
      raf = 0;
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      const still = reduce.matches;
      const anyActive = activeRef.current !== null;

      // The categories: drift, unless one is held.
      const ringT = anyActive || still ? 0 : TAU / CATEGORY_PERIOD;
      ring.omega = still ? 0 : ring.omega + (ringT - ring.omega) * (1 - Math.exp(-dt * 5));
      phiRef.current += ring.omega * dt;

      categoriesRef.current.forEach((w, i) => {
        const a = ((ANGLES[i] ?? 0) * Math.PI) / 180 + phiRef.current;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const sys = sysEls.current[i];
        if (sys) {
          sys.style.left = `${(50 + RING * cos).toFixed(3)}%`;
          sys.style.top = `${(50 + RING * sin).toFixed(3)}%`;
        }
        // Keep the orb lit from the hub, wherever it is.
        const orb = orbEls.current[i];
        if (orb) {
          orb.style.setProperty("--lx", `${(50 - cos * 26).toFixed(1)}%`);
          orb.style.setProperty("--ly", `${(50 - sin * 26).toFixed(1)}%`);
          orb.style.setProperty("--shx", `${(cos * 9).toFixed(1)}px`);
          orb.style.setProperty("--shy", `${(sin * 9 + 6).toFixed(1)}px`);
        }

        // The moons: drift, unless this category is held.
        const s = sims[i];
        const on = activeRef.current === i;
        const omegaT = on || still ? 0 : TAU / (PERIODS[i] ?? 60);
        const rT = (on ? MOON_R_ZOOM : MOON_R_REST) * unit;
        if (still) {
          s.omega = 0;
          s.r = rT;
        } else {
          // Frame-rate independent easing toward the targets.
          s.omega += (omegaT - s.omega) * (1 - Math.exp(-dt * 5));
          s.r += (rT - s.r) * (1 - Math.exp(-dt * 7));
        }
        s.theta += s.omega * dt;
        const n = w.projects.length;
        for (let j = 0; j < n; j++) {
          const m = moonEls.current[i]?.[j];
          if (!m) continue;
          const b = s.theta + (SEEDS[i] ?? 0) + (TAU * j) / n;
          m.style.transform = `translate(${(Math.cos(b) * s.r).toFixed(2)}px, ${(Math.sin(b) * s.r).toFixed(2)}px)`;
        }
        const mr = ringEls.current[i];
        if (mr) {
          const d = `${(s.r * 2).toFixed(1)}px`;
          mr.style.width = d;
          mr.style.height = d;
        }
      });
      if (visible && !still) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    kick.current = start;

    const ro = new ResizeObserver(() => {
      unit = Math.min(1, el.clientWidth / BOX);
      start();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? true;
      if (visible) start();
    });
    io.observe(el);
    start();

    return () => {
      ro.disconnect();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      kick.current = () => {};
    };
  }, []);

  // Under reduced motion the loop sleeps between changes; wake it.
  useEffect(() => {
    kick.current();
  }, [active]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  const enter = (i: number) => {
    window.clearTimeout(leaveTimer.current);
    if (activeRef.current !== i) setMoon(null);
    setActive(i);
  };
  const leave = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setActive(null);
      setMoon(null);
    }, LEAVE_GRACE);
  };

  const onMove = (e: React.MouseEvent) => {
    const el = parallax.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
  };

  const onLeaveBox = () => {
    if (parallax.current) parallax.current.style.transform = "";
  };

  // What the hub says: the moon under the pointer, else the focused category,
  // else nothing. It leans away from the active category.
  const focused = active !== null ? categories[active] : null;
  const leanAng = active !== null ? ((ANGLES[active] ?? 0) * Math.PI) / 180 + phiRef.current : 0;
  const hubLean = active !== null ? { x: Math.cos(leanAng) * 30, y: Math.sin(leanAng) * 30 } : { x: 0, y: 0 };
  const hub = moon
    ? {
        key: `p:${moon.slug}`,
        label: moon.name,
        meta: `${moon.kind} · ${moon.statusLabel}`,
        title: moon.latest?.title ?? moon.line,
        fallback: "",
      }
    : focused
      ? {
          key: focused.slug,
          label: focused.name,
          meta: focused.latest?.project ?? "",
          title: focused.latest?.title ?? "",
          fallback: focused.tagline,
        }
      : null;

  return (
    <div className="relative w-full">
      {/* ---------- Desktop: the constellation ---------- */}
      <div
        ref={box}
        className="orbit-box relative hidden aspect-square w-full md:ml-auto md:block"
        style={{ maxWidth: BOX }}
        onMouseMove={onMove}
        onMouseLeave={onLeaveBox}
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

        {categories.map((w, i) => {
          // The starting pose, so the server render is right; the loop moves it.
          const ang = ((ANGLES[i] ?? 0) * Math.PI) / 180;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const isActive = active === i;
          const dim = active !== null && !isActive;

          return (
            <div
              key={w.slug}
              ref={(el) => {
                sysEls.current[i] = el;
              }}
              className="sys"
              style={{ left: `${50 + RING * cos}%`, top: `${50 + RING * sin}%`, width: SYS, height: SYS }}
              data-active={isActive}
              data-dim={dim}
              onMouseEnter={() => enter(i)}
              onMouseLeave={leave}
              onFocus={() => enter(i)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave();
              }}
            >
              <div className="sys-body orbit-float" style={{ animationDelay: `${i * 0.9}s` }}>
                <div
                  ref={(el) => {
                    ringEls.current[i] = el;
                  }}
                  className="moon-ring"
                />

                <a
                  href={`/${w.slug}`}
                  className="orb-btn"
                  style={{ animationDelay: `${0.4 + i * 0.09}s` }}
                  aria-label={`${w.name}: ${w.tagline}`}
                >
                  <div
                    ref={(el) => {
                      orbEls.current[i] = el;
                    }}
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
                    <span
                      key={isActive ? "enter" : "count"}
                      className="orb-sub hub-in text-[11px]"
                      data-on={isActive}
                    >
                      {isActive ? "Enter →" : `${w.count} ${w.count === 1 ? "project" : "projects"}`}
                    </span>
                  </div>
                </a>

                {w.projects.map((p, j) => {
                  // The resting pose, so the server render is right; the loop moves it.
                  const b = (SEEDS[i] ?? 0) + (TAU * j) / w.projects.length;
                  return (
                  <div
                    key={p.slug}
                    ref={(el) => {
                      (moonEls.current[i] ??= [])[j] = el;
                    }}
                    className="moon-pos"
                    style={{ transform: `translate(${(Math.cos(b) * MOON_R_REST).toFixed(2)}px, ${(Math.sin(b) * MOON_R_REST).toFixed(2)}px)` }}
                  >
                    <a
                      href={p.href}
                      className="moon"
                      data-status={p.status}
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`${p.name}: ${p.kind}, ${p.statusLabel.toLowerCase()}`}
                      onMouseEnter={() => setMoon(p)}
                      onMouseLeave={() => setMoon(null)}
                      onFocus={() => setMoon(p)}
                      onBlur={() => setMoon(null)}
                    >
                      <span className="moon-txt" data-long={/\S{10,}/.test(p.short)}>
                        {p.short}
                      </span>
                    </a>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* center hub — what's new in the focused category or on the hovered moon; a greeting at rest */}
        <div
          className="hub pointer-events-none absolute left-1/2 top-1/2 z-[4] w-[40%] text-center"
          style={{ transform: `translate(calc(-50% - ${hubLean.x.toFixed(1)}px), calc(-50% - ${hubLean.y.toFixed(1)}px))` }}
        >
          {!hub && (
            <div key="rest" className="hub-in hub-rest mono text-[10px] tracking-[0.18em]">
              what up
            </div>
          )}
          {hub && (
            <div key={hub.key} className="hub-in">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                {hub.label}
              </div>
              {hub.title ? (
                <>
                  {hub.meta && <div className="mono mt-2 text-[11px] text-muted">{hub.meta}</div>}
                  <div className="hub-t mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {hub.title}
                  </div>
                </>
              ) : (
                <div className="mt-2 text-sm text-muted">{hub.fallback}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Mobile: three cards ---------- */}
      <div className="flex flex-col gap-3 md:hidden">
        {categories.map((w) => (
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
                  {w.latest.title}
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
