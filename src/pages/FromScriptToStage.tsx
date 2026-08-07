import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { useMediaQuery } from '../hooks/useMediaQuery'

/* Four pillars. Budgeting (01) and Rehearsal & Production Planning (04)
   are each a full-width row split roughly 45/55 with a hand-built
   operational artifact — a budget board, a workflow map — deliberately
   built to look like documents a production manager would actually
   produce rather than decorative charts, following the same "artifacts
   over graphics" principle Execution Strategy uses on the Vasant case
   study. Cross-city Coordination (02) and Technical Production (03)
   carry no artifact: they sit side by side as a plain two-column text
   board (see EngineeringBoard below) instead.

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

function PillarDivider({ index, title, showLine = true }: { index: number; title: string; showLine?: boolean }): ReactElement {
  return (
    <>
      {showLine && (
        <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="h-1 w-full" aria-hidden="true">
          <line x1={0} y1={2} x2={1000} y2={2} className="l-thin draw-in-line" />
        </svg>
      )}
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

/* ---- shared geometry helpers --------------------------------------------

   Both artifacts below draw their connecting lines and arrowheads inside
   a single `viewBox="0 0 100 100" preserveAspectRatio="none"` SVG, the
   same plain-fraction convention the Production Lifecycle map on this
   case study's opening sheet uses — so a line, and the arrowhead drawn
   on it, stretch together as one unit regardless of the card's actual
   pixel aspect ratio, rather than the arrowhead's rotation reading wrong
   once the SVG stretches non-uniformly. */

function trimLine(ax: number, ay: number, bx: number, by: number, startGap: number, endGap: number) {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return { x1: ax + ux * startGap, y1: ay + uy * startGap, x2: bx - ux * endGap, y2: by - uy * endGap }
}

function arrowhead(ax: number, ay: number, bx: number, by: number, t: number, size: number): string {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux
  const cx = ax + dx * t
  const cy = ay + dy * t
  const tipX = cx + ux * size
  const tipY = cy + uy * size
  const b1x = cx - ux * size * 0.6 + px * size * 0.55
  const b1y = cy - uy * size * 0.6 + py * size * 0.55
  const b2x = cx - ux * size * 0.6 - px * size * 0.55
  const b2y = cy - uy * size * 0.6 - py * size * 0.55
  return `${tipX},${tipY} ${b1x},${b1y} ${b2x},${b2y}`
}

/* ---- 01. Budget Board -----------------------------------------------------

   Not a ledger — a conceptual allocation board, the shape a production
   manager might actually pin up: one "Production Budget" hub branching
   into every department, each branch carrying its own cost weight,
   two vendor-quotation slips paperclipped to the departments that were
   shopped hardest, one approval stamp standing in for the whole sign-off
   pass, and Contingency drawn deliberately outside the network — it was
   never allocated to a branch, so it doesn't hang off one. */

type BudgetNode = { item: string; share: number; weight: number; note: string; quote?: boolean }

const BUDGET_CENTER = { x: 20, y: 50 }

const BUDGET_NODES: (BudgetNode & { x: number; y: number })[] = [
  { item: 'Set', share: 19, weight: 79, x: 20, y: 10, note: 'Three vendor quotations compared before award.', quote: true },
  { item: 'Projection', share: 24, weight: 100, x: 42, y: 21, note: 'Largest single line — hardware plus operator fee.', quote: true },
  { item: 'Lighting', share: 13, weight: 54, x: 49, y: 33, note: 'Rig plotted alongside the projection plan.' },
  { item: 'Costumes', share: 9, weight: 38, x: 52, y: 44, note: 'In-house build, materials sourced separately.' },
  { item: 'Transport', share: 11, weight: 46, x: 52, y: 56, note: 'Mumbai ↔ Pune set and equipment moves.' },
  { item: 'Hospitality', share: 6, weight: 25, x: 49, y: 67, note: 'Scaled to company size per show date.' },
  { item: 'Technical', share: 10, weight: 42, x: 42, y: 79, note: 'Equipment hire and on-site operator fees.' },
  { item: 'Cast & Crew', share: 8, weight: 33, x: 20, y: 90, note: 'Artist fees and crew allowances.' },
]

const QUOTE_SLIPS = [
  { forItem: 'Set', x: 74, y: 3, label: 'Vendor Quote — Set' },
  { forItem: 'Projection', x: 88, y: 20, label: 'Vendor Quote — Projection' },
]

