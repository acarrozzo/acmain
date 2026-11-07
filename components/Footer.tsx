import { HomeFooter } from "./home/Blocks";

/** The site's footer on every page but the home, which composes its own. */
export function Footer() {
  return (
    <div className="home h-bottom">
      <HomeFooter />
    </div>
  );
}
