import { useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useReveal } from '../hooks/useReveal'

/* Scope of Ownership and Project Complexity used to be two separate,
   scroll-triggered sections, each pairing a diagram with a list. They're
   now one sheet: a hub-and-spoke "command map" of what she owned on the
   left, a risk matrix of why that ownership was operationally hard on the
   right, side by side in one desktop viewport — the same "read it in one
   glance" discipline the opening sheet (see CaseStudy.tsx) uses, on a
   `lg:` breakpoint for the same reason: six modules and six risk cards
   have no graceful way to compress into a phone screen, so mobile falls
   back to ordinary, fully-scrollable document order.

   One shared `useReveal()` on the outer wrapper drives both halves'
   entrance stagger together, so scrolling this sheet into view reads as
   one moment rather than two. */

function SubsectionHeading({ children, tag }: { children: string; tag: string }): ReactElement {
  return (
    <div className="mb-3 flex shrink-0 items-baseline gap-3 border-b-2 border-ink pb-2.5">
      <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
      <h2 className="font-display text-[clamp(1.05rem,1.9vw,1.3rem)] font-bold">{children}</h2>
      <span className="label ml-auto text-ink-45">{tag}</span>
    </div>
  )
}

/* ---- Scope of Ownership: hub-and-spoke command map ---------------------- */

const HUB = { x: 50, y: 50 }
const HUB_R = 11
/* Clockwise from the top, matching the order modules are drawn in. The top
   and bottom spokes (Production Planning, Artist & Hospitality) run a
   shorter radius than the diagonal/side ones — a full-length vertical
   spoke pushes its box past the top/bottom edge of the panel and forces
   the sheet to scroll, where the side spokes have headroom to spare. */
const MODULE_RADII = [24, 31, 31, 24, 31, 31]
const MODULE_ANGLES = [-90, -30, 30, 90, 150, 210]
type Anchor = 'top' | 'right' | 'bottom' | 'left'
const MODULE_ANCHORS: Anchor[] = ['top', 'right', 'right', 'bottom', 'left', 'left']

const ANCHOR_TRANSFORM: Record<Anchor, string> = {
  top: 'translate(-50%, calc(-100% - 10px))',
  right: 'translate(10px, -50%)',
  bottom: 'translate(-50%, 10px)',
  left: 'translate(calc(-100% - 10px), -50%)',
}
const ANCHOR_TEXT: Record<Anchor, string> = {
  top: 'text-center',
  right: 'text-left',
  bottom: 'text-center',
  left: 'text-right',
}
const ANCHOR_ITEMS: Record<Anchor, string> = {
  top: 'items-center',
  right: 'items-start',
  bottom: 'items-center',
  left: 'items-end',
}

function trimLine(ax: number, ay: number, bx: number, by: number, startGap: number, endGap: number) {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  return { x1: ax + ux * startGap, y1: ay + uy * startGap, x2: bx - ux * endGap, y2: by - uy * endGap }
}

