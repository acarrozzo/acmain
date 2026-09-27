import { isFigure, type Block, type Figure } from "@/content/types";

/** One figure: the image at column width, a caption under it. */
export function Fig({ f, lead }: { f: Figure; lead?: boolean }) {
  return (
    <figure className={lead ? "fig fig-lead" : "fig"}>
      <img src={f.image} alt={f.alt} loading={lead ? "eager" : "lazy"} decoding="async" />
      {f.caption && <figcaption>{f.caption}</figcaption>}
    </figure>
  );
}

/**
 * A project's story. Runs of paragraphs share one `.copy` measure so the
 * paragraph spacing holds; each figure breaks the run at column width.
 */
export function Story({ blocks }: { blocks: Block[] }) {
  const groups: Array<string[] | Figure> = [];
  for (const b of blocks) {
    if (isFigure(b)) groups.push(b);
    else {
      const last = groups[groups.length - 1];
      if (Array.isArray(last)) last.push(b);
      else groups.push([b]);
    }
  }
  return (
    <div className="story">
      {groups.map((g, i) =>
        Array.isArray(g) ? (
          <div className="copy" key={i}>
            {g.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </div>
        ) : (
          <Fig key={i} f={g} />
        ),
      )}
    </div>
  );
}
