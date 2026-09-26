import { projects } from "@/content/projects";
import { worlds } from "@/content/worlds";
import { featured } from "@/content/featured";
import type { Entry, Featured, Project, Status, World, WorldId } from "@/content/types";

export type { Entry, Featured, Project, Status, World, WorldId };
export { projects, worlds, featured };

export type EntryWithProject = Entry & { project: Project; world: World };

export const STATUS_LABEL: Record<Status, string> = {
  idea: "Idea",
  paper: "On paper",
  prototype: "Prototype",
  playable: "Playable",
  live: "Live",
  resting: "Resting",
  archived: "Archived",
};

/** Statuses that count as "currently building". */
const BUILDING: Status[] = ["prototype", "playable", "paper", "idea"];

export function worldById(id: WorldId): World {
  const w = worlds.find((w) => w.id === id);
  if (!w) throw new Error(`Unknown world: ${id}`);
  return w;
}

export function worldBySlug(slug: string): World | undefined {
  return worlds.find((w) => w.slug === slug);
}

export function worldPath(world: World): string {
  return `/${world.slug}`;
}

export function projectPath(p: Project): string {
  return `/${worldById(p.world).slug}/${p.slug}`;
}

export function getProject(worldSlug: string, slug: string): Project | undefined {
  const w = worldBySlug(worldSlug);
  if (!w) return undefined;
  return projects.find((p) => p.world === w.id && p.slug === slug);
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

function bySlugOrder(order: string[] | undefined) {
  return (a: Project, b: Project) => {
    const ia = order?.indexOf(a.slug) ?? -1;
    const ib = order?.indexOf(b.slug) ?? -1;
    const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
    const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  };
}

/** Projects that belong to a world, in the world's featured order, then the rest. */
export function projectsInWorld(world: World): Project[] {
  return projects
    .filter((p) => p.world === world.id)
    .sort(bySlugOrder(world.featured));
}

/** Projects from other worlds that a world page also shows. */
export function alsoInWorld(world: World): Project[] {
  return (world.also ?? [])
    .map((slug) => projectBySlug(slug))
    .filter((p): p is Project => Boolean(p));
}

export function entriesOf(p: Project): Entry[] {
  return [...(p.entries ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function latestEntryOf(p: Project): Entry | undefined {
  return entriesOf(p)[0];
}

/** Every entry on the site, newest first. */
export function allEntries(): EntryWithProject[] {
  const out: EntryWithProject[] = [];
  for (const project of projects) {
    const world = worldById(project.world);
    for (const e of project.entries ?? []) out.push({ ...e, project, world });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function latestEntries(n: number): EntryWithProject[] {
  return allEntries().slice(0, n);
}

export function latestEntryInWorld(world: World): EntryWithProject | undefined {
  return allEntries().find((e) => e.world.id === world.id);
}

/** Newest date on the whole site, for "last shipped". */
export function lastShipped(): string | undefined {
  return allEntries()[0]?.date;
}

function byActivity(a: Project, b: Project) {
  const da = latestEntryOf(a)?.date ?? "";
  const db = latestEntryOf(b)?.date ?? "";
  if (da !== db) return da < db ? 1 : -1;
  return a.name.localeCompare(b.name);
}

/** Projects with fresh work, newest activity first. */
export function building(): Project[] {
  return projects.filter((p) => BUILDING.includes(p.status)).sort(byActivity);
}

/** Every project, newest activity first. */
export function latestActivity(): Project[] {
  return [...projects].sort(byActivity);
}

/** Group a world's projects for listing. */
export function groupByStatus(list: Project[]): { label: string; projects: Project[] }[] {
  const groups: { label: string; statuses: Status[] }[] = [
    { label: "Live and playable", statuses: ["live", "playable"] },
    { label: "Being built", statuses: ["prototype", "paper", "idea"] },
    { label: "Resting", statuses: ["resting"] },
    { label: "Archive", statuses: ["archived"] },
  ];
  return groups
    .map((g) => ({ label: g.label, projects: list.filter((p) => g.statuses.includes(p.status)) }))
    .filter((g) => g.projects.length > 0);
}

/** Letters for the typographic tile when a project has no artwork. */
export function initials(p: Project): string {
  if (p.mark) return p.mark;
  const words = p.name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

/**
 * Everything a capsule needs, serializable, so the same card renders on
 * the server and inside client components (tabs, filters).
 */
export type CapsuleData = {
  slug: string;
  name: string;
  world: WorldId;
  worldName: string;
  kind: string;
  status: Status;
  line: string;
  href: string;
  hero?: string;
  pos?: string;
  square?: boolean;
  bar?: string;
  tags: string[];
  mark: string;
  date?: string;
  latest?: string;
};

export function toCapsule(p: Project): CapsuleData {
  const latest = latestEntryOf(p);
  return {
    slug: p.slug,
    name: p.name,
    world: p.world,
    worldName: worldById(p.world).name,
    kind: p.kind,
    status: p.status,
    line: p.line,
    href: projectPath(p),
    hero: p.hero,
    pos: p.slug === "coin-and-castle" ? "center top" : undefined,
    square: p.square,
    bar: p.bar,
    tags: p.tags ?? [],
    mark: initials(p),
    date: latest?.date,
    latest: latest?.title,
  };
}

/** The tabs of the "In the workshop" module. */
export function workshopTabs(): { id: string; label: string; items: CapsuleData[] }[] {
  const notArchived = (p: Project) => p.status !== "archived";
  return [
    { id: "now", label: "Fresh commits", items: latestActivity().filter(notArchived).slice(0, 6).map(toCapsule) },
    { id: "building", label: "Building", items: building().map(toCapsule) },
    { id: "live", label: "Live", items: projects.filter((p) => p.status === "live").sort(byActivity).map(toCapsule) },
    { id: "resting", label: "Resting", items: projects.filter((p) => p.status === "resting" || p.status === "archived").sort(byActivity).map(toCapsule) },
  ].filter((t) => t.items.length > 0);
}

export type FeaturedItem = Featured & { image: string; status: Status; thumbKicker: string };

/** The home carousel, with images and status resolved from the project. */
export function featuredItems(): FeaturedItem[] {
  return featured
    .map((f) => {
      const p = projectBySlug(f.project);
      if (!p) return null;
      const image = f.image ?? p.hero;
      if (!image) return null;
      return { ...f, image, status: p.status, thumbKicker: `${worldById(p.world).name} · ${p.name}` };
    })
    .filter((f): f is FeaturedItem => Boolean(f));
}
