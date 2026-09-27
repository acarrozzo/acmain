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
/** Below this the six tabs no longer fit on one line, so they fold into the menu sheet. */
const COMPACT_MEDIA = "(max-width: 520px)";
const SHEET_ID = "mast-sheet";
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
  const [compact, setCompact] = useState(false);
  const [sheet, setSheet] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MEDIA);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The sheet only exists in the compact layout, and a new page starts closed. */
  useEffect(() => {
    if (!compact) setSheet(false);
  }, [compact]);
  useEffect(() => setSheet(false), [pathname]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSheet(false);
      menuBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sheet]);

  const showSheet = compact && sheet;

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
        <div className="mast-left">
          <button
            ref={menuBtn}
            type="button"
            className="mast-menu"
            onClick={() => setSheet((v) => !v)}
            aria-label={showSheet ? "Close menu" : "Menu"}
            aria-expanded={showSheet}
            aria-controls={SHEET_ID}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {showSheet ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <a className="mast-name" href="/">
            <span className="n">{name}</span>
            <span className="r">{role}</span>
          </a>
        </div>
        <a className="mast-mark" href="/" aria-label="Home">
          <Mark />
        </a>
        <div className="mast-right">
          <CommandPalette items={palette} />
          <ThemeToggle />
        </div>
      </div>
      {showSheet && <Sheet id={SHEET_ID} nav={nav} pathname={pathname} />}
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
        <ul className="tree">
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

/**
 * The compact-layout menu. The three categories lead as a row of tabs, then
 * each category's site tree (touch has no flyouts, so this is where the
 * projects live), then the standalone pages. Sits under the masthead rule
 * and pushes the page down rather than covering it.
 */
function Sheet({ id, nav, pathname }: { id: string; nav: NavItem[]; pathname: string }) {
  const cats = nav.filter((n) => (n.children?.length ?? 0) > 0);
  const pages = nav.filter((n) => !(n.children?.length ?? 0));
  return (
    <nav className="mast-sheet" id={id} aria-label="Sections">
      <ul className="sheet-cats">
        {cats.map((c) => (
          <li key={c.href}>
            <a href={c.href} className={isActive(pathname, c.href) ? "sheet-cat on" : "sheet-cat"}>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
      {cats.map((c) => {
        const children = c.children ?? [];
        const own = children.filter((x) => !x.from);
        const guests = children.filter((x) => x.from);
        return (
          <section className="sheet-tree" key={c.href} aria-label={c.label}>
            <a className="fly-all" href={c.href} aria-current={pathname === c.href ? "page" : undefined}>
              All {c.label}
            </a>
            <ul className="tree">
              {own.map((x) => (
                <FlyRow key={x.href} c={x} on={pathname === x.href} />
              ))}
              {guests.length > 0 && <li className="fly-sep" aria-hidden="true" />}
              {guests.map((x) => (
                <FlyRow key={x.href} c={x} on={pathname === x.href} />
              ))}
            </ul>
          </section>
        );
      })}
      <ul className="sheet-pages">
        {pages.map((p) => (
          <li key={p.href}>
            <a
              href={p.href}
              className={isActive(pathname, p.href) ? "sheet-tab on" : "sheet-tab"}
              aria-current={pathname === p.href ? "page" : undefined}
            >
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
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
