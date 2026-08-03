/* ==========================================================================
   The hero drawing sheet.

   One 2000 × 960 plate laid out the way a real sheet is: auditorium ground
   plan on the left, truss elevation above the title, stage front elevation
   below it, building section on the right, details bottom-right. The middle
   band is deliberately left empty — that is where the title sits.

   Groups marked `zone-far` are dropped on narrow screens and the viewBox
   crops to the centre, so a phone gets a legible drawing rather than the
   whole sheet shrunk into noise.
   ========================================================================== */

import { Fragment, type ReactElement } from 'react'
import {
  Bubble,
  CenterLine,
  Crosshair,
  DimH,
  DimV,
  Grid,
  Hatch,
  LanternRun,
  Note,
  RakeSection,
  SeatingFan,
  Tree,
  Truss,
  TrussPlan,
} from '../lib/draft'

const W = 2000
const H = 960

/* ---------- left: site + auditorium ground plan ---------------------------- */

const TREES: [number, number][] = [
  [318, 46], [372, 92], [408, 150], [432, 214], [443, 282],
  [447, 350], [436, 416], [412, 478], [378, 536], [332, 588],
  [278, 634], [214, 672], [148, 706], [88, 742],
  [196, 62], [138, 104], [96, 158],
]

function GroundPlan(): ReactElement {
  return (
    <g className="zone zone-far" transform="translate(0,86)" style={{ animationDelay: '0.28s' }}>
      {/* site: a road curving past the north-west corner, verge trees along it */}
      <path
        d="M-20 130 C 120 60, 210 130, 250 220 S 300 400, 250 520 S 150 700, 20 760"
        className="l-thin"
      />
      <path
        d="M-20 60 C 140 -10, 270 90, 310 210 S 360 410, 305 545 S 190 760, 60 820"
        className="l-hair"
      />
      {TREES.map(([x, y], i) => (
        <Tree key={i} x={x} y={y} radius={i % 3 === 0 ? 26 : 21} spokes={i % 2 ? 14 : 11} />
      ))}

      {/* building footprint — an irregular, angled envelope as built */}
      <path
        d="M96 196 L206 118 L392 118 L470 196 L470 470 L404 560 L404 640 L150 640 L96 566 Z"
        className="l-bold"
      />
      <path
        d="M108 206 L212 130 L386 130 L458 206 L458 466 L396 550 L396 628 L158 628 L108 558 Z"
        className="l-hair"
      />

      {/* stage house, with the upstage crossover */}
      <rect x={148} y={156} width={262} height={116} className="l-med" />
      <rect x={156} y={164} width={246} height={100} className="l-hair" />
      <Note x={279} y={216} size={15}>
        STAGE
      </Note>
      <line x1={148} y1={250} x2={410} y2={250} className="l-hair" />

      {/* back of house: dressing rooms, dock, workshop */}
      <rect x={110} y={274} width={62} height={44} className="l-thin" />
      <rect x={110} y={318} width={62} height={44} className="l-thin" />
      <rect x={386} y={274} width={66} height={88} className="l-thin" />
      <rect x={110} y={132} width={40} height={30} className="l-hair" />

      {/* proscenium wall with the opening, then the apron edge */}
      <line x1={148} y1={272} x2={200} y2={272} className="l-bold" />
      <line x1={358} y1={272} x2={410} y2={272} className="l-bold" />
      <path d="M200 272 Q 279 306, 358 272" className="l-med" />

      <SeatingFan cx={279} cy={150} radius={168} rows={12} rowGap={13} spread={62} seatArc={3.6} />

      {/* rear cross-aisle */}
      <path d="M170 500 Q 279 546, 388 500" className="l-hair" />

      {/* datum lines with grid bubbles */}
      <CenterLine x1={279} y1={96} x2={279} y2={664} />
      <Bubble x={279} y={88} label="A" />
      <CenterLine x1={78} y1={272} x2={486} y2={272} />
      <Bubble x={70} y={272} label="1" />

      <Note x={279} y={690} size={13}>
        GROUND PLAN
      </Note>
      <Note x={279} y={710} size={11} tone="dim">
        SCALE 1:100
      </Note>
    </g>
  )
}

/* ---------- centre top: truss elevation ------------------------------------ */