/* Below `md` (768px) the board's own column shrinks well past the width
   the desktop layout was designed for, and a handful of its children —
   the vendor-quote chits, the department tooltips — carry a fixed pixel
   width anchored by a percentage `left`, a combination that only stays
   inside the box at desktop column widths. Percentage-based `right`
   clamps (the trick used elsewhere, e.g. Contingency) can't fix the
   quote slips without also nudging their position at ordinary desktop
   widths, since the tightest of them already leaves less margin than
   its own box width there — so this needs a real mobile/desktop branch
   rather than a CSS-only formula, keeping the desktop path untouched. */
function BudgetBoardArtifact(): ReactElement {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const quoteSlipX = (s: (typeof QUOTE_SLIPS)[number]) => (isMobile ? 56 : s.x)

  return (
    <div className="relative h-[31rem] w-full border border-ink-25 bg-paper">
      <div className="label absolute inset-x-0 top-0 z-20 flex items-center gap-2 border-b border-ink-25 bg-paper-warm px-3 py-2 whitespace-nowrap text-ink-45">
        Budget Board
        <span className="ml-auto hidden text-ink-25 sm:inline">Archival Copy</span>
      </div>

      <div className="absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {BUDGET_NODES.map((n) => {
            const l = trimLine(BUDGET_CENTER.x, BUDGET_CENTER.y, n.x, n.y, 13, 4)
            return (
              <g key={n.item}>
                <line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  className="l-hair"
                  style={{ fill: 'none', strokeWidth: 0.7 }}
                />
                <polygon
                  points={arrowhead(BUDGET_CENTER.x, BUDGET_CENTER.y, n.x, n.y, 0.56, 2)}
                  className="fill-ink"
                  style={{ opacity: 0.5 }}
                />
              </g>
            )
          })}
          {/* Quote-slip connectors start well clear of the department's own
              label (a large start gap, not the usual small trim) so the
              dashed line never travels underneath that text. */}
          {QUOTE_SLIPS.map((s) => {
            const node = BUDGET_NODES.find((n) => n.item === s.forItem)
            if (!node) return null
            const l = trimLine(node.x, node.y, quoteSlipX(s), s.y, 17, 3)
            return (
              <line
                key={s.label}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                className="l-hair"
                style={{ fill: 'none', strokeWidth: 0.6, strokeDasharray: '2 1.6' }}
              />
            )
          })}
          <circle
            cx={BUDGET_CENTER.x}
            cy={BUDGET_CENTER.y}
            r={13}
            className="l-med"
            style={{ fill: 'var(--paper-warm)', strokeWidth: 1.3 }}
          />
        </svg>

        {/* Central hub label — plain HTML over the SVG circle so the text
            itself never stretches with the non-uniform SVG scaling. */}
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
          style={{ left: `${BUDGET_CENTER.x}%`, top: `${BUDGET_CENTER.y}%`, width: '5.5rem' }}
        >
          <span className="label text-[0.56rem] leading-tight text-ink-45">Production</span>
          <span className="label text-[0.56rem] leading-tight text-ink-45">Budget</span>
        </div>

        {/* Department branches — hover highlights the node and reveals its
            note, the same corner-bracket callout treatment used across
            this case study's other diagrams. */}
        {/* Tooltips open sideways rather than above/below: with eight
            branches stacked closely down the card, a vertical callout
            would just about always land on the next department's own
            label — opening horizontally, into the mostly-empty right
            (or left, for the two branches nearest the card's right
            edge) side of the board, never competes with a neighbour's
            vertical space. */}
        {BUDGET_NODES.map((n) => {
          const openLeft = n.x > 46
          return (
            <div
              key={n.item}
              className="group/dept absolute z-10 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div className="flex items-center gap-1.5 bg-paper py-0.5 pr-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rotate-45 border border-ink-45 bg-paper transition-colors duration-300 group-hover/dept:border-accent-orange group-hover/dept:bg-accent-orange"
                />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1">
                    <span className="label text-[0.58rem] whitespace-nowrap text-ink transition-colors duration-300 group-hover/dept:text-accent-orange">
                      {n.item}
                    </span>
                    <span className="label text-[0.5rem] text-ink-25">{n.share}%</span>
                  </div>
                  <div className="mt-0.5 h-[3px] w-14 border border-ink-25 bg-paper">
                    <div
                      className="h-full bg-ink/60 transition-[width] duration-300 group-hover/dept:bg-accent-orange"
                      style={{ width: `${n.weight}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hover-only and unreachable on touch devices anyway, so
                  below `md` it's skipped outright rather than left to
                  occupy — invisibly — layout space its fixed width can't
                  fit inside a narrow column. */}
              {!isMobile && (
                <div
                  role="tooltip"
                  className={`pointer-events-none absolute top-1/2 z-30 w-36 -translate-y-1/2 border border-ink-25 bg-paper p-1.5 text-left text-[0.6rem] leading-snug text-ink-70 opacity-0 shadow-[0_10px_22px_-10px_var(--ink-45)] transition-[opacity,transform] duration-200 ease-out group-hover/dept:opacity-100 ${
                    openLeft
                      ? 'right-full mr-2 -translate-x-1 group-hover/dept:translate-x-0'
                      : 'left-full ml-2 translate-x-1 group-hover/dept:translate-x-0'
                  }`}
                >
                  <CornerBrackets />
                  {n.note}
                </div>
              )}
            </div>
          )
        })}

        {/* Vendor-quotation slips — small rotated chits paperclipped back
            to the two departments actually shopped across vendors. */}
        {QUOTE_SLIPS.map((s) => (
          <div
            key={s.label}
            className="absolute z-10 w-[5.2rem] -translate-y-1/2 border border-ink-25 bg-paper px-1.5 py-1 text-center shadow-[0_3px_8px_-4px_var(--ink-45)] transition-transform duration-300 ease-out hover:-translate-y-[calc(50%+2px)]"
            style={{
              left: `${quoteSlipX(s)}%`,
              top: `${s.y}%`,
              transform: `translateY(-50%) rotate(${s.forItem === 'Set' ? -5 : 4}deg)`,
            }}
          >
            <span className="label block text-[0.46rem] leading-tight text-ink-45">{s.label}</span>
          </div>
        ))}

        {/* Approval stamp — one mark standing in for the whole quotation
            sign-off pass, not one per department. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute flex flex-col items-center justify-center rounded-full border-2 border-double text-center opacity-60"
          style={{
            left: '70%',
            top: '38%',
            width: '4.4rem',
            height: '4.4rem',
            transform: 'translate(-50%, -50%) rotate(-14deg)',
            borderColor: 'var(--redline)',
            color: 'var(--redline)',
          }}
        >
          <span className="label text-[0.46rem] leading-none">Approved</span>
          <span className="label text-[0.36rem] leading-none">Pre-Procurement</span>
        </div>

        {/* Handwritten-style annotation, the kind of note a production
            manager scribbles on their own copy. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute font-display text-[0.56rem] leading-tight text-ink-45 italic"
          style={{
            left: isMobile ? '54%' : '68%',
            top: '60%',
            width: isMobile ? '6rem' : '7rem',
            transform: 'rotate(-3deg)',
          }}
        >
          quotes weighed on quality, not just price
        </span>
      </div>

      {/* Contingency — outside the network on purpose; it was held back,
          never allocated to a branch. */}
      <div className="absolute right-2 bottom-2 z-20 w-[8rem] border border-dashed border-ink-25 bg-paper-warm/90 p-1.5 transition-colors duration-300 hover:border-ink-45">
        <span className="label block text-[0.54rem] text-ink-45">Contingency</span>
        <span className="label block text-[0.54rem] text-accent-orange">Reserved</span>
        <span
          className="mt-1 block font-display text-[0.52rem] leading-tight text-ink-45 italic"
          style={{ transform: 'rotate(-2deg)' }}
        >
          held back on purpose
        </span>
      </div>
    </div>
  )
}

/* ---- 04. Production Workflow ----------------------------------------------

   Not a Gantt — a horizontal journey toward one destination, Opening
   Night, the way a production bible would actually draw it: Lighting
   Ready and Projection Ready run as parallel department tracks off
   Department Coordination and converge back at Technical Rehearsal,
   because that's the real dependency, not two more beats on a single
   line. Each milestone is a small archival card; hovering it expands
   into its checklist. */

type WorkflowNode = {
  key: string
  label: string
  x: number
  y: number
  side: 'above' | 'below'
  checklist: string[]
  note: string
  destination?: boolean
}

const WORKFLOW_NODES: WorkflowNode[] = [
  { key: 'planning', label: 'Planning', x: 4, y: 50, side: 'below', note: 'Where every schedule starts.', checklist: ['Script locked', 'Creative brief circulated'] },
  { key: 'venue', label: 'Venue Locked', x: 17.1, y: 50, side: 'above', note: 'Everything downstream counts back from this date.', checklist: ['Dates confirmed', 'Load-in slot reserved'] },
  { key: 'blocking', label: 'Blocking', x: 30.3, y: 50, side: 'below', note: 'Movement fixed before tech adds complexity.', checklist: ['Blocking notes finalised', 'Set installed'] },
  { key: 'dept', label: 'Dept. Coordination', x: 43.4, y: 50, side: 'above', note: 'The point every department has to agree.', checklist: ['Lighting & projection synced', 'Costumes fitted'] },
  { key: 'lighting', label: 'Lighting Ready', x: 50, y: 14, side: 'above', note: 'Focus complete ahead of tech.', checklist: ['Rig focused', 'Cues plotted'] },
  { key: 'projection', label: 'Projection Ready', x: 50, y: 86, side: 'below', note: 'Tested against every seat in the house.', checklist: ['Mapping tested', 'Sightlines checked'] },
  { key: 'tech', label: 'Tech Rehearsal', x: 56.6, y: 50, side: 'below', note: 'Lighting and projection run together for the first time.', checklist: ['Cue sheet approved', 'Sound checked'] },
  { key: 'cue', label: 'Cue-to-Cue', x: 69.7, y: 50, side: 'above', note: 'A precision pass before performers run it live.', checklist: ['Every cue called', 'Timing adjusted'] },
  { key: 'dress', label: 'Dress Rehearsal', x: 82.9, y: 50, side: 'below', note: 'The last rehearsal that counts as one.', checklist: ['Costumes ready', 'Full run without stops'] },
  { key: 'opening', label: 'Opening Night', x: 96, y: 50, side: 'above', note: 'Every checklist behind it, cleared.', checklist: ['Front of house briefed', 'Go / no-go cleared'], destination: true },
]

const WORKFLOW_NODE_BY_KEY = new Map(WORKFLOW_NODES.map((n) => [n.key, n]))

const WORKFLOW_SEGMENTS: [string, string][] = [
  ['planning', 'venue'],
  ['venue', 'blocking'],
  ['blocking', 'dept'],
  ['dept', 'lighting'],
  ['lighting', 'tech'],
  ['dept', 'projection'],
  ['projection', 'tech'],
  ['tech', 'cue'],
  ['cue', 'dress'],
  ['dress', 'opening'],
]

const WORKFLOW_CALLOUTS = [
  { text: '✓ Set Installed', x: 10, y: 18 },
  { text: '✓ Lighting Focus Complete', x: 37, y: 18 },
  { text: '✓ Projection Mapping Tested', x: 78, y: 97 },
  { text: '✓ Cue Sheet Approved', x: 63, y: 18 },
  { text: '✓ Costumes Ready', x: 88, y: 18 },
]

function WorkflowMilestone({ n, isMobile }: { n: WorkflowNode; isMobile: boolean }): ReactElement {
  const edge = n.x < 12 ? 'left-0 translate-x-0' : n.x > 88 ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2'

  return (
    <div
      className="group/wf absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${n.x}%`, top: `${n.y}%` }}
    >
      {n.destination ? (
        <span
          aria-hidden="true"
          className="relative flex size-3 items-center justify-center rounded-full border-2 bg-paper"
          style={{ borderColor: 'var(--accent-orange)', boxShadow: '0 0 0 3px var(--paper)' }}
        >
          <span className="size-1 rounded-full bg-accent-orange" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="block size-2 rotate-45 border border-ink bg-paper transition-colors duration-300 group-hover/wf:border-accent-orange group-hover/wf:bg-accent-orange"
        />
      )}

      <span
        className={`label pointer-events-none absolute bg-paper px-1 py-0.5 text-[0.54rem] whitespace-nowrap transition-colors duration-300 group-hover/wf:text-accent-orange ${edge} ${
          n.destination ? 'text-accent-orange' : 'text-ink-45'
        } ${n.side === 'above' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'}`}
      >
        {n.label}
      </span>

      {/* Hover-only and unreachable on touch devices anyway; below `md`
          it's skipped outright rather than left to occupy — invisibly —
          layout space its fixed width can't fit inside a narrow card
          (the edge-aware anchor above only accounts for the anchor
          point, not this box's own width against a phone-narrow
          container). */}
      {!isMobile && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-30 w-40 border border-ink-25 bg-paper p-2 text-left opacity-0 shadow-[0_10px_22px_-10px_var(--ink-45)] transition-[opacity,transform] duration-300 ease-out group-hover/wf:opacity-100 ${edge} ${
            n.side === 'above'
              ? 'bottom-full mb-6 translate-y-1 group-hover/wf:translate-y-0'
              : 'top-full mt-6 -translate-y-1 group-hover/wf:translate-y-0'
          }`}
        >
          <CornerBrackets />
          <ul className="space-y-0.5">
            {n.checklist.map((item) => (
              <li key={item} className="flex items-baseline gap-1 text-[0.6rem] leading-snug text-ink-70">
                <span className="text-accent-orange">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 font-display text-[0.58rem] leading-snug text-ink-45 italic">{n.note}</p>
        </div>
      )}
    </div>
  )
}

function ProductionWorkflowArtifact(): ReactElement {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <div className="relative h-[20rem] w-full border border-ink-25 bg-paper">
      <div className="label absolute inset-x-0 top-0 z-20 flex items-center gap-2 border-b border-ink-25 bg-paper-warm px-3 py-2 whitespace-nowrap text-ink-45">
        Production Workflow
        <span className="ml-auto hidden text-ink-25 sm:inline">Production Bible</span>
      </div>

      <div className="absolute inset-x-0 top-8 bottom-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {WORKFLOW_SEGMENTS.map(([fromKey, toKey]) => {
            const a = WORKFLOW_NODE_BY_KEY.get(fromKey)
            const b = WORKFLOW_NODE_BY_KEY.get(toKey)
            if (!a || !b) return null
            const l = trimLine(a.x, a.y, b.x, b.y, 3, 3)
            return (
              <g key={`${fromKey}-${toKey}`}>
                <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="l-thin" style={{ fill: 'none', strokeWidth: 0.8 }} />
                <polygon
                  points={arrowhead(a.x, a.y, b.x, b.y, 0.85, 2.2)}
                  className="fill-ink"
                  style={{ opacity: 0.55 }}
                />
              </g>
            )
          })}
        </svg>

        {WORKFLOW_CALLOUTS.map((c, i) => (
          <span
            key={c.text}
            aria-hidden="true"
            className="label pointer-events-none absolute z-0 border border-ink-25 bg-paper-warm px-1 py-0.5 text-[0.42rem] leading-none whitespace-nowrap text-ink-45"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%, -50%) rotate(${i % 2 === 0 ? -3 : 3}deg)` }}
          >
            {c.text}
          </span>
        ))}

        {WORKFLOW_NODES.map((n) => (
          <WorkflowMilestone key={n.key} n={n} isMobile={isMobile} />
        ))}
      </div>
    </div>
  )
}

