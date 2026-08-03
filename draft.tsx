/* ==========================================================================
   A small drafting kit.

   Every export is an SVG fragment: plans, elevations, sections, dimension
   strings, and the furniture that makes a drawing read as a drawing. All
   orthographic — never isometric.

   Line weight is a class, not a prop, so the stylesheet re-weights every
   drawing on the site at once. See the `.l-*` rules in src/index.css.
   ========================================================================== */

import { Fragment, type ReactElement } from 'react'

/** Two decimals is plenty for path data and keeps the DOM readable. */
const r = (n: number): number => Math.round(n * 100) / 100

type Weight =
  | 'l-construct'
  | 'l-hair'
  | 'l-thin'
  | 'l-med'
  | 'l-bold'
  | 'l-center'
  | 'l-hidden'

/* ---------- annotation ---------------------------------------------------- */

interface NoteProps {
  x: number
  y: number
  children: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
  tone?: 'note' | 'dim'
  rotate?: number
  /** Paper-coloured halo behind the glyphs. On by default. */
  knock?: boolean
}

export function Note({
  x,
  y,
  children,
  size = 12,
  anchor = 'middle',
  tone = 'note',
  rotate,
  knock = true,
}: NoteProps): ReactElement {
  return (
    <text
      x={r(x)}
      y={r(y)}
      fontSize={size}
      textAnchor={anchor}
      className={`note ${tone === 'dim' ? 'dim' : ''} ${knock ? 'knock' : ''}`}
      transform={rotate ? `rotate(${rotate} ${r(x)} ${r(y)})` : undefined}
    >
      {children}
    </text>
  )
}

/* ---------- drafting marks ------------------------------------------------ */

/** Registration target — the crosshair-in-a-circle at sheet corners. */
export function Crosshair({
  x,
  y,
  size = 14,
}: {
  x: number
  y: number
  size?: number
}): ReactElement {
  const t = size * 1.75
  return (
    <g>
      <circle cx={x} cy={y} r={size} className="l-thin" />
      <circle cx={x} cy={y} r={size * 0.18} className="l-thin fill-ink" />
      <line x1={x - t} y1={y} x2={x + t} y2={y} className="l-hair" />
      <line x1={x} y1={y - t} x2={x} y2={y + t} className="l-hair" />
    </g>
  )
}

/** Dash-dot centreline. */
export function CenterLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
}): ReactElement {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className="l-center" />
}

/** Grid bubble — a circled datum reference, as on any general arrangement. */
export function Bubble({
  x,
  y,
  label,
}: {
  x: number
  y: number
  label: string
}): ReactElement {
  return (
    <g>
      <circle cx={x} cy={y} r={12} className="l-thin fill-paper" />
      <Note x={x} y={y + 4} size={11} knock={false}>
        {label}
      </Note>
    </g>
  )
}

function Arrow({
  x,
  y,
  dir,
  size = 7,
}: {
  x: number
  y: number
  dir: 'left' | 'right' | 'up' | 'down'
  size?: number
}): ReactElement {
  const w = size * 0.38
  const pts: [number, number][] =
    dir === 'left'
      ? [
          [x, y],
          [x + size, y - w],
          [x + size, y + w],
        ]
      : dir === 'right'
        ? [
            [x, y],
            [x - size, y - w],
            [x - size, y + w],
          ]
        : dir === 'up'
          ? [
              [x, y],
              [x - w, y + size],
              [x + w, y + size],
            ]
          : [
              [x, y],
              [x - w, y - size],
              [x + w, y - size],
            ]
  return (
    <polygon
      points={pts.map(([px, py]) => `${r(px)},${r(py)}`).join(' ')}
      className="fill-ink"
    />
  )
}

