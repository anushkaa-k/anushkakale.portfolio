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

   The grid, truss and furniture themselves are fully static — what reads
   as "still being drafted" is a handful of small tick marks
   (`DraftingReveal`) off in the margins that slowly stroke themselves in,
   hold, and withdraw again, staggered and looping (`.blueprint-draw`,
   defined in index.css). Nowhere near the headline, nodes or truss, and
   nothing else on the sheet moves this way.

   Five theatrical profile-spot fixtures (`FocusLights`) hang off the same
   truss chord, each panning a tapered beam onto its own point along the
   name below, on its own timing — the rig itself slowly finding its
   focus. Targets come from the hero measuring the rendered headline
   (see `Hero.tsx`), so they track it responsively. */

import { Fragment, useEffect, useRef, useState, type ReactElement } from 'react'
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
import { useMediaQuery } from '../hooks/useMediaQuery'

const W = 2000
const H = 960

interface Vec {
  x: number
  y: number
}

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

/* ---------- five focus-light fixtures --------------------------------------

   Five theatrical profile-spot fixtures hung on the same truss chord as
   the plain lanterns (`LanternGlow`/`LanternRun` above), each aimed at
   its own point along "Hi, I'm Anushka" and slowly panning onto it. Every
   fixture is two parts, drawn separately on purpose:

   - a fixed yoke: the mounting clamp at the truss, the drop, and the
     bracket arms with their pivot pins — this half never moves, the way
     a real yoke stays clamped to the truss while only the barrel inside
     it tilts.
   - a rotating barrel + beam: the housing, its lens cap, and a beam
     tapered from a narrow throat at the lens to a wider spread at the
     target, sized so its tip lands exactly on the target regardless of
     the fixture's angle (`beamLength` is the live distance from pivot to
     target, not a guess).

   `PIVOTS` mirrors LanternGlow's own spacing at slots 2–6 of its 8, so a
   fixture's pivot always sits at an existing lens position. Targets are
   supplied by the hero (`Hero.tsx` measures the rendered headline and
   converts it into this SVG's coordinate space) — `DEFAULT_TARGETS` is
   only what a fixture aims at for the one frame before that measurement
   is ready. */

const FOCUS_TRUSS_X = 654
const FOCUS_TRUSS_LENGTH = 700
const FOCUS_SCALE = 1.15
const FOCUS_STEP = FOCUS_TRUSS_LENGTH / 9
/** The truss fixtures' lens height, in this svg's own viewBox units —
    exported so Hero.tsx's headline measurement can keep every target
    comfortably below it (see `MIN_TARGET_DROP` there): the headline sits
    close enough to the truss, vertically, that an unclamped target can
    end up level with or above the pivot, spinning a fixture past
    horizontal to reach it. */
export const FOCUS_LENS_Y = 104 + 54 + 26 * FOCUS_SCALE

const FOCUS_SLOTS = [2, 3, 4, 5, 6]
const PIVOTS: Vec[] = FOCUS_SLOTS.map((slot) => ({
  x: FOCUS_TRUSS_X + slot * FOCUS_STEP,
  y: FOCUS_LENS_Y,
}))

/** Where a fixture aims before the headline has been measured — a rough
    spread across where the title usually sits, close enough that the
    first paint doesn't show fixtures pointing somewhere strange. */
const DEFAULT_TARGETS: Vec[] = [
  { x: 780, y: 520 },
  { x: 890, y: 520 },
  { x: 1000, y: 520 },
  { x: 1110, y: 520 },
  { x: 1220, y: 520 },
]

/** How far the far end of each beam spreads, in viewBox units — different
    per fixture, same spirit as the old per-fixture beam-width variety. */
const FOCUS_BEAM_SPREAD = [12, 16, 9, 17, 13]

/** Half-width of the lens the beam actually leaves from — keeps the
    throat of every beam matched to the fixture's own front aperture
    below, rather than an arbitrary sliver. */
const FOCUS_LENS_RADIUS = 3.6

/** Per-fixture spring: how far off its mark the fixture starts (degrees),
    how stiff/damped the settle is, and how long it waits before moving
    at all. Every value is different so the five are never in step. */
const FOCUS_SPRINGS = [
  { startOffset: -16, stiffness: 0.052, damping: 0.6, delayMs: 300 },
  { startOffset: 11, stiffness: 0.044, damping: 0.62, delayMs: 900 },
  { startOffset: -9, stiffness: 0.06, damping: 0.58, delayMs: 150 },
  { startOffset: 18, stiffness: 0.04, damping: 0.63, delayMs: 1150 },
  { startOffset: -7, stiffness: 0.05, damping: 0.6, delayMs: 600 },
]

