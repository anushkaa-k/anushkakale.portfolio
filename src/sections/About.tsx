import type { ReactElement } from 'react'

import { about } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { AboutDetail } from '../drawings/AboutDetail'

export function About({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.65fr)_minmax(15rem,0.85fr)]">
        <div>
          <p className="mb-7 max-w-[58ch] font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight">
            {about.lead}
          </p>

          {about.body.map((paragraph, i) => (
            <p key={i} className="mt-5 max-w-[58ch] first:mt-0">
              {paragraph}
            </p>
          ))}

          {about.approach && (
            <div className="mt-9 border-t border-dashed border-ink-25 pt-7">
              <h3 className="label mb-4 text-ink-45">{about.approach.label}</h3>
              <ul className="grid items-start gap-x-5 gap-y-6 xl:grid-cols-3">
                {about.approach.items.map((item) => (
                  <li key={item.k}>
                    <p className="truncate font-display text-[1.02rem] font-bold">{item.k}</p>
                    <p className="mt-1.5 line-clamp-2 min-h-[2.5em] text-[0.86rem] leading-snug text-ink-70">
                      {item.v}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {about.owns && (
            <div className="mt-9 border-t border-dashed border-ink-25 pt-7">
              <h3 className="label mb-3.5 block text-ink-45">{about.owns.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {about.owns.items.map((item) => (
                  <li
                    key={item}
                    className="border border-ink-25 px-3 py-1.5 font-mono text-[0.78rem] text-ink-70 transition-colors hover:border-ink-45 hover:bg-paper-warm hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {about.status && (
            <p className="mt-9 max-w-[58ch] font-mono text-[0.78rem] tracking-wide text-ink-45">
              {about.status}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <aside className="border border-ink-45 bg-paper-warm">
            <div className="label border-b border-ink-45 bg-[repeating-linear-gradient(45deg,transparent_0_5px,var(--ink-12)_5px_6px)] px-3.5 py-2.5 text-ink-70">
              At a glance
            </div>
            <dl>
              {about.facts.map((fact) => (
                <div
                  key={fact.k}
                  className="flex flex-col-reverse gap-0.5 border-b border-dashed border-ink-25 px-3.5 py-3.5 last:border-b-0"
                >
                  <dt className="label text-[0.6rem] text-ink-45">{fact.k}</dt>
                  <dd className="font-display text-[1.65rem] leading-none font-bold">
                    {fact.v}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="mt-6 aspect-[3/4] lg:aspect-auto lg:min-h-[9rem] lg:flex-1">
            <AboutDetail className="h-full w-full" />
          </div>
        </div>
      </Reveal>
    </Sheet>
  )
}
