import type { Backdrop as BackdropImages } from "@/content/types";
import { site } from "@/content/site";

function vars(b: BackdropImages) {
  return { "--bd-dark": `url("${b.dark}")`, "--bd-light": `url("${b.light}")` } as React.CSSProperties;
}

/**
 * The photo ghosted behind the top of a page. Every page gets the site's
 * forest and sky unless a category brings its own.
 */
export function Backdrop({ images }: { images?: BackdropImages }) {
  return <div className="page-photo" aria-hidden="true" style={vars(images ?? site.backdrop)} />;
}

/**
 * The photo that rises up behind the bottom of a page and the footer:
 * the site's night sky and grass. Rendered inside the footer, which is
 * the positioned box it hangs from. Site-wide, no category override.
 */
export function BackdropBottom() {
  return <div className="page-photo page-photo-bottom" aria-hidden="true" style={vars(site.backdropBottom)} />;
}
