import { site } from "@/content/site";
import { worlds, worldPath } from "@/lib/content";

export function Footer() {
  const links = [
    ...worlds.map((w) => ({ label: w.label ?? w.name, href: worldPath(w) })),
    { label: "Log", href: "/log" },
    { label: "About", href: "/about" },
    { label: "Archive", href: "/archive" },
  ];
  return (
    <footer className="border-t border-line py-12">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mark text-2xl text-ink">
            AC<span className="ac-dot">.</span>
          </span>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Made on Long Island. Nothing here gets deleted; it gets archived.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="text-accent hover:underline">
            {site.email}
          </a>
        </nav>
      </div>
    </footer>
  );
}
