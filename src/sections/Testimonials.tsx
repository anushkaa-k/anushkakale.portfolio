import type { ReactElement } from 'react'

import { testimonials } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

export function Testimonials({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal className="grid gap-px border border-ink-45 bg-ink-25 [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]">
        {testimonials.items.map((person, i) => (
          <figure key={person.name} className="flex flex-col gap-4.5 bg-paper p-7">
            <span className="label text-[0.8rem] text-ink-25">
              {String(i + 1).padStart(2, '0')}
            </span>
            <blockquote className="text-[0.95rem] leading-[1.72] text-ink-70">
              &ldquo;{person.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto border-t border-dashed border-ink-25 pt-4.5">
              <b className="block font-display text-[1.1rem]">{person.name}</b>
              <span className="text-[0.82rem] text-ink-45">{person.role}</span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </Sheet>
  )
}
