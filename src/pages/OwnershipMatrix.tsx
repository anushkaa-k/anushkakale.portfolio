import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { useReveal } from '../hooks/useReveal'
import { Note } from '../lib/draft'

/* Left: seven ownership cards in a matrix grid, each just a domain and one
   line on what it meant in practice. Right: the same seven domains as a
   hub-and-spoke drafting diagram — Assistant Production Manager at the
   centre, one drafted spoke per domain, so the two halves of the section
   are reading the same list two ways rather than repeating it. Domains are
   passed in once and drive both, so they can't drift out of sync. */

/* The canvas has to be wide enough that "Production Documentation" — the
   longest label, ~213px wide at this font size — still clears the viewBox
   edge after running out from its node. CX is off-centre (not W/2) because
   the longest labels land on the left-running spokes; measured via
   getBBox() in the browser rather than estimated, since the monospace note
   font turned out to run noticeably wider than a naive char-count guess. */
const W = 650
const H = 420
const CX = 345
const CY = 170
const HUB_R = 12
const NODE_R = 100
const DOT_R = 4.5

function OwnershipDiagram({ domains }: { domains: string[] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()

  const spokes = domains.map((label, i) => {
    const angle = -90 + i * (360 / domains.length)
    const rad = (angle * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const nx = CX + NODE_R * cos
    const ny = CY + NODE_R * sin
    const hx = CX + HUB_R * cos
    const hy = CY + HUB_R * sin
    const anchor: 'start' | 'middle' | 'end' = cos > 0.35 ? 'start' : cos < -0.35 ? 'end' : 'middle'
    const labelX = nx + cos * 12
    const labelY = ny + sin * 12 + (anchor === 'middle' ? (sin > 0 ? 9 : -5) : 4)
    return { label, nx, ny, hx, hy, anchor, labelX, labelY, dash: Math.hypot(nx - hx, ny - hy) }
  })

  return (
    <div ref={ref} className="mx-auto max-w-[38rem]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Diagram: Assistant Production Manager at the centre, branching into seven operational domains"
      >
        <circle
          cx={CX}
          cy={CY}
          r={NODE_R + 20}
          className="l-construct"
          style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />

        {spokes.map((s, i) => (
          <line
            key={`spoke-${s.label}`}
            x1={s.hx}
            y1={s.hy}
            x2={s.nx}
            y2={s.ny}
            className="l-thin"
            style={{
              strokeDasharray: s.dash,
              strokeDashoffset: shown ? 0 : s.dash,
              transition: 'stroke-dashoffset 0.7s ease',
              transitionDelay: shown ? `${i * 90}ms` : '0ms',
            }}
          />
        ))}

        {spokes.map((s, i) => (
          <g
            key={`node-${s.label}`}
            style={{
              opacity: shown ? 1 : 0,
              transition: 'opacity 0.4s ease',
              transitionDelay: shown ? `${i * 90 + 260}ms` : '0ms',
            }}
          >
            <circle cx={s.nx} cy={s.ny} r={DOT_R} className="l-med fill-paper" />
            <Note x={s.labelX} y={s.labelY} anchor={s.anchor} size={10} tone="dim">
              {s.label}
            </Note>
          </g>
        ))}

        <circle
          cx={CX}
          cy={CY}
          r={HUB_R}
          className="l-bold fill-paper"
          style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />
        <g style={{ opacity: shown ? 1 : 0, transition: 'opacity 0.5s ease', transitionDelay: '150ms' }}>
          <Note x={CX} y={CY + HUB_R + 20} size={10}>
            ASST. PRODUCTION
          </Note>
          <Note x={CX} y={CY + HUB_R + 33} size={10}>
            MANAGER
          </Note>
        </g>
      </svg>
    </div>
  )
}

export function OwnershipMatrix({ ownership }: { ownership: CaseStudy['ownership'] }): ReactElement {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Scope of Ownership</h2>
        <span className="label ml-auto text-ink-45">Ownership Matrix</span>
      </div>

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[3fr_2fr]">
        <Reveal className="grid grid-cols-1 gap-px border border-ink-25 bg-ink-25 sm:grid-cols-2">
          {ownership.map((row) => (
            <div
              key={row.domain}
              className="group bg-paper p-4 transition-[background-color,box-shadow] duration-300 ease-out hover:z-10 hover:bg-paper-warm hover:shadow-[inset_0_0_0_1px_var(--accent-orange),0_0_16px_-6px_var(--accent-orange)] sm:last:col-span-2"
            >
              <h3 className="font-display text-[0.98rem] font-bold transition-colors duration-300 group-hover:text-accent-orange">
                {row.domain}
              </h3>
              <p className="mt-1 text-[0.8rem] leading-snug text-ink-70">{row.summary}</p>
            </div>
          ))}
        </Reveal>

        <OwnershipDiagram domains={ownership.map((row) => row.domain)} />
      </div>
    </section>
  )
}
