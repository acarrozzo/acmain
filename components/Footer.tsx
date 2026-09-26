import { site } from "@/content/site";
import { navItems } from "@/lib/nav";
import { Mark } from "./Mark";

export function Footer() {
  return (
    <footer className="foot container-page">
      <div className="flex flex-col gap-1">
        <a href="/" className="word" aria-label="AC, home">
          <Mark className="" />
          <span>
            AC<span>.</span>
          </span>
        </a>
        <span className="mono">
          {site.version} · {site.since}
        </span>
      </div>
      <div>
        Made on Long Island. Nothing here gets deleted; it gets archived.
        <ul>
          {navItems
            .filter((n) => n.href !== "/")
            .map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
        </ul>
      </div>
      <a href={`mailto:${site.email}`} className="font-semibold text-accent">
        {site.email}
      </a>
    </footer>
  );
}
