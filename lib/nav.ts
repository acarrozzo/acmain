import { projects, projectPath, worldById, worlds, worldPath } from "@/lib/content";

export type NavItem = { label: string; href: string };
export type PaletteItem = { label: string; href: string; group: string };

/** Primary navigation: Home, the worlds, then the pages that always exist. */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  ...worlds.map((w) => ({ label: w.label ?? w.name, href: worldPath(w) })),
  { label: "Log", href: "/log" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
];

/** Everything the command palette can jump to. */
export const paletteItems: PaletteItem[] = [
  ...navItems.map((n) => ({ ...n, group: "Pages" })),
  ...projects.map((p) => ({ label: p.name, href: projectPath(p), group: worldById(p.world).name })),
];
