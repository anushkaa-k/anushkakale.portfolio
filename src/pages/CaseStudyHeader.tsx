import type { ReactElement } from 'react'

import type { Mode } from '../hooks/useLights'

/* The chrome every case study page shares verbatim, split in two:

   CaseStudyNav is the sticky top bar (back link, House Lights toggle,
   section nav) — rendered as a plain sibling before the page's own
   viewport-locked opening sheet, exactly where Masthead sits on the main
   page, so `sticky top-0` pins it across the whole page's scroll rather
   than being scoped to just the opening sheet's own overflow container
   (any ancestor with a non-visible `overflow` — including the opening
   sheet's `overflow-y-auto` — would otherwise cap how far a sticky
   descendant can travel).

   CaseStudyHeader is just the title block (title, role/org/year), which
   stays inline inside each page's own opening layout as before — only
   the nav needed to freeze, not the title.

   The section nav mirrors the main page's Masthead nav (same link
   styling), but points at this page's own in-page anchors, passed in per
   page since Vasant and Alive have different sections. There's no
   scroll-spy active state here — that's a main-page-only affordance. */

export function CaseStudyNav({
  backHref,
  sections,
  mode,
  onToggle,
}: {
  backHref: string
  sections: { id: string; label: string }[]
  mode: Mode
  onToggle: () => void
}): ReactElement {
  return (
    <header className="gutter sticky top-0 z-50 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-ink-25 bg-paper/90 py-3 backdrop-blur-md">
      <a
        href={backHref}
        className="label inline-flex items-center gap-1.5 text-ink-45 no-underline transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Back to Projects
      </a>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={mode === 'blueprint'}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 border border-ink-25 px-2.5 py-1.5 text-ink-70 transition-colors hover:border-ink-45 hover:text-ink"
      >
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full border border-current ${
            mode === 'blueprint' ? 'bg-transparent' : 'bg-redline shadow-[0_0_0_3px_rgb(164_64_42/0.22)]'
          }`}
        />
        <span className="label">{mode === 'blueprint' ? 'House Lights' : 'Lights Out'}</span>
      </button>

      <nav aria-label="Sections on this page" className="ml-auto">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="label border-b border-transparent pb-0.5 text-[0.68rem] text-ink-70 no-underline transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function CaseStudyHeader({
  title,
  role,
  org,
  year,
}: {
  title: string
  role: string
  org: string
  year: string
}): ReactElement {
  return (
    <header className="shrink-0">
      <h1 className="font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-none font-extrabold tracking-tight uppercase">
        {title}
      </h1>
      <p className="label mt-1.5 text-ink-45">
        {role} <span className="text-ink-25">•</span> {org} <span className="text-ink-25">•</span> {year}
      </p>
    </header>
  )
}
