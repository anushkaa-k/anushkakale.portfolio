import type { ReactElement } from 'react'

import { Crosshair, DimV, LanternRun, Note, RakeSection, Truss } from '../lib/draft'

/* A small companion detail beneath the "At a glance" panel, so the empty
   space in the right-hand column reads as part of the drawing rather than
   a gap: a lighting position overhead, and a section through raked seating
   below it — the same vocabulary as the hero banner, at a smaller scale.

   The viewBox is sized so one unit maps to roughly the same screen size as
   in the banner (~0.72px at a typical column width): copying the banner's
   own absolute figures — truss depth, lantern scale, rake run/rise — onto a
   canvas that size is what keeps the linework the same weight as the hero,
   rather than the same numbers stretched over a much smaller sheet. */

export function AboutDetail({ className = '' }: { className?: string }): ReactElement {
  const trussX = 70
  const trussY = 50
  const trussLength = 440
  const trussDepth = 26

  const rakeX = 90
  const rakeY = 380
  const steps = 7
  const run = 44
  const rise = 30
  const rakeRight = rakeX + steps * run
  const rakeTop = rakeY - steps * rise

  return (
    <svg
      viewBox="0 0 580 440"
      className={className}
      role="img"
      aria-label="Technical detail: a lighting position over a section through raked seating"
    >
      <Crosshair x={30} y={30} size={13} />
      <Crosshair x={550} y={410} size={13} />

      {/* overhead lighting position */}
      <Truss x={trussX} y={trussY} length={trussLength} depth={trussDepth} bays={6} />
      <LanternRun
        x={trussX}
        y={trussY + trussDepth}
        length={trussLength}
        count={4}
        types={['profile', 'fresnel', 'par']}
        scale={1.1}
      />
      <Note x={trussX + trussLength} y={trussY - 10} anchor="end" size={12} tone="dim">
        LX 2
      </Note>

      {/* section through raked seating */}
      <RakeSection x={rakeX} y={rakeY} steps={steps} run={run} rise={rise} />
      <line x1={rakeX} y1={rakeY} x2={rakeRight} y2={rakeY} className="l-bold" />
      <line x1={rakeX} y1={rakeY} x2={rakeX} y2={rakeY + 8} className="l-hair" />
      <line x1={rakeRight} y1={rakeY} x2={rakeRight} y2={rakeY + 8} className="l-hair" />

      <DimV
        y1={rakeTop}
        y2={rakeY}
        x={rakeRight + 30}
        from={rakeRight}
        label={`5'-0"`}
        size={11}
      />

      <Note x={30} y={402} anchor="start" size={13}>
        SECTION B-B
      </Note>
      <Note x={30} y={419} anchor="start" size={11} tone="dim">
        SCALE 1:50
      </Note>
    </svg>
  )
}
