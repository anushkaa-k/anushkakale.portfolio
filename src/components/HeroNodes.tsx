/* ==========================================================================
   The four hero nodes.

   Not cards — small drafting marks that sit in the quiet field the banner
   simplification opened up, each answering one line of work with its own
   motif but the same line language (`l-hair`/`l-thin`, the mono `.label`
   type) as the rest of the sheet. A loose mesh of construction-weight
   lines (`NetworkLines`) ties the four together as interconnected
   disciplines — deliberately the faintest weight on the sheet, so it
   never competes with the nodes' own linework or the title. Static for
   now: no cursor interaction yet, just the linework and the fade-in
   every other hero element already uses.
   ========================================================================== */

import type { ReactElement } from 'react'

interface NodeSpec {
  title: string
  caption: string
  icon: () => ReactElement
  /** Tailwind position classes, desktop only — nodes sit out in the gutters. */
  className: string
  delay: string
}

/** Stage front, a spotlight throw, three rows of audience. */
function LiveIcon(): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <path d="M14 22 Q28 12 42 22" className="l-thin" />
      <line x1="10" y1="34" x2="46" y2="34" className="l-med" />
      <path d="M28 15 L20 34 L36 34 Z" className="l-hair" />
      <path d="M17 41 Q28 37 39 41" className="l-hair" />
      <path d="M14 47 Q28 42 42 47" className="l-hair" />
    </svg>
  )
}

/** A short run of storyboard frames, one holding a sketch line. */
function CreativeIcon(): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <rect x="8" y="20" width="13" height="16" className="l-thin" />
      <rect x="24" y="20" width="13" height="16" className="l-med" />
      <rect x="40" y="20" width="8" height="16" className="l-hair" />
      <path d="M27 32 Q30 24 34 30 T37 24" className="l-hair" />
      <line x1="8" y1="42" x2="48" y2="42" className="l-hair" />
    </svg>
  )
}

/** Concentric target rings struck from a single centre point. */
function BrandsIcon(): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <circle cx="28" cy="28" r="18" className="l-hair" />
      <circle cx="28" cy="28" r="11" className="l-thin" />
      <circle cx="28" cy="28" r="1.6" className="fill-ink" />
      <line x1="28" y1="6" x2="28" y2="12" className="l-hair" />
      <line x1="28" y1="44" x2="28" y2="50" className="l-hair" />
      <line x1="6" y1="28" x2="12" y2="28" className="l-hair" />
      <line x1="44" y1="28" x2="50" y2="28" className="l-hair" />
    </svg>
  )
}

/** A timeline: datum line, sequenced nodes, one step ticked off. */
function OperationsIcon(): ReactElement {
  return (
    <svg viewBox="0 0 56 56" className="h-10 w-10" aria-hidden="true">
      <line x1="8" y1="28" x2="48" y2="28" className="l-thin" />
      <circle cx="14" cy="28" r="3" className="l-med fill-paper" />
      <circle cx="28" cy="28" r="3" className="l-med fill-paper" />
      <circle cx="42" cy="28" r="3" className="l-med fill-paper" />
      <path d="M11.5 20 L14 23 L18.5 16" className="l-hair" />
      <line x1="28" y1="34" x2="28" y2="40" className="l-hair" />
      <line x1="42" y1="34" x2="42" y2="38" className="l-hair" />
    </svg>
  )
}

/** Where each node's icon roughly sits, as a percentage of the hero box —
    used only to strike the connecting lines beneath them. */
interface Anchor {
  x: number
  y: number
}

const ANCHORS: Record<string, Anchor> = {
  'Live Experiences': { x: 9, y: 18 },
  Creative: { x: 91, y: 18 },
  Brands: { x: 11, y: 82 },
  Operations: { x: 89, y: 82 },
}

export const HERO_NODES: NodeSpec[] = [
  {
    title: 'Live Experiences',
    caption: 'Production · Events · Artist Management',
    icon: LiveIcon,
    className: 'left-[2%] top-[8%] xl:left-[7%]',
    delay: '0.9s',
  },
  {
    title: 'Creative',
    caption: 'Content · Story · Concept',
    icon: CreativeIcon,
    className: 'right-[2%] top-[8%] xl:right-[7%]',
    delay: '1.0s',
  },
  {
    title: 'Brands',
    caption: 'Experiences · Campaigns · Audience',
    icon: BrandsIcon,
    className: 'left-[2%] bottom-[6%] xl:left-[9%]',
    delay: '1.1s',
  },
  {
    title: 'Operations',
    caption: 'Planning · People · Delivery',
    icon: OperationsIcon,
    className: 'right-[2%] bottom-[6%] xl:right-[9%]',
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

/** The network itself: construction-weight lines only, well under the
    nodes' own linework, so it reads as a faint graph rather than a diagram. */
function NetworkLines(): ReactElement {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="lift absolute inset-0 h-full w-full"
      style={{ animationDelay: '1.3s' }}
      aria-hidden="true"
    >
      {EDGES.map(([a, b]) => {
        const p1 = ANCHORS[a]
        const p2 = ANCHORS[b]
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
      {Object.values(ANCHORS).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.5} style={{ fill: 'var(--line-construct)' }} />
      ))}
    </svg>
  )
}

function HeroNode({ node }: { node: NodeSpec }): ReactElement {
  const Icon = node.icon
  return (
    <div
      className={`lift absolute w-28 text-center ${node.className}`}
      style={{ animationDelay: node.delay }}
    >
      <div className="flex justify-center">
        <Icon />
      </div>
      <p className="label mt-1.5 text-ink-70">{node.title}</p>
      <p className="mt-0.5 text-[0.62rem] leading-snug text-ink-45">{node.caption}</p>
    </div>
  )
}

/** The four nodes, laid out in the hero's quiet corners. Hidden below `lg`
    — there isn't room beside the title once the drawing crops for phones,
    and these are an addition to the quiet field, not something to cram in. */
export function HeroNodes(): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <NetworkLines />
      {HERO_NODES.map((node) => (
        <HeroNode key={node.title} node={node} />
      ))}
    </div>
  )
}
