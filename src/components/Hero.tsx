import { Fragment, useEffect, useRef, useState, type ReactElement, type RefObject } from 'react'

import { sections, site, type Pair } from '../content'
import { Banner } from '../drawings/Banner'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { asset, isExternal } from '../lib/asset'

/* The banner: her name set into the middle of a drawing sheet, the way a
   title sits inside the border of a real drawing.

   The drawing leaves an empty band across its middle for the title; a soft
   paper wash on top only takes the edge off whatever strays into it, so the
   linework keeps running underneath rather than being cut away. The wash
   spans the sheet and fades in gradually from both edges (`.hero-wash`).
   It is anchored by its top edge and runs off the bottom, so the offset
   below is what sets where it starts clearing the truss elevation.

   The heading, subhead, stats and CTAs already fade-and-slide in on load
   via `.lift` (staggered by `animationDelay` below) — that piece existed
   before this pass. What's new here is the drawing itself answering back:
   the sheet's datum line draws itself in (`.hero-draw-in`, in Banner.tsx),
   the stage lights hold an extremely soft breathing pulse, the truss
   takes a slow scanning pass every ~9s, the whole plate drifts a few
   pixels with the cursor, and the stat figures count up rather than just
   appearing. Every one of those is opt-out under `prefers-reduced-motion`
   — see the media query at the bottom of index.css. */

/** A `#section` anchor is used as-is; anything else is a /public path. */
function ctaHref(href: string): string {
  return href.startsWith('#') || isExternal(href) ? href : asset(href)
}

/* A figure like "100+" or "₹50L+" counts up from zero once on load,
   holding its non-numeric prefix/suffix fixed throughout. Reduced-motion
   skips straight to the final value. */
function StatValue({ value }: { value: string }): ReactElement {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value)
      return
    }

    const match = value.match(/^(\D*)(\d[\d,]*)(\D*)$/)
    if (!match) {
      setDisplay(value)
      return
    }
    const [, prefix, digits, suffix] = match
    const target = parseInt(digits.replace(/,/g, ''), 10)
    setDisplay(`${prefix}0${suffix}`)

    let raf = 0
    const startDelay = window.setTimeout(() => {
      const duration = 1300
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`)
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 680)

    return () => {
      window.clearTimeout(startDelay)
      cancelAnimationFrame(raf)
    }
  }, [value, reducedMotion])

  return <>{display}</>
}

function Stat({ stat }: { stat: Pair }): ReactElement {
  return (
    <div className="md:border-l md:border-ink-25 md:px-5 md:first:border-l-0 md:first:pl-0 md:last:pr-0">
      <dt className="label text-[0.58rem] text-ink-45">{stat.k}</dt>
      <dd className="mt-1 font-display text-[1.2rem] font-bold leading-none">
        <StatValue value={stat.v} />
      </dd>
    </div>
  )
}

/* A few pixels of drift toward the cursor — the drawing sheet answering
   to the room rather than sitting inert. Off entirely under reduced
   motion, and simply never fires on a touch device (no mousemove to
   listen for). */
function useParallaxDrift(ref: RefObject<HTMLElement | null>): { x: number; y: number } {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [drift, setDrift] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node || reducedMotion) return

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setDrift({ x: px * 10, y: py * 6 })
    }
    const onLeave = () => setDrift({ x: 0, y: 0 })

    node.addEventListener('mousemove', onMove)
    node.addEventListener('mouseleave', onLeave)
    return () => {
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, reducedMotion])

  return drift
}

export function Hero(): ReactElement {
  const compact = useMediaQuery('(max-width: 767px)')
  const sectionRef = useRef<HTMLElement>(null)
  const drift = useParallaxDrift(sectionRef)
  const first = sections[0]?.id ?? 'about'
  const nameLines = site.meta.headline.split('|')
  const taglineLines = site.hero.tagline.split('|')
  const { stats, cta } = site.hero

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`gutter relative grid place-items-center overflow-hidden border-b border-ink-25 pt-12 pb-28 ${
        compact ? 'min-h-[42rem]' : 'min-h-[clamp(32rem,44vw,42rem)]'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          transform: `translate3d(${drift.x}px, ${drift.y}px, 0)`,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        <Banner compact={compact} />
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="hero-wash pointer-events-none absolute top-1/2 left-1/2 h-[60rem] w-screen -translate-x-1/2 -translate-y-[19rem] md:-translate-y-[22rem]"
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
                <Stat key={stat.k} stat={stat} />
              ))}
            </dl>
          )}

          <div
            className="lift mt-9 flex flex-wrap items-center justify-center gap-3.5"
            style={{ animationDelay: '0.76s' }}
          >
            <a
              href={ctaHref(cta.primary.href)}
              className="label border-2 border-ink px-6 py-2.5 whitespace-nowrap text-ink no-underline transition-[background-color,color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper hover:shadow-[0_14px_28px_-16px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
            >
              {cta.primary.label}
            </a>

            {cta.secondary && (
              <a
                href={ctaHref(cta.secondary.href)}
                {...(isExternal(cta.secondary.href)
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="label border border-ink-25 px-6 py-2.5 whitespace-nowrap text-ink-70 no-underline transition-[color,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-ink-45 hover:text-ink hover:shadow-[0_14px_28px_-16px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
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
