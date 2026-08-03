import type { ReactElement } from 'react'

import { site } from '../content'

/* The pull-quote band. Renders nothing if `quote` is absent from site.yaml. */

export function Interlude(): ReactElement | null {
  const quote = site.quote
  if (!quote) return null

  return (
    <aside className="gutter border-y-2 border-ink bg-paper-warm py-[clamp(3rem,7vw,5rem)] text-center">
      <blockquote>
        <p className="mx-auto max-w-[22ch] font-display text-[clamp(1.5rem,4vw,2.6rem)] leading-tight font-bold italic">
          {quote.text}
        </p>
        <cite className="label mt-5 block text-ink-45 not-italic">— {quote.author}</cite>
      </blockquote>
    </aside>
  )
}
