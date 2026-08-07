import { useState, type ReactElement } from 'react'

import { testimonials } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { Crosshair, DimH } from '../lib/draft'

/* Each testimonial reads as an archived show report rather than a plain
   quote: a report number and a "Verified" stamp in the header, the quote
   itself cropped to a few lines with a Read More toggle, and a name/role
   block styled as a sign-off. Cards are independent (their own border,
   generous gap between them) rather than the shared-divider plate grid
   used elsewhere on the site — these are meant to feel like separate
   filed reports, not one continuous sheet.

   Collapsed height is a fixed max-height, the same for every card, so the
   grid stays level regardless of quote length; expanding one card only
   grows that card (`items-start` keeps the row from stretching the rest
   to match). Hover is plain CSS — nothing here needs to reach into a
   sibling element, unlike the Experience timeline. */

export function Testimonials({ meta }: { meta: SectionMeta }): ReactElement {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const toggle = (i: number) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))

  return (
    <Sheet meta={meta}>
      <div className="relative">
        <svg
          viewBox="0 0 1600 400"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <g style={{ opacity: 0.08 }}>
            <Crosshair x={50} y={40} size={10} />
            <Crosshair x={1550} y={360} size={10} />
            <DimH x1={120} x2={520} y={24} from={24} label={`24'-0"`} size={9} />
            <DimH x1={1080} x2={1480} y={376} from={376} below label={`18'-6"`} size={9} />
          </g>
        </svg>

        <Reveal className="relative grid items-start gap-8 [grid-template-columns:repeat(auto-fit,minmax(19rem,1fr))]">
          {testimonials.items.map((person, i) => {
            const isExpanded = !!expanded[i]

            return (
              <article
                key={person.name}
                className="group relative flex flex-col border border-ink-25 bg-paper p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_14px_28px_-14px_var(--ink-25),0_0_22px_-8px_var(--accent-orange)]"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="label text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
                    Report {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="label border border-ink-25 px-1.5 py-0.5 text-ink-45">Verified</span>
                </div>

                <div className="relative mb-6 flex-1">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 -left-1 font-display text-[5.5rem] leading-none text-ink select-none"
                    style={{ opacity: 0.07 }}
                  >
                    &ldquo;
                  </span>
                  <div
                    className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
                    style={{ maxHeight: isExpanded ? '40rem' : '5rem' }}
                  >
                    <blockquote className="relative pl-5 text-[0.97rem] leading-[1.7] text-ink">
                      &ldquo;{person.quote}&rdquo;
                    </blockquote>
                    {!isExpanded && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-paper to-transparent" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="label mt-2 inline-flex items-center gap-1.5 text-ink-45 transition-colors hover:text-accent-orange"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                    <span
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`}
                    >
                      →
                    </span>
                  </button>
                </div>

                <figcaption className="mt-auto border-t border-dashed border-ink-25 pt-4.5">
                  <b className="block font-display text-[1.3rem] font-bold transition-colors duration-300 group-hover:text-accent-orange">
                    {person.name}
                  </b>
                  <span className="text-[0.8rem] text-ink-45">{person.role}</span>
                </figcaption>
              </article>
            )
          })}
        </Reveal>
      </div>
    </Sheet>
  )
}