/** Horizontal dimension string: extension lines, arrowed run, knocked label. */
export function DimH({
  x1,
  x2,
  y,
  label,
  from,
  below = false,
  size = 12,
}: {
  x1: number
  x2: number
  y: number
  label: string
  /** Where the measured object sits, so extension lines reach back to it. */
  from?: number
  below?: boolean
  size?: number
}): ReactElement {
  const yObj = from ?? y
  const dir = yObj < y ? 1 : -1
  return (
    <g>
      <line x1={x1} y1={yObj + dir * 4} x2={x1} y2={y + dir * 8} className="l-hair" />
      <line x1={x2} y1={yObj + dir * 4} x2={x2} y2={y + dir * 8} className="l-hair" />
      <line x1={x1} y1={y} x2={x2} y2={y} className="l-thin" />
      <Arrow x={x1} y={y} dir="left" />
      <Arrow x={x2} y={y} dir="right" />
      <Note x={(x1 + x2) / 2} y={y + (below ? 14 : -6)} size={size} tone="dim">
        {label}
      </Note>
    </g>
  )
}

/** Vertical dimension string. Reads bottom-to-top unless `flat`. */
export function DimV({
  y1,
  y2,
  x,
  label,
  from,
  flat = false,
  side = 'right',
  size = 12,
}: {
  y1: number
  y2: number
  x: number
  label: string
  from?: number
  flat?: boolean
  side?: 'left' | 'right'
  size?: number
}): ReactElement {
  const xObj = from ?? x
  const dir = xObj < x ? 1 : -1
  return (
    <g>
      <line x1={xObj + dir * 4} y1={y1} x2={x + dir * 8} y2={y1} className="l-hair" />
      <line x1={xObj + dir * 4} y1={y2} x2={x + dir * 8} y2={y2} className="l-hair" />
      <line x1={x} y1={y1} x2={x} y2={y2} className="l-thin" />
      <Arrow x={x} y={y1} dir="up" />
      <Arrow x={x} y={y2} dir="down" />
      {flat ? (
        <Note
          x={x + (side === 'left' ? -8 : 8)}
          y={(y1 + y2) / 2 + 4}
          anchor={side === 'left' ? 'end' : 'start'}
          size={size}
          tone="dim"
        >
          {label}
        </Note>
      ) : (
        <Note x={x - 6} y={(y1 + y2) / 2} rotate={-90} size={size} tone="dim">
          {label}
        </Note>
      )}
    </g>
  )
}

/* ---------- theatre objects ----------------------------------------------- */

/**
 * Lighting truss in elevation: top and bottom chords, vertical posts,
 * X-bracing in every bay, node dots at the joints, end plates.
 */
export function Truss({
  x,
  y,
  length,
  depth,
  bays,
  nodes = true,
}: {
  x: number
  y: number
  length: number
  depth: number
  bays: number
  nodes?: boolean
}): ReactElement {
  const bay = length / bays
  const posts = Array.from({ length: bays + 1 }, (_, i) => x + i * bay)
  const cells = Array.from({ length: bays }, (_, i) => x + i * bay)

  return (
    <g>
      <line x1={x} y1={y} x2={x + length} y2={y} className="l-med" />
      <line x1={x} y1={y + depth} x2={x + length} y2={y + depth} className="l-med" />
      {posts.map((px, i) => (
        <line key={`p${i}`} x1={px} y1={y} x2={px} y2={y + depth} className="l-thin" />
      ))}
      {cells.map((bx, i) => (
        <Fragment key={`b${i}`}>
          <line x1={bx} y1={y} x2={bx + bay} y2={y + depth} className="l-hair" />
          <line x1={bx + bay} y1={y} x2={bx} y2={y + depth} className="l-hair" />
        </Fragment>
      ))}
      {nodes &&
        posts.map((px, i) => (
          <Fragment key={`n${i}`}>
            <circle cx={r(px)} cy={y} r={1.5} className="l-hair fill-paper" />
            <circle cx={r(px)} cy={y + depth} r={1.5} className="l-hair fill-paper" />
          </Fragment>
        ))}
      <line x1={x} y1={y - 2} x2={x} y2={y + depth + 2} className="l-bold" />
      <line
        x1={x + length}
        y1={y - 2}
        x2={x + length}
        y2={y + depth + 2}
        className="l-bold"
      />
    </g>
  )
}

