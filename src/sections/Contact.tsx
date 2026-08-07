import { useState, type ReactElement } from 'react'

import { contact, sections, site } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { useReveal } from '../hooks/useReveal'
import { asset, isExternal } from '../lib/asset'

/* Drawn as the title block of a real sheet: who drew it, at what status,
   which revision — with every way of reaching her alongside, and a close-out
   stamp below standing in for "THE END" without ever spelling it out.

   The card fades in as one piece (the shared .reveal treatment, applied by
   hand here rather than through <Reveal> so the same trigger can also
   stagger the title-block fields in behind it — one useReveal, two
   choreographed effects, the same pattern Experience.tsx uses for its
   timeline. */

export function Contact({ meta }: { meta: SectionMeta }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [copied, setCopied] = useState(false)

  const fields: [string, string][] = [
    ['Status', contact.block.status],
    ['Discipline', contact.block.discipline],
    ['Location', site.meta.location],
    ['Drawn by', contact.block.drawn],
    ['Revision', contact.block.revision],
    ['Last updated', contact.block.updated],
  ]

  const copyEmail = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // row still shows the address in full, so it can be copied by hand.
    }
  }

  return (
    <Sheet meta={meta}>
      <p className="mb-6 max-w-[24ch] font-display text-[clamp(1.2rem,2.2vw,1.6rem)] leading-tight">
        {contact.lead}
      </p>

      <div ref={ref} data-in={shown} className="reveal grid border-2 border-ink md:grid-cols-[1.5fr_1fr]">
        <ul className="bg-paper py-1">
          {contact.links.map((link) => {
            const isEmail = link.href.startsWith('mailto:')
            const external = isExternal(link.href)
            /* Only a link that opens a new tab gets the arrow — an email
               row copies instead of navigating, so the mark would be a
               lie there too. */
            const opensAway = !isEmail && link.href.startsWith('http')

            const inner = (
              <>
                <b className="label w-20 shrink-0 text-[0.62rem] text-ink-45">{link.label}</b>
                <span className="relative inline-block font-display text-[1.02rem] break-words">
                  {isEmail && copied ? 'Copied to clipboard' : link.value}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-ink transition-[width] duration-300 ease-out group-hover:w-full"
                  />
                </span>
                {opensAway && (
                  <span
                    aria-hidden="true"
                    className="ml-auto text-ink-25 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                )}
                {isEmail && (
                  <span
                    aria-hidden="true"
                    className={`label ml-auto shrink-0 text-[0.6rem] transition-colors duration-300 ${copied ? 'text-accent-orange' : 'text-ink-25 group-hover:text-ink-45'}`}
                  >
                    {copied ? '✓' : 'Copy'}
                  </span>
                )}
              </>
            )

            return (
              <li key={link.label} className="border-t border-dashed border-ink-25 first:border-t-0">
                {isEmail ? (
                  <button
                    type="button"
                    onClick={() => copyEmail(link.value)}
                    className="group flex w-full flex-wrap items-baseline gap-x-4 gap-y-1 px-6 py-2.5 text-left transition-[background-color,padding] hover:bg-paper-warm hover:pl-7"
                  >
                    {inner}
                  </button>
                ) : (
                  <a
                    href={external ? link.href : asset(link.href)}
                    {...(opensAway ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 px-6 py-2.5 no-underline transition-[background-color,padding] hover:bg-paper-warm hover:pl-7"
                  >
                    {inner}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <dl className="grid grid-cols-2 border-ink bg-paper-warm max-md:border-t-2 md:border-l-2">
          {fields.map(([term, value], i) => {
            const long = value.length > 18
            return (
              <div
                key={term}
                className={`border-r border-b border-ink-25 px-4 py-2 ${long ? 'col-span-2' : ''}`}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: shown ? `${300 + i * 90}ms` : '0ms',
                }}
              >
                <dt className="label text-[0.58rem] text-ink-45">{term}</dt>
                <dd className="mt-0.5 font-mono text-[0.84rem]">{value}</dd>
              </div>
            )
          })}
        </dl>
      </div>

      {contact.note && <p className="label mt-3 leading-[1.7] text-ink-45">{contact.note}</p>}

      <Reveal className="mt-6">
        <hr className="border-t-2 border-ink" />
        <div className="label mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-ink-45">
          <span>End of Drawings</span>
          <span className="text-ink-25">
            Sheet {meta.sheet} of {String(sections.length).padStart(2, '0')}
          </span>
          <span className="text-ink-25">Final Issue</span>
          <span className="inline-flex items-center gap-1.5 border border-ink-25 px-2 py-1 text-ink-70">
            <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 border border-ink-45" />
            Approved
          </span>
        </div>
      </Reveal>
    </Sheet>
  )
}
