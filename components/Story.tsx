"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isAside, isFigure, isVideo, type Aside, type Block, type Figure, type Video } from "@/content/types";
import { ExternalMark } from "./ui";

type GalleryApi = { figures: Figure[]; open: (i: number) => void };
const GalleryCtx = createContext<GalleryApi | null>(null);

/**
 * The page's figures as one carousel. Wrap the part of a page whose figures
 * belong together; each Fig inside opens the lightbox at its own place, and
 * the visitor moves through the rest with the buttons or the arrow keys.
 * Nested galleries defer to the outer one, so Story can always wrap itself.
 */
export function Gallery({ figures, children }: { figures: Figure[]; children: React.ReactNode }) {
  const parent = useContext(GalleryCtx);
  const [at, setAt] = useState<number | null>(null);
  const open = useCallback((i: number) => setAt(i), []);
  if (parent) return <>{children}</>;
  return (
    <GalleryCtx.Provider value={{ figures, open }}>
      {children}
      {at !== null && <Lightbox figures={figures} start={at} onClose={() => setAt(null)} />}
    </GalleryCtx.Provider>
  );
}

/**
 * One figure: the screenshot inside a minimal window, on a stage that takes
 * the theme, with a caption under it. A plate keeps the frame but drops the
 * window bar. Inside a Gallery either one opens the lightbox.
 */
export function Fig({ f, lead }: { f: Figure; lead?: boolean }) {
  const g = useContext(GalleryCtx);
  const i = g ? g.figures.findIndex((x) => x.image === f.image) : -1;
  const img = <img src={f.image} alt={f.alt} loading={lead ? "eager" : "lazy"} decoding="async" />;
  const art = (
    <div className={f.plate ? "win win-bare" : "win"}>
      {!f.plate && (
        <div className="win-bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      )}
      <div className="win-body">{img}</div>
    </div>
  );
  const clickable =
    g && i >= 0 ? (
      <button type="button" className="fig-btn" onClick={() => g.open(i)} aria-label={`Open image ${i + 1} of ${g.figures.length}`}>
        {art}
      </button>
    ) : (
      art
    );
  const cls = ["fig", lead && "fig-lead", f.plate && "fig-plate", f.half && "fig-half"].filter(Boolean).join(" ");
  return (
    <figure className={cls}>
      <div className={f.note ? "stage stage-row" : "stage"}>
        {clickable}
        {f.note && (
          <div className="fig-note">
            <p>{f.note}</p>
            {f.links && f.links.length > 0 && (
              <div className="acts">
                {f.links.map((l, i) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener" className={i === 0 ? "btn pri" : "btn"}>
                    {l.label}
                    <ExternalMark />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {f.caption && <figcaption>{f.caption}</figcaption>}
    </figure>
  );
}

/** A clip on the same stage as a figure, with the browser's own controls. Nothing loads until it is played. */
export function Vid({ v }: { v: Video }) {
  return (
    <figure className="fig fig-plate">
      <div className="stage">
        <div className="win win-bare">
          <div className="win-body">
            <video src={v.video} poster={v.poster} controls preload="metadata" playsInline className={v.square ? "sq" : undefined} />
          </div>
        </div>
      </div>
      {v.caption && <figcaption>{v.caption}</figcaption>}
    </figure>
  );
}

type Run = { paras: string[] } | { vids: Video[] } | Figure | Aside;

/**
 * A project's story. Runs of paragraphs share one `.copy` measure so the
 * paragraph spacing holds; each figure breaks the run at column width, and
 * consecutive videos sit side by side.
 */
export function Story({ blocks }: { blocks: Block[] }) {
  const groups: Run[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (isFigure(b) || isAside(b)) groups.push(b);
    else if (isVideo(b)) {
      if (last && "vids" in last) last.vids.push(b);
      else groups.push({ vids: [b] });
    } else {
      if (last && "paras" in last) last.paras.push(b);
      else groups.push({ paras: [b] });
    }
  }
  return (
    <Gallery figures={blocks.filter(isFigure)}>
      <div className="story">
        {groups.map((g, i) =>
          "paras" in g ? (
            <div className="copy" key={i}>
              {g.paras.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          ) : "aside" in g ? (
            <aside className="aside-box" key={i}>
              {g.label && <span className="mono">{g.label}</span>}
              <p>{g.aside}</p>
            </aside>
          ) : "vids" in g ? (
            <div className={g.vids.length > 1 ? "vid-row" : undefined} key={i}>
              {g.vids.map((v) => (
                <Vid key={v.video} v={v} />
              ))}
            </div>
          ) : (
            <Fig key={i} f={g} />
          ),
        )}
      </div>
    </Gallery>
  );
}

/** The overlay: one figure at a time, counter and controls top right, caption below. */
function Lightbox({ figures, start, onClose }: { figures: Figure[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const n = figures.length;
  const box = useRef<HTMLDivElement>(null);
  const step = useCallback((d: number) => setI((x) => (((x + d) % n) + n) % n), [n]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    box.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [onClose, step]);

  const f = figures[i];
  if (!f) return null;
  return (
    <div
      ref={box}
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${i + 1} of ${n}`}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ctrl">
        {n > 1 && (
          <>
            <span className="ctr mono">
              {i + 1} / {n}
            </span>
            <button type="button" className="nx" aria-label="Previous" onClick={() => step(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" className="nx" aria-label="Next" onClick={() => step(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        <button type="button" className="pp" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <img key={f.image} src={f.image} alt={f.alt} />
      <figcaption>{f.caption ?? f.alt}</figcaption>
    </div>
  );
}
