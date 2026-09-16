# AC Main

The hub for everything Anthony Carrozzo makes. One person, three worlds, unlimited
projects, one living log. Built so that adding the next thing is one file and never
a redesign.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static pages for every route
```

## The model: four nouns

| Noun | How many | Lives in | Renders |
|------|----------|----------|---------|
| **Person** | one | `content/person.ts` | hero, about page, footer contact |
| **World** | three (Design, Games, Music) | `content/worlds.ts` | nav, orbit, `/work` `/games` `/music` |
| **Project** | many | `content/projects/<slug>.ts` | cards, `/<world>/<slug>` |
| **Entry** | endless | on its project (`entries: []`) | the Now strip, the hub, `/log`, project logs |

A world is a practice you'll still have in twenty years. A project is a thing with a
name and a status. An entry is a dated thing that happened to a project.

### Add a project (five minutes)

1. Create `content/projects/<slug>.ts`, export a `Project` (see `content/types.ts`).
2. Import it in `content/projects/index.ts`.
3. Optionally add the slug to its world's `featured` list in `content/worlds.ts` to
   control order. Unlisted projects sort after the featured ones, by name.
4. Drop a hero image in `public/img/p/<slug>.webp` and set `hero`. No image is fine;
   a tonal field stands in.

### Add an entry (one minute)

Add `{ date, title, note?, href? }` to the project's `entries`. Dates are
`YYYY-MM-DD`, `YYYY-MM` or `YYYY`; use the precision you actually know.
The home page, the orbit hub and `/log` update themselves.

### Status vocabulary

`idea · paper · prototype · playable · live · resting · archived`

"Currently building" on the home page is every project with status `prototype` or
`playable`, newest activity first. Retirement is a status, not a deletion.

## Routes

| Route | What |
|-------|------|
| `/` | Who, the three worlds (orbit), what's new, currently building, about |
| `/work` | Design world: the professional front door. No games on it except Light Gray as a creative-world case study. |
| `/games`, `/music` | World pages, grouped by status |
| `/<world>/<slug>` | Project page: line, body, links, gallery, log |
| `/log` | Every entry, newest first, grouped by month |
| `/about` | The person, the timeline, the site's origin story |
| `/archive` | Points at the original acarrozzo.com, kept unedited |

Old prototype routes (`/product-design`, `/starter-box`, `/music-lab`,
`/design-archive`, `/updates`) redirect in `next.config.mjs`.

## Design system

- **Tokens:** `app/globals.css`. One accent in two lightnesses (deep forest `#26694b`
  light, aurora `#63c99a` dark); everything else is color-mixed off it. Both themes,
  system default, toggle in the nav.
- **Type:** Fraunces (display) + Inter (body), via `next/font`. Mono is the system stack.
- **The orbit:** `components/OrbitalNav.tsx`. Three worlds; the hub shows the newest
  entry on the site at rest and the newest entry in a world on hover.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4. No client state beyond the
theme toggle and the orbit hover; every page is static.

## Before launch

- [ ] Move the old PHP site to a subdomain (e.g. `old.acarrozzo.com`) and update
      `archiveUrl` in `content/site.ts`.
- [ ] Point `acarrozzo.com` at this deployment (Vercel recommended; `site.url` is
      already set).
- [ ] Add an OpenGraph image (`app/opengraph-image.png` or per-project heroes).
- [ ] Decide on analytics (none wired; the site is fully static).
- [ ] Real imagery passes: QuickFrame, Tiny Kingdom, Starter Box, Tower Test have
      placeholders today.
