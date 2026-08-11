/* ==========================================================================
   The four hero nodes.

   Not cards — small drafting marks that sit in the quiet field the banner
   simplification opened up, each answering one line of work with its own
   motif but the same line language (`l-hair`/`l-thin`, the mono `.label`
   type) as the rest of the sheet. A loose mesh of construction-weight
   lines (`NetworkLines`) ties the four together as interconnected
   disciplines — deliberately the faintest weight on the sheet, so it
   never competes with the nodes' own linework or the title.

   Cursor is a magnetic field, not a leash: `useMagnet` pulls every node
   within a generous radius toward the cursor, in proportion to how close
   it is, and lets a small share of each node's pull leak to the nodes
   it's connected to — so the network visibly answers as a system, not
   node-by-node. The whole field fades up and down over three-quarters of
   a second rather than switching on, and every node's position is a
   damped spring chasing that (constantly moving) target, so the motion
   trails the cursor instead of tracking it. Everything reads from a
   single rest/offset model shared by the nodes and the lines they're
   strung between, so the mesh stretches with wherever the nodes actually
   are. Off entirely under reduced motion, same as every other moving
   piece in the hero; never engaged on touch, since nothing fires
   `mousemove` there. */

import { useEffect, useRef, useState, type ReactElement } from 'react'

import { useMediaQuery } from '../hooks/useMediaQuery'

interface Vec {
  x: number
  y: number
}

interface IconProps {
  /** True for the one node the magnet currently holds. */
  active: boolean
}

interface NodeSpec {
  title: string
  caption: string
  icon: (props: IconProps) => ReactElement
  /** Rest position, as a percentage of the hero box — shared by the node
      markup and the lines struck between them. */
  rest: Vec
  delay: string
}

/** Every element that answers to `active` shares this one transition, so
    "becoming active" always reads as the same easing, whatever the icon. */
const anim = 'node-anim'

/* The label/caption read about a quarter too faint against the sheet — a
   touch stronger than the standard `--ink-70`/`--ink-45` text tokens (not
   a full step up, which would be a much bigger jump) so the nodes read as
   deliberate marks rather than background annotation, without darkening
   past what the rest of the hero's type hierarchy uses. */
const LABEL_COLOR = 'color-mix(in srgb, var(--ink) 88%, transparent)'
const CAPTION_COLOR = 'color-mix(in srgb, var(--ink) 58%, transparent)'

/** Stage front, a spotlight throw, three rows of audience. Active: the
    proscenium arc resolves from hairline to a firmer weight and the
    spotlight throw brightens, as if it had just been struck. */
function LiveIcon({ active }: IconProps): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <path d="M14 22 Q28 12 42 22" className={`${anim} l-thin ${active ? 'l-med' : ''}`} />
      <line x1="10" y1="34" x2="46" y2="34" className="l-med" />
      <path
        d="M28 15 L20 34 L36 34 Z"
        className={`${anim} l-hair ${active ? 'opacity-95' : 'opacity-60'}`}
      />
      <path d="M17 41 Q28 37 39 41" className="l-thin" />
      <path d="M14 47 Q28 42 42 47" className="l-thin" />
    </svg>
  )
}

/** A short run of storyboard frames, one holding a sketch line. Active: the
    sketch line draws itself in and the middle frame — mid-development —
    swells a couple of percent. */
function CreativeIcon({ active }: IconProps): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <rect x="8" y="20" width="13" height="16" className="l-thin" />
      <rect
        x="24"
        y="20"
        width="13"
        height="16"
        className={`${anim} l-med`}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transform: active ? 'scale(1.08)' : 'scale(1)',
        }}
      />
      <rect x="40" y="20" width="8" height="16" className="l-thin" />
      <path
        d="M27 32 Q30 24 34 30 T37 24"
        pathLength={1}
        className={`${anim} l-hair`}
        style={{ strokeDasharray: 1, strokeDashoffset: active ? 0 : 1 }}
      />
      <line x1="8" y1="42" x2="48" y2="42" className="l-thin" />
    </svg>
  )
}

/** Concentric target rings struck from a single centre point. Active: the
    rings expand a couple of percent from their shared centre and the
    crosshair ticks ease a touch further out. */
