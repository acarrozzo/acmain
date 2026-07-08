"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle celestial particle field. Slow-drifting, softly twinkling points
 * rendered on a canvas. Colour follows the theme via the --particle CSS var.
 * Disabled entirely for users who prefer reduced motion.
 */
export function Particles({ count = 46 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const pts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.4,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
      tw: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.012 + 0.004,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--particle")
          .trim() || "120, 140, 200";
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.ts;
        if (p.x < 0) p.x += 1;
        if (p.x > 1) p.x -= 1;
        if (p.y < 0) p.y += 1;
        if (p.y > 1) p.y -= 1;
        const a = 0.18 + (Math.sin(p.tw) + 1) * 0.22;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
