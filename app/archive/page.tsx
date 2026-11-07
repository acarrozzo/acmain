import type { Metadata } from "next";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
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

/** The original site, linked and described, never edited. */
export default function ArchivePage() {
  return (
    <>
      <Masthead />
      <main className="home h-top">
        <nav className="h-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><i>/</i><span>Archive</span></nav>
        <div className="h-pk"><span>2000 to 2025</span></div>
        <h1 className="h-page-h1">The original site, kept exactly as it was.</h1>
        <p className="h-intro">acarrozzo.com began in the 90s as a place for me and my friends to share hilarious Photoshop stuff. It grew into a portfolio and stayed one for twenty years. It is archived here, unedited, as a stable comparison to life before the machines came along and made us all superheroes.</p>
        <p className="h-intro">Nothing gets deleted around here. It gets archived.</p>
        <div className="h-btns"><a className="h-pri" href={site.archiveUrl}>{site.archiveLabel}</a></div>
        <section className="h-sec">
          <div className="h-sh"><h2>What&apos;s in there</h2></div>
          <div className="h-what">
            {inside.map((it) => <div key={it.name}><b>{it.name}</b><p>{it.text}</p></div>)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