function BrandsIcon({ active }: IconProps): ReactElement {
  const ringStyle = {
    transformBox: 'fill-box' as const,
    transformOrigin: 'center',
    transform: active ? 'scale(1.06)' : 'scale(1)',
  }
  const tick = (x1: number, y1: number, x2: number, y2: number, dx: number, dy: number) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={`${anim} l-thin`}
      style={{ transform: active ? `translate(${dx}px, ${dy}px)` : 'translate(0, 0)' }}
    />
  )
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <circle cx="28" cy="28" r="18" className={`${anim} l-thin`} style={ringStyle} />
      <circle cx="28" cy="28" r="11" className={`${anim} l-thin`} style={ringStyle} />
      <circle cx="28" cy="28" r="1.6" className="fill-ink" />
      {tick(28, 6, 28, 12, 0, -1.5)}
      {tick(28, 44, 28, 50, 0, 1.5)}
      {tick(6, 28, 12, 28, -1.5, 0)}
      {tick(44, 28, 50, 28, 1.5, 0)}
    </svg>
  )
}

/** A timeline: datum line, sequenced nodes, one step ticked off. Active:
    the datum line extends a touch past its right end and the three step
    nodes resolve — slightly larger, as if just plotted. */
function OperationsIcon({ active }: IconProps): ReactElement {
  const node = (cx: number) => (
    <circle
      cx={cx}
      cy={28}
      r={3}
      className={`${anim} l-med fill-paper`}
      style={{
        transformBox: 'fill-box' as const,
        transformOrigin: 'center',
        transform: active ? 'scale(1.2)' : 'scale(1)',
      }}
    />
  )
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <line
        x1="8"
        y1="28"
        x2="48"
        y2="28"
        className={`${anim} l-thin`}
        style={{
          transformBox: 'fill-box' as const,
          transformOrigin: 'left center',
          transform: active ? 'scaleX(1.08)' : 'scaleX(1)',
        }}
      />
      {node(14)}
      {node(28)}
      {node(42)}
      <path d="M11.5 20 L14 23 L18.5 16" className="l-thin" />
      <line x1="28" y1="34" x2="28" y2="40" className="l-thin" />
      <line x1="42" y1="34" x2="42" y2="38" className="l-thin" />
    </svg>
  )
}

export const HERO_NODES: NodeSpec[] = [
  {
    title: 'Live Experiences',
    caption: 'Production · Events · Artist Management',
    icon: LiveIcon,
    rest: { x: 9, y: 18 },
    delay: '0.9s',
  },
  {
    title: 'Creative',
    caption: 'Content · Story · Concept',
    icon: CreativeIcon,
    rest: { x: 91, y: 18 },
    delay: '1.0s',
  },
  {
    title: 'Brands',
    caption: 'Experiences · Campaigns · Audience',
    icon: BrandsIcon,
    rest: { x: 11, y: 82 },
    delay: '1.1s',
  },
  {
    title: 'Operations',
    caption: 'Planning · People · Delivery',
    icon: OperationsIcon,
    rest: { x: 89, y: 82 },
    delay: '1.2s',
  },
]

/** The perimeter loop only — a ring rather than a hub-and-spoke diagram, so
    the four disciplines read as interconnected without a centre. The two
    diagonals (Live↔Operations, Creative↔Brands) are deliberately left out:
    they'd cross straight through the headline, stats and CTAs, and no
    amount of opacity keeps a line that long from reading as clutter over
    the hero's primary content. */
const EDGES: [string, string][] = [
  ['Live Experiences', 'Creative'],
  ['Creative', 'Operations'],
  ['Operations', 'Brands'],
  ['Brands', 'Live Experiences'],
]

const ZERO: Vec = { x: 0, y: 0 }
const zeroOffsets = (): Record<string, Vec> =>
  Object.fromEntries(HERO_NODES.map((n) => [n.title, { ...ZERO }]))