function OwnershipMap({ ownership, shown }: { ownership: CaseStudy['ownership']; shown: boolean }): ReactElement {
  const [hovered, setHovered] = useState<number | null>(null)

  const points = ownership.map((_, i) => {
    const rad = (MODULE_ANGLES[i] * Math.PI) / 180
    const r = MODULE_RADII[i]!
    return { x: HUB.x + r * Math.cos(rad), y: HUB.y + r * Math.sin(rad) }
  })

  return (
    <>
    <div className="relative hidden min-h-0 flex-1 lg:block">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={HUB_R}
          className="l-construct"
          style={{ fill: 'var(--paper-warm)', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' }}
        />
        {points.map((p, i) => {
          const l = trimLine(HUB.x, HUB.y, p.x, p.y, HUB_R, 3)
          const active = hovered === i
          return (
            <line
              key={ownership[i]!.domain}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              className={active ? 'l-bold' : 'l-thin'}
              style={{
                stroke: active ? 'var(--accent-orange)' : undefined,
                strokeWidth: active ? 2 : 1.1,
                vectorEffect: 'non-scaling-stroke',
                fill: 'none',
                opacity: shown ? 1 : 0,
                transition: 'opacity 0.5s ease, stroke 0.25s ease, stroke-width 0.25s ease',
                transitionDelay: shown ? `${i * 110}ms` : '0ms',
              }}
            />
          )
        })}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={HUB_R}
          className="l-bold"
          style={{
            fill: 'var(--paper-warm)',
            strokeWidth: 2.2,
            vectorEffect: 'non-scaling-stroke',
            opacity: shown ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </svg>

      <div
        className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
        style={{ left: `${HUB.x}%`, top: `${HUB.y}%`, opacity: shown ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <span className="label text-[0.6rem] leading-tight text-ink">Production</span>
        <span className="label text-[0.6rem] leading-tight text-ink">Manager</span>
      </div>

      {ownership.map((m, i) => {
        const p = points[i]!
        const anchor = MODULE_ANCHORS[i]!
        return (
          <div
            key={m.domain}
            className={`group absolute z-10 flex w-36 flex-col ${ANCHOR_ITEMS[anchor]}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: ANCHOR_TRANSFORM[anchor],
              opacity: shown ? 1 : 0,
              transition: 'opacity 0.5s ease',
              transitionDelay: shown ? `${i * 110 + 150}ms` : '0ms',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className={`w-full border border-ink-25 bg-paper px-2.5 py-2 shadow-[0_4px_12px_-8px_var(--ink-25)] transition-[border-color,box-shadow] duration-300 ${ANCHOR_TEXT[anchor]}`}
              style={
                hovered === i
                  ? { borderColor: 'var(--accent-orange)', boxShadow: '0 0 14px -4px var(--accent-orange)' }
                  : undefined
              }
            >
              <h3
                className="font-display text-[0.8rem] leading-tight font-bold transition-colors duration-300"
                style={{ color: hovered === i ? 'var(--accent-orange)' : undefined }}
              >
                {m.domain}
              </h3>
              <div className={`mt-1 flex flex-wrap gap-1 ${anchor === 'right' ? 'justify-start' : anchor === 'left' ? 'justify-end' : 'justify-center'}`}>
                {m.keywords.map((k) => (
                  <span key={k} className="label border border-ink-25 px-1 py-0.5 text-[0.5rem] text-ink-45">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>

    {/* The command map's radial layout has no graceful way to compress
        into a phone's width — the boxes need real horizontal room to
        fan out from the hub. Mobile gets the same six modules as a
        plain stacked list instead. */}
    <div className="flex flex-col gap-2.5 lg:hidden">
      {ownership.map((m) => (
        <div key={m.domain} className="border border-ink-25 bg-paper p-3">
          <h3 className="font-display text-[0.9rem] font-bold">{m.domain}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {m.keywords.map((k) => (
              <span key={k} className="label border border-ink-25 px-1.5 py-0.5 text-[0.56rem] text-ink-45">
                {k}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

/* ---- Project Complexity: risk matrix cards -------------------------------- */

function RiskIcon({ index }: { index: number }): ReactElement {
  const stroke = 'l-thin'
  switch (index % 6) {
    case 0: // Multiple Venues — a small cluster of buildings
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <rect x={4} y={11} width={7} height={13} className={stroke} style={{ fill: 'none' }} />
          <rect x={13} y={6} width={7} height={18} className={stroke} style={{ fill: 'none' }} />
          <rect x={20} y={14} width={5} height={10} className={stroke} style={{ fill: 'none' }} />
        </svg>
      )
    case 1: // Parallel Productions — two parallel tracks
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <line x1={4} y1={10} x2={24} y2={10} className={stroke} />
          <line x1={4} y1={18} x2={24} y2={18} className={stroke} />
          <circle cx={9} cy={10} r={1.8} className="fill-ink" style={{ stroke: 'none' }} />
          <circle cx={17} cy={18} r={1.8} className="fill-ink" style={{ stroke: 'none' }} />
        </svg>
      )
    case 2: // Fixed Show Timings — a clock
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <circle cx={14} cy={14} r={10} className={stroke} style={{ fill: 'none' }} />
          <line x1={14} y1={14} x2={14} y2={7.5} className="l-hair" />
          <line x1={14} y1={14} x2={19} y2={16.5} className="l-hair" />
        </svg>
      )
    case 3: // Shared Resources — overlapping circles
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <circle cx={11} cy={14} r={7.5} className={stroke} style={{ fill: 'none' }} />
          <circle cx={17} cy={14} r={7.5} className={stroke} style={{ fill: 'none' }} />
        </svg>
      )
    case 4: // Live Decision Making — a branch point
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <line x1={7} y1={5} x2={7} y2={14} className={stroke} />
          <path d="M7 14L20 22" className={stroke} style={{ fill: 'none' }} />
          <path d="M7 14L20 6" className={stroke} style={{ fill: 'none' }} />
          <circle cx={7} cy={14} r={1.8} className="fill-ink" style={{ stroke: 'none' }} />
        </svg>
      )
    default: // Interdependent Teams — a small connected network
      return (
        <svg viewBox="0 0 28 28" className="size-5" aria-hidden="true">
          <line x1={7} y1={8} x2={20} y2={8} className="l-hair" />
          <line x1={7} y1={8} x2={13.5} y2={21} className="l-hair" />
          <line x1={20} y1={8} x2={13.5} y2={21} className="l-hair" />
          <circle cx={7} cy={8} r={2.4} className={stroke} style={{ fill: 'var(--paper)' }} />
          <circle cx={20} cy={8} r={2.4} className={stroke} style={{ fill: 'var(--paper)' }} />
          <circle cx={13.5} cy={21} r={2.4} className={stroke} style={{ fill: 'var(--paper)' }} />
        </svg>
      )
  }
}

function ComplexityGrid({ risks, shown }: { risks: CaseStudy['risks']; shown: boolean }): ReactElement {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
      {risks.map((risk, i) => (
        <div
          key={risk.item}
          className="group relative flex flex-col border border-ink-25 bg-paper p-3 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_28px_-16px_var(--ink-45),0_0_16px_-8px_var(--accent-orange)]"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
            transitionDelay: shown ? `${i * 90}ms` : '0ms',
            borderColor: undefined,
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-orange)')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = '')}
        >
          <div className="flex items-center justify-between">
            <span className="label text-ink-25">C-{String(i + 1).padStart(2, '0')}</span>
            <span className="text-ink-45 transition-transform duration-300 group-hover:scale-110 group-hover:text-accent-orange">
              <RiskIcon index={i} />
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-[0.86rem] leading-tight font-bold">{risk.item}</h3>
          <p className="mt-1 text-[0.72rem] leading-snug font-semibold text-accent-orange">{risk.metric}</p>
          <p className="mt-1 text-[0.72rem] leading-snug text-ink-70">{risk.note}</p>
        </div>
      ))}
    </div>
  )
}

/* ---- assembled sheet ------------------------------------------------------ */

export function OperationsMap({
  ownership,
  risks,
}: {
  ownership: CaseStudy['ownership']
  risks: CaseStudy['risks']
}): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  if (ownership.length === 0 && risks.length === 0) return <></>

  return (
    <div ref={ref} className="flex flex-col text-ink lg:h-dvh lg:min-h-[34rem]">
      <div className="gutter flex min-h-0 flex-1 flex-col overflow-hidden py-[clamp(2.5rem,6vh,4rem)]">
        <div className="relative grid min-h-0 flex-1 gap-x-10 gap-y-10 lg:grid-cols-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 lg:block"
          >
            <div className="h-full border-l border-dashed border-ink-25" />
          </div>

          <div className="flex min-h-0 flex-col">
            <SubsectionHeading tag="Command Map">Scope of Ownership</SubsectionHeading>
            <OwnershipMap ownership={ownership} shown={shown} />
          </div>

          <div className="flex min-h-0 flex-col">
            <SubsectionHeading tag={`${risks.length} Factors`}>Project Complexity</SubsectionHeading>
            <ComplexityGrid risks={risks} shown={shown} />
          </div>
        </div>
      </div>
    </div>
  )
}
