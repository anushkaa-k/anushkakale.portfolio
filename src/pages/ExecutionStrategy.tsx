import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { Reveal } from '../components/Sheet'
import { asset } from '../lib/asset'

/* Five stages, each its own bordered card rather than a continuous
   thread — the brief here is "read as an independent module," the
   opposite of the connecting spine this section used to have. Ordinary
   document flow, not a viewport-locked sheet: every card is left to
   grow to whatever height its content needs, so nothing is clipped or
   scrolled inside a container.

   Four rows: Stage 1 paired with Stage 2, the Tech & Stage chart on
   its own row directly after — centered rather than stretched, since
   nothing pairs beside it — then Stage 3 paired with Stage 4 (neither
   carries a photograph), and Stage 5 paired with the Games &
   Activities chart as its own standalone card. Both charts render as
   a standalone ChartCard rather than nested inside a stage, so they
   read as document evidence sitting beside — or under — the stage
   rather than an attachment inside it.

   Every card — text-only or chart — shares the same hover lift and
   orange glow, so the whole rectangle answers to a hover, not just the
   image inside it.

   Each `Reveal` fades its own row up independently as it scrolls into
   view — this section runs long enough now that a card near the bottom
   shouldn't wait on one shared reveal timed for the top of the
   section. */

interface Visual {
  src: string
  alt: string
  title: string
}

const TECH_STAGE_CHART: Visual = {
  src: 'img/vasant-technical-chart.png',
  alt: 'The Tech & Stage sheet from the production spreadsheet: date, venue, performance, stage, lights, sound and schedule columns for each show',
  title: 'Tech & Stage Chart',
}

const GAMES_ACTIVITIES_CHART: Visual = {
  src: 'img/vasant-audience-experience.png',
  alt: 'The Games & Activities sheet from the production spreadsheet: timing, location and activity for each audience-facing installation across the run',
  title: 'Games & Activities Chart',
}

/* Neither chart is nested inside a stage card — both render as their
   own standalone ChartCard. */
const VISUALS: (Visual | null)[] = [null, null, null, null, null]

const CARD_HOVER =
  'transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent-orange hover:shadow-[0_14px_28px_-16px_var(--ink-45),0_0_16px_-8px_var(--accent-orange)]'

/* ---- one stage, always a single bordered card ---------------------------- */

function StageCard({
  index,
  mod,
  onOpenImage,
}: {
  index: number
  mod: CaseStudy['execution'][number]
  onOpenImage: (v: Visual) => void
}): ReactElement {
  const visual = VISUALS[index] ?? null

  return (
    <div className={`flex h-full flex-col border border-ink-25 bg-paper p-5 sm:p-6 ${CARD_HOVER}`}>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="label text-ink-45">Stage {String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[1rem] font-bold">{mod.module}</h3>
      </div>

      <p className="mb-3 text-[0.85rem] leading-snug text-ink-70">{mod.objective}</p>

      <ul className="mb-3">
        {mod.checklist.map((item) => (
          <li key={item} className="flex items-start gap-2 py-1">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 border border-ink-25" />
            <span className="text-[0.8rem] leading-snug text-ink-70">{item}</span>
          </li>
        ))}
      </ul>

      <div className="border-l-2 border-accent-orange pl-3">
        <span className="label text-accent-orange">Key Decision</span>
        <p className="mt-1 text-[0.8rem] leading-snug font-medium text-ink">{mod.keyDecision}</p>
      </div>

      {visual && (
        <button
          type="button"
          onClick={() => onOpenImage(visual)}
          aria-label={`Open the ${visual.title} artifact`}
          className="group relative mt-4 block cursor-pointer overflow-hidden border-t border-dashed border-ink-25 pt-4 text-left"
        >
          <span className="label mb-2 block text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
            {visual.title}
          </span>
          <span className="relative block h-44 overflow-hidden border border-ink-25 bg-paper-warm transition-[border-color,box-shadow] duration-300 group-hover:border-accent-orange group-hover:shadow-[0_0_16px_-8px_var(--accent-orange)] sm:h-52">
            <img src={asset(visual.src)} alt={visual.alt} className="h-full w-full object-contain" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-2 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span className="label text-paper">Click to Enlarge</span>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

/* ---- a chart as its own standalone card ----------------------------------- */

function ChartCard({ visual, onOpenImage }: { visual: Visual; onOpenImage: (v: Visual) => void }): ReactElement {
  return (
    <button
      type="button"
      onClick={() => onOpenImage(visual)}
      aria-label={`Open the ${visual.title} artifact`}
      className={`group flex h-full cursor-pointer flex-col border border-ink-25 bg-paper p-5 text-left sm:p-6 ${CARD_HOVER}`}
    >
      <span className="label mb-2 block text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
        {visual.title}
      </span>
      <span className="relative block h-44 flex-1 overflow-hidden border border-ink-25 bg-paper-warm sm:h-52">
        <img src={asset(visual.src)} alt={visual.alt} className="h-full w-full object-contain" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-2 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="label text-paper">Click to Enlarge</span>
        </span>
      </span>
    </button>
  )
}

/* ---- assembled sheet ------------------------------------------------------ */

export function ExecutionStrategy({ execution }: { execution: CaseStudy['execution'] }): ReactElement {
  const [lightbox, setLightbox] = useState<Visual | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  if (execution.length === 0) return <></>
  const [s1, s2, s3, s4, s5] = execution

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
        <h2 className="font-display text-[clamp(1.15rem,2.2vw,1.4rem)] font-bold">Execution Strategy</h2>
        <span className="label ml-auto text-ink-45">Operations Playbook</span>
      </div>

      <div className="flex flex-col gap-8">
        {s1 && s2 && (
          <Reveal>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <StageCard index={0} mod={s1} onOpenImage={setLightbox} />
              <StageCard index={1} mod={s2} onOpenImage={setLightbox} />
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto w-full lg:max-w-[calc(50%-1rem)]">
            <ChartCard visual={TECH_STAGE_CHART} onOpenImage={setLightbox} />
          </div>
        </Reveal>

        {s3 && s4 && (
          <Reveal>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <StageCard index={2} mod={s3} onOpenImage={setLightbox} />
              <StageCard index={3} mod={s4} onOpenImage={setLightbox} />
            </div>
          </Reveal>
        )}

        {s5 && (
          <Reveal>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <StageCard index={4} mod={s5} onOpenImage={setLightbox} />
              <ChartCard visual={GAMES_ACTIVITIES_CHART} onOpenImage={setLightbox} />
            </div>
          </Reveal>
        )}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[min(92vw,56rem)] border-4 border-paper bg-paper p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <img src={asset(lightbox.src)} alt={lightbox.alt} className="max-h-[78vh] w-full object-contain" />
            <figcaption className="label mt-2 flex items-center justify-between gap-4 px-1 py-1 text-ink-70">
              <span className="truncate">{lightbox.title}</span>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="shrink-0 cursor-pointer border border-ink-25 px-2.5 py-1 text-ink-70 transition-colors hover:border-redline hover:text-ink"
              >
                Close ✕
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
