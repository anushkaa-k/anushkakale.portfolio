import { Fragment, useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'

/* Four pillars. Budgeting (01) and Rehearsal & Production Planning (04)
   are each a full-width row split roughly 45/55 with a hand-built
   operational artifact — a worksheet, a calendar — deliberately built to
   look like documents a production manager would actually produce
   rather than decorative charts, following the same "artifacts over
   graphics" principle Execution Strategy uses on the Vasant case study.
   Cross-city Coordination (02) and Technical Production (03) carry no
   artifact: they sit side by side as a plain two-column text board (see
   EngineeringBoard below) instead.

   The drawn divider above each row/board reuses the existing
   `.draw-in-line` CSS utility (tied to the ancestor <Reveal>'s data-in
   state), the same mechanism Banner.tsx's dividers use — no per-element
   animation code needed. */

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

const ARTIFACTS: Record<'budget' | 'calendar', () => ReactElement> = {
  budget: BudgetWorksheetArtifact,
  calendar: ProductionCalendarArtifact,
}

const ARTIFACT_TITLES: Record<'budget' | 'calendar', string> = {
  budget: 'Budget Worksheet',
  calendar: 'Production Calendar',
}

/* ---- Pillars 02 + 03: the engineering board ------------------------------

   Cross-city Coordination and Technical Production sit side by side as
   one two-column board of text plates — no artifact, no click-to-enlarge
   — rather than two more full-width rows, so scanning "how the
   production actually ran" doesn't take four screens of scrolling.
   `items-start` keeps both columns' text pinned to the same top edge, so
   with the two bodies kept to a similar length they read at a similar
   height without any artificial height-matching.

   Hover is scoped to the whole column: a single unnamed `group` per
   column drives the title's colour and the column's own elevation
   together, since both are meant to read as "this column is active." */

function BoardColumn({ index, title, body }: { index: number; title: string; body: string }): ReactElement {
  return (
    <div className="group border border-transparent p-4 transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-20px_var(--ink-45)]">
      <div className="mb-2.5 flex items-baseline gap-3">
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-45" />
        <span className="label text-ink-45">Pillar {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mb-3 font-display text-[1.4rem] leading-tight font-bold transition-colors duration-300 group-hover:text-accent-orange">
        {title}
      </h3>
      <p className="text-[0.88rem] leading-snug text-ink-70">{body}</p>
    </div>
  )
}

function EngineeringBoard({
  pillars,
}: {
  pillars: [CaseStudy['pillars'][number], CaseStudy['pillars'][number]]
}): ReactElement {
  const [left, right] = pillars

  return (
    <Reveal className="mb-14">
      <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="h-1 w-full" aria-hidden="true">
        <line x1={0} y1={2} x2={1000} y2={2} className="l-thin draw-in-line" />
      </svg>

      <div className="relative mt-8 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:items-start">
        {/* Vertical blueprint divider — dashed centreline with a drafting
            tick at each end, desktop only. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-1/2 hidden w-px -translate-x-1/2 lg:block"
        >
          <div className="h-full border-l border-dashed border-ink-25" />
          <span className="absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rotate-45 border border-ink-25 bg-paper" />
          <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rotate-45 border border-ink-25 bg-paper" />
        </div>

        <BoardColumn index={1} title={left.title} body={left.body} />
        <BoardColumn index={2} title={right.title} body={right.body} />
      </div>
    </Reveal>
  )
}

export function FromScriptToStage({ pillars }: { pillars: CaseStudy['pillars'] }): ReactElement {
  const [openKey, setOpenKey] = useState<'budget' | 'calendar' | null>(null)

  useEffect(() => {
    if (openKey === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openKey])

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
        // Pillars 02 and 03 (Cross-city Coordination, Technical Production)
        // render together as the engineering board below, once, keyed off
        // pillar 02 — pillar 03 is skipped here rather than rendered twice.
        if (i === 2) return null
        if (i === 1) {
          return pillars[2] ? <EngineeringBoard key="engineering-board" pillars={[p, pillars[2]]} /> : null
        }

        // Only pillars 01 (Budgeting) and 04 (Rehearsal & Production
        // Planning) still carry an artifact — index 0 → 'budget', the
        // only other index reaching this branch (3) → 'calendar'.
        const key = i === 0 ? 'budget' : 'calendar'
        const Artifact = ARTIFACTS[key]
        const visualLeft = i % 2 === 1

        return (
          <Reveal key={p.title} className="mb-14 last:mb-0">
            <PillarDivider index={i} title={p.title} />

            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[9fr_11fr]">
              <div className={visualLeft ? 'lg:order-2' : 'lg:order-1'}>
                <p className="text-[0.9rem] leading-snug text-ink-70">{p.body}</p>
              </div>

              <ArtifactCard
                title={ARTIFACT_TITLES[key]}
                onOpen={() => setOpenKey(key)}
                order={visualLeft ? 'lg:order-1' : 'lg:order-2'}
              >
                <Artifact />
              </ArtifactCard>
            </div>
          </Reveal>
        )
      })}

      {openKey !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${ARTIFACT_TITLES[openKey]}, enlarged`}
          onClick={() => setOpenKey(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-[min(90vw,38rem)] overflow-y-auto border-4 border-paper bg-paper p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="label text-ink-70">{ARTIFACT_TITLES[openKey]}</span>
              <button
                type="button"
                onClick={() => setOpenKey(null)}
                className="shrink-0 cursor-pointer border border-ink-25 px-2.5 py-1 text-ink-70 transition-colors hover:border-redline hover:text-ink"
              >
                Close ✕
              </button>
            </div>
            <div className="mx-auto max-w-[30rem]">
              {(() => {
                const Artifact = ARTIFACTS[openKey]
                return <Artifact />
              })()}
            </div>
          </figure>
        </div>
      )}
    </section>
  )
}
