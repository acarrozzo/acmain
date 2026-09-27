"use client";

import { useState } from "react";
import type { CapsuleData } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Btn, Kicker, StatusChip, Tags } from "./ui";

type Tab = { id: string; label: string; items: CapsuleData[] };

/** In the workshop: tabs of projects with a hover preview. */
export function Workshop({ tabs }: { tabs: Tab[] }) {
  const [tabId, setTabId] = useState(tabs[0]?.id ?? "");
  const tab = tabs.find((t) => t.id === tabId) ?? tabs[0];
  const [hover, setHover] = useState<string | null>(null);
  if (!tab) return null;
  const pv = tab.items.find((p) => p.slug === hover) ?? tab.items[0];

  return (
    <section className="module">
      <div className="mod-head">
        <Kicker>In the workshop</Kicker>
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === tab.id}
              className={t.id === tab.id ? "on" : undefined}
              onClick={() => {
                setTabId(t.id);
                setHover(null);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="workshop">
        <ol className="rows">
          {tab.items.map((p) => (
            <li key={p.slug}>
              <a
                href={p.href}
                className={pv && pv.slug === p.slug ? "on" : undefined}
                onMouseEnter={() => setHover(p.slug)}
                onFocus={() => setHover(p.slug)}
              >
                <span className="th">{p.hero ? <img src={p.hero} alt="" loading="lazy" style={p.pos ? { objectPosition: p.pos } : undefined} /> : p.mark}</span>
                <span className="t">
                  <b>
                    {p.name}
                    <StatusChip status={p.status} />
                  </b>
                  <span className="l">{p.latest ?? p.line}</span>
                </span>
                <span className="d mono">{p.date ? formatDate(p.date) : ""}</span>
              </a>
            </li>
          ))}
        </ol>
        {pv && (
          <div className="preview" aria-live="polite">
            <div className={pv.hero ? "th" : "th type-tile"}>
              {pv.hero ? <img src={pv.hero} alt="" style={pv.pos ? { objectPosition: pv.pos } : undefined} /> : <span>{pv.mark}</span>}
            </div>
            <div className="b">
              <div className="row">
                <Kicker muted>
                  {pv.categoryName} · {pv.kind}
                </Kicker>
                <StatusChip status={pv.status} />
              </div>
              <h3>{pv.name}</h3>
              <p>{pv.line}</p>
              <Tags items={pv.tags} category={pv.category} />
              <div className="row">
                <span className="mono">{pv.date ? `${formatDate(pv.date)} · ${pv.latest}` : ""}</span>
                <Btn href={pv.href} small>
                  Enter →
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
