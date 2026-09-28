import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import {
  Editor,
  FeaturedSection,
  HeroOrbit,
  NowPlaying,
  WorkshopSection,
  CategoryGrid,
} from "@/components/Home";
import { categoryById } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="container-page">
        <HeroOrbit />
        <FeaturedSection />

        <section className="band cols">
          <div>
            <WorkshopSection />
          </div>
          <aside className="flex flex-col">
            <NowPlaying />
            <div className="mt-[36px]">
              <Editor />
            </div>
          </aside>
        </section>

        <CategoryGrid category={categoryById("games")} count={6} title="Playable, on paper, on the table." more="All games →" />
        <CategoryGrid category={categoryById("design")} count={3} title="Selected work." more="The professional door →" />
        <CategoryGrid category={categoryById("music")} count={6} title="Nine projects, three albums, one band." more="Listen →" />
      </main>
      <Footer />
    </>
  );
}
