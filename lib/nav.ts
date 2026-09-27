import {
  alsoInCategory,
  projects,
  projectPath,
  projectsInCategory,
  categoryById,
  categories,
  categoryPath,
  type Status,
} from "@/lib/content";

/** A page under a nav item: one of a category's projects, for the flyout. */
export type NavChild = {
  label: string;
  href: string;
  status: Status;
  /** Set when the project lives in another category and is only a guest here. */
  from?: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** The pages under this one. Only categories have any; they get a flyout. */
  children?: NavChild[];
};

export type PaletteItem = { label: string; href: string; group: string };

/**
 * Primary navigation: Home, the categories, then the pages that always exist.
 * Each category carries its projects (its own first, then guests from other
 * categories) so the masthead can hang a site-tree flyout under its tab.
 */
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  ...categories.map((w) => ({
    label: w.label ?? w.name,
    href: categoryPath(w),
    children: [
      ...projectsInCategory(w).map((p) => ({ label: p.name, href: projectPath(p), status: p.status })),
      ...alsoInCategory(w).map((p) => ({
        label: p.name,
        href: projectPath(p),
        status: p.status,
        from: categoryById(p.category).name,
      })),
    ],
  })),
  { label: "About", href: "/about" },
  /** Temporary: the design-system workbench. Remove when it has done its job. */
  { label: "System", href: "/system" },
];

/** Everything the command palette can jump to. */
export const paletteItems: PaletteItem[] = [
  ...navItems.map((n) => ({ label: n.label, href: n.href, group: "Pages" })),
  /** Linked only from the footer, but still worth a jump. */
  { label: "Log", href: "/log", group: "Pages" },
  { label: "Archive", href: "/archive", group: "Pages" },
  ...projects.map((p) => ({ label: p.name, href: projectPath(p), group: categoryById(p.category).name })),
];
