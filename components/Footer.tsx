import { site } from "@/content/site";
import { person } from "@/content/person";
import { navItems } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";
import { BackdropBottom } from "./Backdrop";
import { TempHeadshot } from "./TempHeadshot";

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
      <BackdropBottom />
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
      {/* TEMP: headshot picker; was <img src={person.portrait} ... className="foot-face" /> */}
      <TempHeadshot size={80} className="foot-face" />
      <p className="foot-contact">
        <span className="mut">{footer.contactLabel}</span>{" "}
        <span className="em">{site.email}</span>
      </p>
      <div className="foot-tools">
        <ThemeToggle labelled />
      </div>
      <p className="foot-small mono">
        <span>
          © {footer.firstYear}–{year} {site.name}. All rights reserved.
        </span>
        <a href="/">{footer.homeLabel}</a>
      </p>
    </footer>
  );
}
