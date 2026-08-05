import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useLights } from '../hooks/useLights'
import { useReveal } from '../hooks/useReveal'
import { asset } from '../lib/asset'
import { CaseStudyHeader } from './CaseStudyHeader'
import { FromScriptToStage } from './FromScriptToStage'

/* Alive is a narrative case study, not a dashboard one: the opening is a
   Project Overview (40% of the viewport — a short narrative, a photograph,
   and a row of Blueprint Metric spec cards) and a Production Lifecycle map
   (60%), both inside the same h-dvh lock the Vasant page uses for its own
   opening sheet — no scrolling needed to read either.

   The two panes split with flex-grow ratios (2:3) rather than fixed
   percentages, so the 40/60 split holds regardless of how tall the header
   ends up at a given viewport width. */

type Station = CaseStudy['journey'][number]

/* ---- shared drafting chrome ------------------------------------------- */

/** Four small corner ticks — the recurring "this is a drawn plate, not a
    UI card" tell, reused on both the spec cards and the hover callouts. */
function CornerBrackets(): ReactElement {
  const corner = 'pointer-events-none absolute size-1.5 border-ink-25'
  return (
    <>
      <span aria-hidden="true" className={`${corner} top-0 left-0 border-t border-l`} />
      <span aria-hidden="true" className={`${corner} top-0 right-0 border-t border-r`} />
      <span aria-hidden="true" className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden="true" className={`${corner} right-0 bottom-0 border-r border-b`} />
    </>
  )
}

/* ---- Project Overview: Blueprint Metrics ------------------------------- */

function SpecCard({ k, v }: { k: string; v: string }): ReactElement {
  return (
    <div className="group relative border border-ink-25 bg-paper px-2 py-1 transition-[border-color,box-shadow] duration-300 hover:border-ink hover:shadow-[0_0_14px_-7px_var(--accent-orange)]">
      <CornerBrackets />
      <span className="label block truncate text-[0.56rem] text-ink-45">{k}</span>
      <span className="mt-0.5 block truncate font-display text-[0.78rem] leading-tight font-bold">{v}</span>
    </div>
  )
}

/* ---- Production Lifecycle ----------------------------------------------

   The line is a genuine polyline, not a straight rule: each phase group
   sits on its own y-level (PHASE_Y), flat within the phase and jogging on
   the transition between phases — the "engineering routing" the brief
   asks for, rather than a decorative wobble. The levels step upward left
   to right, so the line's own shape tells the story: it rises from the
   competition to the recognition phase.

   Station positions are plain 0–100 fractions used identically as CSS
   left/top percentages (for the HTML nodes and labels) and as SVG viewBox
   units with preserveAspectRatio="none" (for the line) — the same
   coordinate space stretched over the same box, so a station's dot and
   its label always land on the same point regardless of the container's
   actual rendered aspect ratio. This sidesteps the SVG-text-measurement
   pitfalls hit earlier on this page: no text lives inside the SVG here,
   every label is ordinary HTML. */

const PHASE_Y: Record<string, number> = {
  Competition: 80,
  Selection: 63,
  Production: 46,
  Performance: 29,
  Recognition: 14,
}

function stationPoints(stations: CaseStudy['journey']): { x: number; y: number }[] {
  const n = stations.length
  return stations.map((s, i) => ({
    x: 4 + i * (92 / (n - 1)),
    y: PHASE_Y[s.phase] ?? 50,
  }))
}

function phaseGroups(stations: CaseStudy['journey']): { phase: string; count: number }[] {
  const groups: { phase: string; count: number }[] = []
  for (const s of stations) {
    const last = groups[groups.length - 1]
    if (last && last.phase === s.phase) last.count += 1
    else groups.push({ phase: s.phase, count: 1 })
  }
  return groups
}

