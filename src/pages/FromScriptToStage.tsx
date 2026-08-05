import { Fragment, useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { Bubble, Crosshair, Note } from '../lib/draft'

/* Four pillars, each a full-width row split roughly 45/55 — a short
   explanation and a hand-built operational artifact — alternating which
   side the artifact sits on so the section reads with rhythm rather than
   every row falling the same way. The artifacts are deliberately built
   to look like documents a production manager would actually produce
   (a worksheet, a workflow diagram, a stage plan, a calendar) rather
   than decorative charts, following the same "artifacts over graphics"
   principle Execution Strategy uses on the Vasant case study.

   Diagrams that draw lines in reuse the existing `.draw-in-line` CSS
   utility (tied to the ancestor <Reveal>'s data-in state), the same
   mechanism Banner.tsx's dividers and the other case study diagrams use
   — no per-diagram animation code needed. */

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

function PillarDivider({ index, title }: { index: number; title: string }): ReactElement {
  return (
    <>
      <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="h-1 w-full" aria-hidden="true">
        <line x1={0} y1={2} x2={1000} y2={2} className="l-thin draw-in-line" />
      </svg>
      <div className="mt-3 mb-6 flex items-baseline gap-3">
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-45" />
        <span className="label text-ink-45">Pillar {String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[1.05rem] font-bold">{title}</h3>
      </div>
    </>
  )
}

function ArtifactCard({
  title,
  onOpen,
  order,
  children,
}: {
  title: string
  onOpen: () => void
  order: 'lg:order-1' | 'lg:order-2'
  children: ReactElement
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open the ${title} artifact`}
      className={`group relative block h-full w-full cursor-pointer border border-ink-25 bg-paper-warm p-3 pt-4 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)] ${order}`}
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

/* ---- 01. Budget Worksheet ---------------------------------------------- */

const BUDGET_LINES = [
  { item: 'Set', weight: 88, status: 'Approved', note: 'Quoted across three vendors before award.' },
  { item: 'Projection', weight: 96, status: 'Approved', note: 'Largest line item — hardware plus operator fee.' },
  { item: 'Costumes', weight: 42, status: 'Approved', note: 'In-house build, materials sourced separately.' },
  { item: 'Transport', weight: 55, status: 'Approved', note: 'Mumbai–Pune set and equipment moves.' },
  { item: 'Hospitality', weight: 28, status: 'Approved', note: 'Scaled to company size per show date.' },
  { item: 'Contingency', weight: 38, status: 'Reserved', note: 'Held back, not drawn against another line.' },
]

function BudgetWorksheetArtifact(): ReactElement {
  return (
    <div className="border border-ink-25 bg-paper">
      <div className="label flex items-center gap-2 border-b border-ink-25 bg-paper-warm px-3 py-2 text-ink-45">
        Budget Worksheet — Department Allocation
        <span className="ml-auto text-ink-25">Rev. 3</span>
      </div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="label text-ink-45">
            <th className="border-b border-ink-25 px-3 py-1.5 font-medium">Line Item</th>
            <th className="border-b border-ink-25 px-3 py-1.5 font-medium">Cost Weight</th>
            <th className="border-b border-ink-25 px-3 py-1.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {BUDGET_LINES.map((row) => (
            <tr key={row.item} className="group/row relative border-b border-dashed border-ink-25 last:border-b-0">
              <td className="px-3 py-2 align-top font-display text-[0.78rem] font-bold">{row.item}</td>
              <td className="px-3 py-2 align-top">
                <div className="h-2 w-full border border-ink-25 bg-paper">
                  <div className="h-full bg-ink/70" style={{ width: `${row.weight}%` }} />
                </div>
              </td>
              <td className="relative px-3 py-2 align-top text-[0.7rem]">
                <span className={row.status === 'Approved' ? 'text-accent-orange' : 'text-ink-45'}>
                  ✓ {row.status}
                </span>
                {/* Approval annotation — a blueprint note revealed on hover
                    rather than printed permanently on the sheet, so the
                    worksheet itself stays a clean row of figures. */}
                <div className="pointer-events-none absolute top-full right-0 z-20 mt-1 w-48 border border-ink-25 bg-paper p-2 text-left text-[0.66rem] leading-snug text-ink-70 opacity-0 shadow-[0_10px_22px_-10px_var(--ink-45)] transition-opacity duration-200 group-hover/row:opacity-100">
                  <CornerBrackets />
                  {row.note}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-dashed border-ink-25 px-3 py-2 text-[0.66rem] text-ink-45">
        Approved — Assistant Production Manager
      </div>
    </div>
  )
}

/* ---- 02. Cross-City Workflow --------------------------------------------

   Two hub nodes rather than the convergence diagram Operational
   Complexity uses on the Vasant page — the shape of this claim is
   different (two teams trading flows back and forth, not many inputs
   landing at one point), so it gets its own diagram rather than reusing
   that one. */

const FLOWS: { label: string; y: number; dir: 'right' | 'both' }[] = [
  { label: 'Approvals', y: 52, dir: 'right' },
  { label: 'Payments', y: 90, dir: 'both' },
  { label: 'Materials & Logistics', y: 170, dir: 'right' },
  { label: 'Communication', y: 208, dir: 'both' },
]

function FlowArrow({ x, y, dir }: { x: number; y: number; dir: 'left' | 'right' }): ReactElement {
  const s = dir === 'right' ? 1 : -1
  return (
    <g>
      <line x1={x} y1={y} x2={x - 6 * s} y2={y - 3} className="l-thin" />
      <line x1={x} y1={y} x2={x - 6 * s} y2={y + 3} className="l-thin" />
    </g>
  )
}

function CrossCityWorkflowArtifact(): ReactElement {
  const hubL = 62
  const hubR = 398
  const lineL = 94
  const lineR = 366

  return (
    <svg
      viewBox="0 0 460 260"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: production flows between the Mumbai NCPA team and the Pune creative team"
    >
      <g style={{ opacity: 0.3 }} aria-hidden="true">
        <Crosshair x={20} y={20} size={7} />
        <Crosshair x={440} y={240} size={7} />
      </g>

      <circle cx={hubL} cy={130} r={27} className="l-med fill-paper" />
      <Note x={hubL} y={134} size={11}>
        MUMBAI
      </Note>

      <circle cx={hubR} cy={130} r={27} className="l-med fill-paper" />
      <Note x={hubR} y={134} size={11}>
        PUNE
      </Note>

      {FLOWS.map((f) => (
        <g key={f.label}>
          <line x1={lineL} y1={f.y} x2={lineR} y2={f.y} className="l-thin draw-in-line" />
          <FlowArrow x={lineR} y={f.y} dir="right" />
          {f.dir === 'both' && <FlowArrow x={lineL} y={f.y} dir="left" />}
          <Note x={230} y={f.y - 7} size={9} tone="dim">
            {f.label}
          </Note>
        </g>
      ))}
    </svg>
  )
}

/* ---- 03. Stage Layout ---------------------------------------------------

   Plan view (looking straight down at the stage), not an elevation —
   projection surface upstage, three lighting zones as grid-bubble
   references (the same datum-marker convention draft.tsx uses on real
   arrangement drawings), and two cue points with hover notes standing
   in for a cue sheet. */

const CUES = [
  { x: 150, y: 126, label: '12', note: 'Projection sync, blackout' },
  { x: 250, y: 126, label: '18', note: 'Lighting cross-fade cue' },
]

function StageLayoutArtifact(): ReactElement {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Blueprint stage plan: projection surface, lighting zones and cue points"
    >
      <g style={{ opacity: 0.3 }} aria-hidden="true">
        <Crosshair x={18} y={18} size={7} />
        <Crosshair x={382} y={282} size={7} />
      </g>

      <rect x={40} y={44} width={320} height={176} className="l-med" />
      <rect x={70} y={54} width={260} height={28} className="l-thin" style={{ strokeDasharray: '4 3' }} />
      <Note x={200} y={73} size={8.5} tone="dim">
        PROJECTION SURFACE
      </Note>

      <Note x={48} y={135} anchor="start" size={8} tone="dim">
        SL
      </Note>
      <Note x={352} y={135} anchor="end" size={8} tone="dim">
        SR
      </Note>

      <Bubble x={130} y={150} label="1" />
      <Bubble x={200} y={172} label="2" />
      <Bubble x={270} y={150} label="3" />
      <Note x={200} y={200} size={8} tone="dim">
        LIGHTING ZONES
      </Note>

      {CUES.map((c) => (
        <g key={c.label} className="group/cue">
          {/* A generous invisible hit area — the visible triangle/label
              alone is too small a target to hover reliably. */}
          <rect x={c.x - 16} y={c.y - 34} width={32} height={34} fill="transparent" />
          <line x1={c.x} y1={c.y - 14} x2={c.x} y2={c.y - 4} className="l-hidden" />
          <polygon
            points={`${c.x - 5},${c.y - 22} ${c.x + 5},${c.y - 22} ${c.x},${c.y - 14}`}
            className="l-thin fill-paper"
          />
          <Note x={c.x} y={c.y - 26} size={7.5} tone="dim">
            {`CUE ${c.label}`}
          </Note>
          <rect
            x={c.x - 45}
            y={c.y - 58}
            width={90}
            height={26}
            className="pointer-events-none fill-paper stroke-ink-25 opacity-0 transition-opacity duration-200 group-hover/cue:opacity-100"
            style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.18))' }}
          />
          <text
            x={c.x}
            y={c.y - 43}
            textAnchor="middle"
            className="note dim pointer-events-none opacity-0 transition-opacity duration-200 group-hover/cue:opacity-100"
            fontSize={6.5}
          >
            {c.note}
          </text>
        </g>
      ))}

      <rect x={130} y={244} width={140} height={26} className="l-thin" />
      <Note x={165} y={261} size={7.5} tone="dim">
        LX OP
      </Note>
      <line x1={200} y1={244} x2={200} y2={270} className="l-hair" />
      <Note x={235} y={261} size={7.5} tone="dim">
        PROJ OP
      </Note>
      <Note x={200} y={286} size={8} tone="dim">
        OPERATOR BOOTH
      </Note>
    </svg>
  )
}

/* ---- 04. Production Calendar --------------------------------------------

   A real Gantt, not a day-grid like the run-of-show artifact on the
   Vasant page: continuous bars with genuine overlap between phases
   (technical runs starting before rehearsals finish), which is the
   actual shape of a rehearsal schedule. */

const WEEKS = 8
const CAL_ROWS = [
  { phase: 'Planning', start: 0, span: 2 },
  { phase: 'Rehearsals', start: 1, span: 5 },
  { phase: 'Technical Runs', start: 5, span: 2 },
  { phase: 'Dress Rehearsals', start: 6, span: 1 },
  { phase: 'Premiere', start: 7, span: 1 },
]

function ProductionCalendarArtifact(): ReactElement {
  return (
    <div className="border border-ink-25">
      <div className="label border-b border-ink-25 bg-paper px-2 py-1.5 text-ink-45">
        Production Calendar — Not to Scale
      </div>
      <div className="grid grid-cols-[5.5rem_repeat(8,1fr)] text-center">
        <div className="border-r border-b border-ink-25 bg-paper" />
        {Array.from({ length: WEEKS }, (_, i) => (
          <div key={i} className="label border-r border-b border-ink-25 bg-paper py-1 text-ink-45 last:border-r-0">
            W{i + 1}
          </div>
        ))}
        {CAL_ROWS.map((row) => (
          <Fragment key={row.phase}>
            <div className="label border-r border-b border-ink-25 bg-paper px-2 py-2 text-left text-ink-45 last:border-b-0">
              {row.phase}
            </div>
            <div className="relative col-span-8 border-b border-ink-25 last:border-b-0" style={{ height: '2rem' }}>
              <div
                className="absolute inset-y-1.5 border border-ink bg-ink/75"
                style={{ left: `${(row.start / WEEKS) * 100}%`, width: `${(row.span / WEEKS) * 100}%` }}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

const ARTIFACTS: (() => ReactElement)[] = [
  BudgetWorksheetArtifact,
  CrossCityWorkflowArtifact,
  StageLayoutArtifact,
  ProductionCalendarArtifact,
]

const ARTIFACT_TITLES = ['Budget Worksheet', 'Cross-City Workflow', 'Stage Layout', 'Production Calendar']

export function FromScriptToStage({ pillars }: { pillars: CaseStudy['pillars'] }): ReactElement {
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
      <div className="mb-2 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">From Script to Stage</h2>
        <span className="label ml-auto text-ink-45">Production Dossier</span>
      </div>
      <p className="label mb-6 text-ink-45">
        The operational framework behind building a touring theatre production.
      </p>

      {pillars.map((p, i) => {
        const Artifact = ARTIFACTS[i]
        if (!Artifact) return null
        const visualLeft = i % 2 === 1

        return (
          <Reveal key={p.title} className="mb-14 last:mb-0">
            <PillarDivider index={i} title={p.title} />

            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[9fr_11fr]">
              <div className={visualLeft ? 'lg:order-2' : 'lg:order-1'}>
                <p className="text-[0.9rem] leading-snug text-ink-70">{p.body}</p>
              </div>

              <ArtifactCard
                title={ARTIFACT_TITLES[i]}
                onOpen={() => setOpenIndex(i)}
                order={visualLeft ? 'lg:order-1' : 'lg:order-2'}
              >
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
