"use client";

import { useRef } from "react";
import { about, community, currentlyBuilding, featured } from "@/lib/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
      {children}
    </span>
  );
}

/** A calm tonal placeholder that stands in for card art until real imagery lands. */
function ArtField({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-surface-2 ${className}`}>
      <div className="field-glow absolute inset-0 opacity-70" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
    </div>
  );
}

export function CompactOverview() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: "smooth" });
  };

  return (
    <section className="border-t border-line py-8 md:py-10">
      <div className="container-page flex flex-col gap-8">
        {/* ------------------------------------------------ Currently building */}
        <div>
          <div className="flex items-center gap-3">
            <SectionLabel>Currently building</SectionLabel>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentlyBuilding.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-sm font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {item.note}
                  </p>
                  <span className="mt-auto pt-3 inline-flex w-fit items-center gap-1.5 text-[11px] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item.status}
                  </span>
                </div>
                <ArtField className="h-16 w-20 shrink-0 self-start" />
              </div>
            ))}

            {/* "More to come" — the platform is always growing */}
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-line-strong bg-surface/40 p-4">
              <div className="flex flex-1 flex-col">
                <h3 className="text-sm font-medium text-ink">More to come</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Always building. Always exploring.
                </p>
              </div>
              <div className="grid h-16 w-20 shrink-0 place-items-center rounded-xl border border-line text-muted">
                <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ Featured work */}
        <div>
          <div className="flex items-center gap-3">
            <SectionLabel>Featured work</SectionLabel>
            <span className="h-px flex-1 bg-line" />
            <div className="flex gap-2">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
                  onClick={() => scrollRail(dir)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {dir === -1 ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div
            ref={railRef}
            className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {featured.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group w-56 shrink-0 snap-start"
              >
                <ArtField className="aspect-[4/3] w-full transition-opacity duration-300 group-hover:opacity-90" />
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-ink">{item.title}</h3>
                  <p className="text-xs text-muted">{item.kind}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------ About / signup / connect */}
        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-3 md:gap-12">
          <div>
            <SectionLabel>About</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {about.body}
            </p>
            <a
              href="#about"
              className="mt-3 inline-flex items-center gap-1 text-sm text-accent transition-transform hover:translate-x-0.5"
            >
              Learn more →
            </a>
          </div>

          <div>
            <SectionLabel>Stay in the loop</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Updates, new projects, and behind-the-scenes insights straight to your inbox.
            </p>
            {/* Visual only — no submission wiring yet */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2 rounded-full border border-line-strong bg-surface p-1 pl-4"
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>

          <div>
            <SectionLabel>Let&apos;s connect</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              {community.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="rounded-full border border-line-strong px-4 py-2 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