function StationNode({ highlight }: { highlight: boolean }): ReactElement {
  if (highlight) {
    return (
      <span
        aria-hidden="true"
        className="relative z-10 flex size-5 items-center justify-center rounded-full border-2 border-accent-orange bg-paper ring-4 ring-accent-orange/25 transition-transform duration-300 group-hover:scale-110"
      >
        <span className="size-2 rounded-full bg-accent-orange" />
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className="relative z-10 block size-2.5 rotate-45 border-[1.5px] border-ink bg-paper transition-transform duration-300 group-hover:scale-125"
    />
  )
}

function StationLabel({ s, side }: { s: Station; side: 'above' | 'below' }): ReactElement {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${side === 'above' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'}`}
    >
      <span
        className={`label block max-w-none text-center whitespace-nowrap lg:max-w-[4.75rem] lg:text-[0.58rem] lg:whitespace-normal ${
          s.highlight ? 'font-bold text-accent-orange' : 'text-ink-70'
        }`}
      >
        {s.label}
      </span>

      {/* Blueprint annotation callout — thin border, corner ticks, muted
          orange title repeating the station name, one or two sentences.
          Stacks one step further out than the label (never covering it),
          fades up on hover rather than snapping in. */}
      <div
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-30 w-44 -translate-x-1/2 border border-ink-25 bg-paper p-2.5 text-left opacity-0 shadow-[0_10px_22px_-10px_var(--ink-45)] transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 ${
          side === 'above'
            ? 'bottom-full mb-2 translate-y-1 group-hover:translate-y-0'
            : 'top-full mt-2 -translate-y-1 group-hover:translate-y-0'
        }`}
      >
        <CornerBrackets />
        <span className="label block text-accent-orange">{s.label}</span>
        <p className="mt-1 text-[0.68rem] leading-snug text-ink-70">{s.description}</p>
      </div>
    </div>
  )
}

/* Below `lg` (1024px — this site's established desktop cutover) twelve
   nowrap labels can't fit without overlap, so the strip scrolls
   horizontally there instead, same as a real transit map on a phone or
   tablet. At `lg` and up, labels get a capped width and wrap, sitting at
   their natural share with no overlap and no scrolling. */
function ProductionLifecycle({ stations }: { stations: CaseStudy['journey'] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const points = stationPoints(stations)
  const groups = phaseGroups(stations)
  const highlightIndex = stations.findIndex((s) => s.highlight)

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  const tail = (() => {
    const a = points[points.length - 2]
    const b = points[points.length - 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    return { x: b.x + (dx / len) * 6, y: b.y + (dy / len) * 6 }
  })()

  const boldSegment =
    highlightIndex > 0 && highlightIndex < points.length - 1
      ? `M${points[highlightIndex - 1].x.toFixed(2)},${points[highlightIndex - 1].y.toFixed(2)} L${points[highlightIndex].x.toFixed(2)},${points[highlightIndex].y.toFixed(2)} L${points[highlightIndex + 1].x.toFixed(2)},${points[highlightIndex + 1].y.toFixed(2)}`
      : null

  return (
    <section className="flex min-h-0 flex-col" style={{ flex: '3 1 0%' }}>
      <h2 className="label mb-2 shrink-0 text-ink-45">Production Lifecycle</h2>

      <div
        ref={ref}
        className="flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-visible no-scrollbar lg:overflow-x-visible"
      >
        <div className="relative min-w-[1400px] flex-1 lg:min-w-0">
          {/* The viewBox is stretched non-uniformly (preserveAspectRatio="none"
              onto a container many times wider than it is tall), so every
              stroked element needs vector-effect="non-scaling-stroke" —
              without it, a diagonal segment's stroke gets scaled up along
              with the x-axis and renders many times too thick (caught
              visually during verification: the line rendered as a bold
              ribbon instead of a thin one). The "draws left to right"
              reveal is a clip-path sweep (0 → full width, in the same x
              units as the stations) rather than a stroke-dasharray — a
              dasharray's length is also subject to that same anisotropic
              scaling and would need a separate screen-space length
              calculation; a clip rect growing in plain user-space x needs
              none of that, and reveals the bold interchange segment and
              the tail/arrow in sequence for free, just by sweeping past
              their x position. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="lifecycle-sweep" clipPathUnits="userSpaceOnUse">
                <rect x={0} y={-20} width={shown ? 104 : 0} height={140} style={{ transition: 'width 1.5s ease' }} />
              </clipPath>
            </defs>
            <g clipPath="url(#lifecycle-sweep)">
              <path d={d} className="l-thin" vectorEffect="non-scaling-stroke" style={{ fill: 'none' }} />
              {boldSegment && (
                <path
                  d={boldSegment}
                  className="l-med"
                  vectorEffect="non-scaling-stroke"
                  style={{ fill: 'none' }}
                />
              )}
              <line
                x1={points[points.length - 1].x}
                y1={points[points.length - 1].y}
                x2={tail.x}
                y2={tail.y}
                className="l-hidden"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={tail.x}
                y1={tail.y}
                x2={tail.x - 2.6}
                y2={tail.y + 1}
                className="l-thin"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: 'var(--accent-orange)' }}
              />
              <line
                x1={tail.x}
                y1={tail.y}
                x2={tail.x - 1}
                y2={tail.y + 3}
                className="l-thin"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: 'var(--accent-orange)' }}
              />
            </g>
          </svg>

          {stations.map((s, i) => (
            <div
              key={s.label}
              className="group absolute z-10"
              style={{
                left: `${points[i].x}%`,
                top: `${points[i].y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: shown ? 1 : 0,
                transition: 'opacity 0.4s ease',
                transitionDelay: shown ? `${i * 90 + 300}ms` : '0ms',
              }}
            >
              <StationNode highlight={!!s.highlight} />
              <StationLabel s={s} side={i % 2 === 0 ? 'above' : 'below'} />
            </div>
          ))}
        </div>

        {/* Phase brackets — a quiet ruler beneath the map, not a second
            headline: a thin top rule broken into ticks at each phase
            boundary, with the phase name centred under its own span of
            stations. Navigation aid only. */}
        <div className="flex min-w-[1400px] shrink-0 pt-2 lg:min-w-0">
          {groups.map((g, gi) => (
            <div
              key={`${g.phase}-${gi}`}
              className={`border-t border-ink-25 px-1 pt-1.5 text-center ${gi > 0 ? 'border-l' : ''}`}
              style={{ flexGrow: g.count, flexBasis: 0 }}
            >
              <span className="label text-[0.56rem] text-ink-25">{g.phase}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CaseStudyAlive({ data, backHref }: { data: CaseStudy; backHref: string }): ReactElement {
  useLights()
  const [photoFailed, setPhotoFailed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const photoOk = !!data.poster && !photoFailed

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  return (
    <>
      <div className="flex h-dvh min-h-[36rem] flex-col bg-paper text-ink">
        <div className="gutter flex min-h-0 flex-1 flex-col overflow-y-auto py-[clamp(0.75rem,2.5vh,1.5rem)]">
          <CaseStudyHeader title={data.title} role={data.role} org={data.org} year={data.year} backHref={backHref} />

          <hr className="my-[clamp(0.75rem,2.5vh,1.25rem)] shrink-0 border-t-2 border-ink" />

          <div className="flex min-h-0 flex-1 flex-col gap-[clamp(1rem,3vh,2rem)]">
            <section className="flex min-h-0 flex-col" style={{ flex: '2 1 0%' }}>
              <h2 className="label mb-2 shrink-0 text-ink-45">Project Overview</h2>
              <div className="grid min-h-0 flex-1 gap-x-8 gap-y-4 lg:grid-cols-[3fr_2fr]">
                <div className="flex min-h-0 flex-col overflow-y-auto">
                  <p className="max-w-[42rem] text-[0.82rem] leading-snug text-ink-70">{data.overview}</p>

                  <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">
                    {data.metrics.map((m) => (
                      <SpecCard key={m.k} k={m.k} v={m.v} />
                    ))}
                  </div>
                </div>

                <div className="relative hidden min-h-0 lg:block">
                  {photoOk ? (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      aria-label={`Open the ${data.title} production photograph`}
                      className="group relative block h-full w-full cursor-pointer border border-ink-25 bg-paper-warm p-2 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-2 left-1/2 z-10 size-2.5 -translate-x-1/2 rounded-full border border-ink-45 bg-paper shadow-[0_1px_2px_var(--ink-25)]"
                      />
                      <img
                        src={asset(data.poster!.src)}
                        alt={data.poster!.alt}
                        onError={() => setPhotoFailed(true)}
                        className="h-full w-full object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-3 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <span className="label text-paper">Click to Enlarge</span>
                      </span>
                    </button>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 border border-dashed border-ink-25 bg-paper-warm text-center">
                      <span className="label text-ink-25">Photo Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <ProductionLifecycle stations={data.journey} />
          </div>
        </div>
      </div>

      <div className="gutter bg-paper pb-[clamp(3rem,6vw,5rem)] text-ink">
        <FromScriptToStage pillars={data.pillars} />
      </div>

      {lightboxOpen && photoOk && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={data.poster!.alt}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[min(90vw,36rem)] border-4 border-paper bg-paper p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <img
              src={asset(data.poster!.src)}
              alt={data.poster!.alt}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="label mt-2 flex items-center justify-between gap-4 px-1 py-1 text-ink-70">
              <span className="truncate">{data.poster!.alt}</span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="shrink-0 cursor-pointer border border-ink-25 px-2.5 py-1 text-ink-70 transition-colors hover:border-redline hover:text-ink"
              >
                Close ✕
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
