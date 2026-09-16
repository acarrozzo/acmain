import { worlds, worldPath } from "@/lib/content";
import type { NavItem } from "./SiteNav";

/** Primary navigation: the worlds, then the two pages that always exist. */
export const navItems: NavItem[] = [
  ...worlds.map((w) => ({ label: w.label ?? w.name, href: worldPath(w) })),
  { label: "Log", href: "/log" },
  { label: "About", href: "/about" },
];
