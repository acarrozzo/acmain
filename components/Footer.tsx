import { site } from "@/content/site";
import { person } from "@/content/person";
import { navItems } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The log and the archive are linked from here and nowhere else in the
 * chrome, so they sit after the primary nav behind a hairline divider.
 */
const EXTRA = [
  { label: "Log", href: "/log" },
  { label: "Archive", href: "/archive" },
];

export function Footer() {
  const { footer } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="foot container-page">
      <h2 className="foot-h">{footer.heading}</h2>
      <p className="foot-sub">{footer.sub}</p>
      <ul>
        {navItems.map((n) => (
          <li key={n.href}>
            <a href={n.href}>{n.label}</a>
          </li>
        ))}
        <li className="foot-sep" aria-hidden="true" />
        {EXTRA.map((n) => (
          <li key={n.href}>
            <a href={n.href}>{n.label}</a>
          </li>
        ))}
      </ul>
      <p className="foot-story">{footer.story}</p>
      <img src={person.portrait} alt={person.name} width={80} height={80} loading="lazy" className="foot-face" />
      <p className="foot-contact">
        <span className="mut">{footer.contactLabel}</span>{" "}
        <span className="em">{site.email}</span>
      </p>
      <div className="foot-tools">
        <ThemeToggle labelled />
      </div>
      <p className="foot-small mono">
        <span>
          {site.version} · © {footer.firstYear}–{year} {site.name}. All rights reserved.
        </span>
        <a href="/">{footer.homeLabel}</a>
      </p>
    </footer>
  );
}
