import type { ReactElement } from 'react'

import { about } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { AboutDetail } from '../drawings/AboutDetail'

/* Tailwind's class scanner needs each delay class written out literally
   somewhere in this file — a runtime-computed arbitrary value like
   `[transition-delay:${n}ms]` never resolves to a class it can find, so the
   stagger for the body paragraphs is picked from this fixed list instead. */
const STAGGER = ['delay-0', 'delay-75', 'delay-150', 'delay-200', 'delay-300']

export function About({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.65fr)_minmax(15rem,0.85fr)]">
        <div>
          <Reveal className="max-w-[63ch]">
            <p className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)] leading-tight">
              {about.lead}
            </p>
          </Reveal>

          {about.body.map((paragraph, i) => (
            <Reveal
              key={i}
              className={`mt-5 max-w-[58ch] ${STAGGER[Math.min(i + 1, STAGGER.length - 1)]}`}
            >
              <p>{paragraph}</p>
            </Reveal>
          ))}

          {about.owns && (
            <Reveal className="mt-9 border-t border-dashed border-ink-25 pt-7 [transition-delay:120ms]">
              <h3 className="label mb-3.5 text-ink-45">{about.owns.label}</h3>
              <ul className="grid grid-cols-2 gap-px border border-ink-25 bg-ink-25 lg:grid-cols-4">
                {about.owns.items.map((item) => (
                  <li
                    key={item}
                    className="bg-paper px-4 py-3 font-mono text-[0.78rem] text-ink-70 transition-colors hover:bg-paper-warm hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {about.status && (
            <Reveal className="mt-6 max-w-[58ch] [transition-delay:160ms]">
              <p className="font-mono text-[0.78rem] tracking-wide text-ink-45">
                {about.status}
              </p>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col">
          <Reveal>
            <aside className="border border-ink-45 bg-paper-warm">
              <div className="label border-b border-ink-45 bg-[repeating-linear-gradient(45deg,transparent_0_5px,var(--ink-12)_5px_6px)] px-3.5 py-2.5 text-center text-ink-70">
                At a glance
              </div>
              <dl className="grid grid-cols-2">
                {about.facts.map((fact, i) => {
                  const rows = Math.ceil(about.facts.length / 2)
                  const lastCol = i % 2 === 1
                  const lastRow = i >= (rows - 1) * 2
                  return (
                    <div
                      key={fact.k}
                      className={`group flex flex-col-reverse gap-0.5 border-dashed border-ink-25 px-3.5 py-4 transition-colors duration-300 hover:bg-paper ${
                        lastCol ? '' : 'border-r'
                      } ${lastRow ? '' : 'border-b'}`}
                    >
                      <dt className="label text-[0.6rem] text-ink-45">{fact.k}</dt>
                      <dd className="font-display text-[1.55rem] leading-none font-bold transition-colors duration-300 group-hover:text-accent-orange">
                        {fact.v}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </aside>
          </Reveal>

          <Reveal className="mt-6 hidden aspect-[3/4] md:block lg:aspect-auto lg:min-h-[9rem] lg:flex-1 [transition-delay:130ms]">
            <AboutDetail className="h-full w-full" />
          </Reveal>
        </div>
      </div>
    </Sheet>
  )
}
