import { useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { Note } from '../lib/draft'

/* The closing section reads as a post-project operations review, not a
   fourth retelling of execution tasks: three decisions, each its own
   bordered card at roughly a third of the page, Challenge → Decision →
   Impact. Artist Hospitality is deliberately absent — it already has a
   card in Execution Strategy, and repeating it here would dilute the
   "decisions that mattered" framing this section is going for.

   Each card owns its hover state (rather than a CSS-only :hover) so one
   `hovered` boolean can drive the card's lift and border, the metric's
   colour, and the supporting diagram's accent all at once — the same
   JS-driven hover pattern OperationsMap.tsx uses for its connector
   lines, chosen here for the same reason: an SVG's `stroke`/`fill`
   needs a real colour swap, not just an opacity fade, and inline style
   keeps that swap out of a specificity fight with the `.l-*` line-weight
   classes. Each diagram animates exactly one thing on hover — the
   buffer windows, the flow arrows, the cue sequence — staggered by a
   few dozen milliseconds per element so it reads as a small chase
   rather than everything flipping colour at once. */

/* ---- Decision 1: shared run-of-show, buffer windows animate ------------- */

const VENUES = ['Venue A', 'Venue B', 'Venue C', 'Venue D']

function SchedulingArtifact({ hovered }: { hovered: boolean }): ReactElement {
  const trackX1 = 92
  const trackX2 = 262
  const bufferW = 20
  const showW = 150

  return (
    <svg
      viewBox="0 0 320 128"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: four venues on one shared run-of-show, each show preceded by a buffered changeover window"
    >
      {VENUES.map((label, i) => {
        const y = 14 + i * 28
        const sx = trackX1 + bufferW
        return (
          <g key={label}>
            <Note x={trackX1 - 10} y={y + 4} anchor="end" size={9} tone="dim">
              {label}
            </Note>
            <line x1={trackX1} y1={y} x2={trackX2} y2={y} className="l-hair" />
            <rect
              x={trackX1}
              y={y - 6}
              width={bufferW}
              height={12}
              style={{
                stroke: hovered ? 'var(--accent-orange)' : 'var(--line-thin)',
                fill: 'var(--accent-orange)',
                fillOpacity: hovered ? 0.16 : 0,
                strokeDasharray: '3 2',
                transition: 'stroke 0.35s ease, fill-opacity 0.35s ease',
                transitionDelay: `${i * 70}ms`,
              }}
            />
            <rect x={sx} y={y - 7} width={showW} height={14} className="l-bold fill-ink" />
          </g>
        )
      })}
      <Note x={trackX1} y={124} anchor="start" size={8.5} tone="dim">
        SHARED RUN-OF-SHOW
      </Note>
    </svg>
  )
}

/* ---- Decision 2: zone → shift → escalation, flow arrows animate --------- */

const DEPLOYMENT_STEPS = ['Zones', 'Shifts', 'Escalation']

function DeploymentArtifact({ hovered }: { hovered: boolean }): ReactElement {
  const y = 42
  const nodes = DEPLOYMENT_STEPS.map((label, i) => ({ label, x: 44 + i * 116 }))

  return (
    <svg
      viewBox="0 0 320 76"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: volunteers flow from zone allocation to shift ownership to a named escalation contact"
    >
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1]!
        return (
          <g key={`link-${n.label}`}>
            <line
              x1={n.x + 8}
              y1={y}
              x2={next.x - 10}
              y2={y}
              style={{
                stroke: hovered ? 'var(--accent-orange)' : 'var(--line-thin)',
                transition: 'stroke 0.35s ease',
                transitionDelay: `${i * 130}ms`,
              }}
            />
            <polygon
              points={`${next.x - 10},${y} ${next.x - 16},${y - 3.5} ${next.x - 16},${y + 3.5}`}
              style={{
                fill: hovered ? 'var(--accent-orange)' : 'var(--ink-45)',
                transition: 'fill 0.35s ease',
                transitionDelay: `${i * 130}ms`,
              }}
            />
          </g>
        )
      })}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={y} r={5} className="l-med fill-paper" />
          <Note x={n.x} y={y + 20} size={8.6}>
            {n.label}
          </Note>
        </g>
      ))}
    </svg>
  )
}

