"use client";

import { usePathname } from "next/navigation";
import type { NavItem, PaletteItem } from "@/lib/nav";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function MastheadClient({
  nav,
  palette,
  motto,
  name,
  role,
}: {
  nav: NavItem[];
  palette: PaletteItem[];
  motto: string;
  name: string;
  role: string;
}) {
  const pathname = usePathname() ?? "/";
  return (
    <header className="mast container-page">
      <div className="mast-top">
        <a className="mast-name" href="/about">
          <span className="n">{name}</span>
          <span className="r">{role}</span>
        </a>
        <a className="mast-mark" href="/" aria-label="Home">
          <Mark />
          <span className="motto">{motto}</span>
        </a>
        <div className="mast-right">
          <CommandPalette items={palette} />
          <ThemeToggle />
        </div>
      </div>
      <nav className="mast-nav" aria-label="Sections">
        <ul>
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={isActive(pathname, item.href) ? "on" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
