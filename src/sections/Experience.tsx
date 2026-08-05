import { useEffect, useState, type ReactElement } from 'react'

import { experience } from '../content'
import type { SectionMeta } from '../content'
import { Sheet } from '../components/Sheet'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReveal } from '../hooks/useReveal'
import { Crosshair, DimH, LanternRun, Note, Truss } from '../lib/draft'

/* A run of show, drawn as an elevation: one rising staircase, one step per
   role, read left to right in the order she worked them — the same
   vocabulary (l-* line weights, CAD nodes, dimension strings) as the hero
   banner and the About/Skills detail drawings, just laid on its side.

   Each tread runs a little longer than the last (weight 1, 1.2, 1.4, ...) so
   the climb visibly accelerates toward the present, rather than reading as
   evenly spaced years. That same weighting drives the card grid below via
   CSS `fr` columns, so a node's x-position and its card's column boundary
   are the same fraction of the same width by construction — no separate
   alignment math to keep in sync.

   The stagger on scroll-in is hand-timed rather than the shared .reveal
   fade: the baseline draws first, then each tread+riser in turn, then the
   nodes, connectors and cards lift into place after — one useReveal
   trigger, every element's own transition-delay doing the choreography.
   Hover is tracked in state (not CSS :hover) because hovering a card needs
   to brighten a specific node and connector elsewhere in the SVG. */

const VIEW_W = 1000
const VIEW_H = 200
const START_Y = 150
const RISE = 26

