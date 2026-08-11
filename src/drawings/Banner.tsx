/* ==========================================================================
   The hero drawing sheet.

   A quiet 2000 × 960 blueprint plate: the fine setting-out grid, the sheet's
   datum spine, a lighting truss elevation above the title, and a handful of
   corner crosshairs for sheet furniture. The large illustrative plans that
   used to compete with the title have been removed in favour of open field
   around the typography.

   Groups marked `zone-far` are dropped on narrow screens and the viewBox
   crops to the centre, so a phone gets a legible drawing rather than the
   whole sheet shrunk into noise.

   The grid, the corner crosshairs and one marginal note each carry a very
   slow, staggered ambient loop (`.grid-breathe`/`.crosshair-drift`/
   `.note-breathe`, defined in index.css) — the sheet reading as still
   being drafted rather than a static backdrop. All three are well under
   a 20% swing and run 10s+, so nothing registers as "moving" at a glance. */

import { Fragment, type ReactElement } from 'react'
import {
  Bubble,
  CenterLine,
  Crosshair,
  DimH,
  Grid,
  LanternRun,
  Note,
  Truss,
  TrussPlan,
} from '../lib/draft'

const W = 2000
const H = 960

/* ---------- centre top: truss elevation ------------------------------------ */

/* The lights hanging over the name — and only the fixtures: the truss
   they hang from stays plain blueprint linework, nothing painted on or
   near it. Position math mirrors LanternRun's own spacing exactly, so
   a glow always sits right at its fixture's lens rather than needing
   the lantern positions maintained in two places. The lens sits well
   clear of the truss's own bottom edge (`clearance` below), so even
   the blur never reaches back up into the beam.

   Each fixture is three pieces: a narrow, almost-invisible beam hinting
   at a downward throw; `.hero-light-base`, which powers on once
   (staggered per fixture, ramping gently through 5%–9%) then holds an
   almost-imperceptible shimmer forever; and `.hero-light-boost`, a
   second independent layer that only answers to `#top:hover` — kept
   off the shimmer's own animated property on purpose, so the hover
   brighten never has to interrupt or race a perpetual animation. */
function LanternGlow({
  x,
  y,
  length,
  count,
  scale = 1,
}: {
  x: number
  y: number
  length: number
  count: number
  scale?: number
}): ReactElement {
  const step = length / (count + 1)
  const clearance = 26 * scale
  const lensY = y + clearance
  const r = 9 * scale
  const beamLength = 34 * scale

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const lx = x + (i + 1) * step
        const onDelay = 0.9 + i * 0.12
        return (
          <Fragment key={i}>
            <rect
              x={lx - 1.5 * scale}
              y={lensY}
              width={3 * scale}
              height={beamLength}
              className="hero-light-beam"
              style={{ animationDelay: `${onDelay}s` }}
            />
            <circle
              cx={lx}
              cy={lensY}
              r={r}
              className="hero-light-base"
              style={{ animationDelay: `${onDelay}s, ${onDelay + 1.4}s` }}
            />
            <circle cx={lx} cy={lensY} r={r} className="hero-light-boost" />
          </Fragment>
        )
      })}
    </>
  )
}

function TrussElevation(): ReactElement {
  const x = 654
  const y = 104
  const length = 700
  const depth = 54

  return (
    <g className="zone" style={{ animationDelay: '0.42s' }}>
      {/* The truss itself is plain blueprint linework, full stop — nothing
          is ever painted on or over it. Only the fixtures below it emit
          light (see LanternGlow). */}
      <Truss x={x} y={y} length={length} depth={depth} bays={15} />

      <defs>
        <linearGradient id="heroLightBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-orange)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent-orange)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <LanternGlow x={x} y={y + depth} length={length} count={8} scale={1.15} />
      <LanternRun
        x={x}
        y={y + depth}
        length={length}
        count={8}
        types={['profile', 'fresnel', 'profile', 'par']}
        scale={1.15}
      />

      {/* motor chains up to the grid */}
      {[0.14, 0.5, 0.86].map((f, i) => {
        const hx = x + length * f
        return (
          <Fragment key={i}>
            <line x1={hx} y1={y - 46} x2={hx} y2={y} className="l-hair" />
            <rect x={hx - 7} y={y - 60} width={14} height={14} className="l-thin" />
            <line x1={hx - 7} y1={y - 53} x2={hx + 7} y2={y - 53} className="l-hair" />
          </Fragment>
        )
      })}

      <DimH x1={x} x2={x + length} y={y - 74} from={y - 60} label={`60'-0"`} />

      {/* marginal annotations — outside the phone crop, so dropped with it.
          The LX/trim note breathes very slowly, as if someone were still
          checking it against the rig; the angle callout stays put. */}
      <g className="zone-far">
        <g className="note-breathe" style={{ animationDelay: '2.4s' }}>
          <Note x={x + length + 22} y={y + 30} anchor="start" size={12}>
            LX 1
          </Note>
          <Note x={x + length + 22} y={y + 48} anchor="start" size={11} tone="dim">
            {`TRIM 22'-6"`}
          </Note>
        </g>

        {/* the angle callout from the reference sheet */}
        <Note x={1372} y={44} anchor="start" size={12} tone="dim">
          -90°
        </Note>
        <path d="M1352 52 A 22 22 0 0 1 1366 34" className="l-hair" />
        <line x1={1352} y1={30} x2={1352} y2={56} className="l-hair" />
      </g>
    </g>
  )
}

