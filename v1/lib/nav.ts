import {
  projects,
  projectPath,
  projectsInCategory,
  categoryById,
  categories,
  categoryPath,
  type Status,
} from "@/v1/lib/content";

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
 * Each category carries its own projects so the masthead can hang a site-tree
 * flyout under its tab. Guests from other categories (a category's `also`)
 * appear on the category page but not in its menu.
 */
export const navItems: NavItem[] = [
  { label: "Home", href: "/v1" },
  ...categories.map((w) => ({
    label: w.label ?? w.name,
    href: categoryPath(w),
    children: projectsInCategory(w).map((p) => ({ label: p.name, href: projectPath(p), status: p.status })),
  })),
  { label: "About", href: "/v1/about" },
  /** Temporary: the design-system workbench. Remove when it has done its job. */
  { label: "System", href: "/v1/system" },
];

/** Everything the command palette can jump to. */
export const paletteItems: PaletteItem[] = [
  ...navItems.map((n) => ({ label: n.label, href: n.href, group: "Pages" })),
  /** Linked only from the footer, but still worth a jump. */
  { label: "Log", href: "/v1/log", group: "Pages" },
  { label: "Archive", href: "/v1/archive", group: "Pages" },
  ...projects.map((p) => ({ label: p.name, href: projectPath(p), group: categoryById(p.category).name })),
];
