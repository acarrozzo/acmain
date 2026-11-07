"use client";

import { useEffect, useRef, useState } from "react";

type Item = { src: string; name: string; sub: string; href: string };

/**
 * The large preview. Any element on the page with `data-preview` (an image
 * URL), `data-name`, `data-sub` and `data-href` opens it; the gallery is the
 * page's order of those elements, so prev/next walk the lists.
 */
export function Preview() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const read = () => Array.from(document.querySelectorAll<HTMLElement>("[data-preview]")).map((e) => ({ src: e.dataset.preview!, name: e.dataset.name || "", sub: e.dataset.sub || "", href: e.dataset.href || "#" }));
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      if (!el) return;
      ev.preventDefault();
      const all = read(); setItems(all);
      setIdx(Array.from(document.querySelectorAll("[data-preview]")).indexOf(el));
    };
    document.addEventListener("click", onClick);
    // hover preview for text links that carry an image
    const pv = document.createElement("div"); pv.className = "h-pv"; pv.setAttribute("aria-hidden", "true");
    const img = document.createElement("img"); img.alt = ""; pv.appendChild(img); document.body.appendChild(pv);
    const over = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; const el = (e.target as HTMLElement).closest<HTMLElement>("[data-hover]"); if (!el) return; img.src = el.dataset.preview!; pv.classList.add("h-on"); };
    const move = (e: PointerEvent) => { if (!pv.classList.contains("h-on")) return; let x = e.clientX + 16, y = e.clientY + 16; if (x + 200 > innerWidth) x = e.clientX - 216; if (y + 150 > innerHeight) y = e.clientY - 166; pv.style.transform = `translate(${x}px,${y}px)`; };
    const out = (e: PointerEvent) => { if ((e.target as HTMLElement).closest?.("[data-hover]")) pv.classList.remove("h-on"); };
    document.addEventListener("pointerover", over); document.addEventListener("pointermove", move); document.addEventListener("pointerout", out);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("pointerover", over); document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", out); pv.remove(); };
  }, []);

  useEffect(() => {
    if (idx === null) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length));
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % items.length));
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [idx, items.length]);

  if (idx === null || !items[idx]) return null;
  const it = items[idx];
  return (
    <div className="h-lb" role="dialog" aria-modal="true" aria-label="Preview" onClick={(e) => { if ((e.target as HTMLElement).classList.contains("h-im") || e.target === e.currentTarget) setIdx(null); }}>
      <div className="h-im"><img src={it.src} alt={it.name} /></div>
      <div className="h-bar">
        <div className="h-t"><b>{it.name}</b><span>{it.sub}</span></div>
        <div className="h-ctls">
          <button type="button" onClick={() => setIdx((idx - 1 + items.length) % items.length)}>← prev</button>
          <button type="button" onClick={() => setIdx((idx + 1) % items.length)}>next →</button>
          <a href={it.href}>Open project</a>
          <button type="button" ref={closeBtn} onClick={() => setIdx(null)}>Esc</button>
        </div>
      </div>
    </div>
  );
}