function TrussElevation(): ReactElement {
  const x = 654
  const y = 104
  const length = 700
  const depth = 54

  return (
    <g className="zone" style={{ animationDelay: '0.42s' }}>
      <Truss x={x} y={y} length={length} depth={depth} bays={15} />
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

      {/* marginal annotations — outside the phone crop, so dropped with it */}
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

/* ---------- centre bottom: stage front elevation --------------------------- */

function FrontElevation({ compact }: { compact: boolean }): ReactElement {
  const L = 566
  const R = 1074
  const top = 686
  const deck = 872
  const floor = 906

  return (
    <g
      className="zone"
      transform={compact ? 'translate(182,60)' : undefined}
      style={{ animationDelay: '0.56s' }}
    >
      <line x1={L - 40} y1={floor} x2={R + 40} y2={floor} className="l-bold" />
      <rect x={L} y={top} width={R - L} height={deck - top} className="l-med" />

      <Hatch id="border" x={L} y={top} width={R - L} height={26} gap={8} />
      <Hatch id="legL" x={L} y={top + 26} width={34} height={deck - top - 26} gap={8} />
      <Hatch id="legR" x={R - 34} y={top + 26} width={34} height={deck - top - 26} gap={8} />

      <Truss x={L + 58} y={top + 52} length={R - L - 116} depth={26} bays={10} />
      <LanternRun
        x={L + 58}
        y={top + 78}
        length={R - L - 116}
        count={7}
        types={['profile', 'fresnel']}
        scale={0.92}
      />

      {/* line-array hangs flanking the opening */}
      {[L - 26, R + 26].map((sx, n) => (
        <Fragment key={n}>
          <line x1={sx} y1={top + 4} x2={sx} y2={top + 24} className="l-hair" />
          {Array.from({ length: 6 }, (_, i) => (
            <path
              key={i}
              d={
                `M${sx - 13 - i} ${top + 24 + i * 15}H${sx + 13 + i}` +
                `l-3 13H${sx - 10 - i}Z`
              }
              className="l-thin"
            />
          ))}
        </Fragment>
      ))}

      {/* deck, apron edge, pit rail */}
      <line x1={L + 10} y1={deck} x2={R - 10} y2={deck} className="l-bold" />
      <line x1={L + 10} y1={deck} x2={L + 10} y2={floor} className="l-thin" />
      <line x1={R - 10} y1={deck} x2={R - 10} y2={floor} className="l-thin" />
      {Array.from({ length: Math.floor((R - L - 54) / 46) }, (_, i) => {
        const px = L + 34 + i * 46
        return (
          <line key={i} x1={px} y1={deck + 6} x2={px} y2={floor - 6} className="l-hair" />
        )
      })}

      <DimV y1={top} y2={deck} x={L - 74} from={L} label={`24'-0"`} />
      <Note x={(L + R) / 2} y={floor + 26} size={13}>
        FRONT ELEVATION
      </Note>
    </g>
  )
}

/* ---------- right: section A-A --------------------------------------------- */

function SectionAA(): ReactElement {
  /* Held clear of the right-hand sheet edge so the dimension strings and
     their labels stay inside the drawing. */
  const L = 1360
  const R = 1830
  const ridge = 1595
  const eave = 176
  const apex = 62
  const deck = 396
  const base = 512
  const pros = 1570

  return (
    <g className="zone zone-far" transform="translate(0,44)" style={{ animationDelay: '0.7s' }}>
      {/* envelope: gable roof over fly tower and house */}
      <path d={`M${L} ${eave}L${ridge} ${apex}L${R} ${eave}`} className="l-bold" />
      <path
        d={`M${L + 14} ${eave + 6}L${ridge} ${apex + 14}L${R - 14} ${eave + 6}`}
        className="l-hair"
      />
      <line x1={L} y1={eave} x2={L} y2={base} className="l-bold" />
      <line x1={R} y1={eave} x2={R} y2={base} className="l-bold" />
      <line x1={L} y1={base} x2={R} y2={base} className="l-bold" />
      <line x1={L + 20} y1={eave} x2={R - 20} y2={eave} className="l-thin" />

      {/* fly floor over the stage, truss hung off it */}
      <line x1={L + 16} y1={214} x2={pros} y2={214} className="l-thin" />
      {Array.from({ length: 9 }, (_, j) => (
        <line
          key={j}
          x1={L + 30 + j * 22}
          y1={214}
          x2={L + 30 + j * 22}
          y2={226}
          className="l-hair"
        />
      ))}
      <line x1={1430} y1={226} x2={1430} y2={262} className="l-hair" />
      <line x1={1520} y1={226} x2={1520} y2={262} className="l-hair" />
      <Truss x={1400} y={262} length={150} depth={22} bays={6} nodes={false} />
      <LanternRun
        x={1400}
        y={284}
        length={150}
        count={5}
        types={['profile', 'fresnel']}
        scale={0.72}
      />

      {/* flown goods upstage */}
      <line x1={L + 24} y1={240} x2={L + 24} y2={deck} className="l-hair" />
      <Hatch id="sect-border" x={L + 30} y={232} width={10} height={60} gap={6} />

      {/* proscenium wall, deck, understage */}
      <line x1={pros} y1={214} x2={pros} y2={deck} className="l-bold" />
      <line x1={L} y1={deck} x2={pros} y2={deck} className="l-bold" />
      <line x1={L} y1={deck + 44} x2={pros} y2={deck + 44} className="l-hair" />

      {/* apron, then the house stepping up to the back wall */}
      <line x1={pros} y1={deck} x2={pros + 40} y2={deck} className="l-med" />
      <RakeSection x={pros + 40} y={deck} steps={11} run={22} rise={9} />
      {Array.from({ length: 11 }, (_, k) => (
        <path
          key={k}
          d={`M${pros + 46 + k * 22} ${deck - k * 9}v-14h11v14`}
          className="l-hair"
        />
      ))}

      <DimV y1={eave} y2={deck} x={R + 48} from={R} flat label={`36'-0"`} />
      <DimV y1={deck} y2={base} x={R + 48} from={R} flat label={`40'-0"`} />
      <Note x={R - 4} y={apex + 46} anchor="end" size={13}>
        SECTION A-A
      </Note>
    </g>
  )
}

/* ---------- bottom right: details ------------------------------------------ */

function Details(): ReactElement {
  const x = 1216
  const y = 716
  const length = 420
  const dx = 1760
  const dy = 712

  return (
    <g className="zone zone-far" style={{ animationDelay: '0.84s' }}>
      <TrussPlan x={x} y={y} length={length} width={42} bays={10} />
      <TrussPlan x={x + 14} y={y + 62} length={length - 28} width={42} bays={9} />
      <DimH x1={x} x2={x + length} y={y - 34} from={y} label={`40'-0"`} />
      <DimH
        x1={x + 14}
        x2={x + length - 14}
        y={y + 138}
        from={y + 104}
        below
        label={`28'-0"`}
      />

      {/* base plates under the plan */}
      {Array.from({ length: 6 }, (_, i) => (
        <Fragment key={i}>
          <circle cx={x + 40 + i * 72} cy={y + 132} r={6} className="l-thin" />
          <line
            x1={x + 34 + i * 72}
            y1={y + 126}
            x2={x + 46 + i * 72}
            y2={y + 138}
            className="l-hair"
          />
        </Fragment>
      ))}

      {/* flown line-array, elevation */}
      {Array.from({ length: 9 }, (_, b) => (
        <path
          key={b}
          d={`M${dx - 16 - b} ${dy + b * 17}H${dx + 16 + b}l-4 15H${dx - 12 - b}Z`}
          className="l-thin"
        />
      ))}
      <line x1={dx} y1={dy - 22} x2={dx} y2={dy} className="l-hair" />
      <DimH x1={dx - 24} x2={dx + 24} y={dy - 34} from={dy - 22} label={`4'-0"`} size={11} />
      <DimV
        y1={dy}
        y2={dy + 168}
        x={dx + 62}
        from={dx + 26}
        flat
        label={`12'-0"`}
        size={11}
      />
    </g>
  )
}

/* ---------- sheet furniture ------------------------------------------------- */

function Furniture(): ReactElement {
  return (
    <g className="zone zone-far" style={{ animationDelay: '0.96s' }}>
      <Crosshair x={48} y={44} />
      <Crosshair x={1952} y={44} />
      <Crosshair x={48} y={912} />
      <Crosshair x={640} y={42} size={11} />
      <Crosshair x={1420} y={42} size={11} />
      <Crosshair x={1952} y={912} />
      <Crosshair x={1002} y={826} size={13} />
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
      aria-label={
        'Architectural drawing sheet of a theatre: auditorium ground plan, ' +
        'lighting truss elevation, stage front elevation and building section.'
      }
    >
      <g className="zone zone-far" style={{ animationDelay: '0.05s' }}>
        <Grid width={W} height={H} step={50} />
      </g>
      <g className="zone" style={{ animationDelay: '0.15s' }}>
        <CenterLine x1={1002} y1={0} x2={1002} y2={H} />
      </g>
      <GroundPlan />
      <TrussElevation />
      <FrontElevation compact={compact} />
      <SectionAA />
      <Details />
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
