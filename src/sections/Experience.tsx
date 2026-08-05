import { useState, type ReactElement } from 'react'

import { experience } from '../content'
import type { SectionMeta } from '../content'
import { Sheet } from '../components/Sheet'
import { useReveal } from '../hooks/useReveal'
import { Crosshair, Note } from '../lib/draft'

/* A run of show, drawn as an elevation: one rising staircase, one step per
   role, read left to right in the order she worked them — the same
   vocabulary (l-* line weights, CAD nodes, dimension strings) as the hero
   banner and the About/Skills detail drawings, just laid on its side.

   The stagger on scroll-in is hand-timed rather than the shared .reveal
   fade: the baseline draws first, then each tread+riser in turn, then the
   nodes and cards lift into place after — one useReveal trigger, every
   element's own transition-delay doing the choreography. Hover is tracked
   in state (not CSS :hover) because hovering a card needs to brighten a
   specific segment of the one connected line elsewhere in the SVG. */

const VIEW_W = 1200
const VIEW_H = 260
const START_X = 50
const START_Y = 210
const STEP_RUN = 260
const STEP_RISE = 42

export function Experience({ meta }: { meta: SectionMeta }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [hovered, setHovered] = useState<number | null>(null)
  const items = experience.items

  const treads: { x1: number; x2: number; y: number }[] = []
  const risers: { x: number; y1: number; y2: number }[] = []
  const nodes: { x: number; y: number }[] = []
  let cx = START_X
  let cy = START_Y
  for (let i = 0; i < items.length; i++) {
    const nx = cx + STEP_RUN
    treads.push({ x1: cx, x2: nx, y: cy })
    cx = nx
    const ny = cy - STEP_RISE
    risers.push({ x: cx, y1: cy, y2: ny })
    cy = ny
    nodes.push({ x: cx, y: cy })
  }
  const lastX = cx

  return (
    <Sheet meta={meta}>
      <div ref={ref}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-[10rem] w-full sm:h-[12rem]"
          role="img"
          aria-label="A rising staircase diagram, one step per role, ascending left to right in the order she worked them"
        >
          <Crosshair x={20} y={START_Y} size={9} />
          <Crosshair x={lastX + 20} y={risers[risers.length - 1]?.y2 ?? START_Y} size={9} />

          <line
            x1={START_X}
            y1={START_Y}
            x2={START_X}
            y2={START_Y + 16}
            className="l-hair"
          />

          {treads.map((t, i) => (
            <line
              key={`tread-${i}`}
              x1={t.x1}
              y1={t.y}
              x2={t.x2}
              y2={t.y}
              className={hovered === i ? 'l-bold' : 'l-med'}
              style={{
                strokeDasharray: STEP_RUN,
                strokeDashoffset: shown ? 0 : STEP_RUN,
                transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                transitionDelay: shown ? `${i * 240}ms` : '0ms',
              }}
            />
          ))}

          {risers.map((r, i) => (
            <line
              key={`riser-${i}`}
              x1={r.x}
              y1={r.y1}
              x2={r.x}
              y2={r.y2}
              className={hovered === i ? 'l-bold' : 'l-med'}
              style={{
                strokeDasharray: STEP_RISE,
                strokeDashoffset: shown ? 0 : STEP_RISE,
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
                transitionDelay: shown ? `${i * 240 + 200}ms` : '0ms',
              }}
            />
          ))}

          {items.map((role, i) => {
            const n = nodes[i]
            if (!n) return null
            const active = hovered === i

            return (
              <g
                key={role.title}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  transitionDelay: shown ? `${520 + i * 220}ms` : '0ms',
                }}
              >
                {active && (
                  <circle cx={n.x} cy={n.y} r={20} className="fill-ink" style={{ opacity: 0.08 }} />
                )}
                <line x1={n.x} y1={n.y + 7} x2={n.x} y2={START_Y + 16} className="l-hair" />
                {/* A diamond drawn from explicit points, not a rotated square —
                    the viewBox is stretched non-uniformly (preserveAspectRatio
                    "none"), and rotating a square before that stretch shears
                    it into a chevron instead of a rhombus. Points defined
                    directly in the same space as everything else just get
                    stretched consistently with the rest of the drawing. */}
                <polygon
                  points={`${n.x},${n.y - 6} ${n.x + 6},${n.y} ${n.x},${n.y + 6} ${n.x - 6},${n.y}`}
                  className={`fill-paper transition-transform duration-300 ${active ? 'l-bold scale-125' : 'l-med scale-100'}`}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
                <Note x={n.x} y={START_Y + 32} size={11} tone="dim">
                  {role.period}
                </Note>
              </g>
            )
          })}

          <Note x={20} y={START_Y + 52} anchor="start" size={12}>
            CAREER PROGRESSION
          </Note>
          <Note x={20} y={START_Y + 66} anchor="start" size={10} tone="dim">
            ELEVATION — NOT TO SCALE
          </Note>
        </svg>

        <div className="mt-6 grid gap-px border border-ink-45 bg-ink-25 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((role, i) => (
            <div
              key={role.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative bg-paper p-5 shadow-[0_0_0_0_transparent] transition-[box-shadow] duration-300 ease-out hover:z-10 hover:shadow-[0_10px_24px_-12px_var(--ink-25)]"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown
                  ? hovered === i
                    ? 'translateY(-3px)'
                    : 'translateY(0)'
                  : 'translateY(14px)',
                transition: 'opacity 0.6s ease, transform 0.35s ease',
                transitionDelay: shown ? `${600 + i * 220}ms` : '0ms',
              }}
            >
              <span className="label mb-1.5 block text-ink-45">{role.period}</span>
              <h3 className="font-display text-[1.1rem] leading-tight font-bold">{role.title}</h3>
              <p className="mb-3 text-[0.85rem] text-ink-70">{role.org}</p>
              <ul>
                {role.notes.map((note) => (
                  <li
                    key={note}
                    className="flex items-baseline gap-2 py-0.5 text-[0.82rem] leading-snug text-ink-70"
                  >
                    <span aria-hidden="true" className="mt-[-0.3em] h-px w-3 shrink-0 bg-ink-25" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  )
}
