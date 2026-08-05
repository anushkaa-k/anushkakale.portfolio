import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { useReveal } from '../hooks/useReveal'
import { Crosshair, Note } from '../lib/draft'

/* Visual on the left this time, register on the right — alternating sides
   from the Ownership Matrix above so the page reads with some rhythm
   rather than every row falling the same way.

   The diagram is a convergence line, not a mind map: six operational
   inputs (the same items the register lists) run into one junction, one
   line continues on to a single output. That's the actual shape of the
   claim — several functions have to land at once for a show to run — and
   it reads as a dependency diagram rather than a decorative flourish. */

/* IN_X leaves room for the longest input label ("Multi-Venue Operations",
   ~196px wide at this font size, measured via getBBox() in the browser
   rather than estimated) to run out to the left of its marker without
   crossing the viewBox edge. */
const W = 460
const H = 380
const IN_X = 230
const JUNCTION_X = 340
const OUT_X = 400
const MID_Y = H / 2

function stripParenthetical(label: string): string {
  return label.replace(/\s*\([^)]*\)\s*$/, '')
}

function ComplexityDiagram({ inputs }: { inputs: string[] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const step = (H - 60) / (inputs.length - 1)

  const lines = inputs.map((label, i) => {
    const y = 30 + i * step
    const dash = Math.hypot(JUNCTION_X - IN_X, MID_Y - y)
    return { label, y, dash }
  })

  const outDash = OUT_X - JUNCTION_X

  return (
    <div ref={ref} className="mx-auto max-w-[28rem]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Diagram: six operational functions converging into one point, then continuing to live execution"
      >
        <g style={{ opacity: 0.3 }} aria-hidden="true">
          <Crosshair x={16} y={16} size={7} />
          <Crosshair x={W - 16} y={H - 16} size={7} />
        </g>

        {lines.map((l, i) => (
          <line
            key={`in-${l.label}`}
            x1={IN_X}
            y1={l.y}
            x2={JUNCTION_X}
            y2={MID_Y}
            className="l-thin"
            style={{
              strokeDasharray: l.dash,
              strokeDashoffset: shown ? 0 : l.dash,
              transition: 'stroke-dashoffset 0.6s ease',
              transitionDelay: shown ? `${i * 90}ms` : '0ms',
            }}
          />
        ))}

        {lines.map((l, i) => (
          <g
            key={`marker-${l.label}`}
            style={{
              opacity: shown ? 1 : 0,
              transition: 'opacity 0.4s ease',
              transitionDelay: shown ? `${i * 90 + 200}ms` : '0ms',
            }}
          >
            <circle cx={IN_X} cy={l.y} r={4} className="l-thin fill-paper" />
            <Note x={IN_X - 10} y={l.y + 3.5} anchor="end" size={9.5} tone="dim">
              {stripParenthetical(l.label)}
            </Note>
          </g>
        ))}

        <line
          x1={JUNCTION_X}
          y1={MID_Y}
          x2={OUT_X}
          y2={MID_Y}
          className="l-bold"
          style={{
            strokeDasharray: outDash,
            strokeDashoffset: shown ? 0 : outDash,
            transition: 'stroke-dashoffset 0.4s ease',
            transitionDelay: shown ? `${inputs.length * 90 + 120}ms` : '0ms',
          }}
        />
        <circle
          cx={JUNCTION_X}
          cy={MID_Y}
          r={3.5}
          className="l-thin fill-paper"
          style={{
            opacity: shown ? 1 : 0,
            transition: 'opacity 0.3s ease',
            transitionDelay: shown ? `${inputs.length * 90}ms` : '0ms',
          }}
        />
        <g
          style={{
            opacity: shown ? 1 : 0,
            transition: 'opacity 0.4s ease',
            transitionDelay: shown ? `${inputs.length * 90 + 420}ms` : '0ms',
          }}
        >
          <circle cx={OUT_X} cy={MID_Y} r={6} className="l-bold fill-paper" />
          <Note x={OUT_X} y={MID_Y + 22} size={10}>
            LIVE
          </Note>
          <Note x={OUT_X} y={MID_Y + 35} size={10}>
            EXECUTION
          </Note>
        </g>
      </svg>
    </div>
  )
}

export function OperationalComplexity({ risks }: { risks: CaseStudy['risks'] }): ReactElement {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Operational Complexity</h2>
        <span className="label ml-auto text-ink-45">Risk Register</span>
      </div>

      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[2fr_3fr]">
        <ComplexityDiagram inputs={risks.map((row) => row.item)} />

        <Reveal className="border border-ink-45">
          <div className="label flex items-center gap-3 border-b border-ink-45 bg-paper-warm px-3.5 py-2.5 text-ink-45">
            <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink-45" />
            Operations Risk Register
            <span className="ml-auto text-ink-25">{risks.length} Items</span>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="label text-ink-45">
                <th className="border-b border-ink-25 px-3.5 py-2 font-medium">Operational Complexity</th>
                <th className="border-b border-ink-25 px-3.5 py-2 font-medium">Impact</th>
                <th className="border-b border-ink-25 px-3.5 py-2 font-medium">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((row) => (
                <tr
                  key={row.item}
                  className="border-b border-dashed border-ink-25 transition-colors last:border-b-0 hover:bg-paper-warm"
                >
                  <td className="px-3.5 py-3 align-top font-display text-[0.86rem] font-bold">{row.item}</td>
                  <td className="px-3.5 py-3 align-top text-[0.8rem] leading-snug text-ink-70">{row.impact}</td>
                  <td className="px-3.5 py-3 align-top text-[0.8rem] leading-snug text-ink-70">
                    {row.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  )
}
