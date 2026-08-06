import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useReveal } from '../hooks/useReveal'
import { LanternRun, Note, Truss } from '../lib/draft'

/* Five bands, read top to bottom as one continuous operations playbook
   rather than five disconnected write-ups: a thin spine runs down the
   left edge on desktop, threading every band's number marker into one
   line. Text and diagram alternate sides band to band (odd bands mirror
   via `lg:flex-row-reverse`) so the row reads as rhythm, not repetition.

   One shared `useReveal()` on the outer wrapper drives all five bands'
   entrance, staggered per band via inline transition-delay — the same
   pattern OperationsMap.tsx uses next door, so the two sheets read as one
   family rather than two different animation systems.

   The whole sheet targets one desktop viewport (`lg:h-dvh`, `lg:`-only
   for the same reason as the rest of this case study: five bands of
   text-plus-diagram have no graceful way to compress into a phone
   screen, so mobile flows in ordinary document order instead). Five
   bands of prose, checklist and a hand-drawn artifact each is dense
   enough that a very short window may still need its internal
   `overflow-y-auto` safety net — the same trade-off the opening sheet in
   CaseStudy.tsx makes — but nothing here is designed to need it at a
   normal desktop height. */

/* ---- five miniature blueprint artifacts -------------------------------- */

/* All five share one wide, short viewBox — roughly the aspect ratio a
   half-width band actually renders at — so a node timeline has enough
   run between stops for a two-word label without colliding into its
   neighbour, and the artifact stays shallow rather than growing tall
   inside a wide column. */

const PLAN_STEPS = ['Load-In', 'Tech', 'Rehearsal', 'Doors', 'Curtain']

function ProductionPlanningArtifact(): ReactElement {
  const y = 50
  const x0 = 40
  const step = 98
  const nodes = PLAN_STEPS.map((label, i) => ({ label, x: x0 + i * step }))
  const last = nodes[nodes.length - 1]!

  return (
    <svg
      viewBox="0 0 480 84"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the production schedule planned backward from a fixed curtain time"
    >
      <Note x={x0} y={14} anchor="start" size={8.5} tone="dim">
        PLANNED BACKWARD FROM CURTAIN
      </Note>
      <line x1={x0 - 2} y1={23} x2={last.x} y2={23} className="l-hair" />
      <polygon points={`${x0 - 2},23 ${x0 + 5},19 ${x0 + 5},27`} className="fill-ink" />
      <line x1={x0} y1={y} x2={last.x} y2={y} className="l-thin" />
      {nodes.map((n, i) => {
        const isLast = i === nodes.length - 1
        return (
          <g key={n.label}>
            {isLast ? (
              <rect x={n.x - 4.5} y={y - 4.5} width={9} height={9} className="l-bold fill-paper" />
            ) : (
              <circle cx={n.x} cy={y} r={3.2} className="l-med fill-paper" />
            )}
            <Note x={n.x} y={y + 19} size={9}>
              {n.label}
            </Note>
          </g>
        )
      })}
    </svg>
  )
}

const CUES = ['SQ1', 'SQ2', 'SQ3', 'SQ4']

function TechnicalOperationsArtifact(): ReactElement {
  const x = 18
  const y = 16
  const length = 444
  const depth = 13
  const cy = 68
  const cx0 = 66
  const cstep = 116

  return (
    <svg
      viewBox="0 0 480 84"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the lighting rig above the stage and the cue sequence run during the show"
    >
      <Truss x={x} y={y} length={length} depth={depth} bays={9} />
      <LanternRun x={x} y={y + depth} length={length} count={5} types={['profile', 'fresnel', 'par']} scale={0.6} />
      {CUES.map((c, i) => {
        const cx = cx0 + i * cstep
        return (
          <g key={c}>
            {i > 0 && <line x1={cx - cstep + 10} y1={cy} x2={cx - 10} y2={cy} className="l-hair" />}
            <rect x={cx - 10} y={cy - 7} width={20} height={14} className="l-thin fill-paper" />
            <Note x={cx} y={cy + 3} size={8.5}>
              {c}
            </Note>
          </g>
        )
      })}
    </svg>
  )
}

const VENUES4 = ['Venue A', 'Venue B', 'Venue C', 'Venue D']
const SHIFTS = ['AM', 'PM', 'Eve']
const DEPLOYMENT = [
  [2, 3, 4],
  [3, 0, 5],
  [0, 4, 3],
  [2, 2, 0],
]

function VolunteerManagementArtifact(): ReactElement {
  const cellW = 92
  const cellH = 17
  const x0 = 112
  const y0 = 14

  return (
    <svg
      viewBox="0 0 480 84"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: volunteer deployment matrix across four venues and three shifts"
    >
      {SHIFTS.map((s, ci) => (
        <Note key={s} x={x0 + ci * cellW + (cellW - 6) / 2} y={y0 - 3} size={8.5} tone="dim">
          {s}
        </Note>
      ))}
      {VENUES4.map((v, ri) => (
        <g key={v}>
          <Note x={x0 - 10} y={y0 + ri * cellH + 13} anchor="end" size={8.5}>
            {v}
          </Note>
          {SHIFTS.map((_, ci) => {
            const cx = x0 + ci * cellW
            const cy = y0 + ri * cellH
            const n = DEPLOYMENT[ri]![ci]!
            return (
              <g key={ci}>
                <rect x={cx} y={cy} width={cellW - 6} height={cellH - 3} className="l-hair fill-paper" />
                {n > 0 && (
                  <Note x={cx + (cellW - 6) / 2} y={cy + (cellH - 3) / 2 + 3} size={8.8}>
                    {String(n)}
                  </Note>
                )}
              </g>
            )
          })}
        </g>
      ))}
    </svg>
  )
}

