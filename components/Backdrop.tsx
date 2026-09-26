import type { Backdrop as BackdropImages } from "@/content/types";
import { site } from "@/content/site";

/**
 * The photo ghosted behind the top of a page. Every page gets the site's
 * forest and sky unless a world brings its own.
 */
export function Backdrop({ images }: { images?: BackdropImages }) {
  const b = images ?? site.backdrop;
  const style = { "--bd-dark": `url("${b.dark}")`, "--bd-light": `url("${b.light}")` } as React.CSSProperties;
  return <div className="page-photo" aria-hidden="true" style={style} />;
}
