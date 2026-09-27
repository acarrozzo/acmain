"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavChild, NavItem, PaletteItem } from "@/lib/nav";
import { STATUS_LABEL } from "@/lib/content";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { StatusGlyph } from "./ui";

/** Flyouts need a pointer that can hover and a nav that has not wrapped. */
const FLY_MEDIA = "(hover: hover) and (min-width: 901px)";
/** Crossing the nav should not flash every panel open; leaving should forgive a wobble. */
const OPEN_DELAY = 70;
const CLOSE_DELAY = 140;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function flyId(item: NavItem) {
  return `fly-${item.href.replace(/\W+/g, "") || "home"}`;
}

export function MastheadClient({
  nav,
  palette,
  name,
  role,
}: {
  nav: NavItem[];
  palette: PaletteItem[];
  name: string;
  role: string;
}) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState<string | null>(null);
  const [canFly, setCanFly] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  /** The tab Escape just closed: its next focus event should not reopen it. */
  const dismissed = useRef<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(FLY_MEDIA);
    const sync = () => setCanFly(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(timer.current);
    };
  }, []);

  const later = (next: string | null, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };
  const now = (next: string | null) => {
    window.clearTimeout(timer.current);
    setOpen(next);
  };

  return (
    <header className="mast container-page">
      <div className="mast-top">
        <a className="mast-name" href="/about">
          <span className="n">{name}</span>
          <span className="r">{role}</span>
        </a>
        <a className="mast-mark" href="/" aria-label="Home">
          <Mark />
        </a>
        <div className="mast-right">
          <CommandPalette items={palette} />
          <ThemeToggle />
        </div>
      </div>
      <nav className="mast-nav" aria-label="Sections">
        <ul>
          {nav.map((item) => {
            const fly = canFly && (item.children?.length ?? 0) > 0;
            const isOpen = fly && open === item.href;
            return (
              <li
                key={item.href}
                onMouseEnter={fly ? () => later(item.href, OPEN_DELAY) : undefined}
                onMouseLeave={fly ? () => later(null, CLOSE_DELAY) : undefined}
                onFocus={
                  fly
                    ? () => {
                        if (dismissed.current === item.href) {
                          dismissed.current = null;
                          return;
                        }
                        now(item.href);
                      }
                    : undefined
                }
                onBlur={
                  fly
                    ? (e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) now(null);
                      }
                    : undefined
                }
                onKeyDown={
                  fly
                    ? (e) => {
                        if (e.key !== "Escape" || !isOpen) return;
                        const tab = e.currentTarget.querySelector<HTMLAnchorElement>("a.tab");
                        if (tab && document.activeElement !== tab) {
                          dismissed.current = item.href;
                          tab.focus();
                        }
                        now(null);
                      }
                    : undefined
                }
              >
                <a
                  href={item.href}
                  className={isActive(pathname, item.href) ? "tab on" : "tab"}
                  aria-expanded={fly ? isOpen : undefined}
                  aria-controls={fly ? flyId(item) : undefined}
                >
                  {item.label}
                </a>
                {isOpen && <Flyout id={flyId(item)} item={item} pathname={pathname} />}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

/**
 * The site tree under a category's tab: a link to the whole category, then every
 * project as a status glyph and a name. Guests from other categories sit under
 * a hairline. The wrapper's top padding bridges the gap to the tab so the
 * pointer never leaves the item on the way down.
 */
function Flyout({ id, item, pathname }: { id: string; item: NavItem; pathname: string }) {
  const children = item.children ?? [];
  const own = children.filter((c) => !c.from);
  const guests = children.filter((c) => c.from);
  return (
    <div className="fly" id={id}>
      <div className="fly-card">
        <a className="fly-all" href={item.href}>
          All {item.label}
        </a>
        <ul>
          {own.map((c) => (
            <FlyRow key={c.href} c={c} on={pathname === c.href} />
          ))}
          {guests.length > 0 && <li className="fly-sep" aria-hidden="true" />}
          {guests.map((c) => (
            <FlyRow key={c.href} c={c} on={pathname === c.href} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FlyRow({ c, on }: { c: NavChild; on: boolean }) {
  return (
    <li>
      <a href={c.href} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
        <StatusGlyph status={c.status} />
        <span className="l">{c.label}</span>
        <span className="sr-only">, {STATUS_LABEL[c.status].toLowerCase()}</span>
        {c.from && <span className="f">{c.from}</span>}
      </a>
    </li>
  );
}
