import type { ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'

/* The closing sheet: five reflections on the left (65%), a title-block
   project snapshot on the right (35%) — sized to read as one screen,
   the same "one section, one viewport" discipline the opening sheet
   uses, so the case study ends the way it started rather than trailing
   off into another scroll.

   The five cards are reflection, not a sixth restatement of the metrics
   or the journey map — each one earns its place by being a claim about
   *how* the production was run, grounded in a pillar already argued for
   above, not a new fact. */

type IconType = CaseStudy['takeaways'][number]['icon']

function TakeawayIcon({ type }: { type: IconType }): ReactElement {
  const stroke = 'l-thin'
  switch (type) {
    case 'communication':
      return (
        <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
          <circle cx={8} cy={14} r={5} className={stroke} style={{ fill: 'none' }} />
          <circle cx={20} cy={14} r={5} className={stroke} style={{ fill: 'none' }} />
          <line x1={13} y1={11.5} x2={15} y2={11.5} className="l-thin" />
          <line x1={13} y1={16.5} x2={15} y2={16.5} className="l-thin" />
        </svg>
      )
    case 'budget':
      return (
        <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
          <rect x={4} y={4} width={20} height={20} className={stroke} style={{ fill: 'none' }} />
          <line x1={4} y1={10.5} x2={24} y2={10.5} className="l-hair" />
          <line x1={7} y1={15} x2={16} y2={15} className="l-hair" />
          <line x1={7} y1={19} x2={14} y2={19} className="l-hair" />
          <line x1={19} y1={15} x2={21} y2={15} className={stroke} />
          <line x1={19} y1={19} x2={21} y2={19} className={stroke} />
        </svg>
      )
    case 'workflow':
      return (
        <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
          <rect x={3} y={4} width={9} height={7} className={stroke} style={{ fill: 'none' }} />
          <rect x={16} y={17} width={9} height={7} className={stroke} style={{ fill: 'none' }} />
          <path d="M12 7.5H15.5A3 3 0 0 1 18.5 10.5V17" className="l-thin" style={{ fill: 'none' }} />
          <polygon points="17,15.2 17,18.8 20,17" className="fill-ink" />
        </svg>
      )
    case 'checklist':
      return (
        <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
          <rect x={4} y={3} width={20} height={22} className={stroke} style={{ fill: 'none' }} />
          <rect x={7.5} y={7} width={3.5} height={3.5} className={stroke} style={{ fill: 'none' }} />
          <line x1={14} y1={8.75} x2={21} y2={8.75} className="l-hair" />
          <rect x={7.5} y={13} width={3.5} height={3.5} className={stroke} style={{ fill: 'none' }} />
          <line x1={14} y1={14.75} x2={21} y2={14.75} className="l-hair" />
          <rect x={7.5} y={19} width={3.5} height={3.5} className={stroke} style={{ fill: 'none' }} />
          <line x1={14} y1={20.75} x2={21} y2={20.75} className="l-hair" />
          <path
            d="M7.8 8.6L8.8 9.6L10.6 7.4"
            className="l-thin"
            style={{ fill: 'none', stroke: 'var(--accent-orange)' }}
          />
        </svg>
      )
    case 'planning':
      return (
        <svg viewBox="0 0 28 28" className="size-6" aria-hidden="true">
          <rect x={3} y={6} width={22} height={18} className={stroke} style={{ fill: 'none' }} />
          <line x1={3} y1={11} x2={25} y2={11} className={stroke} />
          <line x1={8} y1={3} x2={8} y2={8} className="l-med" />
          <line x1={20} y1={3} x2={20} y2={8} className="l-med" />
          <line x1={7} y1={15.5} x2={16} y2={15.5} className="l-hair" />
          <line x1={7} y1={19.5} x2={21} y2={19.5} className="l-hair" />
        </svg>
      )
  }
}

function TakeawayCard({ index, t }: { index: number; t: CaseStudy['takeaways'][number] }): ReactElement {
  return (
    <div className="group flex gap-3.5 border-b border-dashed border-ink-25 p-3 transition-colors duration-300 last:border-b-0 hover:bg-paper-warm sm:gap-4 sm:p-3.5">
      <div className="flex w-11 shrink-0 flex-col items-center gap-2 border-r border-dashed border-ink-25 pt-0.5 pr-3.5 sm:w-12">
        <span className="label text-ink-25">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
          <TakeawayIcon type={t.icon} />
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="mb-1 font-display text-[0.92rem] leading-tight font-bold transition-colors duration-300 group-hover:text-accent-orange">
          {t.heading}
        </h3>
        <p className="text-[0.76rem] leading-snug text-ink-70">{t.body}</p>
      </div>
    </div>
  )
}

function ProjectSnapshot({ snapshot }: { snapshot: NonNullable<CaseStudy['snapshot']> }): ReactElement {
  return (
    <div className="flex h-full flex-col border border-ink-25 bg-paper">
      <div className="label border-b-2 border-ink bg-paper-warm px-3.5 py-2.5 text-ink-45">Project Snapshot</div>
      <dl className="flex-1">
        {snapshot.fields.map((f) => (
          <div key={f.k} className="border-b border-dashed border-ink-25 px-3.5 py-2 last:border-b-0">
            <dt className="label text-[0.6rem] text-ink-45">{f.k}</dt>
            <dd className="mt-0.5 font-display text-[0.82rem] leading-snug font-bold">{f.v}</dd>
          </div>
        ))}
      </dl>
      {snapshot.closing && (
        <div className="relative border-t-2 border-ink bg-paper-warm px-3.5 py-3.5">
          <span aria-hidden="true" className="absolute top-2 left-3.5 font-display text-[1.4rem] leading-none text-ink-25">
            &ldquo;
          </span>
          <p className="pl-3 text-[0.78rem] leading-snug font-medium text-ink italic">{snapshot.closing}</p>
        </div>
      )}
    </div>
  )
}

export function OperationsTakeaways({ data }: { data: CaseStudy }): ReactElement {
  if (data.takeaways.length === 0) return <></>

  return (
    <Reveal className="mt-14 lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Operations Takeaways</h2>
        <span className="label ml-auto text-ink-45">Closing Sheet</span>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[65fr_35fr]">
        <div className="border border-ink-25">
          {data.takeaways.map((t, i) => (
            <TakeawayCard key={t.heading} index={i} t={t} />
          ))}
        </div>

        {data.snapshot && <ProjectSnapshot snapshot={data.snapshot} />}
      </div>
    </Reveal>
  )
}
