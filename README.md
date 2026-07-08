# AC Design Main

The central creative hub — a gateway into software, games, tools, systems, and worlds.
Not a portfolio; a long-term creative operating system built to grow for years.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## What's here (Prototype v0.1 — homepage only)

Two homepage concepts share **one** design system, so this is a feel-comparison, not two sites.

| Route | Concept |
|-------|---------|
| `/` | Chooser — pick a prototype |
| `/worlds` | **Concept 2 — Worlds**: orbital navigation, hover-to-focus, center hub |
| `/minimal` | **Concept 3 — Minimal Hub**: large type + destination cards |
| `/<destination>` | On-brand placeholders for each world (coming next) |

Both include the full homepage flow: Hero → Primary Destinations → Currently Building →
Featured Work → About → Community. Light + dark themes with a no-flash toggle.

## Design system (single source of truth)

- **Tokens:** `app/globals.css` — colors, both themes. Change `--accent` in one place to
  re-tint the entire platform (currently a restrained burnt amber / warm gold in dark).
- **Content & worlds:** `lib/content.ts` — destinations, hero copy, nav, sections.
- **Type:** Fraunces (editorial display) + Inter (UI), via `next/font`.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Motion (framer-motion).

## Notes

- `components/PrototypeSwitcher.tsx` is a review aid (floating pill) — remove before launch.
- Adding a new "world" = one entry in `lib/content.ts`. The homepage never needs redesigning.
