import type { ReactElement } from 'react'

import { site } from '../content'
import { useParallax } from '../hooks/useParallax'
import { useReveal } from '../hooks/useReveal'
import { CenterLine, Crosshair, DimH, LanternRun, RakeSection, Truss } from '../lib/draft'

/* The pull-quote band, redesigned as an intermission rather than a bare
   spacer: a small blueprint label, a short quote, and a ghost of a theatre
   elevation (rig, curtain swag, raked seating) drifting faintly behind it.
   Renders nothing if `quote` is absent from site.yaml. */

/** A miniature theatre elevation, held at near-zero opacity as ambient
    texture — the same drafting vocabulary as the hero banner, just quieter. */
function TheatreGhost(): ReactElement {
  return (
    <svg
      viewBox="0 0 1600 320"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <g style={{ opacity: 0.07 }}>
        <CenterLine x1={800} y1={0} x2={800} y2={320} />
        <Truss x={250} y={50} length={1100} depth={26} bays={18} />
        <LanternRun x={250} y={76} length={1100} count={9} scale={0.85} />
        <path
          d="M700 320 Q720 258 740 320 Q760 258 780 320 Q800 258 820 320 Q840 258 860 320 Q880 258 900 320"
          className="l-hair"
        />
        <RakeSection x={120} y={280} steps={7} run={26} rise={9} />
        <DimH x1={300} x2={1300} y={30} from={30} label={`40'-0"`} size={11} />
        <DimH x1={500} x2={1100} y={300} from={300} below label={`24'-0"`} size={11} />
        <Crosshair x={60} y={40} size={10} />
        <Crosshair x={1540} y={280} size={10} />
      </g>
    </svg>
  )
}

export function Interlude(): ReactElement | null {
  const quote = site.quote
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>()
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()
  if (!quote) return null

  return (
    <aside
      ref={parallaxRef}
      className="gutter relative overflow-hidden border-y-2 border-ink bg-paper-warm py-[clamp(2.75rem,5vw,3.5rem)] text-center"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -inset-y-6 h-[calc(100%+3rem)] w-full"
        style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.2s linear' }}
      >
        <TheatreGhost />
      </div>

      <div ref={revealRef} data-in={shown} className="reveal relative mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-center gap-3">
          <svg width="44" height="10" viewBox="0 0 44 10" className="opacity-40" aria-hidden="true">
            <line x1={0} y1={5} x2={44} y2={5} className="l-hair" />
            <line x1={0} y1={1} x2={0} y2={9} className="l-hair" />
            <line x1={22} y1={2} x2={22} y2={8} className="l-hair" />
            <line x1={44} y1={1} x2={44} y2={9} className="l-hair" />
          </svg>
          <span className="label text-ink-45">Intermission</span>
          <svg width="44" height="10" viewBox="0 0 44 10" className="opacity-40" aria-hidden="true">
            <line x1={0} y1={5} x2={44} y2={5} className="l-hair" />
            <line x1={0} y1={1} x2={0} y2={9} className="l-hair" />
            <line x1={22} y1={2} x2={22} y2={8} className="l-hair" />
            <line x1={44} y1={1} x2={44} y2={9} className="l-hair" />
          </svg>
        </div>

        <blockquote>
          <p className="mx-auto max-w-[22ch] font-display text-[clamp(1.3rem,3.2vw,2rem)] leading-tight font-bold italic">
            {quote.text}
          </p>
          <cite className="label mt-4 block text-ink-45 not-italic">— {quote.author}</cite>
        </blockquote>
      </div>
    </aside>
  )
}
