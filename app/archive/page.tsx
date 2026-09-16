import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ExternalMark, PageHeader, SectionLabel } from "@/components/ui";
import { navItems } from "@/components/nav";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Archive",
  description: "The original acarrozzo.com, kept exactly as it was.",
};

const inside = [
  { name: "Design", text: "Newsday redesigns, NewsdayTV, Sports Central, Faces of Long Island, election coverage, the A/B tests, and the 2023 design system." },
  { name: "Code", text: "Stickman, AC Pop and the collapser. CSS transitions and jQuery, back when that was the whole stack." },
  { name: "Photo", text: "Macro photography and the Foot Action cinemagraphs." },
  { name: "Music", text: "The three SS4ST albums and the Banned from the Zoo demo." },
  { name: "Game", text: "The original Light Gray demo, the first Coin & Castle, and the card games as they launched." },
  { name: "Retail and brands", text: "Steve & Barry's campaigns, Starbury, the celebrity lines, the United Nations work, Mobileistic catalogs." },
  { name: "For funsies", text: "The wallpapers. Minimal, astronomy-flavored, free to take." },
];

export default function ArchivePage() {
  return (
    <main>
      <SiteNav items={navItems} />
      <PageHeader
        eyebrow="Archive"
        title="The original site, kept exactly as it was."
        intro={[
          "acarrozzo.com began in the 90s as a place for me and my friends to share hilarious Photoshop stuff. It grew into a portfolio and stayed one for twenty years. It is archived here, unedited, as a stable comparison to life before the machines came along and made us all superheroes.",
          "Nothing gets deleted around here. It gets archived.",
        ]}
      >
        <a
          href={site.archiveUrl}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hi"
        >
          {site.archiveLabel}
          <ExternalMark />
        </a>
      </PageHeader>

      <section className="container-page pb-16 md:pb-20">
        <SectionLabel>What&apos;s in there</SectionLabel>
        <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {inside.map((it) => (
            <div key={it.name}>
              <dt className="text-lg font-semibold tracking-tight">{it.name}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{it.text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Footer />
    </main>
  );
}