/** The same truss seen from above: chords plus lacing. */
export function TrussPlan({
  x,
  y,
  length,
  width,
  bays,
}: {
  x: number
  y: number
  length: number
  width: number
  bays: number
}): ReactElement {
  const bay = length / bays
  return (
    <g>
      <rect x={x} y={y} width={length} height={width} className="l-med" />
      {Array.from({ length: bays + 1 }, (_, i) => (
        <line
          key={`p${i}`}
          x1={x + i * bay}
          y1={y}
          x2={x + i * bay}
          y2={y + width}
          className="l-thin"
        />
      ))}
      {Array.from({ length: bays }, (_, i) => (
        <Fragment key={`b${i}`}>
          <line
            x1={x + i * bay}
            y1={y}
            x2={x + (i + 1) * bay}
            y2={y + width}
            className="l-hair"
          />
          <line
            x1={x + (i + 1) * bay}
            y1={y}
            x2={x + i * bay}
            y2={y + width}
            className="l-hair"
          />
        </Fragment>
      ))}
    </g>
  )
}

export type LanternType = 'profile' | 'fresnel' | 'par'

/** A hung lantern in elevation: drop, hook clamp, yoke, body, lens. */
export function Lantern({
  x,
  y,
  type = 'profile',
  scale: k = 1,
}: {
  x: number
  y: number
  type?: LanternType
  scale?: number
}): ReactElement {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 5 * k} className="l-thin" />
      <rect x={x - 3 * k} y={y + 5 * k} width={6 * k} height={3.5 * k} className="l-thin" />
      <line x1={x} y1={y + 8.5 * k} x2={x} y2={y + 11 * k} className="l-thin" />
      <line
        x1={x - 6 * k}
        y1={y + 11 * k}
        x2={x + 6 * k}
        y2={y + 11 * k}
        className="l-hair"
      />

      {type === 'fresnel' && (
        <>
          <rect
            x={x - 5.5 * k}
            y={y + 11 * k}
            width={11 * k}
            height={11 * k}
            className="l-med"
          />
          <line
            x1={x - 5.5 * k}
            y1={y + 18 * k}
            x2={x + 5.5 * k}
            y2={y + 18 * k}
            className="l-hair"
          />
        </>
      )}

      {type === 'par' && (
        <>
          <rect
            x={x - 4.5 * k}
            y={y + 11 * k}
            width={9 * k}
            height={9 * k}
            className="l-med"
          />
          <circle cx={x} cy={r(y + 20 * k)} r={r(4.5 * k)} className="l-thin" />
        </>
      )}

      {type === 'profile' && (
        <>
          <path
            d={
              `M${r(x - 4 * k)} ${r(y + 11 * k)}` +
              `L${r(x + 4 * k)} ${r(y + 11 * k)}` +
              `L${r(x + 6 * k)} ${r(y + 22 * k)}` +
              `L${r(x - 6 * k)} ${r(y + 22 * k)}Z`
            }
            className="l-med"
          />
          <line
            x1={x - 6 * k}
            y1={y + 19 * k}
            x2={x + 6 * k}
            y2={y + 19 * k}
            className="l-hair"
          />
          <rect
            x={x - 3.5 * k}
            y={y + 6 * k}
            width={7 * k}
            height={5 * k}
            className="l-hair"
          />
        </>
      )}
    </g>
  )
}

/** A run of lanterns hung along a truss chord. */
export function LanternRun({
  x,
  y,
  length,
  count,
  types = ['profile', 'fresnel', 'par'],
  scale = 1,
}: {
  x: number
  y: number
  length: number
  count: number
  types?: LanternType[]
  scale?: number
}): ReactElement {
  const step = length / (count + 1)
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <Lantern
          key={i}
          x={x + (i + 1) * step}
          y={y}
          type={types[i % types.length]}
          scale={scale}
        />
      ))}
    </g>
  )
}

/**
 * Raked seating in plan: arc rows struck from a focal point upstage, each
 * divided into seats by radial ticks.
 */
