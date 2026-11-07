/**
 * The solar system on the home page: one planet per practice, a moon per
 * project, seen at an angle, pulled by the pointer. Vanilla DOM and canvas,
 * mounted by `components/home/SolarSystem.tsx`. Everything a visitor tunes
 * (planets, view, each planet's size, speed, density, rings and moons, and
 * the site's accent) is kept in localStorage so it survives a reload.
 */
import { ACCENTS, ACCENT_KEY, DEFAULT_ACCENT } from "./accents";

export type SystemPlanet = { name: string; count: number; href: string };
export type SystemOptions = {
  /** The first planets, in order: the practices. */
  planets: SystemPlanet[];
  /** The A, as an SVG path on a 612×612 box; drawn as the sun. */
  mark: string;
};

type MoonCfg = { d: number; s: number; sp: number; inc: number };
type PlanetCfg = { size: number; speed: number; density: number; moons: number; rings: number; ms: MoonCfg[] };
type Cfg = { n: number; tilt: number; angle: number; roll: number; gravity: number; trail: number; planets: PlanetCfg[] };
type Moon = { r: number; s: number; inc: number; w: number; a: number; sx?: number; sy?: number };
type Planet = {
  i: number; name: string | null; href: string | null; r: number; w: number; a: number; rad: number; mass: number; n: number; mr: number;
  ms: Moon[]; rings: number; dx: number; dy: number; vx: number; vy: number; trail: number[][]; hot: boolean; pulse: number;
  sx: number; sy: number; sc: number; depth: number; x: number; y: number; z: number; bx: number; by: number;
};

const KEY = "ac-system";
const BASE = [[3, 1, 1, 0], [2.6, 1, 1, 0], [3.6, 1, 1.4, 2], [2.3, 1, 1, 0], [4, 1, 1, 1]];

