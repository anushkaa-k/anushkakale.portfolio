import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useReveal } from '../hooks/useReveal'
import { asset } from '../lib/asset'

/* Five bands, read top to bottom as one continuous operations playbook
   rather than five disconnected write-ups: a thin spine runs down the
   left edge on desktop, threading every band's number marker into one
   line.

   Only two bands carry a visual — the real Tech & Stage and Games &
   Activities charts from the production spreadsheet, dropped in as
   photographs of the actual documents rather than a drawn stand-in —
   so those two keep the alternating text/visual split (odd bands mirror
   via `lg:flex-row-reverse`, matching the original five-band rhythm:
   Technical Operations is band two, Audience Experience is band five,
   so they land on opposite sides exactly as they did when every band
   had a diagram). The other three bands have no artifact to pair
   against, so they run full width instead of half, rather than leaving
   an empty column.

   One shared `useReveal()` on the outer wrapper drives all five bands'
   entrance, staggered per band via inline transition-delay — the same
   pattern OperationsMap.tsx uses next door, so the two sheets read as
   one family rather than two different animation systems.

   The whole sheet targets one desktop viewport (`lg:h-dvh`, `lg:`-only
   for the same reason as the rest of this case study: mobile flows in
   ordinary document order instead). With only two photographs instead
   of five hand-drawn diagrams, five bands comfortably fit one normal
   desktop screen — the `overflow-y-auto` on the scroll container is
   kept purely as the same short-window safety net every other sheet in
   this case study uses, not because this one is expected to need it. */

interface Visual {
  src: string
  alt: string
  title: string
}

const VISUALS: (Visual | null)[] = [
  null,
  {
    src: 'img/vasant-technical-chart.png',
    alt: 'The Tech & Stage sheet from the production spreadsheet: date, venue, performance, stage, lights, sound and schedule columns for each show',
    title: 'Tech & Stage Chart',
  },
  null,
  null,
  {
    src: 'img/vasant-audience-experience.png',
    alt: 'The Games & Activities sheet from the production spreadsheet: timing, location and activity for each audience-facing installation across the run',
    title: 'Games & Activities Chart',
  },
]

/* ---- one band ----------------------------------------------------------- */

function BandBody({ index, mod }: { index: number; mod: CaseStudy['execution'][number] }): ReactElement {
  return (
    <>
      <div className="mb-0.5 flex items-baseline gap-2">
        <span className="label text-ink-45">Stage {String(index + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[0.86rem] font-bold">{mod.module}</h3>
      </div>
      <p className="mb-1 text-[0.72rem] leading-tight text-ink-70">{mod.objective}</p>
      <ul className="mb-1">
        {mod.checklist.map((item) => (
          <li key={item} className="flex items-start gap-1.5 py-px">
            <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 border border-ink-25" />
            <span className="text-[0.68rem] leading-tight text-ink-70">{item}</span>
          </li>
        ))}
      </ul>
      <div className="border-l-2 border-accent-orange pl-2.5">
        <span className="label text-accent-orange">Key Decision</span>
        <p className="mt-0.5 text-[0.68rem] leading-tight font-medium text-ink">{mod.keyDecision}</p>
      </div>
    </>
  )
}

function Band({
  index,
  mod,
  shown,
  onOpenImage,
}: {
  index: number
  mod: CaseStudy['execution'][number]
  shown: boolean
  onOpenImage: (v: Visual) => void
}): ReactElement {
  const visual = VISUALS[index] ?? null
  const reversed = index % 2 === 1

  return (
    <div
      className="relative"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        transitionDelay: shown ? `${index * 130}ms` : '0ms',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 left-0 z-10 hidden size-2.5 -translate-x-1/2 rotate-45 border border-ink bg-paper lg:block"
      />

      {visual ? (
        <div
          className={`flex flex-col gap-3 pl-0 lg:flex-row lg:items-center lg:gap-8 lg:pl-7 ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          <div className="lg:w-1/2">
            <BandBody index={index} mod={mod} />
          </div>

          <button
            type="button"
            onClick={() => onOpenImage(visual)}
            aria-label={`Open the ${visual.title} artifact`}
            className="group relative block cursor-pointer overflow-hidden border border-ink-25 bg-paper-warm p-1.5 text-left transition-[border-color,box-shadow] duration-300 lg:w-1/2 hover:border-accent-orange hover:shadow-[0_0_16px_-8px_var(--accent-orange)]"
          >
            <span className="label mb-1 block text-ink-45 transition-colors duration-300 group-hover:text-accent-orange">
              {visual.title}
            </span>
            <span className="relative block h-32 overflow-hidden border border-ink-25 bg-paper sm:h-36">
              <img src={asset(visual.src)} alt={visual.alt} className="h-full w-full object-contain" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-2 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              >
                <span className="label text-paper">Click to Enlarge</span>
              </span>
            </span>
          </button>
        </div>
      ) : (
        <div className="pl-0 lg:pl-7">
          <BandBody index={index} mod={mod} />
        </div>
      )}
    </div>
  )
}

/* ---- assembled sheet ------------------------------------------------------ */

export function ExecutionStrategy({ execution }: { execution: CaseStudy['execution'] }): ReactElement {
  const { ref, shown } = useReveal<HTMLDivElement>()
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

  return (
    <div ref={ref} className="flex flex-col bg-paper text-ink lg:h-dvh lg:min-h-[36rem]">
      <div className="gutter flex min-h-0 flex-1 flex-col overflow-y-auto py-[clamp(1rem,3vh,1.75rem)]">
        <div className="mb-2.5 flex shrink-0 items-baseline gap-3 border-b-2 border-ink pb-2">
          <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink" />
          <h2 className="font-display text-[clamp(1.05rem,1.9vw,1.3rem)] font-bold">Execution Strategy</h2>
          <span className="label ml-auto text-ink-45">Operations Playbook</span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col gap-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-0 hidden w-px bg-ink-25 lg:block"
          />
          {execution.map((mod, i) => (
            <Band key={mod.module} index={i} mod={mod} shown={shown} onOpenImage={setLightbox} />
          ))}
        </div>
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
    </div>
  )
}
