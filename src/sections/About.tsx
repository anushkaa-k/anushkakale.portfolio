import type { ReactElement } from 'react'

import { about } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

export function About({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.65fr)_minmax(15rem,0.85fr)]">
        <div>
          <p className="mb-6 font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight">
            {about.lead}
          </p>

          {about.body.map((paragraph, i) => (
            <p key={i} className="mt-4 max-w-[60ch] first:mt-0">
              {paragraph}
            </p>
          ))}

          {about.owns && (
            <div className="mt-8 border-t border-dashed border-ink-25 pt-6">
              <span className="label mb-3.5 block text-ink-45">{about.owns.label}</span>
              <ul className="flex flex-wrap gap-2">
                {about.owns.items.map((item) => (
                  <li
                    key={item}
                    className="border border-ink-25 px-3 py-1.5 font-mono text-[0.78rem] text-ink-70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="self-start border border-ink-45 bg-paper-warm">
          <div className="label border-b border-ink-45 bg-[repeating-linear-gradient(45deg,transparent_0_5px,var(--ink-12)_5px_6px)] px-3.5 py-2.5 text-ink-70">
            At a glance
          </div>
          <dl>
            {about.facts.map((fact) => (
              <div
                key={fact.k}
                className="grid gap-0.5 border-b border-dashed border-ink-25 px-3.5 py-3 last:border-b-0"
              >
                <dt className="label text-[0.6rem] text-ink-45">{fact.k}</dt>
                <dd className="font-display text-[1.15rem]">{fact.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Reveal>
    </Sheet>
  )
}
