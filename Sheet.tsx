import type { ReactElement, ReactNode } from 'react'

import type { SectionMeta } from '../content'
import { useReveal } from '../hooks/useReveal'

/* ==========================================================================
   The furniture every sheet shares: a numbered header rule, and a body that
   fades in the first time it is scrolled past.
   ========================================================================== */

export function SheetHead({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <header className="mb-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b-2 border-ink pb-4">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 self-center rotate-45 border border-ink"
      />
      <span className="label text-ink-70">
        Sheet <b className="font-semibold text-ink">{meta.sheet}</b>
      </span>
      <h2 className="font-display text-[clamp(1.8rem,4vw,2.9rem)] leading-none font-bold">
        {meta.title}
      </h2>
      <span className="label ml-auto text-ink-45">{meta.scale}</span>
    </header>
  )
}

export function Sheet({
  meta,
  children,
}: {
  meta: SectionMeta
  children: ReactNode
}): ReactElement {
  return (
    <section id={meta.id} className="gutter py-[clamp(3.5rem,8vw,6rem)]">
      <SheetHead meta={meta} />
      {children}
    </section>
  )
}

/** Wraps a block so it fades up when it first comes into view. */
export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-in={shown} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
