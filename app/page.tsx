import { Header } from "@/components/home/Header";
import { SolarSystem } from "@/components/home/SolarSystem";
import { Sections } from "@/components/home/Sections";
import { Preview } from "@/components/home/Preview";
import { About, Forest, Hero, HomeFooter } from "@/components/home/Blocks";
import { person } from "@/content/person";
import { categories, categoryPath, projectsInCategory } from "@/lib/content";
import { headerLinks, paletteItems } from "@/lib/nav";

export default function Home() {
  const planets = categories.map((c) => ({ name: c.name, count: projectsInCategory(c).length, href: categoryPath(c) }));
  return (
    <>
      <Forest />
      <main className="home">
        <Header name={person.name} links={headerLinks} palette={paletteItems} />
        <section className="h-hero">
          <Hero />
          <SolarSystem planets={planets} />
        </section>
        <Sections />
        <About />
        <HomeFooter />
      </main>
      <Preview />
    </>
  );
}