const MIN_BEAM_LENGTH = 120
const MAX_BEAM_LENGTH = 420

/** 0° is straight down; positive rotates the fixture toward +x. */
function angleTo(pivot: Vec, target: Vec): number {
  const dx = target.x - pivot.x
  const dy = target.y - pivot.y
  return (Math.atan2(dx, dy) * 180) / Math.PI
}

/** Each fixture's current rotation, in degrees. Not a CSS keyframe: the
    target angle is derived from the (possibly still-updating) headline
    measurement, so it has to be computed and sprung toward at runtime.
    Every fixture starts offset from its mark, waits out its own delay,
    then eases in on a damped spring — comfortably overdamped for its own
    stiffness, so it never overshoots or oscillates once it arrives.
    Fully static (no rAF at all) under reduced motion. */
function useFocusAngles(targets: Vec[]): number[] {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finalAngles = PIVOTS.map((pivot, i) => angleTo(pivot, targets[i]))
  const finalAnglesRef = useRef(finalAngles)
  finalAnglesRef.current = finalAngles

  const [angles, setAngles] = useState<number[]>(() =>
    finalAngles.map((a, i) => a + FOCUS_SPRINGS[i].startOffset),
  )
  const angleRef = useRef(angles)
  const velocityRef = useRef(angles.map(() => 0))
  const mountedAtRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) {
      setAngles(finalAnglesRef.current)
      return
    }

    mountedAtRef.current = performance.now()
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now

      const next = angleRef.current.map((angle, i) => {
        const spring = FOCUS_SPRINGS[i]
        if (now - mountedAtRef.current < spring.delayMs) return angle
        const target = finalAnglesRef.current[i]
        const v =
          velocityRef.current[i] + (spring.stiffness * (target - angle) - spring.damping * velocityRef.current[i]) * dt
        velocityRef.current[i] = v
        return angle + v * dt
      })
      angleRef.current = next
      setAngles(next)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return reducedMotion ? finalAngles : angles
}

function FocusFixture({
  pivot,
  angle,
  target,
  beamSpread,
}: {
  pivot: Vec
  angle: number
  target: Vec
  beamSpread: number
}): ReactElement {
  const { x: px, y: lensY } = pivot
  const beamLength = Math.min(
    Math.max(Math.hypot(target.x - px, target.y - lensY), MIN_BEAM_LENGTH),
    MAX_BEAM_LENGTH,
  )
  const mountY = 104 + 54

  return (
    <g>
      {/* fixed yoke: clamped to the truss, never rotates — the bracket a
          real moving-head/profile fixture's barrel pivots inside. */}
      <rect x={px - 7} y={mountY} width={14} height={6} className="l-thin" />
      <line x1={px} y1={mountY + 6} x2={px} y2={lensY - 30} className="l-hair" />
      <line x1={px - 11} y1={lensY - 30} x2={px + 11} y2={lensY - 30} className="l-hair" />
      <line x1={px - 11} y1={lensY - 30} x2={px - 11} y2={lensY + 3} className="l-med" />
      <line x1={px + 11} y1={lensY - 30} x2={px + 11} y2={lensY + 3} className="l-med" />
      <circle cx={px - 11} cy={lensY - 11} r={1.6} className="l-thin fill-paper" />
      <circle cx={px + 11} cy={lensY - 11} r={1.6} className="l-thin fill-paper" />

      {/* rotating barrel, lens and beam — one pivot, at the lens itself,
          so the whole assembly tilts the way a real barrel does inside
          its yoke. */}
      <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${px}px ${lensY}px` }}>
        <polygon
          points={`${px - FOCUS_LENS_RADIUS},${lensY} ${px - beamSpread},${lensY + beamLength} ${px + beamSpread},${lensY + beamLength} ${px + FOCUS_LENS_RADIUS},${lensY}`}
          style={{ fill: 'color-mix(in srgb, var(--accent-orange) 18%, var(--ink))' }}
          fillOpacity={0.2}
        />
        <line
          x1={px - FOCUS_LENS_RADIUS}
          y1={lensY}
          x2={px - beamSpread}
          y2={lensY + beamLength}
          className="l-hair"
          style={{ opacity: 0.6 }}
        />
        <line
          x1={px + FOCUS_LENS_RADIUS}
          y1={lensY}
          x2={px + beamSpread}
          y2={lensY + beamLength}
          className="l-hair"
          style={{ opacity: 0.6 }}
        />
        {/* main housing */}
        <rect x={px - 6} y={lensY - 26} width={12} height={17} className="l-med" />
        {/* control-panel ticks on the housing face */}
        <line x1={px - 3.5} y1={lensY - 22} x2={px + 3.5} y2={lensY - 22} className="l-hair" />
        <line x1={px - 3.5} y1={lensY - 19} x2={px + 3.5} y2={lensY - 19} className="l-hair" />
        {/* neck down to the lens */}
        <rect x={px - 3} y={lensY - 9} width={6} height={9} className="l-thin" />
        {/* front lens: the fixture's actual aperture, where the beam leaves from */}
        <circle cx={px} cy={lensY} r={FOCUS_LENS_RADIUS} className="l-thin" />
        <circle cx={px} cy={lensY} r={1.4} className="l-hair" />
      </g>
    </g>
  )
}

function FocusLights({ targets }: { targets: Vec[] | null }): ReactElement {
  const resolvedTargets = targets ?? DEFAULT_TARGETS
  const angles = useFocusAngles(resolvedTargets)

  return (
    <>
      {PIVOTS.map((pivot, i) => (
        <FocusFixture
          key={i}
          pivot={pivot}
          angle={angles[i]}
          target={resolvedTargets[i]}
          beamSpread={FOCUS_BEAM_SPREAD[i]}
        />
      ))}
    </>
  )
}

function TrussElevation({ targets }: { targets: Vec[] | null }): ReactElement {
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
      <FocusLights targets={targets} />
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

      {/* marginal annotations — outside the phone crop, so dropped with it. */}
      <g className="zone-far">
        <Note x={x + length + 22} y={y + 30} anchor="start" size={12}>
          LX 1
        </Note>
        <Note x={x + length + 22} y={y + 48} anchor="start" size={11} tone="dim">
          {`TRIM 22'-6"`}
        </Note>

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
        <Crosshair key={i} x={x} y={y} size={size} />
      ))}
    </g>
  )
}

