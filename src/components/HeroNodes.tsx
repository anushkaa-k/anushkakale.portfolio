/* ==========================================================================
   The four hero nodes.

   Not cards — small drafting marks that sit in the quiet field the banner
   simplification opened up, each answering one line of work with its own
   motif but the same line language (`l-hair`/`l-thin`, the mono `.label`
   type) as the rest of the sheet. A loose mesh of construction-weight
   lines (`NetworkLines`) ties the four together as interconnected
   disciplines — deliberately the faintest weight on the sheet, so it
   never competes with the nodes' own linework or the title.

   Cursor is a magnetic field, not a leash: `useMagnet` tracks which node
   is nearest the pointer and, after it has held that spot for a beat,
   lets it drift toward the cursor on a damped spring (no bounce, no
   snapping) while the other three ease a couple of percent away from it.
   Everything reads from a single rest/offset model shared by the nodes
   and the lines they're strung between, so the mesh always tracks where
   the nodes actually are. Off entirely under reduced motion, same as
   every other moving piece in the hero. */

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
        className={`${anim} l-hair ${active ? 'opacity-90' : 'opacity-45'}`}
      />
      <path d="M17 41 Q28 37 39 41" className="l-hair" />
      <path d="M14 47 Q28 42 42 47" className="l-hair" />
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
      <rect x="40" y="20" width="8" height="16" className="l-hair" />
      <path
        d="M27 32 Q30 24 34 30 T37 24"
        pathLength={1}
        className={`${anim} l-hair`}
        style={{ strokeDasharray: 1, strokeDashoffset: active ? 0 : 1 }}
      />
      <line x1="8" y1="42" x2="48" y2="42" className="l-hair" />
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
      className={`${anim} l-hair`}
      style={{ transform: active ? `translate(${dx}px, ${dy}px)` : 'translate(0, 0)' }}
    />
  )
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <circle cx="28" cy="28" r="18" className={`${anim} l-hair`} style={ringStyle} />
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
      <path d="M11.5 20 L14 23 L18.5 16" className="l-hair" />
      <line x1="28" y1="34" x2="28" y2="40" className="l-hair" />
      <line x1="42" y1="34" x2="42" y2="38" className="l-hair" />
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

/** Every pair, once — a loose mesh rather than a hub-and-spoke diagram, so
    the four disciplines read as interconnected, not as feeding one centre. */
const EDGES: [string, string][] = [
  ['Live Experiences', 'Creative'],
  ['Creative', 'Operations'],
  ['Operations', 'Brands'],
  ['Brands', 'Live Experiences'],
  ['Live Experiences', 'Operations'],
  ['Creative', 'Brands'],
]

const ZERO: Vec = { x: 0, y: 0 }
const zeroOffsets = (): Record<string, Vec> =>
  Object.fromEntries(HERO_NODES.map((n) => [n.title, { ...ZERO }]))

/* Tuning: how far a magnetised node may wander, how long the pointer has
   to sit nearest a node before it responds, and a damped-spring pair
   (stiffness well under the critical-damping line for `damping`) chosen
   specifically so a step target eases in without ever overshooting it. */
const MAX_DISPLACE = 9
const REPEL_NUDGE = 2
const ATTRACT_DELAY_MS = 1500
const STIFFNESS = 0.05
const DAMPING = 0.62

interface Magnet {
  offsets: Record<string, Vec>
  active: string | null
}

/** Tracks the pointer, decides which node (if any) the field has caught,
    and steps a damped spring toward that target every frame. Returns a
    per-node offset (in the same percentage units as `rest`) plus the
    title of the node currently caught, for the icons' own micro-animations. */
function useMagnet(cursor: Vec | null): Magnet {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [offsets, setOffsets] = useState<Record<string, Vec>>(zeroOffsets)
  const [active, setActive] = useState<string | null>(null)
  const offsetsRef = useRef<Record<string, Vec>>(zeroOffsets())
  const velocityRef = useRef<Record<string, Vec>>(zeroOffsets())
  const pendingRef = useRef<{ title: string | null; since: number }>({ title: null, since: 0 })
  const attractedRef = useRef<string | null>(null)
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

      if (cur) {
        let nearestTitle: string | null = null
        let nearestDist = Infinity
        for (const node of HERO_NODES) {
          const d = Math.hypot(cur.x - node.rest.x, cur.y - node.rest.y)
          if (d < nearestDist) {
            nearestDist = d
            nearestTitle = node.title
          }
        }
        if (nearestTitle !== pendingRef.current.title) {
          pendingRef.current = { title: nearestTitle, since: now }
        }
        attractedRef.current =
          nearestTitle && now - pendingRef.current.since >= ATTRACT_DELAY_MS ? nearestTitle : null
      } else {
        pendingRef.current = { title: null, since: now }
        attractedRef.current = null
      }

      const active = attractedRef.current
      setActive((prev) => (prev === active ? prev : active))

      for (const node of HERO_NODES) {
        let target: Vec = ZERO
        if (active === node.title && cur) {
          const dx = cur.x - node.rest.x
          const dy = cur.y - node.rest.y
          const mag = Math.hypot(dx, dy) || 1
          const clamped = Math.min(mag, MAX_DISPLACE)
          target = { x: (dx / mag) * clamped, y: (dy / mag) * clamped }
        } else if (active) {
          const activeRest = HERO_NODES.find((n) => n.title === active)!.rest
          const dx = node.rest.x - activeRest.x
          const dy = node.rest.y - activeRest.y
          const mag = Math.hypot(dx, dy) || 1
          target = { x: (dx / mag) * REPEL_NUDGE, y: (dy / mag) * REPEL_NUDGE }
        }

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
      <p className="label mt-1.5 text-ink-70">{node.title}</p>
      <p className="mt-0.5 text-[0.62rem] leading-snug text-ink-45">{node.caption}</p>
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
