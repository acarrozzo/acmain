import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { latestEntryOf, projectPath, projects, worldPath, worlds } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...worlds.map((w) => ({ url: `${base}${worldPath(w)}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: `${base}/log`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/archive`, changeFrequency: "yearly", priority: 0.3 },
  ];
  for (const p of projects) {
    const latest = latestEntryOf(p);
    pages.push({
      url: `${base}${projectPath(p)}`,
      lastModified: latest && latest.date.length === 10 ? new Date(latest.date) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  return pages;
}