/* ---------- the sheet still being drafted ----------------------------------

   A handful of small tick marks — the kind of thing a draughtsperson jots
   in the margin while checking a measurement — that stroke themselves in,
   hold, then withdraw again, on a slow, staggered, endless loop. This is
   the whole of the "still being drafted" effect: nothing else on the
   sheet moves. Deliberately not the shared `Grid` (every line of that
   would be expensive to animate individually, and isn't the point — a
   few marks read as active drafting; a breathing grid reads as a UI
   effect) and deliberately kept off to the sides, clear of the headline,
   nodes and truss. `pathLength={1}` normalises every mark's dash units to
   1 regardless of its real length, the same trick the datum spine uses. */
const DRAFT_MARKS: { x1: number; y1: number; x2: number; y2: number; duration: number; delay: number }[] = [
  { x1: 130, y1: 300, x2: 168, y2: 300, duration: 11, delay: 0 },
  { x1: 150, y1: 282, x2: 150, y2: 318, duration: 11, delay: 0 },
  { x1: 1870, y1: 620, x2: 1908, y2: 620, duration: 13, delay: 2.4 },
  { x1: 1889, y1: 602, x2: 1889, y2: 638, duration: 13, delay: 2.4 },
  { x1: 232, y1: 780, x2: 270, y2: 780, duration: 9.5, delay: 4.8 },
  { x1: 1730, y1: 150, x2: 1768, y2: 150, duration: 12.5, delay: 7.2 },
]

function DraftingReveal(): ReactElement {
  return (
    <g className="zone-far" aria-hidden="true">
      {DRAFT_MARKS.map((m, i) => (
        <line
          key={i}
          x1={m.x1}
          y1={m.y1}
          x2={m.x2}
          y2={m.y2}
          pathLength={1}
          className="l-hair blueprint-draw"
          style={{ animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
        />
      ))}
    </g>
  )
}

/* ---------- assembly -------------------------------------------------------- */

export function Banner({
  compact,
  targets = null,
}: {
  compact: boolean
  /** Five points, in this SVG's own coordinate space, for the focus
      fixtures to aim at — see `Hero.tsx`'s `useHeadlineTargets`. `null`
      (the default) until the headline has been measured. */
  targets?: Vec[] | null
}): ReactElement {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={compact ? '612 20 780 1000' : `0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Blueprint grid with a lighting truss elevation over the title."
    >
      <g className="zone zone-far" style={{ animationDelay: '0.05s' }}>
        <Grid width={W} height={H} step={50} />
      </g>
      <g className="zone" style={{ animationDelay: '0.15s' }}>
        {/* the sheet's own datum spine — the one line drawn stroke-first
            rather than faded in with its group, so the sheet reads as
            struck rather than simply appearing */}
        <line x1={1002} y1={0} x2={1002} y2={H} pathLength={1} className="l-center hero-draw-in" />
      </g>
      <TrussElevation targets={targets} />
      <Furniture />
      <DraftingReveal />
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
