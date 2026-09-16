import { projects } from "@/content/projects";
import { worlds } from "@/content/worlds";
import type { Entry, Project, Status, World, WorldId } from "@/content/types";

export type { Entry, Project, Status, World, WorldId };
export { projects, worlds };

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
const BUILDING: Status[] = ["prototype", "playable"];

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

/** Projects with fresh work, newest activity first. */
export function building(): Project[] {
  return projects
    .filter((p) => BUILDING.includes(p.status))
    .sort((a, b) => {
      const da = latestEntryOf(a)?.date ?? "";
      const db = latestEntryOf(b)?.date ?? "";
      if (da !== db) return da < db ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
}

/** Group a world's projects for listing: live and playable first, then building, then the rest. */
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
