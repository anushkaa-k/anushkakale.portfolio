import { useEffect, useState, type ReactElement } from 'react'

import type { CaseStudy } from '../content'
import { useLights } from '../hooks/useLights'
import { useReveal } from '../hooks/useReveal'
import { asset } from '../lib/asset'
import { CaseStudyHeader, CaseStudyNav } from './CaseStudyHeader'
import { ExecutionStrategy } from './ExecutionStrategy'
import { OperationalDecisions } from './OperationalDecisions'
import { OperationsMap } from './OperationsMap'

/* This page's own sections, in document order — fed to CaseStudyHeader's
   nav so it can jump around this page specifically, distinct from the
   main site's section list. */
const VASANT_SECTIONS = [
  { id: 'scope-of-ownership', label: 'Scope of Ownership' },
  { id: 'project-complexity', label: 'Project Complexity' },
  { id: 'execution-strategy', label: 'Execution Strategy' },
  { id: 'operational-decisions', label: 'Operational Decisions' },
]

/* Sheet one is the opening: header, Executive Dashboard, Project Context and
   the festival poster as a Project Board. Every block flows in ordinary
   document height — nothing here is locked to the viewport, so the sheet
   simply grows as tall as its content needs and the page scrolls normally
   past it, the same as every sheet after it.

   The 40/60 column split reads as figures-then-evidence: the Executive
   Dashboard and Project Context on the left tell a recruiter the shape of
   the project in a glance, and the poster on the right is the primary
   document that actually proves it — a real artifact, not decoration.

   `useLights()` is called for its side effect only — the stored paper/
   blueprint choice from the main site still applies here, there just isn't
   a visible toggle on this page. `useReveal()` drives one entrance pass
   for the whole opening sheet (dashboard tiles, context sections and the
   board itself each stagger off the same `shown` flag) rather than the
   generic scroll-triggered `.reveal` — this sheet is above the fold, so
   "on scroll into view" and "on load" are effectively the same moment. */

function SubsectionHeading({ children }: { children: string }): ReactElement {
  return (
    <h2 className="label mb-2 flex shrink-0 items-center gap-2 text-ink-45">
      <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-45" />
      {children}
    </h2>
  )
}

/* ---- Executive Dashboard --------------------------------------------- */

