import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useLights } from '../hooks/useLights'
import { asset } from '../lib/asset'
import { ExecutionStrategy } from './ExecutionStrategy'
import { OperationalComplexity } from './OperationalComplexity'
import { OperationalDecisions } from './OperationalDecisions'
import { OwnershipMatrix } from './OwnershipMatrix'

/* Sheet one is the opening: header, Executive Dashboard, Project Context and
   the festival poster, sized to sit inside one desktop viewport with no
   scrolling. `h-dvh` plus `min-h-0` down the flex chain is what makes that
   hold: each block is `shrink-0` except the two-column row at the bottom,
   which is the one `flex-1` that absorbs whatever height is left over. A
   very short window still overflows into a scrollbar rather than clipping
   content outright, but nothing here is designed to need it.

   Everything after that — Scope of Ownership, Operational Complexity — is
   deliberately outside the h-dvh block, in ordinary document flow: those
   are read by scrolling, the opening sheet is read at a glance.

   `useLights()` is called for its side effect only — the stored paper/
   blueprint choice from the main site still applies here, there just isn't
   a visible toggle on this page. */

export function CaseStudy({
  data,
  backHref,
}: {
  data: CaseStudy
  backHref: string
}): ReactElement {
  useLights()
  const [posterFailed, setPosterFailed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const posterOk = !!data.poster && !posterFailed

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  return (
    <>
      <div className="flex h-dvh min-h-[36rem] flex-col bg-paper text-ink">
        <div className="gutter flex min-h-0 flex-1 flex-col overflow-y-auto py-[clamp(0.75rem,2.5vh,1.5rem)]">
          <header className="shrink-0">
            <a
              href={backHref}
              className="label inline-flex items-center gap-1.5 text-ink-45 no-underline transition-colors hover:text-ink"
            >
              <span aria-hidden="true">←</span> Back to Projects
            </a>
            <h1 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-none font-extrabold tracking-tight uppercase">
              {data.title}
            </h1>
            <p className="label mt-1.5 text-ink-45">
              {data.role} <span className="text-ink-25">•</span> {data.org}{' '}
              <span className="text-ink-25">•</span> {data.year}
            </p>
          </header>

          <hr className="my-[clamp(0.75rem,2.5vh,1.25rem)] shrink-0 border-t-2 border-ink" />

          <section className="shrink-0">
            <h2 className="label mb-2 text-ink-45">Executive Dashboard</h2>
            <dl className="grid grid-cols-2 gap-px border border-ink-25 bg-ink-25 sm:grid-cols-4 lg:grid-cols-8">
              {data.metrics.map((metric) => (
                <div key={metric.k} className="bg-paper px-3 py-2.5">
                  <dt className="label text-[0.56rem] text-ink-45">{metric.k}</dt>
                  <dd className="mt-1 font-display text-[1.05rem] leading-none font-bold">{metric.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <hr className="my-[clamp(0.75rem,2.5vh,1.25rem)] shrink-0 border-t-2 border-ink" />

          <section className="grid min-h-0 flex-1 gap-x-10 gap-y-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex min-h-0 flex-col">
              <h2 className="label mb-2 shrink-0 text-ink-45">Project Context</h2>
              <div className="min-h-0 overflow-y-auto">
                {data.context.map((paragraph, i) => (
                  <p key={i} className="mb-3 text-[0.92rem] leading-snug text-ink-70 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col">
              <h2 className="label mb-2 shrink-0 text-ink-45">Festival Schedule Poster</h2>
              <div className="relative min-h-0 flex-1">
                {posterOk ? (
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`Open the ${data.title} schedule poster`}
                    className="group relative block h-full w-full cursor-pointer border border-ink-25 bg-paper-warm p-2 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 left-1/2 z-10 size-2.5 -translate-x-1/2 rounded-full border border-ink-45 bg-paper shadow-[0_1px_2px_var(--ink-25)]"
                    />
                    <img
                      src={asset(data.poster!.src)}
                      alt={data.poster!.alt}
                      onError={() => setPosterFailed(true)}
                      className="h-full w-full object-contain"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 to-transparent py-3 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <span className="label text-paper">Click to Enlarge</span>
                    </span>
                  </button>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 border border-dashed border-ink-25 bg-paper-warm text-center">
                    <span className="label text-ink-25">Poster Pending</span>
                    <span className="text-[0.75rem] text-ink-45">Final art to follow</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="gutter bg-paper pb-[clamp(3rem,6vw,5rem)] text-ink">
        <OwnershipMatrix ownership={data.ownership} />
        <OperationalComplexity risks={data.risks} />
        <ExecutionStrategy execution={data.execution} />
        <OperationalDecisions decisions={data.decisions} />
      </div>

      {lightboxOpen && posterOk && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={data.poster!.alt}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[min(90vw,44rem)] border-4 border-paper bg-paper p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <img
              src={asset(data.poster!.src)}
              alt={data.poster!.alt}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="label mt-2 flex items-center justify-between gap-4 px-1 py-1 text-ink-70">
              <span className="truncate">{data.poster!.alt}</span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="shrink-0 cursor-pointer border border-ink-25 px-2.5 py-1 text-ink-70 transition-colors hover:border-redline hover:text-ink"
              >
                Close ✕
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
