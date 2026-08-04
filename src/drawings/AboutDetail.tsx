import type { ReactElement } from 'react'

import { Crosshair, DimV, Lantern, Note, RakeSection } from '../lib/draft'

/* A small companion detail beneath the "At a glance" panel, so the empty
   space in the right-hand column reads as part of the drawing rather than
   a gap: a lighting position overhead, and a section through raked seating
   below it — the same vocabulary as the hero banner, at a smaller scale. */

export function AboutDetail({ className = '' }: { className?: string }): ReactElement {
  const rakeX = 46
  const rakeY = 244
  const steps = 6
  const run = 22
  const rise = 15
  const topY = rakeY - steps * rise
  const rakeRight = rakeX + steps * run

  return (
    <svg
      viewBox="0 0 210 300"
      className={className}
      role="img"
      aria-label="Technical detail: a lighting position over a section through raked seating"
    >
      <Crosshair x={16} y={16} size={6} />
      <Crosshair x={194} y={284} size={6} />

      {/* overhead lighting position */}
      <line x1={36} y1={38} x2={162} y2={38} className="l-med" />
      <line x1={36} y1={49} x2={162} y2={49} className="l-med" />
      {[36, 68, 99, 130, 162].map((x) => (
        <line key={x} x1={x} y1={38} x2={x} y2={49} className="l-thin" />
      ))}
      <Lantern x={58} y={49} type="profile" scale={0.85} />
      <Lantern x={99} y={49} type="fresnel" scale={0.85} />
      <Lantern x={140} y={49} type="par" scale={0.85} />
      <Note x={162} y={33} anchor="end" size={8} tone="dim">
        LX 2
      </Note>

      {/* section through raked seating */}
      <RakeSection x={rakeX} y={rakeY} steps={steps} run={run} rise={rise} />
      <line x1={rakeX} y1={rakeY} x2={rakeRight} y2={rakeY} className="l-bold" />
      <line x1={rakeX} y1={rakeY} x2={rakeX} y2={rakeY + 6} className="l-hair" />
      <line x1={rakeRight} y1={rakeY} x2={rakeRight} y2={rakeY + 6} className="l-hair" />

      <DimV
        y1={topY}
        y2={rakeY}
        x={rakeRight + 22}
        from={rakeRight}
        label={`4'-6"`}
        size={9}
      />

      <Note x={16} y={278} anchor="start" size={11}>
        SECTION B-B
      </Note>
      <Note x={16} y={291} anchor="start" size={9} tone="dim">
        SCALE 1:50
      </Note>
    </svg>
  )
}
