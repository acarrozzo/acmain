import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { navItems } from "@/components/nav";

export default function NotFound() {
  return (
    <main>
      <SiteNav items={navItems} />
      <section className="container-page flex min-h-dvh flex-col justify-center py-32">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted">404</span>
        <h1 className="mt-4 max-w-2xl text-4xl leading-tight md:text-6xl">
          Nothing lives at this address.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          It may have been archived, or it may never have existed. Both are fine.
        </p>
        <a href="/" className="mt-8 w-fit text-accent hover:underline">
          ← Back to the hub
        </a>
      </section>
      <Footer />
    </main>
  );
}
