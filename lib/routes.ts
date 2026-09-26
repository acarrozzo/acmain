/** "app/[world]/[slug]/page.tsx" → "/{world}/{slug}". Pure; safe in client bundles. */
export function routeLabel(file: string): string {
  if (!file.startsWith("app/")) return file;
  const rest = file.slice(4);
  if (rest === "layout.tsx") return "layout";
  if (rest === "not-found.tsx") return "404";
  if (rest === "sitemap.ts") return "/sitemap.xml";
  if (rest === "robots.ts") return "/robots.txt";
  if (rest === "globals.css") return "globals.css";
  return "/" + rest.replace(/\/?page\.tsx$/, "").replace(/\[(\w+)\]/g, "{$1}");
}