const ARTIFACTS: Record<'budget' | 'workflow', () => ReactElement> = {
  budget: BudgetBoardArtifact,
  workflow: ProductionWorkflowArtifact,
}

const ARTIFACT_TITLES: Record<'budget' | 'workflow', string> = {
  budget: 'Budget Board',
  workflow: 'Production Workflow',
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

/* A pillar body can carry more than one paragraph (see Budgeting and
   Rehearsal & Production Planning) — the YAML separates them with a
   blank line, which a folded block scalar collapses to a single `\n`.
   Everything else on this page is still one paragraph, so this just
   renders as a single <p> for those, unchanged. */
function PillarBody({ body }: { body: string }): ReactElement {
  const paragraphs = body.split(/\n+/).filter(Boolean)
  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[0.9rem] leading-snug text-ink-70">
          {para}
        </p>
      ))}
    </div>
  )
}

export function FromScriptToStage({ pillars }: { pillars: CaseStudy['pillars'] }): ReactElement {
  const [openKey, setOpenKey] = useState<'budget' | 'workflow' | null>(null)

  useEffect(() => {
    if (openKey === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openKey])

  return (
    <section id="from-script-to-stage" className="mt-14">
      <div className="mb-2 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">From Script to Stage</h2>
        <span className="label ml-auto text-ink-45">Production Dossier</span>
      </div>
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
        // only other index reaching this branch (3) → 'workflow'.
        const key = i === 0 ? 'budget' : 'workflow'
        const Artifact = ARTIFACTS[key]
        const visualLeft = i % 2 === 1

        return (
          <Reveal key={p.title} className="mb-14 last:mb-0">
            <PillarDivider index={i} title={p.title} showLine={i !== 0} />

            <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[9fr_11fr]">
              <div className={visualLeft ? 'lg:order-2' : 'lg:order-1'}>
                <PillarBody body={p.body} />
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
