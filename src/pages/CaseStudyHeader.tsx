import type { ReactElement } from 'react'

import { sections } from '../content'

/* The one piece of chrome every case study page shares verbatim: the back
   link, a link back to the main page's sections, and the title block.
   Each page builds its own body below this — the shared part is
   deliberately just the header, not the whole page, since the two case
   studies' opening layouts differ by design.

   The section nav mirrors the main page's Masthead nav (same labels, same
   link styling) so it reads as the same navigation bar, just without the
   scroll-spy active state — these pages have no `#about`/`#skills`/etc.
   sections of their own to spy on, only the main page does. */

export function CaseStudyHeader({
  title,
  role,
  org,
  year,
  backHref,
}: {
  title: string
  role: string
  org: string
  year: string
  backHref: string
}): ReactElement {
  return (
    <header className="shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <a
          href={backHref}
          className="label inline-flex items-center gap-1.5 text-ink-45 no-underline transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Back to Projects
        </a>

        <nav aria-label="Sections">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`${import.meta.env.BASE_URL}#${s.id}`}
                  className="label border-b border-transparent pb-0.5 text-[0.68rem] text-ink-70 no-underline transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <h1 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-none font-extrabold tracking-tight uppercase">
        {title}
      </h1>
      <p className="label mt-1.5 text-ink-45">
        {role} <span className="text-ink-25">•</span> {org} <span className="text-ink-25">•</span> {year}
      </p>
    </header>
  )
}
