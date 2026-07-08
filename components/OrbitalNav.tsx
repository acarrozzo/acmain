"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { destinations } from "@/lib/content";

// A calm circular orbit. Each node is a large circle carrying an image that
// represents its section, with light text over it. On hover the circle lifts
// and a CTA pill floats up to overlap it generously.
const R = 36; // orbit radius (% from center)

export function OrbitalNav() {
  const [active, setActive] = useState<number | null>(null);
  const focused = active !== null ? destinations[active] : null;
  const n = destinations.length;

  return (
    <div className="relative">
      {/* ---------- Desktop: orbital field ---------- */}
      <div className="relative mx-auto hidden aspect-square w-[min(36vw,460px)] md:block">
        {/* concentric guide rings + accent glow */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="field-glow absolute h-[70%] w-[70%] rounded-full blur-2xl" />
          {[100, 72, 44].map((s) => (
            <div
              key={s}
              className="absolute rounded-full border border-line"
              style={{ width: `${s}%`, height: `${s}%` }}
            />
          ))}
        </div>

        {/* nodes — fixed positions */}
        <div className="absolute inset-0">
          {destinations.map((d, i) => {
            const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // start at top
            const x = 50 + R * Math.cos(angle);
            const y = 50 + R * Math.sin(angle);
            const isActive = active === i;
            const dim = active !== null && !isActive;

            return (
              <div
                key={d.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%`, zIndex: isActive ? 20 : 10 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <button
                  type="button"
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => (window.location.href = d.href)}
                  className="group relative block rounded-full outline-none"
                  aria-label={`${d.name} — ${d.tagline}`}
                >
                  {/* image circle — lifts on hover */}
                  <motion.span
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -8 : 0,
                      opacity: dim ? 0.42 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative grid h-[100px] w-[100px] place-items-center overflow-hidden rounded-full border-2 bg-cover bg-center transition-colors duration-300 ${
                      isActive
                        ? "border-accent"
                        : "border-line-strong group-hover:border-accent"
                    }`}
                    style={{
                      backgroundImage: `url(/circle/${d.id}.svg)`,
                      ...(isActive ? { boxShadow: "0 0 40px var(--glow)" } : {}),
                    }}
                  >
                    {/* scrim so the light label always reads over the image */}
                    <span className="absolute inset-0 bg-black/35" />
                    <span
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
                      }}
                    />
                    <span className="relative px-2 text-center text-[13px] font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
                      {d.name}
                    </span>
                  </motion.span>

                  {/* CTA pill — floats up to overlap the circle generously */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-[80%] z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-semibold text-paper shadow-xl"
                      >
                        {d.cta} <span aria-hidden>→</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            );
          })}
        </div>

        {/* center hub */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="flex w-[46%] flex-col items-center text-center">
            <AnimatePresence mode="wait">
              {focused ? (
                <motion.div
                  key={focused.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[9px] uppercase tracking-[0.22em] text-muted">
                    {focused.tagline}
                  </span>
                  <h2 className="mt-1.5 text-base leading-tight tracking-tight">
                    {focused.name}
                  </h2>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
                    Explore
                  </span>
                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
