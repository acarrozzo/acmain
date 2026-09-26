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
| **Person** | one | `content/person.ts` | masthead name, editor box, about page |
| **World** | three (Design, Games, Music) | `content/worlds.ts` | nav, world tiles, `/work` `/games` `/music` |
| **Project** | many | `content/projects/<slug>.ts` | capsules, `/<world>/<slug>` |
| **Entry** | endless | on its project (`entries: []`) | the log column, the workshop, `/log`, changelogs |

Plus one editorial list: `content/featured.ts`, the four stories in the home page
carousel.

### Add a project (five minutes)

1. Create `content/projects/<slug>.ts`, export a `Project` (see `content/types.ts`).
   Give it `tags` (two to four words) and, if there is no artwork yet, a `mark`
   (two letters) for the typographic tile. If the name is long, add a `short`
   (two words) for its moon on the home page orbit.
2. Import it in `content/projects/index.ts`.
3. Optionally add the slug to its world's `featured` list in `content/worlds.ts`.
4. Drop a hero image in `public/img/p/<slug>.webp` and set `hero`. Albums set
   `square: true` and a `bar` color.

### Add an entry (one minute)

Add `{ date, title, note?, href?, version? }` to the project's `entries`. Dates are
`YYYY-MM-DD`, `YYYY-MM` or `YYYY`. The home page, the workshop tabs and `/log`
update themselves.

### Status vocabulary

`idea · paper · prototype · playable · live · resting · archived`

Drawn as a growth glyph on every capsule: a dot, a stake, a frame, a house, a lit
house, moss, a plaque. Retirement is a status, not a deletion.

## The front page (Broadsheet + storefront)

- **Masthead**: the name left, the A mark centered, search and
  theme toggle right, a centered section nav under a double rule. Not sticky.
  Hover or focus a world's tab and a small flyout hangs under it with the
  world's site tree: an "All Games" link to the world page, then every
  project as a status glyph and a name (guests from other worlds under a
  hairline). Escape closes it. There is
  no flyout on touch or once the nav wraps; the tab just goes to the world.
  The tree comes from `navItems` in `lib/nav.ts`, so a new project shows up
  on its own.
- **The orbit** (`OrbitalNav`): the opening band. Three world orbs drift clockwise
  around the hub, each with its projects orbiting it as tiny status-coloured moons,
  also clockwise. Hover or focus a world and everything eases to a stop while the
  camera pushes in: the orb grows, the moons spread out and become labelled links
  to the project pages. The hub in the middle shows
  the newest entry on the site, in the hovered world, or on the hovered moon.
  Geometry constants sit at the top of the component; the orbit itself is one
  `requestAnimationFrame` loop that sleeps off-screen and under reduced motion.
  Below `md` it is three cards.
- **Featured & fresh**: an auto-advancing carousel (six seconds an item, play/pause,
  counter, progress bar) from `content/featured.ts`, with side thumbnails.
- **In the workshop**: tabs (Fresh commits, Building, Live, Resting) with a hover
  preview, derived from records.
- **Right column**: the log (eight newest entries), now playing (hand-picked in
  `person.nowPlaying`), about the editor.
- **Worlds, then capsule grids** for Games, Design and Music.

⌘K (or the search pill) opens a command palette that jumps to any page or project.

## Routes

| Route | What |
|-------|------|
| `/` | The front page |
| `/work` | Design: the professional door. Selected work, what I do, elsewhere, contact. |
| `/games`, `/music` | World pages: headline, stats, a featured banner, filter chips, capsules |
| `/<world>/<slug>` | Project page: hero carousel, side rail, about, changelog, more in the world |
| `/log` | Every entry, newest first, grouped by month |
| `/about` | The person, the timeline, the site's origin story |
| `/archive` | Points at the original acarrozzo.com, kept unedited |
| `/system` | Temporary workbench: every token, class, component, record and query, read from the source at build time. Not indexed. Remove when done (`app/system`, `components/system`, `lib/system*.ts`, `lib/routes.ts`, the nav entry, the last block of `globals.css`). |

Old prototype routes redirect in `next.config.mjs`.

## Design system

- **Tokens**: `app/globals.css`. Dark is the default (`ThemeScript` adds `.dark`
  before paint); light is the swapped set. One accent in two lightnesses: aurora
  `#63c99a` dark, forest `#26694b` light.
- **Type**: Fraunces (display), Instrument Sans (UI), JetBrains Mono (dates,
  versions), via `next/font`.
- **The mark**: `public/img/ac-mark.svg`, inlined through `components/Mark.tsx`.
- **Backdrops**: every page has a photo ghosted behind its top (`site.backdrop`:
  the forest in dark, the sky in light). Give a world its own by setting
  `backdrop: { dark, light }` in `content/worlds.ts`; its door and its project
  pages pick it up.
- **Components**: `Capsule`, `StatusChip`, `Tags`, `Featured`, `Workshop`,
  `HeroCarousel`, `FilteredGrid`, `CommandPalette`, `Masthead`, `Footer`.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4. Every page is static. Client
JavaScript is limited to the carousels, the workshop tabs, filters, the palette and
the theme toggle.

## Before launch

- [ ] Move the old PHP site to a subdomain (e.g. `old.acarrozzo.com`) and update
      `archiveUrl` in `content/site.ts`.
- [ ] Point `acarrozzo.com` at this deployment (Vercel recommended; `site.url` is set).
- [ ] Add an OpenGraph image.
- [ ] Decide on analytics (none wired).
- [ ] Real imagery passes: QuickFrame, Tiny Kingdom, Starter Box, Tower Test, and the
      Battle and Party screenshots for Light Gray.
- [ ] Replace the hand-picked now-playing track with a feed from AC Music.