function ExecutiveDashboard({ metrics, shown }: { metrics: CaseStudy['metrics']; shown: boolean }): ReactElement {
  return (
    <section id="executive-dashboard" className="shrink-0">
      <SubsectionHeading>Executive Dashboard</SubsectionHeading>
      <dl className="grid grid-cols-2 gap-px border border-ink-25 bg-ink-25 sm:grid-cols-4">
        {metrics.map((metric, i) => (
          <div
            key={metric.k}
            className="group relative overflow-hidden bg-paper px-3 py-2.5 transition-colors duration-300 hover:bg-paper-warm"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.45s ease, transform 0.45s ease',
              transitionDelay: shown ? `${i * 55}ms` : '0ms',
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px w-0 bg-accent-orange transition-[width] duration-300 ease-out group-hover:w-full"
            />
            <dt className="label text-[0.56rem] text-ink-45">{metric.k}</dt>
            <dd className="mt-1 font-display text-[1.05rem] leading-none font-bold transition-colors duration-300 group-hover:text-accent-orange">
              {metric.v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---- Project Context ---------------------------------------------------
   Three short blueprint sections — what it is, its scale, why it was
   operationally complex — read as a leader-line annotation off a dimension
   string rather than three more paragraphs. */

function ProjectContext({ context, shown }: { context: CaseStudy['context']; shown: boolean }): ReactElement {
  return (
    <div id="project-context" className="flex flex-col">
      <SubsectionHeading>Project Context</SubsectionHeading>
      <div className="flex flex-col gap-4">
        {context.map((section, i) => (
          <div
            key={section.label}
            className="border-l-2 border-ink-25 py-0.5 pl-3 transition-colors duration-300 hover:border-accent-orange"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: shown ? `${280 + i * 130}ms` : '0ms',
            }}
          >
            <span className="label text-[0.62rem] text-accent-orange">{section.label}</span>
            <p className="mt-0.5 text-[0.8rem] leading-snug text-ink-70">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---- Project Board -------------------------------------------------------
   The poster itself, drawn as the primary operational document rather than
   a plain image: small blueprint annotations pinned around it, naming what
   the document is actually used for — an engineering-drawing convention,
   not dashboard chrome. */

const POSTER_ANNOTATIONS: { text: string; className: string }[] = [
  { text: 'Primary Operational Document', className: 'top-2 left-2' },
  { text: 'Venue Scheduling Reference', className: 'top-2 right-2 text-right' },
  { text: 'Used for Volunteer Deployment', className: 'bottom-2 left-2' },
  { text: 'Daily Run-of-Show Planning', className: 'bottom-2 right-2 text-right' },
]

export function CaseStudy({
  data,
  backHref,
}: {
  data: CaseStudy
  backHref: string
}): ReactElement {
  const { mode, toggle } = useLights()
  const { ref, shown } = useReveal<HTMLDivElement>()
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
      <CaseStudyNav backHref={backHref} sections={VASANT_SECTIONS} mode={mode} onToggle={toggle} />

      <div ref={ref} className="flex flex-col text-ink">
        <div className="gutter flex flex-col py-[clamp(0.75rem,2.5vh,1.5rem)]">
          <CaseStudyHeader title={data.title} role={data.role} org={data.org} year={data.year} />

          <hr className="my-[clamp(0.65rem,2.2vh,1.1rem)] shrink-0 border-t-2 border-ink" />

          <section className="grid gap-x-10 gap-y-8 lg:grid-cols-[2fr_3fr]">
            {/* LEFT — 40%: Executive Dashboard over Project Context */}
            <div className="flex flex-col gap-[clamp(0.75rem,2vh,1.25rem)]">
              <ExecutiveDashboard metrics={data.metrics} shown={shown} />
              <ProjectContext context={data.context} shown={shown} />
            </div>

            {/* RIGHT — 60%: the poster as a Project Board */}
            <div
              id="project-board"
              className="flex min-w-0 flex-col"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
                transitionDelay: shown ? '160ms' : '0ms',
              }}
            >
              <SubsectionHeading>Project Board</SubsectionHeading>

              {/* On desktop the board is sized off the viewport height rather
                  than the column width (51:68 is the same 3:4 ratio), so the
                  whole opening sheet stays inside one screen instead of the
                  poster running metres tall in a wide column. Below `lg` the
                  column is full-width and the page stacks, so it keeps the
                  plain width-driven aspect box. */}
              <div className="relative aspect-[3/4] lg:mx-auto lg:aspect-auto lg:h-[75vh] lg:w-[56.25vh] lg:max-w-full">
                {posterOk ? (
                  <>
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

                    {POSTER_ANNOTATIONS.map((a, i) => (
                      <span
                        key={a.text}
                        aria-hidden="true"
                        className={`label pointer-events-none absolute z-20 hidden max-w-[9rem] border border-ink-25 bg-paper px-1.5 py-1 text-[0.56rem] leading-tight text-ink-45 shadow-[0_2px_8px_-3px_var(--ink-25)] lg:block ${a.className}`}
                        style={{
                          opacity: shown ? 1 : 0,
                          transition: 'opacity 0.4s ease',
                          transitionDelay: shown ? `${420 + i * 90}ms` : '0ms',
                        }}
                      >
                        {a.text}
                      </span>
                    ))}
                  </>
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

      <OperationsMap ownership={data.ownership} risks={data.risks} />

      <div className="gutter pb-[clamp(3rem,6vw,5rem)] text-ink">
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
