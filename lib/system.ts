import fs from "fs";
import path from "path";
import { routeLabel } from "./routes";

/**
 * Build-time introspection for the temporary /system page. It reads the
 * repo's own source (app, components, content, lib, globals.css) and
 * public/img, so the page describes what actually exists instead of a
 * hand-kept list. Server only: never import it from a client component.
 */

const ROOT = process.cwd();
const SRC_DIRS = ["app", "components", "content", "lib"];

export type SourceFile = {
  path: string;
  text: string;
  lines: number;
  client: boolean;
  /** The first comment block in the file, cleaned. */
  doc: string;
};

export type ExportInfo = {
  name: string;
  kind: "component" | "hook" | "function" | "const" | "type";
  doc: string;
  line: number;
  /** The declaration, trimmed to its opening brace. */
  signature: string;
  reexport?: boolean;
};

export type FileInfo = SourceFile & {
  exports: ExportInfo[];
  /** Internal imports, resolved to repo paths. */
  imports: { from: string; symbols: string[] }[];
  importedBy: { by: string; symbols: string[] }[];
  /** App entries (pages, layout, sitemap…) that reach this file through imports. */
  routes: string[];
};

export type CssDecl = { prop: string; value: string };
export type CssRule = {
  selector: string;
  decls: CssDecl[];
  media?: string;
  note?: string;
  /** The first class (or element) of each selector in the list. */
  roots: string[];
  /** `[data-*]` hooks the selector keys off. */
  states: string[];
};
export type CssKeyframes = { name: string; body: string };
export type CssClass = { name: string; rules: number; usedOn: string[] };
export type CssSection = { title: string; note?: string; rules: CssRule[]; keyframes: CssKeyframes[]; classes: CssClass[] };
export type CssToken = {
  name: string;
  light: string;
  dark?: string;
  /** Resolved literals (nested var() substituted), for swatches. */
  lightResolved: string;
  darkResolved: string;
  /** The `@theme inline` name, when Tailwind gets a utility for it. */
  alias?: string;
  utilities: string[];
  /** How many `var(--name)` references exist across css and tsx. */
  uses: number;
  group: string;
};
export type CssInventory = {
  tokens: CssToken[];
  aliases: { name: string; value: string }[];
  sections: CssSection[];
  media: string[];
  totalRules: number;
  totalClasses: number;
  totalKeyframes: number;
};

export type TypeField = { name: string; optional: boolean; type: string; doc: string };
export type TypeInfo = { name: string; doc: string; fields: TypeField[]; union: string[]; alias?: string };

export type Asset = { path: string; bytes: number; referencedBy: string[]; svg: boolean };