export function SeatingFan({
  cx,
  cy,
  radius,
  rows,
  rowGap,
  spread,
  seatArc,
}: {
  cx: number
  cy: number
  /** Radius of the front row. */
  radius: number
  rows: number
  rowGap: number
  /** Total angle covered, in degrees. */
  spread: number
  /** Angular width of one seat, in degrees. */
  seatArc: number
}): ReactElement {
  /* 0° points straight down the centreline, away from the stage, so the rows
     curve around the focal point rather than away from it. */
  const rad = (d: number) => ((90 - d) * Math.PI) / 180
  const px = (rr: number, d: number) => cx + rr * Math.cos(rad(d))
  const py = (rr: number, d: number) => cy + rr * Math.sin(rad(d))

  const seatAngles: number[] = []
  for (let a = -spread / 2; a <= spread / 2 + 0.001; a += seatArc) seatAngles.push(a)

  return (
    <g>
      {Array.from({ length: rows }, (_, i) => {
        const rr = radius + i * rowGap
        /* Drawn as a polyline through the seat positions: identical on the
           page to an arc, with no sweep-flag guesswork. */
        const row = seatAngles.map((a) => `${r(px(rr, a))},${r(py(rr, a))}`).join(' ')
        return (
          <Fragment key={i}>
            <polyline points={row} className="l-hair" />
            {seatAngles.map((a, j) => (
              <line
                key={j}
                x1={r(px(rr, a))}
                y1={r(py(rr, a))}
                x2={r(px(rr + rowGap * 0.62, a))}
                y2={r(py(rr + rowGap * 0.62, a))}
                className="l-hair"
              />
            ))}
          </Fragment>
        )
      })}
    </g>
  )
}

/** The stepped profile you get cutting a section through a raked house. */
export function RakeSection({
  x,
  y,
  steps,
  run,
  rise,
}: {
  x: number
  y: number
  steps: number
  run: number
  rise: number
}): ReactElement {
  let d = `M${r(x)} ${r(y)}`
  let cx = x
  let cy = y
  for (let i = 0; i < steps; i++) {
    cx += run
    d += `L${r(cx)} ${r(cy)}`
    cy -= rise
    d += `L${r(cx)} ${r(cy)}`
  }
  return <path d={d} className="l-med" />
}

/** Plan-view tree: canopy circle with radial spokes, as on a site drawing. */
export function Tree({
  x,
  y,
  radius,
  spokes = 12,
}: {
  x: number
  y: number
  radius: number
  spokes?: number
}): ReactElement {
  return (
    <g>
      <circle cx={r(x)} cy={r(y)} r={r(radius)} className="l-hair" />
      {Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2
        return (
          <line
            key={i}
            x1={r(x + Math.cos(a) * radius * 0.15)}
            y1={r(y + Math.sin(a) * radius * 0.15)}
            x2={r(x + Math.cos(a) * radius)}
            y2={r(y + Math.sin(a) * radius)}
            className="l-hair"
          />
        )
      })}
      <circle cx={r(x)} cy={r(y)} r={r(radius * 0.13)} className="l-hair" />
    </g>
  )
}

/** 45° hatching clipped to a rectangle — masking, walls, poché. */
export function Hatch({
  x,
  y,
  width,
  height,
  gap = 7,
  id,
}: {
  x: number
  y: number
  width: number
  height: number
  gap?: number
  /** Must be unique on the page: it names the clip path. */
  id: string
}): ReactElement {
  const clip = `hatch-${id}`
  const lines: number[] = []
  for (let i = -height; i < width; i += gap) lines.push(i)

  return (
    <g>
      <clipPath id={clip}>
        <rect x={x} y={y} width={width} height={height} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {lines.map((i, n) => (
          <line
            key={n}
            x1={r(x + i)}
            y1={r(y + height)}
            x2={r(x + i + height)}
            y2={r(y)}
            className="l-hair"
          />
        ))}
      </g>
      <rect x={x} y={y} width={width} height={height} className="l-med" />
    </g>
  )
}

/** Faint setting-out grid across a sheet. */
export function Grid({
  width,
  height,
  step,
}: {
  width: number
  height: number
  step: number
}): ReactElement {
  const cols: number[] = []
  const rows: number[] = []
  for (let i = step; i < width; i += step) cols.push(i)
  for (let i = step; i < height; i += step) rows.push(i)
  return (
    <g>
      {cols.map((i) => (
        <line key={`c${i}`} x1={i} y1={0} x2={i} y2={height} className="l-construct" />
      ))}
      {rows.map((i) => (
        <line key={`r${i}`} x1={0} y1={i} x2={width} y2={i} className="l-construct" />
      ))}
    </g>
  )
}

export type { Weight }