const HOSPITALITY_STOPS = [
  { label: 'Arrival', time: 'T-75' },
  { label: 'Green Room', time: 'T-60' },
  { label: 'Sound Check', time: 'T-45' },
  { label: 'Meal', time: 'T-30' },
  { label: 'Places', time: 'T-5' },
]

function HospitalityArtifact(): ReactElement {
  const y = 48
  const x0 = 30
  const step = 104
  const nodes = HOSPITALITY_STOPS.map((s, i) => ({ ...s, x: x0 + i * step }))
  const last = nodes[nodes.length - 1]!

  return (
    <svg
      viewBox="0 0 480 84"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the artist call-time sequence counting down to places"
    >
      <line x1={x0} y1={y} x2={last.x} y2={y} className="l-thin" />
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={y} r={3.2} className="l-med fill-paper" />
          <Note x={n.x} y={y - 12} size={8} tone="dim">
            {n.time}
          </Note>
          <Note x={n.x} y={y + 18} size={9}>
            {n.label}
          </Note>
        </g>
      ))}
    </svg>
  )
}

const JOURNEY_STEPS = ['Arrival', 'Entry Check', 'Seating', 'Show', 'Exit']

function AudienceExperienceArtifact(): ReactElement {
  const y = 46
  const x0 = 30
  const step = 104
  const nodes = JOURNEY_STEPS.map((label, i) => ({ label, x: x0 + i * step }))
  const last = nodes[nodes.length - 1]!

  return (
    <svg
      viewBox="0 0 480 78"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the audience journey from arrival through to exit, with a checkpoint at each stage"
    >
      <line x1={x0} y1={y} x2={last.x} y2={y} className="l-thin" />
      {nodes.map((n) => (
        <g key={n.label}>
          <line x1={n.x} y1={y - 6} x2={n.x} y2={y + 6} className="l-med" />
          <Note x={n.x} y={y + 20} size={9}>
            {n.label}
          </Note>
        </g>
      ))}
    </svg>
  )
}

const ARTIFACTS: (() => ReactElement)[] = [
  ProductionPlanningArtifact,
  TechnicalOperationsArtifact,
  VolunteerManagementArtifact,
  HospitalityArtifact,
  AudienceExperienceArtifact,
]

const ARTIFACT_TITLES = [
  'Reverse-Planned Timeline',
  'Cue Flow & Rig',
  'Deployment Matrix',
  'Call-Time Sequence',
  'Visitor Journey',
]

/* ---- one band ----------------------------------------------------------- */

function Band({
  index,
  mod,
  shown,
}: {
  index: number
  mod: CaseStudy['execution'][number]
  shown: boolean
}): ReactElement {
  const Artifact = ARTIFACTS[index]!
  const reversed = index % 2 === 1

  return (
    <div
      className="relative"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        transitionDelay: shown ? `${index * 130}ms` : '0ms',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 left-0 z-10 hidden size-2.5 -translate-x-1/2 rotate-45 border border-ink bg-paper lg:block"
      />
      <div
        className={`flex flex-col gap-3 pl-0 lg:flex-row lg:items-center lg:gap-8 lg:pl-7 ${
          reversed ? 'lg:flex-row-reverse' : ''
        }`}
      >
        <div className="lg:w-1/2">
          <div className="mb-0.5 flex items-baseline gap-2">
            <span className="label text-ink-45">Stage {String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-[0.86rem] font-bold">{mod.module}</h3>
          </div>
          <p className="mb-1 text-[0.72rem] leading-tight text-ink-70">{mod.objective}</p>
          <ul className="mb-1">
            {mod.checklist.map((item) => (
              <li key={item} className="flex items-start gap-1.5 py-px">
                <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 border border-ink-25" />
                <span className="text-[0.68rem] leading-tight text-ink-70">{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-l-2 border-accent-orange pl-2.5">
            <span className="label text-accent-orange">Key Decision</span>
            <p className="mt-0.5 text-[0.68rem] leading-tight font-medium text-ink">{mod.keyDecision}</p>
          </div>
        </div>

        <div className="group border border-ink-25 bg-paper-warm p-2 transition-[border-color,box-shadow] duration-300 lg:w-1/2 hover:border-accent-orange hover:shadow-[0_0_16px_-8px_var(--accent-orange)]">
          <span className="label mb-1 block text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
            {ARTIFACT_TITLES[index]}
          </span>
          <Artifact />
        </div>
      </div>
    </div>
  )
}

/* ---- assembled sheet ------------------------------------------------------ */

export function ExecutionStrategy({ execution }: { execution: CaseStudy['execution'] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  if (execution.length === 0) return <></>

  return (
    <div ref={ref} className="flex flex-col bg-paper text-ink lg:h-dvh lg:min-h-[40rem]">
      <div className="gutter flex min-h-0 flex-1 flex-col overflow-y-auto py-[clamp(1.25rem,3.5vh,2.25rem)]">
        <div className="mb-3 flex shrink-0 items-baseline gap-3 border-b-2 border-ink pb-2">
          <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
          <h2 className="font-display text-[clamp(1.05rem,1.9vw,1.3rem)] font-bold">Execution Strategy</h2>
          <span className="label ml-auto text-ink-45">Operations Playbook</span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col gap-2.5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 hidden w-px bg-ink-25 lg:block"
          />
          {execution.map((mod, i) => (
            <Band key={mod.module} index={i} mod={mod} shown={shown} />
          ))}
        </div>
      </div>
    </div>
  )
}
