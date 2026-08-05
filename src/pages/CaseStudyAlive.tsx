import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useLights } from '../hooks/useLights'
import { useReveal } from '../hooks/useReveal'
import { CaseStudyHeader } from './CaseStudyHeader'

/* Alive is a narrative case study, not a dashboard one: the opening is a
   Project Overview paragraph (40% of the viewport) and a subway-style
   Journey Map (60%), both inside the same h-dvh lock the Vasant page uses
   for its own opening sheet — no scrolling needed to read either.

   The two panes split with flex-grow ratios (2:3) rather than fixed
   percentages, so the 40/60 split holds regardless of how tall the header
   ends up at a given viewport width.

   The Journey Map animates itself with one useReveal call: the line
   draws in first (stroke-dashoffset, same 1000-unit convention as the
   .draw-in-line utility elsewhere), then each station fades up in
   sequence — the same staggered-spoke technique OwnershipMatrix's
   diagram uses, just along one axis instead of radiating from a hub. */

type Station = CaseStudy['journey'][number]

function StationDot({ highlight }: { highlight: boolean }): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={`z-10 size-3.5 shrink-0 rounded-full border-2 bg-paper transition-transform duration-300 group-hover:scale-125 ${
        highlight ? 'border-accent-orange ring-4 ring-accent-orange/20' : 'border-ink'
      }`}
    />
  )
}

function StationLabel({ s, side }: { s: Station; side: 'above' | 'below' }): ReactElement {
  return (
    <div className="relative flex flex-col items-center">
      <span
        className={`label max-w-none text-center text-[0.68rem] leading-tight whitespace-nowrap lg:max-w-[4.75rem] lg:text-[0.58rem] lg:whitespace-normal ${
          s.highlight ? 'font-bold text-accent-orange' : 'text-ink-70'
        }`}
      >
        {s.label}
      </span>
      <div
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-20 w-40 -translate-x-1/2 border border-ink-25 bg-paper px-2.5 py-2 text-center text-[0.68rem] leading-snug text-ink-70 opacity-0 shadow-[0_6px_16px_-8px_var(--ink-45)] transition-opacity duration-200 group-hover:opacity-100 ${
          side === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {s.description}
      </div>
    </div>
  )
}

/* Below `lg` (1024px — this site's established desktop cutover, the same
   breakpoint the Project Overview text switches to two columns at) twelve
   nowrap labels can't fit without overlap, so the strip scrolls
   horizontally there instead (a real transit map does the same on a
   phone or tablet). At `lg` and up, labels are given a hard max-width and
   allowed to wrap, so all twelve stations sit at their natural flex share
   with no overlap and no scrolling — the layout this section is meant to
   reach on a normal desktop viewport, which is what the "fits in one
   viewport" brief is actually about. */
function JourneyMap({ stations }: { stations: CaseStudy['journey'] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()

  return (
    <section className="flex min-h-0 flex-col" style={{ flex: '3 1 0%' }}>
      <h2 className="label mb-2 shrink-0 text-ink-45">Journey Map</h2>
      <div
        ref={ref}
        className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden no-scrollbar lg:overflow-x-visible"
      >
        <div className="relative flex h-full min-w-[1180px] items-stretch px-4 lg:min-w-0 lg:px-2">
          <svg
            viewBox="0 0 1000 4"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2"
            aria-hidden="true"
          >
            <line
              x1={0}
              y1={2}
              x2={1000}
              y2={2}
              className="l-thin"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: shown ? 0 : 1000,
                transition: 'stroke-dashoffset 1.2s ease',
              }}
            />
          </svg>

          {stations.map((s, i) => {
            const above = i % 2 === 0
            return (
              <div key={s.label} className="group relative z-10 flex flex-1 flex-col items-center">
                <div
                  className="flex flex-1 items-end justify-center pb-2.5"
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'none' : 'translateY(8px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: shown ? `${i * 75 + 250}ms` : '0ms',
                  }}
                >
                  {above && <StationLabel s={s} side="above" />}
                </div>

                <div
                  style={{
                    opacity: shown ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    transitionDelay: shown ? `${i * 75 + 200}ms` : '0ms',
                  }}
                >
                  <StationDot highlight={s.highlight} />
                </div>

                <div
                  className="flex flex-1 items-start justify-center pt-2.5"
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? 'none' : 'translateY(-8px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: shown ? `${i * 75 + 250}ms` : '0ms',
                  }}
                >
                  {!above && <StationLabel s={s} side="below" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CaseStudyAlive({ data, backHref }: { data: CaseStudy; backHref: string }): ReactElement {
  useLights()

  return (
    <div className="flex h-dvh min-h-[36rem] flex-col bg-paper text-ink">
      <div className="gutter flex min-h-0 flex-1 flex-col overflow-y-auto py-[clamp(0.75rem,2.5vh,1.5rem)]">
        <CaseStudyHeader title={data.title} role={data.role} org={data.org} year={data.year} backHref={backHref} />

        <hr className="my-[clamp(0.75rem,2.5vh,1.25rem)] shrink-0 border-t-2 border-ink" />

        <div className="flex min-h-0 flex-1 flex-col gap-[clamp(1rem,3vh,2rem)]">
          <section className="flex min-h-0 flex-col" style={{ flex: '2 1 0%' }}>
            <h2 className="label mb-2 shrink-0 text-ink-45">Project Overview</h2>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:justify-center">
              <p className="columns-1 gap-x-10 text-[0.92rem] leading-snug text-ink-70 lg:columns-2">
                {data.overview}
              </p>
            </div>
          </section>

          <JourneyMap stations={data.journey} />
        </div>
      </div>
    </div>
  )
}