/* Tuning for the force-directed field:
   - FIELD_RADIUS is generous on purpose — the pull should start well
     before the cursor reaches a node, not switch on at its edge.
   - FALLOFF_POWER > 1 means the field is soft at its rim and steep near
     its centre, so "closest is strongest" is felt, not just technically
     true.
   - NEIGHBOR_PULL is how much of a node's own pull leaks along each edge
     to the nodes it's connected to — small on purpose: it's what makes
     the *other* nodes answer through the network rather than staying
     inert, without ever pulling them as hard as the node the cursor is
     actually near.
   - FIELD_RAMP_MS is how long the whole field takes to fade up after the
     cursor arrives, and fade back down after it leaves — a big part of
     "delayed" and "gradually disappears" rather than a hard on/off.
   - MAX_DISPLACE is the hard ceiling in percentage units, well short of
     the headline/stats/CTA column.
   - STIFFNESS/DAMPING are the same damped-spring pair as before: damping
     comfortably past critical for this stiffness, so a step target eases
     in without ever overshooting or bouncing. */
const FIELD_RADIUS = 38
const FALLOFF_POWER = 1.8
const NEIGHBOR_PULL = 0.16
const FIELD_RAMP_MS = 750
const MAX_DISPLACE = 8
const STIFFNESS = 0.045
const DAMPING = 0.6
/** A node counts as "active" only once it's pulling meaningfully harder
    than the field's own noise floor — otherwise the label/icon boost
    would flicker on for a node barely inside the radius. */
const ACTIVE_THRESHOLD = 0.4

/** Every node this one shares a drawn edge with, precomputed once. */
const NEIGHBORS: Record<string, string[]> = Object.fromEntries(
  HERO_NODES.map((n) => [
    n.title,
    EDGES.filter(([a, b]) => a === n.title || b === n.title).map(([a, b]) =>
      a === n.title ? b : a,
    ),
  ]),
)

interface Magnet {
  offsets: Record<string, Vec>
  active: string | null
}

/** A continuous magnetic field, not a single node the pointer "catches."
    Every node within `FIELD_RADIUS` of the cursor is pulled toward it in
    proportion to how close it is; each node also leaks a fraction of its
    own pull to its network neighbours, so the two nodes not nearest the
    cursor still visibly answer, through their connection, rather than
    sitting still. The whole field fades up over `FIELD_RAMP_MS` when the
    cursor arrives and fades back down when it leaves, and every node's
    position is a damped spring chasing its (constantly moving) target —
    between the fade and the spring, the whole system trails the cursor
    rather than reacting to it instantly. */