export type SystemData = {
  files: FileInfo[];
  css: CssInventory;
  types: TypeInfo[];
  assets: Asset[];
  redirects: { source: string; destination: string; permanent: boolean }[];
  pkg: { deps: Record<string, string>; devDeps: Record<string, string>; scripts: Record<string, string> };
  node: string;
};

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function rel(abs: string): string {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

function cleanComment(raw: string): string {
  return raw
    .split("\n")
    .map((l) => l.replace(/^\s*\/\*+\s?/, "").replace(/^\s*\*+\/?\s?/, "").replace(/\s*\*\/\s*$/, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstDoc(text: string): string {
  const m = /\/\*[\s\S]*?\*\//.exec(text);
  if (!m) return "";
  const doc = cleanComment(m[0]);
  return doc.length > 280 ? doc.slice(0, 277) + "…" : doc;
}

/** The comment block (or `//` run) directly above line `i`. A blank line between them means it is not a doc for that line. */
function docBefore(lines: string[], i: number): string {
  let j = i - 1;
  if (j < 0) return "";
  const l = lines[j]!.trim();
  if (l.startsWith("//")) {
    const buf: string[] = [];
    while (j >= 0 && lines[j]!.trim().startsWith("//")) {
      buf.unshift(lines[j]!.trim().replace(/^\/\/\s?/, ""));
      j--;
    }
    return buf.join(" ");
  }
  if (!l.endsWith("*/")) return "";
  const buf: string[] = [];
  while (j >= 0) {
    buf.unshift(lines[j]!);
    if (lines[j]!.includes("/*")) break;
    j--;
  }
  return cleanComment(buf.join("\n"));
}

const DECL_RE = /^export\s+(?:default\s+)?(?:async\s+)?(function|const|let|type|interface)\s+(\w+)(.*)$/;
const REEXPORT_RE = /^export\s+(type\s+)?\{([^}]*)\}/;

function parseExports(file: SourceFile): ExportInfo[] {
  const lines = file.text.split("\n");
  const tsx = file.path.endsWith(".tsx");
  const out: ExportInfo[] = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const m = DECL_RE.exec(line);
    if (m) {
      const kw = m[1]!;
      const name = m[2]!;
      let kind: ExportInfo["kind"];
      if (kw === "type" || kw === "interface") kind = "type";
      else if (kw === "function") kind = name.startsWith("use") ? "hook" : tsx && /^[A-Z]/.test(name) ? "component" : "function";
      else kind = tsx && /^[A-Z]/.test(name) ? "component" : "const";
      let signature = line.replace(/^export\s+(default\s+)?(async\s+)?/, "").replace(/\s*\{\s*$/, "").replace(/\s*=\s*[[{(]?\s*$/, "");
      if (signature.length > 120) signature = signature.slice(0, 117) + "…";
      out.push({ name, kind, doc: docBefore(lines, i), line: i + 1, signature });
      return;
    }
    const r = REEXPORT_RE.exec(line);
    if (r) {
      const isType = Boolean(r[1]);
      for (const n of r[2]!.split(",").map((s) => s.trim()).filter(Boolean)) {
        const name = n.replace(/^type\s+/, "").replace(/\s+as\s+.*$/, "");
        out.push({ name, kind: isType ? "type" : "const", doc: docBefore(lines, i) || "Re-exported.", line: i + 1, signature: line.replace(/;$/, ""), reexport: true });
      }
    }
  });
  return out;
}

const IMPORT_RE = /import\s+(type\s+)?(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s+["']([^"']+)["']/g;
const SIDE_IMPORT_RE = /import\s+["']([^"']+)["']/g;

function resolveImport(fromFile: string, spec: string, known: Set<string>): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = spec.slice(2);
  else if (spec.startsWith(".")) base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec));
  else return null;
  for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) if (known.has(cand)) return cand;
  return null;
}

function parseImports(file: SourceFile, known: Set<string>): { from: string; symbols: string[] }[] {
  const out: { from: string; symbols: string[] }[] = [];
  const push = (spec: string, symbols: string[]) => {
    const to = resolveImport(file.path, spec, known);
    if (!to) return;
    const hit = out.find((o) => o.from === to);
    if (hit) hit.symbols.push(...symbols.filter((s) => !hit.symbols.includes(s)));
    else out.push({ from: to, symbols });
  };
  for (const m of file.text.matchAll(IMPORT_RE)) {
    const symbols: string[] = [];
    if (m[2]) symbols.push(m[2]);
    if (m[3]) for (const s of m[3].split(",")) {
      const n = s.trim().replace(/^type\s+/, "").replace(/\s+as\s+.*$/, "");
      if (n) symbols.push(n);
    }
    push(m[4]!, symbols);
  }
  for (const m of file.text.matchAll(SIDE_IMPORT_RE)) push(m[1]!, []);
  return out;
}

const ENTRY_RE = /^app\/(.*\/)?(page\.tsx|layout\.tsx|not-found\.tsx|sitemap\.ts|robots\.ts)$/;

function readSources(): SourceFile[] {
  const files: SourceFile[] = [];
  const abs = SRC_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  abs.push(path.join(ROOT, "next.config.mjs"));
  for (const a of abs) {
    if (!/\.(tsx?|css|mjs)$/.test(a)) continue;
    const text = fs.readFileSync(a, "utf8");
    files.push({
      path: rel(a),
      text,
      lines: text.split("\n").length,
      client: /^\s*["']use client["']/.test(text),
      doc: firstDoc(text),
    });
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function buildGraph(sources: SourceFile[]): FileInfo[] {
  const known = new Set(sources.map((f) => f.path));
  const infos: FileInfo[] = sources.map((f) => ({
    ...f,
    exports: /\.(tsx?)$/.test(f.path) ? parseExports(f) : [],
    imports: /\.(tsx?|mjs)$/.test(f.path) ? parseImports(f, known) : [],
    importedBy: [],
    routes: [],
  }));
  const byPath = new Map(infos.map((i) => [i.path, i]));
  for (const f of infos) for (const imp of f.imports) byPath.get(imp.from)?.importedBy.push({ by: f.path, symbols: imp.symbols });
  for (const entry of infos.filter((f) => ENTRY_RE.test(f.path))) {
    const seen = new Set<string>();
    const stack = [entry.path];
    while (stack.length) {
      const p = stack.pop()!;
      if (seen.has(p)) continue;
      seen.add(p);
      for (const imp of byPath.get(p)?.imports ?? []) stack.push(imp.from);
    }
    for (const p of seen) if (p !== entry.path) byPath.get(p)!.routes.push(routeLabel(entry.path));
  }
  for (const f of infos) {
    f.importedBy.sort((a, b) => a.by.localeCompare(b.by));
    f.routes.sort();
  }
  return infos;
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

type Item = { type: "comment"; text: string } | { type: "statement"; text: string } | { type: "block"; prelude: string; body: string };

function tokenizeCss(css: string): Item[] {
  const items: Item[] = [];
  let i = 0;
  while (i < css.length) {
    const ch = css[i]!;
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      items.push({ type: "comment", text: css.slice(i + 2, end < 0 ? css.length : end) });
      i = end < 0 ? css.length : end + 2;
      continue;
    }
    let j = i;
    let paren = 0;
    while (j < css.length && !((css[j] === ";" || css[j] === "{") && paren === 0)) {
      if (css[j] === "(") paren++;
      else if (css[j] === ")") paren--;
      j++;
    }
    const prelude = css.slice(i, j).trim();
    if (j >= css.length || css[j] === ";") {
      if (prelude) items.push({ type: "statement", text: prelude });
      i = j + 1;
      continue;
    }
    let depth = 1;
    let k = j + 1;
    while (k < css.length && depth > 0) {
      if (css[k] === "{") depth++;
      else if (css[k] === "}") depth--;
      k++;
    }
    items.push({ type: "block", prelude, body: css.slice(j + 1, k - 1) });
    i = k;
  }
  return items;
}

function parseDecls(body: string): CssDecl[] {
  return body
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const i = s.indexOf(":");
      return i < 0 ? { prop: s, value: "" } : { prop: s.slice(0, i).trim(), value: s.slice(i + 1).trim() };
    });
}

function rootsOf(selector: string): string[] {
  const roots: string[] = [];
  for (const raw of selector.split(",")) {
    const part = raw.trim().replace(/^:root:not\(\.dark\)\s+/, "").replace(/^\.dark\s+/, "").replace(/^:root\s+/, "");
    const compound = part.split(/\s+|\s*[>+~]\s*/)[0] ?? "";
    const cls = /\.([A-Za-z0-9_-]+)/.exec(compound);
    const root = cls ? cls[1]! : compound.replace(/[:[].*$/, "") || compound;
    if (root && !roots.includes(root)) roots.push(root);
  }
  return roots;
}

function sectionOf(text: string): { title: string; note?: string } | null {
  if (!/^\s*-{3,}/.test(text)) return null;
  const inner = text.replace(/-{3,}/g, " ").replace(/\s+/g, " ").trim();
  if (!inner) return null;
  const first = (inner.split(/(?<=\.)\s|\s—\s|:\s/)[0] ?? inner).replace(/\.$/, "").trim();
  return { title: first, note: inner !== first ? inner : undefined };
}

function parseTokenBlock(body: string, into: Record<string, string>, groups: Record<string, string>) {
  let group = "";
  for (const it of tokenizeCss(body)) {
    if (it.type === "comment") {
      group = cleanComment(it.text);
      continue;
    }
    if (it.type !== "statement") continue;
    const i = it.text.indexOf(":");
    if (i <= 0) continue;
    const name = it.text.slice(0, i).trim();
    into[name] = it.text.slice(i + 1).trim();
    if (group) groups[name] = group;
  }
}

function resolveVars(value: string, map: Record<string, string>, depth = 0): string {
  if (depth > 4) return value;
  return value.replace(/var\((--[\w-]+)\)/g, (m, n: string) => (map[n] ? resolveVars(map[n]!, map, depth + 1) : m));
}

function utilitiesFor(alias: string): string[] {
  const m = /^--(color|font)-(.+)$/.exec(alias);
  if (!m) return [];
  return m[1] === "color" ? [`bg-${m[2]}`, `text-${m[2]}`, `border-${m[2]}`] : [`font-${m[2]}`];
}

/** Every whitespace-separated word inside a string literal: the class tokens a file could apply. */
function stringTokens(text: string): Set<string> {
  const set = new Set<string>();
  const re = /"([^"\\\n]*)"|'([^'\\\n]*)'|`([^`]*)`/g;
  for (const m of text.matchAll(re)) {
    const s = m[1] ?? m[2] ?? m[3] ?? "";
    for (const t of s.replace(/[^\w\s-]/g, " ").split(/\s+/)) if (t) set.add(t);
  }
  return set;
}

function parseCss(css: string, files: SourceFile[]): CssInventory {
  const tsx = files.filter((f) => /\.tsx?$/.test(f.path));
  const tokensOf = new Map(tsx.map((f) => [f.path, stringTokens(f.text)]));
  const sections: CssSection[] = [];
  let cur: CssSection = { title: "Setup", rules: [], keyframes: [], classes: [] };
  sections.push(cur);
  let note: string | undefined;
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  const groups: Record<string, string> = {};
  const aliases: { name: string; value: string }[] = [];
  const media: string[] = [];

  const handle = (list: Item[], mediaCtx?: string) => {
    for (const it of list) {
      if (it.type === "comment") {
        const sec = sectionOf(it.text);
        if (sec) {
          cur = { title: sec.title, note: sec.note, rules: [], keyframes: [], classes: [] };
          sections.push(cur);
          note = undefined;
        } else note = cleanComment(it.text);
        continue;
      }
      if (it.type === "statement") {
        note = undefined;
        continue;
      }
      const { prelude, body } = it;
      if (prelude === ":root" && !mediaCtx) {
        parseTokenBlock(body, light, groups);
        continue;
      }
      if (prelude === ".dark" && !mediaCtx) {
        parseTokenBlock(body, dark, {});
        continue;
      }
      if (prelude.startsWith("@theme")) {
        for (const d of parseDecls(body)) aliases.push({ name: d.prop, value: d.value });
        continue;
      }
      if (prelude.startsWith("@keyframes")) {
        cur.keyframes.push({ name: prelude.replace("@keyframes", "").trim(), body: body.replace(/\s+/g, " ").trim() });
        note = undefined;
        continue;
      }
      if (prelude.startsWith("@media")) {
        const q = prelude.replace("@media", "").trim();
        if (!media.includes(q)) media.push(q);
        handle(tokenizeCss(body), q);
        continue;
      }
      cur.rules.push({
        selector: prelude.replace(/\s+/g, " "),
        decls: parseDecls(body),
        media: mediaCtx,
        note,
        roots: rootsOf(prelude),
        states: Array.from(new Set(prelude.match(/\[data-[\w-]+(?:="[^"]*")?\]/g) ?? [])),
      });
      note = undefined;
    }
  };
  handle(tokenizeCss(css));

  const all = files.map((f) => f.text).join("\n");
  const tokens: CssToken[] = Object.keys(light).map((name) => {
    const alias = aliases.find((a) => a.value === `var(${name})`)?.name;
    const uses = (all.match(new RegExp(`var\\(${name.replace(/-/g, "\\-")}\\)`, "g")) ?? []).length;
    return {
      name,
      light: light[name]!,
      dark: dark[name],
      lightResolved: resolveVars(light[name]!, light),
      darkResolved: resolveVars(dark[name] ?? light[name]!, { ...light, ...dark }),
      alias,
      utilities: alias ? utilitiesFor(alias) : [],
      uses,
      group: groups[name] ?? "",
    };
  });

  let totalRules = 0;
  let totalClasses = 0;
  let totalKeyframes = 0;
  for (const s of sections) {
    totalRules += s.rules.length;
    totalKeyframes += s.keyframes.length;
    const counts = new Map<string, number>();
    for (const r of s.rules) for (const root of r.roots) if (!/^[a-z*:]/.test(root) || r.selector.includes(`.${root}`)) counts.set(root, (counts.get(root) ?? 0) + 1);
    s.classes = Array.from(counts, ([name, rules]) => ({
      name,
      rules,
      usedOn: tsx.filter((f) => tokensOf.get(f.path)?.has(name)).map((f) => f.path),
    }));
    totalClasses += s.classes.length;
  }
  const seen = new Set<string>();
  for (const s of sections) s.classes = s.classes.filter((c) => (seen.has(c.name) ? false : (seen.add(c.name), true)));
  totalClasses = seen.size;

  return { tokens, aliases, sections: sections.filter((s) => s.rules.length || s.keyframes.length), media, totalRules, totalClasses, totalKeyframes };
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

function parseTypes(text: string): TypeInfo[] {
  const lines = text.split("\n");
  const out: TypeInfo[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^export type (\w+)\s*=\s*(.*)$/.exec(lines[i]!);
    if (!m) continue;
    const info: TypeInfo = { name: m[1]!, doc: docBefore(lines, i), fields: [], union: [] };
    const rest = m[2]!.trim();
    if (rest.startsWith("{") && rest.endsWith("};")) {
      for (const f of rest.slice(1, -2).split(";")) {
        const fm = /^\s*(\w+)(\?)?:\s*(.+)$/.exec(f);
        if (fm) info.fields.push({ name: fm[1]!, optional: Boolean(fm[2]), type: fm[3]!.trim(), doc: "" });
      }
    } else if (rest === "{") {
      let j = i + 1;
      while (j < lines.length && lines[j]!.trim() !== "};") {
        const fm = /^\s*(\w+)(\?)?:\s*(.+?);\s*$/.exec(lines[j]!);
        if (fm) info.fields.push({ name: fm[1]!, optional: Boolean(fm[2]), type: fm[3]!, doc: docBefore(lines, j) });
        j++;
      }
      i = j;
    } else {
      let buf = rest;
      let j = i;
      while (!buf.trim().endsWith(";") && j + 1 < lines.length) {
        j++;
        buf += " " + lines[j]!.trim();
      }
      const lits = buf.match(/"([^"]+)"/g)?.map((s) => s.replace(/"/g, "")) ?? [];
      if (lits.length) info.union = lits;
      else info.alias = buf.replace(/;$/, "").trim();
      i = j;
    }
    out.push(info);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Assets, config                                                      */
/* ------------------------------------------------------------------ */

function readAssets(files: SourceFile[]): Asset[] {
  const pub = path.join(ROOT, "public");
  return walk(pub)
    .filter((a) => !path.basename(a).startsWith("."))
    .map((a) => {
      const web = "/" + path.relative(pub, a).split(path.sep).join("/");
      return {
        path: web,
        bytes: fs.statSync(a).size,
        referencedBy: files.filter((f) => f.text.includes(web)).map((f) => f.path),
        svg: web.endsWith(".svg"),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

function readRedirects(files: SourceFile[]) {
  const cfg = files.find((f) => f.path === "next.config.mjs")?.text ?? "";
  const out: SystemData["redirects"] = [];
  for (const m of cfg.matchAll(/source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*permanent:\s*(true|false)/g)) {
    out.push({ source: m[1]!, destination: m[2]!, permanent: m[3] === "true" });
  }
  return out;
}

function readPkg(): SystemData["pkg"] {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
  return { deps: pkg.dependencies ?? {}, devDeps: pkg.devDependencies ?? {}, scripts: pkg.scripts ?? {} };
}

/* ------------------------------------------------------------------ */

let memo: SystemData | null = null;

/** Everything the /system page shows, computed once per build. */
export function system(): SystemData {
  if (memo) return memo;
  const sources = readSources();
  const files = buildGraph(sources);
  const css = parseCss(sources.find((f) => f.path === "app/globals.css")?.text ?? "", sources);
  const types = parseTypes(sources.find((f) => f.path === "content/types.ts")?.text ?? "");
  memo = {
    files,
    css,
    types,
    assets: readAssets(sources),
    redirects: readRedirects(sources),
    pkg: readPkg(),
    node: process.version,
  };
  return memo;
}
