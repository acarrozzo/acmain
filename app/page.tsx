import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import {
  Editor,
  FeaturedSection,
  HeroOrbit,
  LogColumn,
  NowPlaying,
  WorkshopSection,
  WorldGrid,
  WorldsTiles,
} from "@/components/Home";
import { worldById } from "@/lib/content";

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
            <LogColumn />
            <div className="mt-[26px]">
              <NowPlaying />
            </div>
            <div className="mt-[26px]">
              <Editor />
            </div>
          </aside>
        </section>

        <WorldsTiles />
        <WorldGrid world={worldById("games")} count={6} title="Playable, on paper, on the table." more="All games →" />
        <WorldGrid world={worldById("design")} count={3} title="Selected work." more="The professional door →" />
        <WorldGrid world={worldById("music")} count={3} title="Nine personas, three albums, one band." more="Listen →" />
      </main>
      <Footer />
    </>
  );
}