function useMagnet(cursor: Vec | null): Magnet {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [offsets, setOffsets] = useState<Record<string, Vec>>(zeroOffsets)
  const [active, setActive] = useState<string | null>(null)
  const offsetsRef = useRef<Record<string, Vec>>(zeroOffsets())
  const velocityRef = useRef<Record<string, Vec>>(zeroOffsets())
  const fieldStrengthRef = useRef(0)
  const cursorRef = useRef(cursor)
  cursorRef.current = cursor

  useEffect(() => {
    if (reducedMotion) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now
      const cur = cursorRef.current

      const fieldTarget = cur ? 1 : 0
      const rampStep = dt / (FIELD_RAMP_MS / 16.67)
      fieldStrengthRef.current += (fieldTarget - fieldStrengthRef.current) * Math.min(rampStep, 1)

      /* Each node's own raw pull toward the cursor, before any of it leaks
         to neighbours — a unit vector scaled by a 0–1 falloff over the
         field radius, quadratic-ish so it's soft at the rim. */
      const pull: Record<string, Vec> = {}
      const strength: Record<string, number> = {}
      for (const node of HERO_NODES) {
        pull[node.title] = ZERO
        strength[node.title] = 0
        if (!cur) continue
        const dx = cur.x - node.rest.x
        const dy = cur.y - node.rest.y
        const dist = Math.hypot(dx, dy)
        if (dist >= FIELD_RADIUS || dist < 0.01) continue
        const s = (1 - dist / FIELD_RADIUS) ** FALLOFF_POWER
        strength[node.title] = s
        pull[node.title] = { x: (dx / dist) * s, y: (dy / dist) * s }
      }

      let nearestTitle: string | null = null
      let nearestStrength = 0
      for (const node of HERO_NODES) {
        if (strength[node.title] > nearestStrength) {
          nearestStrength = strength[node.title]
          nearestTitle = node.title
        }
      }
      const nextActive =
        cur && nearestStrength >= ACTIVE_THRESHOLD && fieldStrengthRef.current > 0.5
          ? nearestTitle
          : null
      setActive((prev) => (prev === nextActive ? prev : nextActive))

      const field = fieldStrengthRef.current
      for (const node of HERO_NODES) {
        /* Direct pull, plus a small share of each neighbour's pull — the
           network answering on the node's behalf even when the cursor
           isn't near it directly. */
        let tx = pull[node.title].x
        let ty = pull[node.title].y
        for (const neighbor of NEIGHBORS[node.title]) {
          tx += pull[neighbor].x * NEIGHBOR_PULL
          ty += pull[neighbor].y * NEIGHBOR_PULL
        }

        const mag = Math.hypot(tx, ty)
        const clamped = Math.min(mag, 1) * MAX_DISPLACE * field
        const target: Vec = mag > 0.001 ? { x: (tx / mag) * clamped, y: (ty / mag) * clamped } : ZERO

        const pos = offsetsRef.current[node.title]
        const vel = velocityRef.current[node.title]
        vel.x += (STIFFNESS * (target.x - pos.x) - DAMPING * vel.x) * dt
        vel.y += (STIFFNESS * (target.y - pos.y) - DAMPING * vel.y) * dt
        pos.x += vel.x * dt
        pos.y += vel.y * dt
      }

      setOffsets({
        ...Object.fromEntries(HERO_NODES.map((n) => [n.title, { ...offsetsRef.current[n.title] }])),
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return reducedMotion ? { offsets: zeroOffsets(), active: null } : { offsets, active }
}

/** The network itself: construction-weight lines only, well under the
    nodes' own linework, so it reads as a faint graph rather than a diagram.
    Drawn from each node's live (rest + magnet offset) position, so the
    mesh flexes with the nodes rather than staying pinned to their rest
    spots. */
function NetworkLines({ offsets }: { offsets: Record<string, Vec> }): ReactElement {
  const at = (title: string): Vec => {
    const rest = HERO_NODES.find((n) => n.title === title)!.rest
    const o = offsets[title] ?? ZERO
    return { x: rest.x + o.x, y: rest.y + o.y }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="lift absolute inset-0 h-full w-full"
      style={{ animationDelay: '1.3s' }}
      aria-hidden="true"
    >
      {EDGES.map(([a, b]) => {
        const p1 = at(a)
        const p2 = at(b)
        return (
          <line
            key={`${a}-${b}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            vectorEffect="non-scaling-stroke"
            className="l-construct"
          />
        )
      })}
      {HERO_NODES.map((node) => {
        const p = at(node.title)
        return <circle key={node.title} cx={p.x} cy={p.y} r={0.5} style={{ fill: 'var(--line-construct)' }} />
      })}
    </svg>
  )
}

function HeroNode({
  node,
  offset,
  active,
}: {
  node: NodeSpec
  offset: Vec
  active: boolean
}): ReactElement {
  const Icon = node.icon
  return (
    <div
      className="lift absolute w-28 -translate-x-1/2 -translate-y-1/2 text-center"
      style={{
        left: `${node.rest.x + offset.x}%`,
        top: `${node.rest.y + offset.y}%`,
        animationDelay: node.delay,
      }}
    >
      <div className="flex justify-center">
        <Icon active={active} />
      </div>
      <p className="label mt-1.5" style={{ color: LABEL_COLOR }}>
        {node.title}
      </p>
      <p className="mt-0.5 text-[0.62rem] leading-snug" style={{ color: CAPTION_COLOR }}>
        {node.caption}
      </p>
    </div>
  )
}

/** The four nodes, laid out in the hero's quiet corners and drifting
    toward the cursor on a damped spring when the field catches one of
    them. Hidden below `lg` — there isn't room beside the title once the
    drawing crops for phones, and these are an addition to the quiet
    field, not something to cram in. */
export function HeroNodes({ cursor }: { cursor: Vec | null }): ReactElement {
  const { offsets, active } = useMagnet(cursor)

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <NetworkLines offsets={offsets} />
      {HERO_NODES.map((node) => (
        <HeroNode
          key={node.title}
          node={node}
          offset={offsets[node.title] ?? ZERO}
          active={active === node.title}
        />
      ))}
    </div>
  )
}
