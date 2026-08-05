import type { ReactElement } from 'react'

/* The one piece of chrome every case study page shares verbatim: the back
   link and the title block. Each page builds its own body below this —
   the shared part is deliberately just the header, not the whole page,
   since the two case studies' opening layouts differ by design. */

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
      <a
        href={backHref}
        className="label inline-flex items-center gap-1.5 text-ink-45 no-underline transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Back to Projects
      </a>
      <h1 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-none font-extrabold tracking-tight uppercase">
        {title}
      </h1>
      <p className="label mt-1.5 text-ink-45">
        {role} <span className="text-ink-25">•</span> {org} <span className="text-ink-25">•</span> {year}
      </p>
    </header>
  )
}
