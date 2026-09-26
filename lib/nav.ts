import {
  alsoInWorld,
  projects,
  projectPath,
  projectsInWorld,
  worldById,
  worlds,
  worldPath,
  type Status,
} from "@/lib/content";

/** A page under a nav item: one of a world's projects, for the flyout. */
export type NavChild = {
  label: string;
  href: string;
  status: Status;
  /** Set when the project lives in another world and is only a guest here. */
  from?: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** The pages under this one. Only worlds have any; they get a flyout. */
  children?: NavChild[];
};

export type PaletteItem = { label: string; href: string; group: string };

/**
 * Primary navigation: Home, the worlds, then the pages that always exist.
 * Each world carries its projects (its own first, then guests from other
 * worlds) so the masthead can hang a site-tree flyout under its tab.
 */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  ...worlds.map((w) => ({
    label: w.label ?? w.name,
    href: worldPath(w),
    children: [
      ...projectsInWorld(w).map((p) => ({ label: p.name, href: projectPath(p), status: p.status })),
      ...alsoInWorld(w).map((p) => ({
        label: p.name,
        href: projectPath(p),
        status: p.status,
        from: worldById(p.world).name,
      })),
    ],
  })),
  { label: "Log", href: "/log" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
];

/** Everything the command palette can jump to. */
export const paletteItems: PaletteItem[] = [
  ...navItems.map((n) => ({ label: n.label, href: n.href, group: "Pages" })),
  ...projects.map((p) => ({ label: p.name, href: projectPath(p), group: worldById(p.world).name })),
];
