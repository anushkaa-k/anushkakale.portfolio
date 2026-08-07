import { useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'

/* The closing section reads as a post-project operations review, not a
   fourth retelling of execution tasks: three decisions, each its own
   bordered card at roughly a third of the page, Challenge → Decision →
   Impact. Artist Hospitality is deliberately absent — it already has a
   card in Execution Strategy, and repeating it here would dilute the
   "decisions that mattered" framing this section is going for.

   Each card owns its hover state (rather than a CSS-only :hover) so one
   `hovered` boolean can drive both the card's lift/border and the
   metric's colour at once. */

/* ---- one decision, a single bordered card --------------------------------- */

function DecisionStage({
  label,
  text,
  highlight = false,
}: {
  label: string
  text: string
  highlight?: boolean
}): ReactElement {
  return (
    <div className={highlight ? 'border-l-2 border-accent-orange pl-3' : ''}>
      <span className={`label ${highlight ? 'text-accent-orange' : 'text-ink-45'}`}>{label}</span>
      <p className={`mt-1 text-[0.8rem] leading-snug ${highlight ? 'font-medium text-ink' : 'text-ink-70'}`}>
        {text}
      </p>
    </div>
  )
}

function StageArrow(): ReactElement {
  return (
    <div aria-hidden="true" className="my-2 text-[0.7rem] text-ink-25">
      ↓
    </div>
  )
}

function DecisionCard({ index, d }: { index: number; d: CaseStudy['decisions'][number] }): ReactElement {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex h-full flex-col border bg-paper p-6 transition-[transform,box-shadow,border-color] duration-300 ${
        hovered ? '-translate-y-1 border-accent-orange shadow-[0_16px_32px_-18px_var(--ink-45),0_0_16px_-8px_var(--accent-orange)]' : 'border-ink-25'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="label text-ink-45">Decision {String(index + 1).padStart(2, '0')}</span>
        <span className={`label text-right font-bold transition-colors duration-300 ${hovered ? 'text-accent-orange' : 'text-ink-70'}`}>
          {d.metric}
        </span>
      </div>

      <h3 className="mb-4 font-display text-[1rem] font-bold">{d.title}</h3>

      <DecisionStage label="Challenge" text={d.challenge} />
      <StageArrow />
      <DecisionStage label="Decision" text={d.decision} highlight />
      <StageArrow />

      <div>
        <span className="label text-ink-45">Impact</span>
        <ul className="mt-1.5">
          {d.impact.map((item) => (
            <li key={item} className="flex items-start gap-2 py-0.5">
              <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-ink-25" />
              <span className="text-[0.78rem] leading-snug text-ink-70">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function OperationalDecisions({ decisions }: { decisions: CaseStudy['decisions'] }): ReactElement {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Operational Decisions</h2>
        <span className="label ml-auto text-ink-45">Decision Log</span>
      </div>

      <Reveal>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {decisions.map((d, i) => (
            <DecisionCard key={d.title} index={i} d={d} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
