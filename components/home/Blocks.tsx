import { home, linkify } from "@/content/home";
import { person } from "@/content/person";
import { site } from "@/content/site";
import { MARK_PATH } from "@/components/mark-path";

export function Links({ s }: { s: string }) {
  return <>{linkify(s).map((x, i) => (x.href ? <a key={i} href={x.href}>{x.text}</a> : <span key={i}>{x.text}</span>))}</>;
}

export function Hero() {
  return <h1 className="h-cap"><Links s={home.h1} /></h1>;
}

export function About() {
  const np = person.nowPlaying;
  return (
    <section className="h-about">
      <div>
        <span className="h-k">About</span>
        <div className="h-ab">
          <img src={person.portrait} alt={person.name} loading="lazy" />
          <div>
            <p><Links s={home.about} /></p>
            <div className="h-links">
              <a href="/about">The long version →</a>
              <span>{site.email}</span>
              <a href={person.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="h-k">Now playing</span>
        <div className="h-np">
          <img src={np.art} alt="" loading="lazy" />
          <div><b>{np.title}</b><span>{np.by} · {np.note} · from AC Music</span></div>
          <a className="h-play" href={np.href} target="_blank" rel="noopener" aria-label={`Play ${np.title} at AC Music`}>
            <svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export function SystemBlock() {
  return (
    <section className="h-sys" id="system">
      <div className="h-sh"><span className="h-k">System</span><a className="h-k" href="/system">The full system →</a></div>
      <div className="h-sysg">
        {home.system.map((b) => (
          <div key={b.k}>
            <span className="h-k">{b.k}</span>
            {b.swatches && (
              <div className="h-swl">
                {["paper", "surface", "surface-2", "muted", "ink-soft", "ink", "accent"].map((v) => <i key={v} style={{ background: `var(--${v})` }} title={v.replace("-", " ")} />)}
              </div>
            )}
            {b.k === "Type" ? (
              <>
                <p className="h-td">{b.body[0]}</p>
                <p className="h-tm">{b.body[1]}</p>
              </>
            ) : (
              b.body.map((t) => <p key={t}>{t}</p>)
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const FOOT_LINKS = [
  { label: "About", href: "/about" },
  { label: "Log", href: "/log" },
  { label: "System", href: "/system" },
  { label: "Archive", href: "/archive" },
  { label: "Contact", href: `mailto:${site.email}` },
];

export function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="h-foot">
      <div className="h-big">{home.wink.lead} <i>{home.wink.rest}</i></div>
      <p>{site.footer.story}</p>
      <div className="h-ln">{FOOT_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</div>
      <div className="h-cp">
        <svg viewBox="0 0 612 612" aria-hidden="true"><path d={MARK_PATH} /></svg>
        <span>© {site.footer.firstYear}–{year} {site.name}</span>
      </div>
    </footer>
  );
}

/** The forest, faint, behind the top of the page; the sky in light mode. Gone by mid-page. */
/** Set to true to bring the faint forest / sky backdrop back behind the top of every page. */
const BACKDROP = false;

export function Forest() {
  if (!BACKDROP) return null;
  return <div className="h-forest" aria-hidden="true" style={{ "--f-dark": `url("${site.backdrop.dark}")`, "--f-light": `url("${site.backdrop.light}")` } as React.CSSProperties} />;
}