/* ---------- sheet furniture ------------------------------------------------- */

/* Every crosshair drifts on the same slow loop, but staggered so they never
   move in unison — a sheet with several registration marks being checked
   one at a time, not a pattern blinking together. */
const CROSSHAIRS: [number, number, number | undefined][] = [
  [48, 44, undefined],
  [1952, 44, undefined],
  [48, 912, undefined],
  [640, 42, 11],
  [1420, 42, 11],
  [1952, 912, undefined],
  [1002, 826, 13],
]

function Furniture(): ReactElement {
  return (
    <g className="zone zone-far" style={{ animationDelay: '0.96s' }}>
      {CROSSHAIRS.map(([x, y, size], i) => (
        <g key={i} className="crosshair-drift" style={{ animationDelay: `${i * 1.8}s` }}>
          <Crosshair x={x} y={y} size={size} />
        </g>
      ))}
    </g>
  )
}

/* ---------- assembly -------------------------------------------------------- */

export function Banner({ compact }: { compact: boolean }): ReactElement {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={compact ? '612 20 780 1000' : `0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Blueprint grid with a lighting truss elevation over the title."
    >
      <g className="zone zone-far" style={{ animationDelay: '0.05s' }}>
        <g className="grid-breathe">
          <Grid width={W} height={H} step={50} />
        </g>
      </g>
      <g className="zone" style={{ animationDelay: '0.15s' }}>
        {/* the sheet's own datum spine — the one line drawn stroke-first
            rather than faded in with its group, so the sheet reads as
            struck rather than simply appearing */}
        <line x1={1002} y1={0} x2={1002} y2={H} pathLength={1} className="l-center hero-draw-in" />
      </g>
      <TrussElevation />
      <Furniture />
    </svg>
  )
}

/** How many distinct dividers exist, for callers cycling through them. */
export const DIVIDER_VARIANTS = 3

/**
 * The marks used to separate sheets down the page. Three different plates —
 * a truss rule, a lighting-plot strip, a grid-datum strip — cycled by
 * callers so the same artifact never repeats between two adjacent sections.
 * Each is a real production drawing in miniature, not a decorative rule.
 */
export function Divider({ variant = 0 }: { variant?: number }): ReactElement {
  const w = 1000
  const h = 60
  const mid = h / 2
  const v = ((variant % DIVIDER_VARIANTS) + DIVIDER_VARIANTS) % DIVIDER_VARIANTS

  if (v === 1) {
    /* A run of lanterns hung off a batten — a lighting plot in miniature. */
    return (
      <svg
        className="h-15 w-full opacity-80"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1={70}
          y1={mid - 15}
          x2={w - 70}
          y2={mid - 15}
          className="l-thin draw-in-line"
        />
        <LanternRun
          x={70}
          y={mid - 15}
          length={w - 140}
          count={9}
          types={['profile', 'fresnel', 'profile', 'par']}
          scale={0.85}
        />
        <Crosshair x={34} y={mid} size={9} />
        <Crosshair x={w - 34} y={mid} size={9} />
      </svg>
    )
  }

  if (v === 2) {
    /* A datum line strung between grid bubbles — the setting-out reference
       that runs through every plan on the site. */
    const labels = ['A', 'B', 'C', 'D', 'E', 'F']
    const left = 100
    const right = w - 100
    const step = (right - left) / (labels.length - 1)
    return (
      <svg
        className="h-15 w-full opacity-80"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <CenterLine x1={left} y1={mid} x2={right} y2={mid} />
        {labels.map((label, i) => (
          <Bubble key={label} x={left + i * step} y={mid} label={label} />
        ))}
        <Crosshair x={34} y={mid} size={9} />
        <Crosshair x={w - 34} y={mid} size={9} />
      </svg>
    )
  }

  return (
    <svg
      className="h-15 w-full opacity-80"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <TrussPlan x={70} y={mid - 9} length={w - 140} width={18} bays={22} />
      <Crosshair x={34} y={mid} size={9} />
      <Crosshair x={w - 34} y={mid} size={9} />
    </svg>
  )
}