function h(tag: string, attrs?: Record<string, string>, kids?: (Node | string)[]) {
  const e = document.createElement(tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs![k]);
  (kids || []).forEach((c) => e.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return e;
}
function rgba(hex: string, a: number) {
  let s = hex.replace("#", "");
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function moonSet(seed: number): MoonCfg[] {
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const ms: MoonCfg[] = [];
  for (let j = 0; j < 8; j++) ms.push({ d: +(0.6 + rnd() * 1.1).toFixed(2), s: +(0.75 + rnd()).toFixed(2), sp: +((rnd() < 0.17 ? -1 : 1) * (0.7 + rnd() * 0.6)).toFixed(2), inc: Math.round((rnd() - 0.5) * 80) });
  return ms;
}

export function mountSolarSystem(el: HTMLElement, opts: SystemOptions): () => void {
  const root = document.documentElement;
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = 220, dpr = Math.min(2, window.devicePixelRatio || 1);
  const names = opts.planets;
  let px = 220, full = false;

  // ---- markup ----
  const cv = h("canvas", { "aria-label": "A small solar system: one planet per practice, a moon per project. Drag to turn time; hover a planet or a moon to name it; click one to tune it." }) as HTMLCanvasElement;
  const tune = h("div", { class: "h-tune" }); tune.hidden = true;
  function fit() {
    const wide = innerWidth > 1000, edit = !tune.hidden;
    // full screen: beside the panel on wide screens when it is open, else the whole window; under it on narrow ones
    const w = innerWidth - (wide && edit ? 380 + 72 : 48), hgt = innerHeight - (wide ? 80 : edit ? 120 : 80);
    px = full ? Math.max(200, Math.min(w, hgt)) : 220;
    cv.style.width = px + "px"; cv.style.height = px + "px"; cv.width = Math.round(px * dpr); cv.height = Math.round(px * dpr);
  }
  fit();
  const lab = h("span", { class: "h-lab-t" }, [" "]);
  const icon = (d: string) => { const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("viewBox", "0 0 24 24"); sv.setAttribute("aria-hidden", "true"); sv.innerHTML = d; return sv; };
  const I_RND = '<path d="M4 6h3l9 12h4"/><path d="M4 18h3l9-12h4"/><path d="M18 3l3 3-3 3"/><path d="M18 15l3 3-3 3"/>';
  const I_EDIT = '<path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h8M16 17h4"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="14" cy="17" r="2"/>';
  const I_FULL = '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
  const I_EXIT = '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>';
  const rnd = h("button", { type: "button", title: "A random system", "aria-label": "Random system" }, [icon(I_RND)]);
  const tb = h("button", { type: "button", "aria-expanded": "false", title: "Edit the system", "aria-label": "Edit the system" }, [icon(I_EDIT)]);
  const fb = h("button", { type: "button", "aria-pressed": "false", title: "Full screen", "aria-label": "Full screen" }, [icon(I_FULL)]);
  const labRow = h("div", { class: "h-lab" }, [lab, h("span", { class: "h-r" }, [rnd, tb, fb])]);
  const toy = h("div", { class: "h-toy" }, [cv, labRow]);
  el.appendChild(toy); el.appendChild(tune); el.classList.add("h-live");

  // ---- state ----
  const ctx = cv.getContext("2d")!;
  void opts.mark;
  const col: Record<string, string> = {};
  function colors() { const cs = getComputedStyle(root); ["ink", "ink-soft", "muted", "accent", "line", "line-strong", "paper"].forEach((k) => { col[k] = cs.getPropertyValue("--" + k).trim(); }); }
  colors();
  function defaults(): Cfg {
    return { n: 3, tilt: 58, angle: 0, roll: 0, gravity: 1, trail: 70, planets: BASE.map((b, i) => ({ size: b[0], speed: b[1], density: b[2], moons: i < names.length ? Math.min(8, names[i].count) : (i % 3) + 2, rings: b[3], ms: moonSet(11 + i * 97) })) };
  }
  let cfg = defaults();
  try { const sv = JSON.parse(localStorage.getItem(KEY) || "null"); if (sv && sv.planets && sv.planets.length === 5 && typeof sv.roll === "number" && sv.planets[0].ms) cfg = sv; } catch {}
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch {} }
  type HotMoon = { p: Planet; j: number };
  let P: Planet[] = [], t = 0, rate = 1, prec = 0, hot: Planet | null = null, hotM: HotMoon | null = null;
  const ptr = { x: 0, y: 0, in: false, down: false, ang: 0, moved: false, lastT: 0 };
  function pname(i: number) { return i < names.length ? names[i].name.toLowerCase() : "planet " + (i + 1); }

  function build() {
    const n = cfg.n, old = P; P = [];
    for (let i = 0; i < n; i++) {
      const pc = cfg.planets[i], r = n === 1 ? 62 : 30 + i * (62 / (n - 1));
      const rad = pc.size, mass = pc.density * Math.pow(rad / 3, 3);
      const mr = rad * 2.2 + 3.5, mw = 0.32 * 2.4 * Math.sqrt(mass) * Math.pow(9 / mr, 1.5), ms: Moon[] = [];
      for (let j = 0; j < pc.moons; j++) { const mc = pc.ms[j], rr = mr * mc.d; ms.push({ r: rr, s: mc.s, inc: (mc.inc * Math.PI) / 180, w: mw * Math.pow(mr / rr, 1.5) * mc.sp, a: old[i] && old[i].ms[j] ? old[i].ms[j].a : (j * 1.7 + i) % (Math.PI * 2) }); }
      const wn = (pc.speed * 69) / Math.pow(r, 1.5);
      const o = old[i];
      P.push({ i, name: i < names.length ? names[i].name : null, href: i < names.length ? names[i].href : null, r, w: wn, a: o ? o.w * t + o.a - wn * t : i * 2.1 + 0.6 - wn * t, rad, mass, n: pc.moons, mr, ms, rings: pc.rings, dx: o ? o.dx : 0, dy: o ? o.dy : 0, vx: o ? o.vx : 0, vy: o ? o.vy : 0, trail: o ? o.trail : [], hot: false, pulse: 0, sx: 0, sy: 0, sc: 1, depth: 0, x: 0, y: 0, z: 0, bx: 0, by: 0 });
    }
  }
  build();

  // ---- projection: precession, tilt about X (near side down), angle about the vertical, roll about the view axis, perspective ----
  const F = 420;
  function proj(x: number, y: number, z: number, cx: number, cy: number, k: number) {
    const c = Math.cos(prec), s = Math.sin(prec), X = x * c - y * s, Y = x * s + y * c;
    const tl = (cfg.tilt * Math.PI) / 180, ct = Math.cos(tl), st = Math.sin(tl);
    const Yp = Y * ct - z * st, Z1 = Y * st + z * ct;
    const an = (cfg.angle * Math.PI) / 180, ca = Math.cos(an), sa = Math.sin(an);
    const X2 = X * ca + Z1 * sa, depth = -X * sa + Z1 * ca;
    const rl = (cfg.roll * Math.PI) / 180, cr = Math.cos(rl), sr = Math.sin(rl);
    const X3 = X2 * cr - Yp * sr, Y3 = X2 * sr + Yp * cr;
    // positions are orthographic so every orbit stays centered on the sun; depth only scales the bodies
    const sc = F / (F - depth);
    return [cx + X3 * k, cy + Y3 * k, sc, depth];
  }
  function unproj(sx: number, sy: number) {
    const rl = (cfg.roll * Math.PI) / 180, cr = Math.cos(rl), sr = Math.sin(rl), ux = sx * cr + sy * sr, uy = -sx * sr + sy * cr;
    const tl = (cfg.tilt * Math.PI) / 180, ct = Math.max(0.2, Math.cos(tl)), st = Math.sin(tl);
    const an = (cfg.angle * Math.PI) / 180, ca = Math.max(0.3, Math.cos(an)), sa = Math.sin(an);
    const Y = uy / ct, Z1 = Y * st, X = (ux - Z1 * sa) / ca, c = Math.cos(prec), s = Math.sin(prec);
    return [X * c + Y * s, -X * s + Y * c];
  }
  function orbitPt(p: Planet, th: number) { return [p.r * Math.cos(th), p.r * Math.sin(th), 0]; }
  function moonPt(p: Planet, m: Moon, a: number) { return [p.x + m.r * Math.cos(a), p.y + m.r * Math.sin(a) * Math.cos(m.inc), p.z + m.r * Math.sin(a) * Math.sin(m.inc)]; }

  function step(dt: number) {
    if (!ptr.down) rate += (1 - rate) * Math.min(1, dt * 1.2);
    t += rate * dt; prec += dt * 0.02; hot = null; hotM = null;
    P.forEach((p) => { const b = orbitPt(p, p.w * t + p.a); p.bx = b[0]; p.by = b[1]; p.z = b[2]; p.x = b[0] + p.dx; p.y = b[1] + p.dy; });
    const pm = ptr.in && !ptr.down ? unproj(ptr.x - 110, ptr.y - 110) : null;
    P.forEach((p) => {
      let ax = 0, ay = 0;
      if (pm) { const ex = pm[0] - p.x, ey = pm[1] - p.y, d2 = ex * ex + ey * ey + 400, d = Math.sqrt(d2), f = (52000 * cfg.gravity) / d2; ax += (ex / d) * f; ay += (ey / d) * f; }
      P.forEach((q) => { if (q === p) return; const ex = q.x - p.x, ey = q.y - p.y, d2 = ex * ex + ey * ey + 60, d = Math.sqrt(d2), f = (900 * q.mass) / d2; ax += (ex / d) * f; ay += (ey / d) * f; });
      p.vx += (-p.dx * 14 - p.vx * 3.2 + ax) * dt; p.vy += (-p.dy * 14 - p.vy * 3.2 + ay) * dt;
      const lim = 44; p.dx = Math.max(-lim, Math.min(lim, p.dx + p.vx * dt)); p.dy = Math.max(-lim, Math.min(lim, p.dy + p.vy * dt));
      p.x = p.bx + p.dx; p.y = p.by + p.dy;
      p.trail.push([p.x, p.y, p.z]); while (p.trail.length > cfg.trail) p.trail.shift();
      p.ms.forEach((m) => { m.a += m.w * rate * dt; }); p.pulse *= Math.max(0, 1 - dt * 3);
      const q = proj(p.x, p.y, p.z, 110, 110, 1); p.sx = q[0]; p.sy = q[1]; p.sc = q[2]; p.depth = q[3];
      if (ptr.in && !ptr.down) {
        p.ms.forEach((m, j) => { const mp = moonPt(p, m, m.a), mq = proj(mp[0], mp[1], mp[2], 110, 110, 1); m.sx = mq[0]; m.sy = mq[1]; if (!hotM && Math.hypot(ptr.x - mq[0], ptr.y - mq[1]) < 1.1 * m.s * mq[2] + 4) hotM = { p, j }; });
        if (!hot && !hotM && Math.hypot(ptr.x - p.sx, ptr.y - p.sy) < p.rad * p.sc + 7) hot = p;
      }
    });
    const hm = hotM as HotMoon | null; if (hm) hot = hm.p;
    P.forEach((p) => { p.hot = hot === p; });
    cv.classList.toggle("h-hot", !!hot && !ptr.down);
    lab.textContent = hm ? `${pname(hm.p.i)} · moon ${hm.j + 1}` : hot ? (hot.name ? `${hot.name.toLowerCase()} · ${hot.n} projects` : `planet ${hot.i + 1} · ${hot.n} moons`) : " ";
  }
  function ring(c: CanvasRenderingContext2D, p: Planet, cx: number, cy: number, k: number, lw: number, a: number) {
    c.lineWidth = lw; c.globalAlpha = a; c.beginPath();
    for (let i = 0; i <= 72; i++) { const o = orbitPt(p, (i * Math.PI) / 36), q = proj(o[0], o[1], o[2], cx, cy, k); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }
    c.stroke(); c.globalAlpha = 1;
  }
  function draw(c: CanvasRenderingContext2D, cx: number, cy: number, k: number, lw: number) {
    c.lineCap = "round";
    c.strokeStyle = col["line-strong"]; c.lineWidth = lw;
    for (let i = 0; i < 72; i++) { const a = (i * Math.PI) / 36, L = i % 6 === 0 ? 5 : 2, q1 = proj((100 - L) * Math.cos(a), (100 - L) * Math.sin(a), 0, cx, cy, k), q2 = proj(100 * Math.cos(a), 100 * Math.sin(a), 0, cx, cy, k); c.globalAlpha = Math.max(0.15, Math.min(1, 0.45 + 0.55 * (q1[2] - 0.75) * 2)); c.beginPath(); c.moveTo(q1[0], q1[1]); c.lineTo(q2[0], q2[1]); c.stroke(); }
    c.globalAlpha = 1;
    P.forEach((p) => { c.strokeStyle = p.hot ? col["muted"] : col["line-strong"]; ring(c, p, cx, cy, k, lw, p.hot ? 1 : 0.5); });
    P.forEach((p) => { const n = p.trail.length; c.strokeStyle = col["ink"]; c.lineWidth = lw; let prev: number[] | null = null; for (let i = 0; i < n; i++) { const q = proj(p.trail[i][0], p.trail[i][1], p.trail[i][2], cx, cy, k); if (prev) { c.globalAlpha = (i / n) * 0.55; c.beginPath(); c.moveTo(prev[0], prev[1]); c.lineTo(q[0], q[1]); c.stroke(); } prev = q; } c.globalAlpha = 1; });
    const items: { d: number; p?: Planet; sun?: boolean }[] = P.map((p) => ({ d: p.depth, p })); items.push({ d: 0, sun: true });
    items.sort((a, b) => a.d - b.d);
    const sq = proj(0, 0, 0, cx, cy, k);
    items.forEach((it) => {
      if (it.sun) {
        const g = c.createRadialGradient(sq[0], sq[1], 0, sq[0], sq[1], 26 * k); g.addColorStop(0, rgba(col["accent"], 0.45)); g.addColorStop(1, rgba(col["accent"], 0)); c.fillStyle = g; c.beginPath(); c.arc(sq[0], sq[1], 26 * k, 0, Math.PI * 2); c.fill();
        c.fillStyle = col["accent"]; c.beginPath(); c.arc(sq[0], sq[1], 4.2 * k, 0, Math.PI * 2); c.fill();
        c.fillStyle = col["paper"]; c.globalAlpha = 0.35; c.beginPath(); c.arc(sq[0] + 1.2 * k, sq[1] + 1.2 * k, 2.2 * k, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
        return;
      }
      const p = it.p!; const qq = proj(p.x, p.y, p.z, cx, cy, k); const px = qq[0], py = qq[1], sc = qq[2];
      const R = (p.rad + (p.hot ? 0.5 : 0)) * sc * k + p.pulse * 6 * k;
      for (let b = 0; b < p.rings; b++) { c.strokeStyle = col["ink-soft"]; c.lineWidth = lw; c.globalAlpha = 0.55 - b * 0.12; c.beginPath(); const rr = p.rad * (1.7 + b * 0.45); for (let i = 0; i <= 48; i++) { const q = proj(p.x + rr * Math.cos((i * Math.PI) / 24), p.y + rr * Math.sin((i * Math.PI) / 24), p.z, cx, cy, k); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke(); c.globalAlpha = 1; }
      if (p.hot) p.ms.forEach((m, j) => { c.strokeStyle = hotM && hotM.p === p && hotM.j === j ? col["ink"] : col["line-strong"]; c.lineWidth = lw; c.globalAlpha = 0.6; c.beginPath(); for (let i = 0; i <= 40; i++) { const mp = moonPt(p, m, (i * Math.PI) / 20), q = proj(mp[0], mp[1], mp[2], cx, cy, k); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.stroke(); c.globalAlpha = 1; });
      const ang = Math.atan2(sq[1] - py, sq[0] - px), lx = px + Math.cos(ang) * R * 0.45, ly = py + Math.sin(ang) * R * 0.45;
      const g2 = c.createRadialGradient(lx, ly, R * 0.1, px, py, R * 1.05); g2.addColorStop(0, col["ink"]); g2.addColorStop(0.7, col["ink-soft"]); g2.addColorStop(1, col["muted"]); c.fillStyle = g2; c.beginPath(); c.arc(px, py, R, 0, Math.PI * 2); c.fill();
      c.fillStyle = col["accent"];
      p.ms.forEach((m, j) => { const mp = moonPt(p, m, m.a), mq = proj(mp[0], mp[1], mp[2], cx, cy, k), hm = hotM && hotM.p === p && hotM.j === j; c.globalAlpha = mq[3] < p.depth ? 0.5 : 1; c.beginPath(); c.arc(mq[0], mq[1], (hm ? 1.5 : 1.1) * m.s * mq[2] * k, 0, Math.PI * 2); c.fill(); });
      c.globalAlpha = 1;
    });
  }
  let last = 0, fc = 0, raf = 0, alive = true;
  function frame(now: number) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    if (++fc % 30 === 0) colors();
    const k = px / S; step(dt); ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0); ctx.clearRect(0, 0, S, S); draw(ctx, 110, 110, 1, 1 / k);
    raf = requestAnimationFrame(frame);
  }
  function still() { const k = px / S; ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0); ctx.clearRect(0, 0, S, S); draw(ctx, 110, 110, 1, 1 / k); }
  if (!REDUCED) raf = requestAnimationFrame(frame); else { for (let i = 0; i < 60; i++) step(0.05); still(); }

  // ---- pointer ----
  function pos(e: PointerEvent) { const b = cv.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * S, ((e.clientY - b.top) / b.height) * S]; }
  cv.addEventListener("pointerenter", () => { ptr.in = true; });
  cv.addEventListener("pointerleave", () => { ptr.in = false; });
  cv.addEventListener("pointermove", (e) => {
    const q = pos(e); ptr.x = q[0]; ptr.y = q[1]; ptr.in = true;
    if (ptr.down) { const a = Math.atan2(q[1] - 110, q[0] - 110); let d = a - ptr.ang; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; const now = performance.now(), dt = Math.max(0.004, (now - ptr.lastT) / 1000); ptr.lastT = now; ptr.ang = a; const dtm = d * 6; t += dtm; P.forEach((p) => { p.ms.forEach((m) => { m.a += m.w * dtm; }); }); rate = Math.max(-40, Math.min(40, dtm / dt)); if (Math.abs(d) > 0.01) ptr.moved = true; }
  });
  cv.addEventListener("pointerdown", (e) => { const q = pos(e); ptr.down = true; ptr.moved = false; ptr.ang = Math.atan2(q[1] - 110, q[0] - 110); ptr.lastT = performance.now(); cv.classList.add("h-drag"); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
  function up() { if (!ptr.down) return; ptr.down = false; cv.classList.remove("h-drag"); if (ptr.moved) return; if (hotM) selectMoon(hotM.p.i, hotM.j); else if (hot) { hot.pulse = 1; selectPlanet(hot.i); } }
  cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);

  // ---- edit panel, full screen ----
  function showTune(on: boolean) { tune.hidden = !on; tb.setAttribute("aria-expanded", on ? "true" : "false"); el.classList.toggle("h-edit", on); if (full) { fit(); if (REDUCED) still(); } }
  tb.addEventListener("click", () => showTune(tune.hidden));
  function setFull(on: boolean) {
    full = on; el.classList.toggle("h-full", on); fb.setAttribute("aria-pressed", on ? "true" : "false"); fb.setAttribute("title", on ? "Exit full screen" : "Full screen"); fb.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
    fb.replaceChildren(icon(on ? I_EXIT : I_FULL)); document.body.style.overflow = on ? "hidden" : ""; if (on) showTune(true); fit(); if (REDUCED) still();
  }
  fb.addEventListener("click", () => setFull(!full));
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && full) setFull(false); };
  const onResize = () => { if (full) { fit(); if (REDUCED) still(); } };
  document.addEventListener("keydown", onKey); window.addEventListener("resize", onResize);
  type Row = HTMLDivElement & { sync: () => void };
  function btnRow(label: string, vals: number[], get: () => number, set: (v: number) => void): Row {
    const row = h("div", { class: "h-tabs" }, [h("b", {}, [label])]) as Row; const bs: [number, HTMLElement][] = [];
    vals.forEach((v) => { const b = h("button", { type: "button" }, [String(v)]); b.addEventListener("click", () => { set(v); row.sync(); build(); persist(); }); bs.push([v, b]); row.appendChild(b); });
    row.sync = () => { const cur = get(); bs.forEach((x) => x[1].setAttribute("aria-pressed", x[0] === cur ? "true" : "false")); };
    row.sync(); return row;
  }
  const nRow = btnRow("Planets", [1, 2, 3, 4, 5], () => cfg.n, (v) => { cfg.n = v; syncTabs(); });
  let sel = 0, selM = 0;
  const tabs = h("div", { class: "h-tabs" }, [h("b", {}, ["Planet"])]), tabBtns: HTMLElement[] = [], tabName = h("span");
  for (let i = 0; i < 5; i++) { const b = h("button", { type: "button" }, [String(i + 1)]); b.addEventListener("click", () => { sel = i; syncTabs(); syncPlanet(); }); tabBtns.push(b); tabs.appendChild(b); }
  tabs.appendChild(tabName);
  function syncTabs() { tabBtns.forEach((b, i) => { b.style.display = i < cfg.n ? "" : "none"; b.setAttribute("aria-pressed", i === sel ? "true" : "false"); }); if (sel >= cfg.n) { sel = cfg.n - 1; syncTabs(); } tabName.textContent = pname(sel); }
  const fx = (v: number) => v.toFixed(2) + "×", deg = (v: number) => v + "°";
  type Slider = [string, string, number, number, number, (v: number) => string];
  const G: Slider[] = [["tilt", "Tilt", 0, 80, 1, deg], ["angle", "Angle", -70, 70, 1, deg], ["roll", "Roll", -180, 180, 1, deg], ["gravity", "Gravity", 0, 3, 0.05, fx], ["trail", "Trail", 2, 200, 1, String]];
  const PL: Slider[] = [["size", "Size", 1, 7, 0.1, (v) => v.toFixed(1)], ["speed", "Speed", 0.1, 4, 0.05, fx], ["density", "Density", 0.1, 4, 0.05, fx], ["rings", "Rings", 0, 3, 1, (v) => (v === 0 ? "none" : String(v))]];
  const ML: Slider[] = [["d", "Distance", 0.4, 2.6, 0.05, fx], ["s", "Size", 0.4, 2.2, 0.05, fx], ["sp", "Speed", -3, 3, 0.05, fx], ["inc", "Tilt", -85, 85, 1, deg]];
  const ctl: Record<string, { inp: HTMLInputElement; out: HTMLElement; fmt: (v: number) => string; get: () => number }> = {};
  function slider(s: Slider, key: string, get: () => number, set: (v: number) => void) {
    const inp = h("input", { type: "range", min: String(s[2]), max: String(s[3]), step: String(s[4]), value: String(get()), "aria-label": s[1] }) as HTMLInputElement, out = h("output", {}, [s[5](get())]);
    inp.addEventListener("input", () => { set(parseFloat(inp.value)); out.textContent = s[5](get()); build(); persist(); });
    ctl[key] = { inp, out, fmt: s[5], get };
    return h("label", {}, [h("b", {}, [s[1]]), inp, out]);
  }
  const c = cfg as unknown as Record<string, number>;
  tune.appendChild(nRow);
  G.forEach((s) => tune.appendChild(slider(s, s[0], () => (cfg as unknown as Record<string, number>)[s[0]], (v) => { (cfg as unknown as Record<string, number>)[s[0]] = v; })));
  void c;
  tune.appendChild(h("div", { class: "h-sep" })); tune.appendChild(tabs);
  const mRow = btnRow("Moons", [0, 1, 2, 3, 4, 5, 6, 7, 8], () => cfg.planets[sel].moons, (v) => { cfg.planets[sel].moons = v; syncMoons(); });
  PL.forEach((s) => tune.appendChild(slider(s, "p" + s[0], () => (cfg.planets[sel] as unknown as Record<string, number>)[s[0]], (v) => { (cfg.planets[sel] as unknown as Record<string, number>)[s[0]] = v; })));
  tune.appendChild(mRow);
  const mTabs = h("div", { class: "h-tabs" }, [h("b", {}, ["Moon"])]), mTabBtns: HTMLElement[] = [], moonBox = h("div", { class: "h-moonbox" });
  for (let j = 0; j < 8; j++) { const b = h("button", { type: "button" }, [String(j + 1)]); b.addEventListener("click", () => { selM = j; syncMoons(); }); mTabBtns.push(b); mTabs.appendChild(b); }
  moonBox.appendChild(mTabs);
  ML.forEach((s) => moonBox.appendChild(slider(s, "m" + s[0], () => (cfg.planets[sel].ms[selM] as unknown as Record<string, number>)[s[0]], (v) => { (cfg.planets[sel].ms[selM] as unknown as Record<string, number>)[s[0]] = v; })));
  tune.appendChild(moonBox);
  function syncMoons() { const n = cfg.planets[sel].moons; if (selM >= n) selM = Math.max(0, n - 1); moonBox.hidden = n === 0; mTabBtns.forEach((b, j) => { b.style.display = j < n ? "" : "none"; b.setAttribute("aria-pressed", j === selM ? "true" : "false"); }); ML.forEach((s) => { const x = ctl["m" + s[0]]; x.inp.value = String(x.get()); x.out.textContent = x.fmt(x.get()); }); }
  function syncPlanet() { PL.forEach((s) => { const x = ctl["p" + s[0]]; x.inp.value = String(x.get()); x.out.textContent = x.fmt(x.get()); }); mRow.sync(); syncMoons(); }
  function syncAll() { G.forEach((s) => { const x = ctl[s[0]]; x.inp.value = String(x.get()); x.out.textContent = x.fmt(x.get()); }); nRow.sync(); syncTabs(); syncPlanet(); }
  function selectPlanet(i: number) { sel = i; syncTabs(); syncPlanet(); if (tune.hidden) { tune.hidden = false; tb.setAttribute("aria-expanded", "true"); } tabBtns[i].focus({ preventScroll: true }); }
  function selectMoon(i: number, j: number) { selectPlanet(i); selM = j; syncMoons(); mTabBtns[j].focus({ preventScroll: true }); }
  rnd.addEventListener("click", () => {
    const R = Math.random, ri = (a: number, b: number) => a + Math.floor(R() * (b - a + 1)), rf = (a: number, b: number) => a + R() * (b - a);
    cfg.n = ri(2, 5); cfg.tilt = ri(30, 75); cfg.angle = ri(-60, 60); cfg.roll = ri(-180, 180); cfg.gravity = +rf(0.6, 1.8).toFixed(2); cfg.trail = ri(30, 160);
    cfg.planets.forEach((pc) => { pc.size = +rf(1.4, 6).toFixed(1); pc.speed = +rf(0.4, 2.2).toFixed(2); pc.density = +rf(0.4, 2.6).toFixed(2); pc.moons = R() < 0.25 ? 0 : ri(1, 7); pc.rings = R() < 0.28 ? ri(1, 3) : 0; pc.ms = moonSet(ri(1, 100000)); });
    P = []; build(); P.forEach((p) => { p.a = R() * Math.PI * 2; }); syncAll(); persist();
  });
  // ---- color ----
  const sw = h("div", { class: "h-sw" }, [h("b", {}, ["Color"])]), swb: Record<string, HTMLElement> = {}, swn = h("span", { class: "h-nm" });
  function setAccent(a: string) { root.setAttribute("data-a", a); try { localStorage.setItem(ACCENT_KEY, a); } catch {} swn.textContent = a; for (const k in swb) swb[k].setAttribute("aria-pressed", k === a ? "true" : "false"); colors(); }
  ACCENTS.forEach((a) => { const b = h("button", { type: "button", "aria-label": a[0], title: a[0], style: "--c:" + a[1] }); b.addEventListener("click", () => setAccent(a[0])); swb[a[0]] = b; sw.appendChild(b); });
  sw.appendChild(swn);
  const rs = h("button", { type: "button", class: "h-rs" }, ["reset"]); rs.addEventListener("click", () => { cfg = defaults(); sel = 0; build(); syncAll(); setAccent(DEFAULT_ACCENT); try { localStorage.removeItem(KEY); } catch {} });
  sw.appendChild(rs); tune.appendChild(sw);
  let acc = DEFAULT_ACCENT; try { acc = localStorage.getItem(ACCENT_KEY) || DEFAULT_ACCENT; } catch {}
  if (!ACCENTS.some((a) => a[0] === acc)) acc = DEFAULT_ACCENT;
  syncTabs(); syncMoons(); setAccent(acc);
  function syncSw() { const light = !root.classList.contains("dark"); ACCENTS.forEach((a) => swb[a[0]].style.setProperty("--c", light ? a[2] : a[1])); }
  syncSw(); const mo = new MutationObserver(syncSw); mo.observe(root, { attributes: true, attributeFilter: ["class"] });

  return () => { alive = false; cancelAnimationFrame(raf); mo.disconnect(); document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); document.body.style.overflow = ""; el.classList.remove("h-live"); toy.remove(); tune.remove(); };
}
