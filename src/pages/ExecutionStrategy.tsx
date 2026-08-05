import { Fragment, useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { LanternRun, Note, Truss } from '../lib/draft'

/* Five modules, each a 60/40 row: the operational objective and a "how it
   was executed" checklist on the left, a supporting artifact on the right.
   The artifacts are hand-built rather than photographed — a run-of-show
   grid, a rider, an allocation sheet, a hospitality timeline, a journey
   diagram — because the real documents aren't digitised for the site, and
   a built diagram that's honest about being schematic beats a stand-in
   photo that isn't actually the artifact it claims to be.

   Each row's line-draw and fade-up both come from one <Reveal>: the
   drawn divider above the row and the row's own content share the same
   `.reveal[data-in="true"]` trigger, so nothing needs its own scroll
   listener — see the `draw-in-line` rule in index.css, the same mechanism
   Banner.tsx's sheet dividers use. */

function ModuleDivider({ index, title }: { index: number; title: string }): ReactElement {
  return (
    <>
      <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="h-1 w-full" aria-hidden="true">
        <line x1={0} y1={2} x2={1000} y2={2} className="l-thin draw-in-line" />
      </svg>
      <div className="mt-3 mb-6 flex items-baseline gap-3">
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-45" />
        <span className="label text-ink-45">Module {String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[1.05rem] font-bold">{title}</h3>
      </div>
    </>
  )
}

function ArtifactCard({ title, onOpen, children }: { title: string; onOpen: () => void; children: ReactElement }): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open the ${title} artifact`}
      className="group relative block h-full w-full cursor-pointer border border-ink-25 bg-paper-warm p-3 pt-4 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
    >
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-1/2 z-10 size-2.5 -translate-x-1/2 rounded-full border border-ink-45 bg-paper shadow-[0_1px_2px_var(--ink-25)]"
      />
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-2.5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        <span className="label text-paper">Click to Enlarge</span>
      </span>
    </button>
  )
}

/* ---- the five artifacts ---------------------------------------------- */

const VENUES = ['Venue A', 'Venue B', 'Venue C', 'Venue D']
const DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4']
const ACTIVE_DAYS: Record<number, number[]> = { 0: [0, 1], 1: [1, 2], 2: [0, 3], 3: [2, 3] }

function ProductionScheduleArtifact(): ReactElement {
  return (
    <div className="border border-ink-25">
      <div className="label border-b border-ink-25 bg-paper px-2 py-1.5 text-ink-45">Run of Show — Not to Scale</div>
      <div className="grid grid-cols-[4.5rem_repeat(4,1fr)] text-center">
        <div className="border-r border-b border-ink-25 bg-paper" />
        {DAYS.map((day) => (
          <div key={day} className="label border-r border-b border-ink-25 bg-paper py-1.5 text-ink-45 last:border-r-0">
            {day}
          </div>
        ))}
        {VENUES.map((venue, vi) => (
          <Fragment key={venue}>
            <div className="label border-r border-b border-ink-25 bg-paper px-2 py-2.5 text-left text-ink-45 last:border-b-0">
              {venue}
            </div>
            {DAYS.map((_, di) => (
              <div
                key={di}
                className={`border-r border-b border-ink-25 py-2.5 last:border-r-0 ${
                  ACTIVE_DAYS[vi].includes(di)
                    ? 'bg-[repeating-linear-gradient(45deg,transparent_0_5px,var(--ink-12)_5px_6px)]'
                    : ''
                }`}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function TechnicalRiderArtifact(): ReactElement {
  const x = 30
  const y = 34
  const length = 340
  const depth = 20
  return (
    <div>
      <svg
        viewBox="0 0 400 110"
        className="h-auto w-full"
        role="img"
        aria-label="Technical rider: a lighting position spanning the venue"
      >
        <Truss x={x} y={y} length={length} depth={depth} bays={8} />
        <LanternRun x={x} y={y + depth} length={length} count={5} types={['profile', 'fresnel', 'par']} scale={0.85} />
        <Note x={x + length} y={y - 10} anchor="end" size={10} tone="dim">
          LX 1
        </Note>
      </svg>
      <div className="border-t border-dashed border-ink-25 px-1 pt-3 pb-1">
        <span className="label text-ink-45">Equipment</span>
        <p className="mt-1 font-mono text-[0.72rem] leading-relaxed text-ink-70">
          4× Profile · 3× Fresnel · 4× PAR · FOH Mix Position · DMX Distro
        </p>
      </div>
    </div>
  )
}

const VOLUNTEER_ROWS = [
  { zone: 'Front of House', shift: 'Morning', count: 6 },
  { zone: 'Backstage', shift: 'Evening', count: 8 },
  { zone: 'Box Office', shift: 'All Day', count: 4 },
  { zone: 'Artist Liaison', shift: 'Evening', count: 5 },
  { zone: 'Technical Support', shift: 'All Day', count: 7 },
]

function VolunteerAllocationArtifact(): ReactElement {
  const total = VOLUNTEER_ROWS.reduce((sum, row) => sum + row.count, 0)
  return (
    <div className="border border-ink-25">
      <div className="label flex items-center gap-2 border-b border-ink-25 bg-paper px-2 py-1.5 text-ink-45">
        Volunteer Allocation
        <span className="ml-auto text-ink-25">{total} Total</span>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="label text-ink-45">
            <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Zone</th>
            <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Shift</th>
            <th className="border-b border-ink-25 px-2 py-1.5 text-right font-medium">Count</th>
          </tr>
        </thead>
        <tbody>
          {VOLUNTEER_ROWS.map((row) => (
            <tr key={row.zone} className="border-b border-dashed border-ink-25 last:border-b-0">
              <td className="px-2 py-2 text-[0.78rem] text-ink-70">{row.zone}</td>
              <td className="px-2 py-2 text-[0.78rem] text-ink-70">{row.shift}</td>
              <td className="px-2 py-2 text-right font-display text-[0.85rem] font-bold">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const HOSPITALITY_STOPS = [
  { label: 'Green Room Ready', time: 'T-90 min' },
  { label: 'Artist Arrival', time: 'T-75 min' },
  { label: 'Sound Check', time: 'T-45 min' },
  { label: 'Meal Service', time: 'T-30 min' },
  { label: 'Places Call', time: 'T-5 min' },
  { label: 'Curtain', time: 'T-0' },
]

function HospitalityScheduleArtifact(): ReactElement {
  return (
    <div className="border border-ink-25 bg-paper p-4">
      <span className="label text-ink-45">Hospitality Timeline</span>
      <ol className="mt-3 border-l-2 border-ink-25 pl-4">
        {HOSPITALITY_STOPS.map((stop) => (
          <li key={stop.label} className="relative pb-3.5 last:pb-0">
            <span aria-hidden="true" className="absolute top-1 -left-[1.19rem] size-2 rotate-45 border border-ink bg-paper" />
            <span className="block font-display text-[0.82rem] leading-tight font-bold">{stop.label}</span>
            <span className="label text-ink-45">{stop.time}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const JOURNEY_STEPS = ['Arrival', 'Ticketing', 'Seating', 'Performance', 'Interval', 'Exit']

function AudienceJourneyArtifact(): ReactElement {
  const y = 55
  const step = 110
  const nodes = JOURNEY_STEPS.map((label, i) => ({ label, x: 45 + i * step }))

  return (
    <svg
      viewBox="0 0 640 130"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the audience journey from arrival through to exit"
    >
      {nodes.slice(0, -1).map((n, i) => (
        <line
          key={`link-${n.label}`}
          x1={n.x}
          y1={y}
          x2={nodes[i + 1].x}
          y2={y}
          className="l-thin draw-in-line"
        />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={y} r={5} className="l-med fill-paper" />
          <Note x={n.x} y={y + 22} size={10.5}>
            {n.label}
          </Note>
        </g>
      ))}
    </svg>
  )
}

const ARTIFACTS: (() => ReactElement)[] = [
  ProductionScheduleArtifact,
  TechnicalRiderArtifact,
  VolunteerAllocationArtifact,
  HospitalityScheduleArtifact,
  AudienceJourneyArtifact,
]

const ARTIFACT_TITLES = [
  'Run of Show',
  'Technical Rider',
  'Volunteer Allocation Sheet',
  'Hospitality Timeline',
  'Audience Journey Diagram',
]

export function ExecutionStrategy({ execution }: { execution: CaseStudy['execution'] }): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex])

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Execution Strategy</h2>
        <span className="label ml-auto text-ink-45">Operations Playbook</span>
      </div>

      {execution.map((mod, i) => {
        const Artifact = ARTIFACTS[i]
        if (!Artifact) return null

        return (
          <Reveal key={mod.module} className="mb-14 last:mb-0">
            <ModuleDivider index={i} title={mod.module} />

            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[3fr_2fr]">
              <div>
                <span className="label mb-2 block text-ink-45">Operational Objective</span>
                <p className="mb-4 text-[0.92rem] leading-snug text-ink-70">{mod.objective}</p>

                <span className="label mb-2 block text-ink-45">How It Was Executed</span>
                <ul>
                  {mod.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 py-1">
                      <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 border border-ink-25" />
                      <span className="text-[0.85rem] leading-snug text-ink-70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ArtifactCard title={ARTIFACT_TITLES[i]} onOpen={() => setOpenIndex(i)}>
                <Artifact />
              </ArtifactCard>
            </div>
          </Reveal>
        )
      })}

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${ARTIFACT_TITLES[openIndex]}, enlarged`}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-[min(90vw,38rem)] overflow-y-auto border-4 border-paper bg-paper p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="label text-ink-70">{ARTIFACT_TITLES[openIndex]}</span>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="shrink-0 cursor-pointer border border-ink-25 px-2.5 py-1 text-ink-70 transition-colors hover:border-redline hover:text-ink"
              >
                Close ✕
              </button>
            </div>
            <div className="mx-auto max-w-[30rem]">
              {(() => {
                const Artifact = ARTIFACTS[openIndex]
                return <Artifact />
              })()}
            </div>
          </figure>
        </div>
      )}
    </section>
  )
}
