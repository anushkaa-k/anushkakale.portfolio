import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { Note } from '../lib/draft'

/* Four decisions, each Situation → Decision → Outcome plus a small
   supporting blueprint visual, all inside one bordered rectangle per
   decision — the same single-box-per-unit treatment used throughout the
   rest of the site (the risk matrix cards, the Execution Strategy bands)
   rather than a text card and a visual card sitting side by side as two
   separate boxes.

   Decisions 1 and 2 each keep a full-width row; 3 and 4 share one row as
   a pair, decision 4 to the right of decision 3. To read as genuinely
   equal in weight rather than "two big cards, two small ones squeezed
   in," all four use the same internal template — header, then Situation
   → Decision → Outcome, then the visual — and the four supporting
   visuals were re-tuned to a consistent height instead of each artifact
   dictating its own (the run-of-show timeline in particular used to run
   noticeably taller than the other three).

   The Decision stage keeps the orange rule — the one moment in each card
   that isn't just describing what happened. */

function SchedulingArtifact(): ReactElement {
  const rows = ['Venue A', 'Venue B', 'Venue C', 'Venue D']
  const trackX1 = 76
  const trackX2 = 300
  const bufferW = 24
  const showW = 164

  return (
    <svg
      viewBox="0 0 320 148"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: four venues on one shared timeline, each show block preceded by a buffered changeover window"
    >
      <Note x={trackX1} y={14} anchor="start" size={9} tone="dim">
        SHARED RUN-OF-SHOW
      </Note>
      {rows.map((label, i) => {
        const y = 36 + i * 24
        const sx = trackX1 + bufferW
        return (
          <g key={label}>
            <Note x={trackX1 - 8} y={y + 4} anchor="end" size={9.5} tone="dim">
              {label}
            </Note>
            <line x1={trackX1} y1={y} x2={trackX2} y2={y} className="l-hair draw-in-line" />
            <rect x={trackX1} y={y - 6} width={bufferW} height={12} className="l-hidden" />
            <rect x={sx} y={y - 7} width={showW} height={14} className="l-bold fill-ink" />
          </g>
        )
      })}
      <g transform="translate(76, 134)">
        <rect x={0} y={-7} width={16} height={12} className="l-hidden" />
        <Note x={20} y={2} anchor="start" size={8.5} tone="dim">
          Buffer
        </Note>
        <rect x={78} y={-7} width={16} height={12} className="l-bold fill-ink" />
        <Note x={98} y={2} anchor="start" size={8.5} tone="dim">
          Show Window
        </Note>
      </g>
    </svg>
  )
}

const DEPLOYMENT_ROWS = [
  { zone: 'Front of House', shift: 'Morning', contact: 'Zone Lead — FOH' },
  { zone: 'Backstage', shift: 'Evening', contact: 'Zone Lead — Backstage' },
  { zone: 'Box Office', shift: 'All Day', contact: 'Zone Lead — Box Office' },
  { zone: 'Technical Support', shift: 'Evening', contact: 'Zone Lead — Technical' },
]

