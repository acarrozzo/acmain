import { navItems, paletteItems } from "@/v1/lib/nav";
import { person } from "@/v1/content/person";
import type { Backdrop as BackdropImages } from "@/v1/content/types";
import { Backdrop } from "./Backdrop";
import { MastheadClient } from "./MastheadClient";

/**
 * The broadsheet masthead, with the page's backdrop behind it. Server
 * wrapper: builds the nav and palette data. Pass a category's `backdrop`
 * to give its pages their own photo.
 */
export function Masthead({ backdrop }: { backdrop?: BackdropImages } = {}) {
  return (
    <>
      <Backdrop images={backdrop} />
      <MastheadClient
        nav={navItems}
        palette={paletteItems}
        name={person.name}
        role={person.title}
      />
    </>
  );
}
