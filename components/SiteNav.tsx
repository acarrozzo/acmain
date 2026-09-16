"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";
import { AccentPicker } from "./AccentPicker";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        {/* Picker sits at the far left so its panel opens over the hero copy
            rather than across the orbit — the orbit is the thing you're
            actually judging the accent against. Temporary rig; remove with
            StudioControls before launch. */}
        <div className="flex items-center gap-2.5">
          <AccentPicker />
          <a
            href="/"
            className="mark text-xl tracking-tight text-ink"
            aria-label="Home"
          >
            AC<span className="ac-dot">.</span>
          </a>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper/95 backdrop-blur-xl md:hidden">
          <nav className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-base text-ink-soft"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
