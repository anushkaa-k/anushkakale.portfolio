import { Fragment, type ReactElement } from 'react'

import { sections, site } from '../content'
import { Banner } from '../drawings/Banner'
import { useMediaQuery } from '../hooks/useMediaQuery'

/* The banner: her name set into the middle of a drawing sheet, the way a
   title sits inside the border of a real drawing.

   The drawing leaves an empty band across its middle for the title; a soft
   paper wash on top only takes the edge off whatever strays into it, so the
   linework still appears to run underneath rather than being cut away. */

export function Hero(): ReactElement {
  const compact = useMediaQuery('(max-width: 767px)')
  const first = sections[0]?.id ?? 'about'
  const lines = site.meta.headline.split('|')

  return (
    <section
      id="top"
      className={`gutter relative grid place-items-center overflow-hidden border-b border-ink-25 pt-12 pb-18 ${
        compact ? 'min-h-[38rem]' : 'min-h-[clamp(30rem,44vw,42rem)]'
      }`}
    >
      <Banner compact={compact} />

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-[26%] -inset-y-[20%] [background:radial-gradient(ellipse_at_center,var(--paper)_0%,color-mix(in_srgb,var(--paper)_82%,transparent)_46%,transparent_78%)]"
        />

        <div className="relative max-w-[40ch] text-center">
          <p
            className="lift label flex flex-wrap items-center justify-center gap-3 text-ink-70"
            style={{ animationDelay: '0.3s' }}
          >
            <span>{site.meta.role}</span>
            <i aria-hidden="true" className="text-[0.5rem] not-italic text-redline">
              ◆
            </i>
            <span>{site.meta.location}</span>
          </p>

          <hr className="rule lift mt-6" style={{ animationDelay: '0.36s' }} />

          <h1
            className="lift my-2 font-display text-[clamp(2.9rem,8vw,5.6rem)] leading-[0.98] font-extrabold tracking-tight"
            style={{ animationDelay: '0.45s' }}
          >
            {lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>

          <hr className="rule lift" style={{ animationDelay: '0.54s' }} />

          <p
            className="lift label mt-5 text-[0.66rem] leading-[1.9] text-ink-70"
            style={{ animationDelay: '0.6s' }}
          >
            {site.meta.standfirst}
          </p>
        </div>
      </div>

      <a
        href={`#${first}`}
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 h-11 w-px -translate-x-1/2 bg-ink-25"
      >
        <span className="absolute -left-[3px] bottom-0 border-x-[3.5px] border-t-[6px] border-x-transparent border-t-ink-45" />
      </a>
    </section>
  )
}
