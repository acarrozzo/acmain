"use client";

import { CommandPalette } from "@/components/CommandPalette";
import type { PaletteItem } from "@/lib/nav";

export type HeaderLink = { label: string; href: string };

/** Flip the theme with a blurred circle that grows from the button, like paulstamatiou.com. */
function flipTheme(btn: HTMLElement | null) {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";
  const apply = () => {
    root.classList.toggle("dark", next === "dark");
    root.dataset.theme = next;
    try { localStorage.setItem("ac-theme", next); } catch {}
  };
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const d = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (!d.startViewTransition || reduced || !btn) { apply(); return; }
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, s = Math.max(innerWidth, innerHeight) * 2.2;
  const mask = "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-66 -66 132 132\"><defs><filter id=\"b\"><feGaussianBlur stdDeviation=\"5\"/></filter></defs><circle r=\"33\" fill=\"black\" filter=\"url(%23b)\"/></svg>')";
  const st = document.createElement("style");
  st.textContent = `::view-transition-group(root){animation-duration:800ms}::view-transition-new(root){animation:ac-reveal 800ms linear(0 0%,.2342 12.49%,.4374 24.99%,.6093 37.49%,.6835 43.74%,.7499 49.99%,.8086 56.25%,.8593 62.5%,.9023 68.75%,.9375 75%,.9648 81.25%,.9844 87.5%,.9961 93.75%,1 100%) forwards;mask:${mask} 0 0/100% 100% no-repeat;mask-position:${x}px ${y}px}::view-transition-old(root){animation:none;z-index:-1}@keyframes ac-reveal{0%{mask-position:${x}px ${y}px;mask-size:0}100%{mask-position:${x - s / 2}px ${y - s / 2}px;mask-size:${s}px}}`;
  document.head.appendChild(st);
  d.startViewTransition(apply).finished.then(() => st.remove(), () => st.remove());
}

/** One row: the name on the left, the nav and controls on the right, a hairline under. The A lives in the footer. */
export function Header({ name, links, palette }: { name: string; links: HeaderLink[]; palette: PaletteItem[] }) {
  return (
    <header className="h-hd">
      <a className="h-nm" href="/">{name}</a>
      <nav>
        {links.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
        <span className="h-ctl">
          <CommandPalette items={palette} />
          <button type="button" aria-label="Toggle light or dark" onClick={(e) => flipTheme(e.currentTarget)}>☾</button>
        </span>
      </nav>
    </header>
  );
}
