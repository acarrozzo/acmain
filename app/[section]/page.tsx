import { SiteNav } from "@/components/SiteNav";
import { destinations } from "@/lib/content";
import { notFound } from "next/navigation";

// Lightweight placeholder for destination routes so homepage nav never
// dead-ends during review. These become full sections later.
export default async function SectionPlaceholder({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const dest = destinations.find((d) => d.href === `/${section}`);
  if (!dest) notFound();

  return (
    <main>
      <SiteNav />
      <section className="container-page flex min-h-dvh flex-col justify-center py-32">
        <a href="/" className="text-sm text-muted hover:text-ink">
          ← Back to the hub
        </a>
        <span className="mt-10 text-[11px] uppercase tracking-[0.3em] text-muted">
          {dest.tagline}
        </span>
        <h1 className="mt-4 max-w-3xl text-5xl leading-tight tracking-tight md:text-7xl">
          {dest.name}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {dest.description}
        </p>
        <p className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          This world is coming next.
        </p>
      </section>
    </main>
  );
}
