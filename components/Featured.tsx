"use client";

import type { FeaturedItem } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Btn, Kicker, StatusChip } from "./ui";
import { PlayPause, useCarousel } from "./useCarousel";

/** Featured & fresh: the big capsule with side thumbnails, auto-advancing. */
export function Featured({ items, duration = 6000 }: { items: FeaturedItem[]; duration?: number }) {
  const { index, show, playing, toggle, progress } = useCarousel(items.length, duration);
  const f = items[index];
  if (!f) return null;
  return (
    <div className="feat-grid">
      <article className="feat-main">
        <img key={f.image} src={f.image} alt="" />
        <div className="ov" />
        <span className="ctr mono">
          {index + 1} / {items.length}
        </span>
        {items.length > 1 && <PlayPause playing={playing} onToggle={toggle} />}
        <div className="txt">
          <Kicker>{f.kicker}</Kicker>
          <h2>{f.title}</h2>
          <p>{f.dek}</p>
          <div className="meta">
            <span className="mono">{formatDate(f.date)}</span>
            <StatusChip status={f.status} onImage />
          </div>
          <div className="acts">
            <Btn href={f.primary.href} primary small>
              {f.primary.label}
            </Btn>
            {f.secondary && (
              <Btn href={f.secondary.href} small onImage>
                {f.secondary.label}
              </Btn>
            )}
          </div>
        </div>
        <div className="prog" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
      </article>
      <ol className="feat-thumbs">
        {items.map((it, i) => (
          <li key={it.project + i}>
            <button type="button" className={i === index ? "on" : undefined} onClick={() => show(i)} aria-current={i === index}>
              <span className="th">
                <img src={it.image} alt="" loading="lazy" />
              </span>
              <span className="t">
                <b>{it.title}</b>
                <span>{it.thumbKicker}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
