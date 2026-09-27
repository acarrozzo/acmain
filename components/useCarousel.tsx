"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Auto-advance with a per-item progress value. Pauses when the tab is
 * hidden and starts paused when the visitor prefers reduced motion.
 */
export function useCarousel(count: number, duration: number) {
  const [index, setIndex] = useState(0);
  const [wantPlay, setWantPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const start = useRef(0);
  const elapsed = useRef(0);
  const raf = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setWantPlay(false);
  }, []);

  const show = useCallback(
    (n: number) => {
      setIndex(((n % count) + count) % count);
      elapsed.current = 0;
      start.current = performance.now();
      setProgress(0);
    },
    [count],
  );

  useEffect(() => {
    if (!wantPlay || count < 2) return;
    let alive = true;
    const run = () => {
      if (running.current) return;
      running.current = true;
      start.current = performance.now() - elapsed.current;
      const tick = (now: number) => {
        if (!alive || !running.current) return;
        const p = Math.min(1, (now - start.current) / duration);
        setProgress(p);
        if (p >= 1) {
          setIndex((i) => (i + 1) % count);
          elapsed.current = 0;
          start.current = now;
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    };
    const halt = () => {
      if (!running.current) return;
      running.current = false;
      elapsed.current = performance.now() - start.current;
      cancelAnimationFrame(raf.current);
    };
    const onVis = () => (document.hidden ? halt() : run());
    document.addEventListener("visibilitychange", onVis);
    run();
    return () => {
      alive = false;
      halt();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [wantPlay, count, duration]);

  /** Move by a delta from wherever we are now, so rapid clicks all land. */
  const step = useCallback(
    (d: number) => {
      setIndex((i) => (((i + d) % count) + count) % count);
      elapsed.current = 0;
      start.current = performance.now();
      setProgress(0);
    },
    [count],
  );
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  const toggle = useCallback(() => setWantPlay((v) => !v), []);

  return { index, show, prev, next, playing: wantPlay, toggle, progress };
}

export function PlayPause({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="pp" aria-pressed={playing} aria-label={playing ? "Pause" : "Play"} onClick={onToggle}>
      {playing ? (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 4l13 8-13 8z" />
        </svg>
      )}
    </button>
  );
}

/**
 * The full control cluster for a carousel corner: counter, previous, play or
 * pause, next. Positioned by `.ctrl`; the buttons inside sit in flow.
 */
export function CarouselControls({
  index,
  count,
  playing,
  onToggle,
  onPrev,
  onNext,
}: {
  index: number;
  count: number;
  playing: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="ctrl">
      <span className="ctr mono">
        {index + 1} / {count}
      </span>
      <button type="button" className="nx" aria-label="Previous" onClick={onPrev}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <PlayPause playing={playing} onToggle={onToggle} />
      <button type="button" className="nx" aria-label="Next" onClick={onNext}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