function DeploymentArtifact(): ReactElement {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="label text-ink-45">
          <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Zone</th>
          <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Shift</th>
          <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Escalation</th>
        </tr>
      </thead>
      <tbody>
        {DEPLOYMENT_ROWS.map((row) => (
          <tr key={row.zone} className="border-b border-dashed border-ink-25 last:border-b-0">
            <td className="px-2 py-2 text-[0.75rem] text-ink-70">{row.zone}</td>
            <td className="px-2 py-2 text-[0.75rem] text-ink-70">{row.shift}</td>
            <td className="px-2 py-2 text-[0.7rem] text-ink-70">{row.contact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const WORKFLOW_STEPS = ['Walkthrough', 'Cue Sheet', 'Live Show']

function CoordinationArtifact(): ReactElement {
  const y = 46
  const nodes = WORKFLOW_STEPS.map((label, i) => ({ label, x: 50 + i * 110 }))
  const last = nodes[nodes.length - 1]!
  const first = nodes[0]!

  return (
    <svg
      viewBox="0 0 320 100"
      className="h-auto w-full"
      role="img"
      aria-label="Workflow diagram: a pre-show walkthrough into a venue cue sheet into the live show, repeated per venue"
    >
      {nodes.slice(0, -1).map((n, i) => (
        <line key={`link-${n.label}`} x1={n.x} y1={y} x2={nodes[i + 1]!.x} y2={y} className="l-thin draw-in-line" />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={y} r={5} className="l-med fill-paper" />
          <Note x={n.x} y={y + 20} size={9.5}>
            {n.label}
          </Note>
        </g>
      ))}
      <path
        d={`M${last.x} ${y - 5} C ${last.x + 20} ${y - 32}, ${first.x - 20} ${y - 32}, ${first.x} ${y - 5}`}
        className="l-hidden"
      />
      <Note x={(first.x + last.x) / 2} y={y - 38} size={9} tone="dim">
        × 4 VENUES
      </Note>
    </svg>
  )
}

const HOSPITALITY_TIERS = [
  { size: 'Solo (1–5)', scope: 'Green room + local transport' },
  { size: 'Ensemble (6–15)', scope: 'Shared green room + catering' },
  { size: 'Company (16–25)', scope: 'Multi-room, catering + transport' },
]

function HospitalityScalingArtifact(): ReactElement {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="label text-ink-45">
          <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Size</th>
          <th className="border-b border-ink-25 px-2 py-1.5 font-medium">Scope</th>
        </tr>
      </thead>
      <tbody>
        {HOSPITALITY_TIERS.map((row) => (
          <tr key={row.size} className="border-b border-dashed border-ink-25 last:border-b-0">
            <td className="px-2 py-2.5 align-top font-display text-[0.76rem] font-bold whitespace-nowrap">
              {row.size}
            </td>
            <td className="px-2 py-2.5 align-top text-[0.7rem] leading-snug text-ink-70">{row.scope}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const VISUALS: (() => ReactElement)[] = [
  SchedulingArtifact,
  DeploymentArtifact,
  CoordinationArtifact,
  HospitalityScalingArtifact,
]

const VISUAL_TITLES = ['Shared Run-of-Show', 'Zone Deployment Map', 'Coordination Workflow', 'Hospitality Scaling']

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
      <p className={`mt-1 text-[0.82rem] leading-snug ${highlight ? 'font-medium text-ink' : 'text-ink-70'}`}>
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

/* ---- one decision, always a single bordered rectangle -------------------- */

function DecisionCard({
  index,
  d,
  layout,
}: {
  index: number
  d: CaseStudy['decisions'][number]
  /** `row`: text and visual side by side, for the two full-width cards.
      `stack`: visual below the text, for the paired half-width cards —
      there isn't enough room at half width for a side-by-side split. */
  layout: 'row' | 'stack'
}): ReactElement {
  const Visual = VISUALS[index]
  if (!Visual) return <></>

  const stages = (
    <>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="label text-ink-45">Decision {String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[0.95rem] font-bold">{d.title}</h3>
        <span className="label ml-auto text-right text-ink-45">{d.metric}</span>
      </div>

      <DecisionStage label="Situation" text={d.situation} />
      <StageArrow />
      <DecisionStage label="Decision" text={d.decision} highlight />
      <StageArrow />
      <DecisionStage label="Outcome" text={d.outcome} />
    </>
  )

  const visual = (
    <div
      className={
        layout === 'row'
          ? 'mt-4 border-t border-dashed border-ink-25 pt-4 lg:mt-0 lg:h-full lg:border-t-0 lg:border-l lg:pl-6'
          : 'mt-4 border-t border-dashed border-ink-25 pt-4'
      }
    >
      <span className="label mb-2 block text-ink-45">{VISUAL_TITLES[index]}</span>
      <Visual />
    </div>
  )

  if (layout === 'stack') {
    return (
      <div className="flex h-full flex-col border border-ink-25 bg-paper p-5">
        {stages}
        {visual}
      </div>
    )
  }

  return (
    <div className="grid gap-x-8 border border-ink-25 bg-paper p-5 lg:grid-cols-[3fr_2fr]">
      <div>{stages}</div>
      {visual}
    </div>
  )
}

function RowDivider(): ReactElement {
  return (
    <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="mb-10 h-1 w-full" aria-hidden="true">
      <line x1={0} y1={2} x2={1000} y2={2} className="l-thin draw-in-line" />
    </svg>
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

      {decisions[0] && (
        <Reveal className="mb-10">
          <DecisionCard index={0} d={decisions[0]} layout="row" />
        </Reveal>
      )}

      {decisions[1] && (
        <>
          <RowDivider />
          <Reveal className="mb-10">
            <DecisionCard index={1} d={decisions[1]} layout="row" />
          </Reveal>
        </>
      )}

      {decisions[2] && decisions[3] && (
        <>
          <RowDivider />
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-2">
              <DecisionCard index={2} d={decisions[2]} layout="stack" />
              <DecisionCard index={3} d={decisions[3]} layout="stack" />
            </div>
          </Reveal>
        </>
      )}
    </section>
  )
}