/* ---- Decision 3: cue sequence, cue progression animates ------------------ */

const CUES = ['SQ1', 'SQ2', 'SQ3', 'SQ4', 'SQ5']

function CoordinationArtifact({ hovered }: { hovered: boolean }): ReactElement {
  const y = 34
  const step = 56
  const x0 = 26

  return (
    <svg
      viewBox="0 0 300 68"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the technical cue sequence run at every venue"
    >
      <line x1={x0} y1={y} x2={x0 + step * (CUES.length - 1)} y2={y} className="l-hair" />
      {CUES.map((c, i) => {
        const cx = x0 + i * step
        return (
          <g key={c}>
            <rect
              x={cx - 11}
              y={y - 9}
              width={22}
              height={18}
              className="fill-paper"
              style={{
                stroke: hovered ? 'var(--accent-orange)' : 'var(--line-thin)',
                transition: 'stroke 0.3s ease',
                transitionDelay: `${i * 90}ms`,
              }}
            />
            <Note x={cx} y={y + 4} size={8.5}>
              {c}
            </Note>
          </g>
        )
      })}
      <Note x={x0} y={62} anchor="start" size={8.5} tone="dim">
        100+ CUES · 4 VENUES
      </Note>
    </svg>
  )
}

const VISUALS: ((props: { hovered: boolean }) => ReactElement)[] = [
  SchedulingArtifact,
  DeploymentArtifact,
  CoordinationArtifact,
]

const VISUAL_TITLES = ['Shared Run-of-Show', 'Escalation Flow', 'Cue Sequence']

/* ---- one decision, a single bordered card --------------------------------- */

function DecisionStage({
  label,
  text,
  highlight = false,
}: {
  label: string
  text: string
  highlight?: boolean
}): ReactElement {
  return (
    <div className={highlight ? 'border-l-2 border-accent-orange pl-3' : ''}>
      <span className={`label ${highlight ? 'text-accent-orange' : 'text-ink-45'}`}>{label}</span>
      <p className={`mt-1 text-[0.8rem] leading-snug ${highlight ? 'font-medium text-ink' : 'text-ink-70'}`}>
        {text}
      </p>
    </div>
  )
}

function StageArrow(): ReactElement {
  return (
    <div aria-hidden="true" className="my-2 text-[0.7rem] text-ink-25">
      ↓
    </div>
  )
}

function DecisionCard({ index, d }: { index: number; d: CaseStudy['decisions'][number] }): ReactElement {
  const [hovered, setHovered] = useState(false)
  const Visual = VISUALS[index]
  if (!Visual) return <></>

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex h-full flex-col border bg-paper p-6 transition-[transform,box-shadow,border-color] duration-300 ${
        hovered ? '-translate-y-1 border-accent-orange shadow-[0_16px_32px_-18px_var(--ink-45),0_0_16px_-8px_var(--accent-orange)]' : 'border-ink-25'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="label text-ink-45">Decision {String(index + 1).padStart(2, '0')}</span>
        <span className={`label text-right font-bold transition-colors duration-300 ${hovered ? 'text-accent-orange' : 'text-ink-70'}`}>
          {d.metric}
        </span>
      </div>

      <h3 className="mb-4 font-display text-[1rem] font-bold">{d.title}</h3>

      <DecisionStage label="Challenge" text={d.challenge} />
      <StageArrow />
      <DecisionStage label="Decision" text={d.decision} highlight />
      <StageArrow />

      <div>
        <span className="label text-ink-45">Impact</span>
        <ul className="mt-1.5">
          {d.impact.map((item) => (
            <li key={item} className="flex items-start gap-2 py-0.5">
              <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-25" />
              <span className="text-[0.78rem] leading-snug text-ink-70">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-dashed border-ink-25 pt-4">
        <span className="label mb-2 block text-ink-45">{VISUAL_TITLES[index]}</span>
        <Visual hovered={hovered} />
      </div>
    </div>
  )
}

export function OperationalDecisions({ decisions }: { decisions: CaseStudy['decisions'] }): ReactElement {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Operational Decisions</h2>
        <span className="label ml-auto text-ink-45">Decision Log</span>
      </div>

      <Reveal>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {decisions.map((d, i) => (
            <DecisionCard key={d.title} index={i} d={d} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
