import { STATUS_LABEL, type Status } from "@/lib/content";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
      <span className="h-2 w-2 rounded-full bg-accent" style={{ boxShadow: "0 0 12px var(--glow)" }} />
      {children}
    </p>
  );
}

const STATUS_TONE: Record<Status, string> = {
  live: "bg-accent-soft text-accent",
  playable: "bg-accent-soft text-accent",
  prototype: "bg-accent-soft text-accent",
  paper: "bg-surface-2 text-muted",
  idea: "bg-surface-2 text-muted",
  resting: "bg-surface-2 text-muted",
  archived: "bg-surface-2 text-muted",
};

export function StatusPill({ status }: { status: Status }) {
  const dot = status === "live" || status === "playable" || status === "prototype";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_TONE[status]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

/** An image if the project has one, a calm tonal field if it doesn't. */
export function Art({
  src,
  alt = "",
  className = "",
  position,
}: {
  src?: string;
  alt?: string;
  className?: string;
  position?: string;
}) {
  if (!src) return <div className={`art-field ${className}`} aria-hidden />;
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="container-page pt-32 pb-12 md:pt-40 md:pb-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      {intro && (
        <div className="copy mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}

export function ExternalMark() {
  return <span aria-hidden> ↗</span>;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}
