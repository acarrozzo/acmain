import { person } from "@/content/person";
import { headerLinks, paletteItems } from "@/lib/nav";
import { Header } from "./home/Header";
import { Forest } from "./home/Blocks";

/** The site's header on every page but the home, which composes its own. The forest sits behind it. */
export function Masthead() {
  return (
    <>
      <Forest />
      <div className="home h-top">
        <Header name={person.name} links={headerLinks} palette={paletteItems} />
      </div>
    </>
  );
}
