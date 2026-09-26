"use client";

import { useState } from "react";
import { STATUS_LABEL, type CapsuleData, type Status, type WorldId } from "@/lib/content";
import { Capsule } from "@/components/Capsule";
import { Btn, Kicker, StatusChip, StatusGlyph, Tags } from "@/components/ui";
import { PlayPause } from "@/components/useCarousel";
import { Cell } from "./Spec";

const STATUSES: Status[] = ["idea", "paper", "prototype", "playable", "live", "resting", "archived"];
/** Mirrors HOT in components/ui.tsx. */
const HOT: Status[] = ["live", "playable", "prototype"];
const WORLDS: { id: WorldId; name: string }[] = [
  { id: "design", name: "Design" },
  { id: "games", name: "Games" },
  { id: "music", name: "Music" },
];
const BARS: [string, string][] = [
  ["none", ""],
  ["red #d32f2f", "#d32f2f"],
  ["gold #f6c445", "#f6c445"],
  ["accent", "var(--accent)"],
];

/**
 * Flip status, world, artwork and text and watch every primitive and the
 * capsule re-render. Nothing here touches the records.
 */
export function Playground({ art }: { art: { label: string; src: string }[] }) {
  const [status, setStatus] = useState<Status>("playable");
  const [world, setWorld] = useState<WorldId>("games");
  const [hero, setHero] = useState<string>(art[0]?.src ?? "");
  const [square, setSquare] = useState(false);
  const [bar, setBar] = useState("");
  const [tags, setTags] = useState("Turn-based, Multiplayer, Browser");
  const [name, setName] = useState("Example project");
  const [dated, setDated] = useState(true);
  const [label, setLabel] = useState("Enter →");
  const [playing, setPlaying] = useState(true);

  const worldName = WORLDS.find((w) => w.id === world)?.name ?? world;
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
  const cap: CapsuleData = {
    slug: "example",
    name,
    world,
    worldName,
    kind: "Game",
    status,
    line: "One line that shows on cards and as the page subtitle.",
    href: "#playground",
    hero: hero || undefined,
    square,
    bar: bar || undefined,
    tags: tagList,
    mark: "EX",
    date: dated ? "2026-09-26" : undefined,
    latest: dated ? "Something shipped" : undefined,
  };

  return (
    <div className="pg">
      <div className="pg-controls">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]} · {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          World
          <select value={world} onChange={(e) => setWorld(e.target.value as WorldId)}>
            {WORLDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Artwork
          <select value={hero} onChange={(e) => setHero(e.target.value)}>
            <option value="">None · type tile</option>
            {art.map((a) => (
              <option key={a.src} value={a.src}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Bar
          <select value={bar} onChange={(e) => setBar(e.target.value)}>
            {BARS.map(([l, v]) => (
              <option key={l} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Tags
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <label>
          Button label
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label className="chk">
          <input type="checkbox" checked={square} onChange={(e) => setSquare(e.target.checked)} /> square art
        </label>
        <label className="chk">
          <input type="checkbox" checked={dated} onChange={(e) => setDated(e.target.checked)} /> has an entry
        </label>
      </div>

      <div className="ds-row">
        <Cell label="StatusGlyph">
          <div className="ds-glyph" data-hot={HOT.includes(status)}>
            <StatusGlyph status={status} />
          </div>
        </Cell>
        <Cell label={`StatusChip${HOT.includes(status) ? " · hot" : ""}`}>
          <StatusChip status={status} />
        </Cell>
        <Cell label="StatusChip onImage">
          <div className="ds-photo">
            <StatusChip status={status} onImage />
          </div>
        </Cell>
        <Cell label={`Tags · .t-${world}`}>
          <Tags items={tagList} world={world} />
        </Cell>
        <Cell label="Kicker · muted">
          <Kicker>
            {worldName} · {STATUS_LABEL[status]}
          </Kicker>
          <Kicker muted>
            {worldName} · {STATUS_LABEL[status]}
          </Kicker>
        </Cell>
        <Cell label="Moon · at rest, zoomed">
          <div className="flex gap-2">
            <Moon status={status} name={name} active={false} />
            <Moon status={status} name={name} active />
          </div>
        </Cell>
        <Cell label="Flyout row">
          <div className="fly ds-fly">
            <div className="fly-card">
              <a className="fly-all" href="#playground">
                All {worldName}
              </a>
              <ul>
                <li>
                  <a href="#playground">
                    <StatusGlyph status={status} />
                    <span className="l">{name}</span>
                  </a>
                </li>
                <li className="fly-sep" aria-hidden="true" />
                <li>
                  <a href="#playground">
                    <StatusGlyph status="live" />
                    <span className="l">A guest project</span>
                    <span className="f">Design</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Cell>
      </div>

      <div className="ds-row">
        <Cell label="Btn">
          <Btn href="#playground">{label}</Btn>
        </Cell>
        <Cell label="primary">
          <Btn href="#playground" primary>
            {label}
          </Btn>
        </Cell>
        <Cell label="small">
          <Btn href="#playground" small>
            {label}
          </Btn>
        </Cell>
        <Cell label="primary small">
          <Btn href="#playground" primary small>
            {label}
          </Btn>
        </Cell>
        <Cell label="ghost">
          <Btn href="#playground" ghost>
            {label}
          </Btn>
        </Cell>
        <Cell label="disabled · no href">
          <Btn disabled>{label}</Btn>
        </Cell>
        <Cell label="external · adds ↗">
          <Btn href="https://example.com">{label}</Btn>
        </Cell>
        <Cell label="onImage">
          <div className="ds-photo">
            <Btn href="#playground" small onImage>
              {label}
            </Btn>
            <Btn href="#playground" primary small>
              {label}
            </Btn>
          </div>
        </Cell>
        <Cell label="PlayPause · .pp">
          <div className="ds-photo" style={{ position: "relative", width: 58, height: 58, padding: 0 }}>
            <PlayPause playing={playing} onToggle={() => setPlaying((v) => !v)} />
          </div>
        </Cell>
      </div>

      <div className="ds-row top">
        <Cell label="Capsule" style={{ width: "min(100%, 320px)" }}>
          <div className="w-full">
            <Capsule p={cap} />
          </div>
        </Cell>
        <Cell label="Workshop row · .rows" style={{ width: "min(100%, 420px)" }}>
          <ol className="rows w-full">
            <li>
              <a href="#playground" className="on">
                <span className="th">{cap.hero ? <img src={cap.hero} alt="" /> : cap.mark}</span>
                <span className="t">
                  <b>
                    {cap.name}
                    <StatusChip status={status} />
                  </b>
                  <span className="l">{cap.latest ?? cap.line}</span>
                </span>
                <span className="d mono">{cap.date ? "26 Sep 2026" : ""}</span>
              </a>
            </li>
          </ol>
        </Cell>
        <Cell label="Log row · .log-list" style={{ width: "min(100%, 340px)" }}>
          <ol className="log-list w-full">
            <li>
              <span className="mono">26 Sep</span>
              <div>
                <a href="#playground" className="p">
                  {cap.name}
                </a>
                <div className="t">{cap.latest ?? "No entry yet"}</div>
                <div className="n">A note under the entry title.</div>
              </div>
            </li>
          </ol>
        </Cell>
      </div>
    </div>
  );
}

/** A project's moon from the orbit, frozen: at rest it is a status-coloured dot, zoomed it is a labelled orb. */
function Moon({ status, name, active }: { status: Status; name: string; active: boolean }) {
  return (
    <div className="ds-moonbox">
      <div className="sys" data-active={active} data-dim={false}>
        <div className="sys-body">
          <div className="moon-pos">
            <a href="#playground" className="moon" data-status={status} tabIndex={-1} aria-label={`${name}, ${STATUS_LABEL[status].toLowerCase()}`}>
              <span className="moon-txt" data-long={/\S{10,}/.test(name)}>
                {name}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
