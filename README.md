# Anushka Kale — Production Manager

A portfolio site built like a theatre working drawing: navy ink on cream paper,
every section a numbered sheet, all of it drawn in flat 2D — plans, elevations
and sections, never perspective.

React · TypeScript · Tailwind CSS · Vite. No CMS, no database, no backend.

---

## Editing the site

**All the words live in the `content/` folder.** They are plain text files.
You never need to touch any code to change what the site says.

| File | What it controls |
| --- | --- |
| `content/site.yaml` | Name, role, headline, the order of the page, the pull-quote, the footer |
| `content/about.yaml` | Sheet 01 — the opening line, the paragraphs, the "At a glance" panel |
| `content/projects.yaml` | Sheet 02 — one card per project, with its figures |
| `content/skills.yaml` | Sheet 03 — the skill columns |
| `content/experience.yaml` | Sheet 04 — the roles, newest first |
| `content/testimonials.yaml` | Sheet 05 — the quotes |
| `content/gallery.yaml` | Sheet 06 — the photographs |
| `content/contact.yaml` | Sheet 07 — every way of getting in touch |

### The easiest way to make a change

1. Open the file on GitHub.
2. Click the pencil icon (**Edit this file**).
3. Change the words.
4. Click **Commit changes** at the bottom.

The site rebuilds and redeploys itself within a minute or so.

### Four rules

- Keep the words to the **left** of a colon exactly as they are. Change the
  words to the **right** freely.
- Keep the indentation. Spaces only — never tabs.
- If a line contains a colon, or starts with a symbol like `@`, wrap the whole
  value in `"double quotes"`.
- To add another project, role or quote, copy an existing block from its `-`
  down to its last line, paste it underneath, and edit the copy.

Every file has comments at the top explaining exactly what it does.

### Things that look after themselves

- **Sheet numbers.** Reorder the `sections:` list in `site.yaml` and the page
  reorders, the navigation follows, and the sheets renumber. Nothing is
  numbered by hand.
- **Empty sections.** A section with nothing in it disappears completely —
  from the page *and* from the navigation. That is why the Gallery is not
  showing yet.
- **Typos in the YAML.** If a file is edited into an invalid state the site
  says which file and which field, rather than rendering a blank section.

### Adding the photographs

1. Put the image files into `public/img/`.
2. Uncomment the example lines in `content/gallery.yaml` and change the
   filenames to match.

A photo listed but missing from `public/img/` quietly drops itself out, so a
typo can never leave a broken image on the page.

### Adding the resume

1. Put the PDF at `public/Anushka_Kale_Resume.pdf`.
2. Remove the `# ` marks from the last three lines of `content/contact.yaml`.

It ships switched off so the site never has a download link that leads nowhere.

---

## Running it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server with hot reload |
| `npm run build` | Type-check, then build into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run typecheck` | Types only |
| `npm run lint` | Lint |

---

## Deploying

The repository is set up for **Vercel**, which detects Vite automatically:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Nothing else to configure. Every push redeploys, which is what makes editing a
YAML file on GitHub enough to update the live site.

To serve from a sub-path instead (a GitHub Pages project site, for example),
set `BASE_PATH` at build time:

```bash
BASE_PATH=/musical-waffle/ npm run build
```

---

## How it is put together

```
content/              every word on the site — see above
public/
  img/                gallery photographs
  favicon.svg
src/
  content/
    schema.ts         the shape of the YAML, and the types inferred from it
    index.ts          loads, validates and exports the content
  lib/
    draft.tsx         the drafting kit — trusses, lanterns, seating, dimensions
    asset.ts          resolves files in /public against the deploy path
  drawings/
    Banner.tsx        the hero drawing sheet, composed from the drafting kit
  components/         masthead, hero, shared sheet furniture
  sections/           one component per sheet
  hooks/              house lights, scroll spy, reveal-on-scroll, media query
  index.css           design tokens, line weights, the two colour modes
plugins/
  yaml.ts             build-time YAML loader
```

### The drafting kit

`src/lib/draft.tsx` is why the site looks coherent. Rather than hand-drawn SVG
scattered through the components, there is one set of drawing primitives —
`Truss`, `Lantern`, `SeatingFan`, `RakeSection`, `DimH`, `DimV`, `Crosshair`,
`Hatch`, `Tree` — and every drawing is composed from them.

Line weight is a **class**, never an inline attribute:

```
l-construct   faint setting-out lines
l-hair        hairline detail
l-thin        general linework
l-med         primary object outlines
l-bold        cut lines and section profiles
l-center      dash-dot centreline
```

Changing one of those rules in `index.css` re-weights every drawing on the site
at once.

### The two modes

The **House Lights** switch in the header swaps between the working drawing
(navy on cream) and the same sheet with the lights out — a cyanotype, pale on
navy. Both modes are one set of CSS custom properties; every component and every
line weight follows automatically, so there is no second theme to maintain. The
choice is remembered between visits.

### Responsiveness

The banner is a 2000 × 960 sheet. On a phone it does not shrink — it **crops**
to its centre column and drops the outer drawings, so a small screen gets a
legible drawing rather than the whole sheet reduced to noise.

---

## Accessibility

Semantic landmarks and headings, a skip link, visible focus rings, `aria-current`
on the active navigation item, real alt text on photographs, and full support for
`prefers-reduced-motion` — which disables every animation and reveal.