export function Experience({ meta }: { meta: SectionMeta }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [hovered, setHovered] = useState<number | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const items = experience.items
  const lastIndex = items.length - 1

  /* The scroll-in stagger and the hover reaction share the same style
     objects below, so a naive `transitionDelay: shown ? '${i*240}ms' : 0`
     would keep re-applying that entrance delay to every hover-triggered
     colour change forever (CSS transition-delay is just whatever the style
     says *now*, not "only on the way in") — hovering the first tread would
     stay snappy but the last one could lag most of a second behind. Once
     the longest-scheduled entrance transition has had time to finish,
     `settled` flips true and every delay below collapses to 0, leaving
     hover free to react immediately. */
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (!shown) return
    const worstCase = 780 + Math.max(0, items.length - 1) * 220 + 600
    const t = setTimeout(() => setSettled(true), worstCase)
    return () => clearTimeout(t)
  }, [shown, items.length])
  const entering = shown && !settled

  /* Growing weights, not a flat step — the literal "increasing length"
     the redesign asks for. Also doubles as the fr-track list for the
     card grid below, so the two never drift apart. */
  const treadWeights = items.map((_, i) => 1 + i * 0.2)
  const totalWeight = treadWeights.reduce((a, b) => a + b, 0)

  const treads: { x1: number; x2: number; y: number }[] = []
  const risers: { x: number; y1: number; y2: number }[] = []
  const nodes: { x: number; y: number }[] = []
  let cx = 0
  let cy = START_Y
  let cum = 0
  for (let i = 0; i < items.length; i++) {
    cum += treadWeights[i]
    const nx = (cum / totalWeight) * VIEW_W
    treads.push({ x1: cx, x2: nx, y: cy })
    cx = nx
    const ny = cy - RISE
    risers.push({ x: cx, y1: cy, y2: ny })
    cy = ny
    nodes.push({ x: cx, y: cy })
  }

  return (
    <Sheet meta={meta}>
      <div ref={ref}>
        <div className="mb-3 flex items-baseline justify-between">
          <span className="label text-ink-70">Professional Timeline</span>
          <span className="label text-ink-45">Elevation — Not to Scale</span>
        </div>

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-[8.5rem] w-full sm:h-[10rem]"
          role="img"
          aria-label="A rising staircase diagram, one step per role, ascending left to right in the order she worked them, each step longer than the last"
        >
          {/* Architectural filler for the otherwise-empty upper field —
              generic drafting furniture, not real measurements, kept at a
              near-invisible opacity so it reads as texture, not content. */}
          <g style={{ opacity: 0.07 }} aria-hidden="true">
            <Crosshair x={44} y={26} size={7} />
            <Crosshair x={956} y={26} size={7} />
            <DimH x1={60} x2={520} y={16} from={16} label={`20'-0"`} size={8} />
            <DimH x1={560} x2={940} y={16} from={16} label={`16'-6"`} size={8} />
            <Truss x={620} y={30} length={300} depth={12} bays={5} />
            <LanternRun x={620} y={30} length={300} count={3} scale={0.5} />
          </g>

          <Crosshair x={12} y={START_Y} size={7} />
          <Crosshair x={VIEW_W - 12} y={(nodes[lastIndex]?.y ?? START_Y) - 12} size={7} />

          <line x1={0} y1={START_Y} x2={0} y2={START_Y + 16} className="l-hair" />

          {treads.map((t, i) => (
            <line
              key={`tread-${i}`}
              x1={t.x1}
              y1={t.y}
              x2={t.x2}
              y2={t.y}
              className={hovered === i ? 'l-bold' : 'l-med'}
              style={{
                stroke: hovered === i ? 'var(--accent-orange)' : undefined,
                strokeDasharray: t.x2 - t.x1,
                strokeDashoffset: shown ? 0 : t.x2 - t.x1,
                transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
                transitionDelay: entering ? `${i * 240}ms` : '0ms',
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
                stroke: hovered === i ? 'var(--accent-orange)' : undefined,
                strokeDasharray: RISE,
                strokeDashoffset: shown ? 0 : RISE,
                transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
                transitionDelay: entering ? `${i * 240 + 200}ms` : '0ms',
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
                  transitionDelay: entering ? `${520 + i * 220}ms` : '0ms',
                }}
              >
                {active && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={20}
                    style={{ fill: 'var(--accent-orange)', opacity: 0.14 }}
                  />
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
                  className={`fill-paper transition-transform duration-300 ${active ? 'scale-125' : 'scale-100'}`}
                  style={{
                    stroke: active ? 'var(--accent-orange)' : 'var(--ink)',
                    strokeWidth: active ? 2.6 : 1.9,
                    transformOrigin: `${n.x}px ${n.y}px`,
                  }}
                />
                <Note
                  x={i === lastIndex ? n.x - 4 : n.x}
                  y={START_Y + 26}
                  size={11}
                  tone="dim"
                  anchor={i === lastIndex ? 'end' : 'middle'}
                >
                  {role.period}
                </Note>
              </g>
            )
          })}
        </svg>

        {isDesktop ? (
          <svg
            viewBox={`0 0 ${VIEW_W} 24`}
            preserveAspectRatio="none"
            className="h-6 w-full"
            aria-hidden="true"
          >
            {nodes.map((n, i) => (
              <line
                key={`connector-${i}`}
                x1={n.x}
                y1={0}
                x2={n.x}
                y2={24}
                className={hovered === i ? 'l-bold' : 'l-hair'}
                style={{
                  stroke: hovered === i ? 'var(--accent-orange)' : undefined,
                  opacity: shown ? 1 : 0,
                  transition: 'opacity 0.4s ease, stroke 0.3s ease',
                  transitionDelay: entering ? `${700 + i * 220}ms` : '0ms',
                }}
              />
            ))}
          </svg>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}

        <div
          className={`grid gap-px border border-ink-45 bg-ink-25 ${isDesktop ? '' : 'grid-cols-1 sm:grid-cols-2'}`}
          style={isDesktop ? { gridTemplateColumns: treadWeights.map((w) => `${w}fr`).join(' ') } : undefined}
        >
          {items.map((role, i) => {
            const current = i === lastIndex
            const active = hovered === i

            return (
              <div
                key={role.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative bg-paper p-5 shadow-[0_0_0_0_transparent] transition-[box-shadow] duration-300 ease-out hover:z-10 ${
                  current ? 'ring-2 ring-inset ring-ink' : ''
                }`}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown
                    ? active
                      ? 'translateY(-3px)'
                      : 'translateY(0)'
                    : 'translateY(14px)',
                  transition: 'opacity 0.6s ease, transform 0.35s ease, box-shadow 0.3s ease',
                  transitionDelay: entering ? `${780 + i * 220}ms` : '0ms',
                  boxShadow: active
                    ? '0 10px 24px -12px var(--ink-25), 0 0 20px -6px var(--accent-orange)'
                    : undefined,
                  outline: active ? '1px solid var(--accent-orange)' : undefined,
                  outlineOffset: active ? '-1px' : undefined,
                }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="label text-ink-45">{role.period}</span>
                  {current && (
                    <span className="label border border-accent-orange px-1.5 py-0.5 text-accent-orange">
                      Current
                    </span>
                  )}
                </div>
                <h3
                  className={`font-display leading-tight font-bold transition-colors duration-300 ${
                    current ? 'text-[1.25rem]' : 'text-[1.1rem]'
                  } ${active ? 'text-accent-orange' : ''}`}
                >
                  {role.title}
                </h3>
                <p
                  className={`mb-3 text-[0.85rem] font-semibold transition-colors duration-300 ${
                    active ? 'text-accent-orange' : 'text-ink-70'
                  }`}
                >
                  {role.org}
                </p>
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
            )
          })}
        </div>
      </div>
    </Sheet>
  )
}
