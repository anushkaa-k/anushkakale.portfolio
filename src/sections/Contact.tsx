import type { ReactElement } from 'react'

import { contact, site } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { asset, isExternal } from '../lib/asset'

/* Drawn as the title block of a real sheet: who drew it, at what scale,
   which revision — with every way of reaching her alongside. */

const today = new Date()
  .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  .toUpperCase()

export function Contact({ meta }: { meta: SectionMeta }): ReactElement {
  const fields: [string, string][] = [
    ['Drawn by', contact.block.drawn],
    ['Discipline', contact.block.discipline],
    ['Location', site.meta.location],
    ['Scale', contact.block.scale],
    ['Revision', contact.block.revision],
    ['Date', today],
  ]

  return (
    <Sheet meta={meta}>
      <p className="mb-10 max-w-[24ch] font-display text-[clamp(1.35rem,2.5vw,1.85rem)] leading-tight">
        {contact.lead}
      </p>

      <Reveal className="grid border-2 border-ink md:grid-cols-[1.5fr_1fr]">
        <ul className="py-1.5">
          {contact.links.map((link) => {
            const external = isExternal(link.href)
            /* Only a link that opens a new tab gets the arrow — an email or
               phone link stays in place, so the mark would be a lie. */
            const opensAway = link.href.startsWith('http')
            return (
              <li key={link.label} className="border-t border-dashed border-ink-25 first:border-t-0">
                <a
                  href={external ? link.href : asset(link.href)}
                  {...(opensAway ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-baseline gap-4 px-6 py-3.5 no-underline transition-[background-color,padding] hover:bg-paper-warm hover:pl-8"
                >
                  <b className="label w-24 shrink-0 text-[0.64rem] text-ink-45">{link.label}</b>
                  <span className="font-display text-[1.12rem] break-words">{link.value}</span>
                  {opensAway && (
                    <span aria-hidden="true" className="ml-auto text-ink-25">
                      ↗
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <dl className="grid grid-cols-2 border-ink bg-paper-warm max-md:border-t-2 md:border-l-2">
          {fields.map(([term, value]) => (
            <div key={term} className="border-r border-b border-ink-25 px-4 py-3">
              <dt className="label text-[0.58rem] text-ink-45">{term}</dt>
              <dd className="mt-1 font-mono text-[0.9rem]">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {contact.note && <p className="label mt-5 leading-[1.9] text-ink-45">{contact.note}</p>}
    </Sheet>
  )
}
