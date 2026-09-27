"use client";

import { useEffect, useState } from "react";

/**
 * The sun / moon switch. It can sit in more than one place (masthead and
 * footer), so every instance reads the theme off <html> and watches it for
 * changes rather than owning the state itself. Pass `labelled` for a wider
 * button that says which theme is on.
 */
export function ThemeToggle({ labelled = false }: { labelled?: boolean }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    setMounted(true);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("ac-theme", next ? "dark" : "light");
    } catch {}
  }

  const isDark = mounted && dark;
  const base =
    "group relative border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink";
  const shape = labelled
    ? "inline-flex h-9 items-center gap-2 rounded-full pl-3 pr-4"
    : "grid h-9 w-9 place-items-center rounded-full";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      aria-pressed={dark}
      className={`${base} ${shape}`}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun / moon crossfade — stable output until mounted to avoid hydration mismatch */}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {isDark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
      {labelled && (
        <span className="mono" aria-hidden="true">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
