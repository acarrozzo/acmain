import { home, type SectionLayout } from "@/content/home";
import { categoryById, categoryPath, projectBySlug, projectPath, projectsInCategory, type Category, type Project } from "@/lib/content";
import { LayoutSwitch } from "./LayoutSwitch";

function initials(p: Project) {
  return (p.mark ?? p.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2)).toUpperCase();
}
function years(p: Project) {
  if (!p.started) return "";
  return p.ended ? `${p.started}–${String(p.ended).slice(2)}` : `${p.started}–`;
}

/** A thumbnail that opens the large preview, or a typographic tile when there is no image. */
function Thumb({ p, cat, cls = "h-th" }: { p: Project; cat: Category; cls?: string }) {
  if (!p.hero) return <div className={`${cls} h-t`}>{initials(p)}</div>;
  return (
    <button type="button" className={cls} aria-label={`Preview ${p.name}`} data-preview={p.hero} data-name={p.name} data-sub={`${cat.name} · ${p.line}`} data-href={projectPath(p)}>
      <img src={p.hero} alt="" loading="lazy" />
    </button>
  );
}
function Tx({ p }: { p: Project }) {
  return (
    <a className="h-tx" href={projectPath(p)}>
      <b>{p.name}</b>
      <span>{p.line}</span>
    </a>
  );
}
/** A text link that previews on hover and opens the preview on click when the project has an image. */
function PLink({ p, cat, children }: { p: Project; cat: Category; children: React.ReactNode }) {
  if (!p.hero) return <a href={projectPath(p)}>{children}</a>;
  return (
    <a href={projectPath(p)} data-preview={p.hero} data-name={p.name} data-sub={`${cat.name} · ${p.line}`} data-href={projectPath(p)} data-hover="">
      {children}
    </a>
  );
}

export function Rows({ list, cat, big = false }: { list: Project[]; cat: Category; big?: boolean }) {
  return (
    <div className="h-rows">
      {list.map((p) => (
        <div key={p.slug} className={`h-row${big ? " h-big" : ""}`}>
          <Thumb p={p} cat={cat} />
          <Tx p={p} />
        </div>
      ))}
    </div>
  );
}

/** Name and line in one row, previewing on hover. For "also here" lists and siblings. */
export function CompactRows({ list, cat }: { list: Project[]; cat: Category }) {
  return (
    <div className="h-rows">
      {list.map((p) => (
        <div key={p.slug} className="h-row h-cmp">
          <PLink p={p} cat={cat}><b>{p.name}</b><span>{p.line}</span></PLink>
        </div>
      ))}
    </div>
  );
}

function Layout({ layout, cat, list, start }: { layout: SectionLayout; cat: Category; list: Project[]; start: number }) {
  if (layout === "list") return <Rows list={list} cat={cat} />;
  if (layout === "big") return <Rows list={list} cat={cat} big />;
  if (layout === "compact")
    return (
      <div className="h-rows">
        {list.map((p) => (
          <div key={p.slug} className="h-row h-cmp">
            <PLink p={p} cat={cat}><b>{p.name}</b><span>{p.line}</span></PLink>
          </div>
        ))}
      </div>
    );
  if (layout === "index")
    return (
      <div className="h-ix">
        {list.map((p, i) => (
          <PLink key={p.slug} p={p} cat={cat}>
            <span className="h-no">{String(start + i + 1).padStart(2, "0")}</span>
            <span className="h-nm2"><b>{p.name}</b><span>{p.line}</span></span>
            <span className="h-yr">{years(p)}</span>
          </PLink>
        ))}
      </div>
    );
  if (layout === "lines")
    return (
      <p className="h-lines">
        {list.map((p, i) => (
          <span key={p.slug}>{i > 0 && <i>·</i>}<PLink p={p} cat={cat}>{p.name}</PLink></span>
        ))}
      </p>
    );
  // lead: the chosen piece at full width, then the rest as rows
  const leadCfg = home.leads[cat.id];
  const lead = (leadCfg && projectBySlug(leadCfg.project)) || list.find((p) => p.hero) || list[0];
  const rest = list.filter((p) => p.slug !== lead.slug);
  const img = lead.hero ?? cat.hero;
  return (
    <div>
      <div className="h-lead">
        {img ? (
          <button type="button" className="h-th" aria-label={`Preview ${lead.name}`} data-preview={img} data-name={lead.name} data-sub={`${cat.name} · ${lead.line}`} data-href={projectPath(lead)}>
            <img src={img} alt="" loading="lazy" />
          </button>
        ) : (
          <div className="h-th h-t">{initials(lead)}</div>
        )}
        <div className="h-lc">
          <b><a href={projectPath(lead)}>{lead.name}</a></b>
          {leadCfg && <span className="h-k">{leadCfg.label}</span>}
          <span>{lead.line}</span>
        </div>
      </div>
      <Rows list={rest} cat={cat} />
    </div>
  );
}

/** One practice on the home page. Renders every layout; `data-layout` shows one. */
export function Sections() {
  let start = 0;
  const ALL: SectionLayout[] = ["list", "lead", "big", "compact", "index", "lines"];
  return (
    <>
      {home.sections.map((s) => {
        const cat = categoryById(s.category);
        const list = projectsInCategory(cat);
        const first = start; start += list.length;
        return (
          <section key={cat.id} className="h-sec" id={cat.id} data-layout={s.layout}>
            <div className="h-sh">
              <h2>{cat.name}</h2>
              <span className="h-cnt">
                <LayoutSwitch id={cat.id} initial={s.layout} />
                <span>{list.length} · </span>
                <a href={categoryPath(cat)}>{s.more} →</a>
              </span>
            </div>
            {ALL.map((l) => (
              <div key={l} className="h-lay" data-for={l}>
                <Layout layout={l} cat={cat} list={list} start={first} />
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
}
