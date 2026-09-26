"use client";

import { useEffect, useState } from "react";

/** The sticky index down the left of the /system page. Highlights the section under the top of the viewport. */
export function SystemIndex({ sections }: { sections: { id: string; label: string }[] }) {
  const [on, setOn] = useState(sections[0]?.id ?? "");
  useEffect(() => {
    const pick = () => {
      let cur = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) cur = s.id;
      }
      setOn(cur);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [sections]);
  return (
    <nav className="ds-index" aria-label="On this page">
      <span className="mono">On this page</span>
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={on === s.id ? "on" : undefined}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}
