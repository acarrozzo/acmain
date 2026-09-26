import { STATUS_LABEL, type Status } from "@/lib/content";

/** Status drawn as a mark that grows: a dot, a stake, a frame, a house, a lit house, moss, a plaque. */
const GLYPH: Record<Status, React.ReactNode> = {
  idea: <circle cx="8" cy="8" r="2.4" fill="currentColor" />,
  paper: (
    <>
      <path d="M8 14V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 3h5l-1.5 2L13 7H8z" fill="currentColor" />
    </>
  ),
  prototype: <rect x="3" y="3" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2" />,
  playable: <path d="M3 8l5-5 5 5v6H3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  live: (
    <>
      <path d="M3 8l5-5 5 5v6H3z" fill="currentColor" />
      <rect x="6.5" y="8.5" width="3" height="3" fill="var(--surface)" />
    </>
  ),
  resting: (
    <>
      <path d="M3 8l5-5 5 5v6H3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 14c1.5-1.2 3-1.2 4.5 0S9.5 15.2 11 14s3-1.2 4 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  archived: (
    <>
      <rect x="2.5" y="4.5" width="11" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

const HOT: Status[] = ["live", "playable", "prototype"];

export function StatusChip({ status, onImage = false }: { status: Status; onImage?: boolean }) {
  const cls = ["chip", onImage ? "on-image" : HOT.includes(status) ? "hot" : ""].filter(Boolean).join(" ");
  return (
    <span className={cls}>
      <svg viewBox="0 0 16 16" aria-hidden="true">{GLYPH[status]}</svg>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Tags({ items, world }: { items: string[]; world: string }) {
  if (items.length === 0) return null;
  return (
    <div className={`tags t-${world}`}>
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

/** Stands in for artwork that does not exist yet. */
export function TypeTile({ mark, note = "artwork coming", className = "" }: { mark: string; note?: string; className?: string }) {
  return (
    <div className={`type-tile ${className}`}>
      <span>{mark}</span>
      <small>{note}</small>
    </div>
  );
}

export function Kicker({ children, muted = false, className = "" }: { children: React.ReactNode; muted?: boolean; className?: string }) {
  return <span className={`kicker ${muted ? "mut" : ""} ${className}`.trim()}>{children}</span>;
}

/** A section head: kicker, optional headline, and a link or a note on the right. */
export function SectionHead({
  kicker,
  title,
  more,
  moreHref = "#",
  dek,
  rule = true,
}: {
  kicker: string;
  title?: string;
  more?: string;
  moreHref?: string;
  dek?: string;
  rule?: boolean;
}) {
  return (
    <div className={`sec-head ${rule ? "rule" : ""}`}>
      <div className="flex flex-col">
        <Kicker>{kicker}</Kicker>
        {title && <h2>{title}</h2>}
      </div>
      {more ? (
        <a className="more" href={moreHref}>
          {more}
        </a>
      ) : dek ? (
        <span className="dek">{dek}</span>
      ) : null}
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="crumbs">
      {items.map((c, i) => (
        <span key={c.label} className="contents">
          {i > 0 && <span>/</span>}
          {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
        </span>
      ))}
    </div>
  );
}

export function ExternalMark() {
  return <span aria-hidden> ↗</span>;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function Btn({
  href,
  children,
  primary = false,
  small = false,
  ghost = false,
  disabled = false,
  onImage = false,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
  small?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  onImage?: boolean;
}) {
  const cls = ["btn", primary && "pri", small && "sm", ghost && "ghost", disabled && "dis", onImage && "on-image"].filter(Boolean).join(" ");
  if (!href || disabled) return <span className={cls}>{children}</span>;
  const ext = isExternal(href);
  return (
    <a href={href} className={cls} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
      {ext && <ExternalMark />}
    </a>
  );
}
