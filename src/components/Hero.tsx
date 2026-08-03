import { Fragment, type ReactElement } from 'react'

import { sections, site } from '../content'
import { Banner } from '../drawings/Banner'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { asset, isExternal } from '../lib/asset'

/* The banner: her name set into the middle of a drawing sheet, the way a
   title sits inside the border of a real drawing.

   The drawing leaves an empty band across its middle for the title; a soft
   radial paper wash on top only takes the edge off whatever strays into it,
   feathered over a wide radius, so the linework keeps running underneath
   rather than being cut away. */

/** A `#section` anchor is used as-is; anything else is a /public path. */
function ctaHref(href: string): string {
  return href.startsWith('#') || isExternal(href) ? href : asset(href)
}

export function Hero(): ReactElement {
  const compact = useMediaQuery('(max-width: 767px)')
  const first = sections[0]?.id ?? 'about'
  const nameLines = site.meta.headline.split('|')
  const taglineLines = site.hero.tagline.split('|')
  const { stats, cta } = site.hero

  return (
    <section
      id="top"
      className={`gutter relative grid place-items-center overflow-hidden border-b border-ink-25 pt-12 pb-28 ${
        compact ? 'min-h-[42rem]' : 'min-h-[clamp(32rem,44vw,42rem)]'
      }`}
    >
      <Banner compact={compact} />

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[44rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 md:h-[52rem] md:w-[68rem] [background:radial-gradient(ellipse_at_center,var(--paper)_0%,var(--paper)_40%,color-mix(in_srgb,var(--paper)_92%,transparent)_55%,color-mix(in_srgb,var(--paper)_75%,transparent)_70%,color-mix(in_srgb,var(--paper)_45%,transparent)_82%,color-mix(in_srgb,var(--paper)_15%,transparent)_93%,transparent_100%)]"
        />

        <div className="relative text-center">
          <p className="lift label text-ink-70" style={{ animationDelay: '0.3s' }}>
            {site.meta.location}
          </p>

          <hr className="rule lift mt-5" style={{ animationDelay: '0.36s' }} />

          <h1
            className="lift mt-3 font-display text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[1.02] font-extrabold tracking-tight"
            style={{ animationDelay: '0.45s' }}
          >
            {nameLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>

          <p
            className="lift mt-2 font-display text-[clamp(1.15rem,2.6vw,1.7rem)] leading-[1.25] font-bold text-ink-70"
            style={{ animationDelay: '0.52s' }}
          >
            {taglineLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>

          <hr className="rule lift mt-5" style={{ animationDelay: '0.58s' }} />

          <p
            className="lift mx-auto mt-4 max-w-[36ch] text-[0.95rem] leading-[1.75] text-ink-70"
            style={{ animationDelay: '0.64s' }}
          >
            {site.meta.standfirst}
          </p>

          {stats.length > 0 && (
            <dl
              className="lift mx-auto mt-7 grid max-w-[26rem] grid-cols-2 gap-x-6 gap-y-4 md:flex md:max-w-none md:flex-wrap md:items-start md:justify-center md:gap-x-7 md:gap-y-4"
              style={{ animationDelay: '0.68s' }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.k}
                  className="md:border-l md:border-ink-25 md:px-5 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
                >
                  <dt className="label text-[0.58rem] text-ink-45">{stat.k}</dt>
                  <dd className="mt-1 font-display text-[1.2rem] font-bold leading-none">
                    {stat.v}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div
            className="lift mt-18 flex flex-wrap items-center justify-center gap-3.5"
            style={{ animationDelay: '0.76s' }}
          >
            <a
              href={ctaHref(cta.primary.href)}
              className="label border-2 border-ink px-6 py-2.5 whitespace-nowrap text-ink no-underline transition-colors hover:bg-ink hover:text-paper"
            >
              {cta.primary.label}
            </a>

            {cta.secondary && (
              <a
                href={ctaHref(cta.secondary.href)}
                {...(isExternal(cta.secondary.href)
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="label border border-ink-25 px-6 py-2.5 whitespace-nowrap text-ink-70 no-underline transition-colors hover:border-ink-45 hover:text-ink"
              >
                {cta.secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>

      <a
        href={`#${first}`}
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 no-underline"
      >
        <span className="label text-ink-45">Scroll</span>
        <span className="relative h-11 w-px bg-ink-25">
          <span className="absolute -left-[3px] bottom-0 border-x-[3.5px] border-t-[6px] border-x-transparent border-t-ink-45" />
        </span>
      </a>
    </section>
  )
}
