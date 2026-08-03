import type { ReactElement } from 'react'

import { experience } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

/* A run of show: one vertical line, a marker per role. */

export function Experience({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal>
        <ol className="relative pl-10 before:absolute before:top-2.5 before:bottom-2.5 before:left-2 before:border-l before:border-ink-45">
          {experience.items.map((role) => (
            <li
              key={`${role.org}-${role.title}`}
              className="relative pb-10 last:pb-0 before:absolute before:top-2 before:-left-[2.18rem] before:size-2.5 before:rotate-45 before:border before:border-ink before:bg-paper"
            >
              <span className="label mb-1.5 block text-ink-45">{role.period}</span>
              <h3 className="font-display text-[1.4rem] leading-tight font-bold">
                {role.title}
              </h3>
              <p className="mb-3 text-[0.9rem] text-ink-70">{role.org}</p>
              <ul className="max-w-[60ch]">
                {role.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-baseline gap-2.5 py-0.5 text-[0.95rem] text-ink-70"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[-0.35em] h-px w-3.5 shrink-0 bg-ink-25"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>
    </Sheet>
  )
}
