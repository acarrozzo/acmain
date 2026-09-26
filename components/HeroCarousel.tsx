"use client";

import { PlayPause, useCarousel } from "./useCarousel";

export type Slide = { kind: "img"; src: string; alt: string } | { kind: "tile"; label: string };

/** A project's hero with its screenshot strip, auto-advancing. */
export function HeroCarousel({ slides, duration = 5000 }: { slides: Slide[]; duration?: number }) {
  const { index, show, playing, toggle, progress } = useCarousel(slides.length, duration);
  const s = slides[index];
  if (!s) return null;
  return (
    <div>
      <div className="hero">
        <div className="slot">
          {s.kind === "img" ? (
            <img key={s.src} src={s.src} alt={s.alt} />
          ) : (
            <div className="type-tile hero-tile">
              <span>{s.label}</span>
              <small>screenshot coming</small>
            </div>
          )}
        </div>
        {slides.length > 1 && (
          <>
            <span className="ctr mono">
              {index + 1} / {slides.length}
            </span>
            <PlayPause playing={playing} onToggle={toggle} />
            <div className="prog" aria-hidden="true">
              <i style={{ transform: `scaleX(${progress})` }} />
            </div>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="shots">
          {slides.map((sl, i) => (
            <button
              key={i}
              type="button"
              className={[i === index ? "on" : "", sl.kind === "tile" ? "type-tile" : ""].filter(Boolean).join(" ") || undefined}
              onClick={() => show(i)}
              aria-label={sl.kind === "img" ? sl.alt : sl.label}
              aria-current={i === index}
            >
              {sl.kind === "img" ? <img src={sl.src} alt="" loading="lazy" /> : <span>{sl.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
