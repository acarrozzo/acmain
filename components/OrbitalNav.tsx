"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { destinations } from "@/lib/content";

// A calm constellation. Each world is a glass orb lit from the central
// "sun". Hover brings one into focus — it lifts and ignites, a light-spoke
// draws out from the hub, and the others recede (depth-of-field). The whole
// field parallaxes gently under the cursor; the orbs never travel, they breathe.
const R = 40; // orbit radius, % from center

export function OrbitalNav() {
  const [active, setActive] = useState<number | null>(null);
  const focused = active !== null ? destinations[active] : null;
  const n = destinations.length;
  const parallax = useRef<HTMLDivElement>(null);

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
        className="relative hidden aspect-square w-full max-w-[520px] md:ml-auto md:block"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* nebula + guide rings — the layer that parallaxes */}
        <div
          ref={parallax}
          className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
        >
          <div className="orbit-nebula absolute -inset-[20%]" />
          {[100, 68, 36].map((s) => (
            <div
              key={s}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
              style={{ width: `${s}%`, height: `${s}%` }}
            />
          ))}
          <div className="orbit-ring-spin absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        {/* the central sun — light source + resting focal point */}
        <div className="orbit-sun absolute left-1/2 top-1/2 z-[3] h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

        {/* orbs */}
        {destinations.map((d, i) => {
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const x = 50 + R * cos;
          const y = 50 + R * sin;
          const isActive = active === i;
          const dim = active !== null && !isActive;

          return (
            <div
              key={d.id}
              className="absolute z-[5] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="orbit-float" style={{ animationDelay: `${i * 0.55}s` }}>
                <button
                  type="button"
                  className="orb-btn relative block rounded-full outline-none"
                  style={{ animationDelay: `${0.55 + i * 0.07}s` }}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => (window.location.href = d.href)}
                  aria-label={`${d.name} — ${d.tagline}`}
                >
                  <div
                    className="orb grid place-items-center rounded-full"
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
                    <span className="orb-label px-2 text-center text-[13px] font-semibold leading-tight tracking-tight">
                      {d.name}
                    </span>
                  </div>

                  {/* CTA pill — overlaps the bottom edge of the focused orb */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="orb-cta pointer-events-none absolute left-1/2 top-full z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-semibold"
                      >
                        {d.cta} <span aria-hidden>→</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          );
        })}

        {/* center hub — resolves the focused world */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4] w-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
          <AnimatePresence mode="wait">
            {focused && (
              <motion.div
                key={focused.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="text-[9px] uppercase tracking-[0.22em] text-muted">
                  {focused.tagline}
                </div>
                <div className="mt-1.5 text-base font-semibold leading-tight tracking-tight text-ink">
                  {focused.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Mobile: stacked cards with section imagery ---------- */}
      <div className="flex flex-col gap-3 md:hidden">
        {destinations.map((d) => (
          <a
            key={d.id}
            href={d.href}
            className="group relative flex h-24 items-center justify-between gap-4 overflow-hidden rounded-2xl border border-line-strong bg-cover bg-center p-5"
            style={{ backgroundImage: `url(/circle/${d.id}.svg)` }}
          >
            <span className="absolute inset-0 bg-black/45" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-widest text-white/70">
                {d.tagline}
              </div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-white">
                {d.name}
              </div>
            </div>
            <span className="relative text-white transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
