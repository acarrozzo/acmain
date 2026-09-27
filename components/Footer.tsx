import { site } from "@/content/site";
import { person } from "@/content/person";
import { navItems } from "@/lib/nav";

/** The log and the archive are linked from here and nowhere else in the chrome. */
const LOG = { label: "Log", href: "/log" };
const ARCHIVE = { label: "Archive", href: "/archive" };

/**
 * The footer, composed like the original acarrozzo.com footer: a centered
 * stack that ends every page the same way. Copy lives in `site.footer`.
 */
export function Footer() {
  const { footer } = site;
  const year = new Date().getFullYear();
  const about = navItems.findIndex((n) => n.href === "/about");
  const links =
    about < 0
      ? [...navItems, LOG, ARCHIVE]
      : [...navItems.slice(0, about), LOG, navItems[about], ARCHIVE, ...navItems.slice(about + 1)];
  return (
    <footer className="foot container-page">
      <h2 className="foot-h">{footer.heading}</h2>
      <p className="foot-sub">{footer.sub}</p>
      <ul>
        {links.map((n) => (
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
      <p className="foot-small mono">
        <span>
          {site.version} · © {footer.firstYear}–{year} {site.name}. All rights reserved.
        </span>
        <a href="/">{footer.homeLabel}</a>
      </p>
    </footer>
  );
}
