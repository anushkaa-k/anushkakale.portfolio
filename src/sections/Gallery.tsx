import { useEffect, useState, type ReactElement } from 'react'

import { gallery, type Photo } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, SheetHead } from '../components/Sheet'
import { asset } from '../lib/asset'

/*
  Photos are optional. A file listed in gallery.yaml but missing from
  public/img/ drops itself out, and if none of them load the sheet removes
  itself entirely — so the site looks finished before the photos arrive.

  Presented as a contact sheet: each print mounted on its own card, given a
  small alternating tilt as if pinned up for review, numbered like frames on
  a roll — that frame number is a stable identity (hashed from the filename,
  not the on-screen position), so it never changes when a filter reorders
  the grid. Clicking a frame opens a lightbox with Previous/Next and the
  full caption, never truncated.

  Only a curated 12 frames — atmosphere, backstage, crew, venue detail —
  show by default under "All", favouring the shots that don't already
  appear as hero images on the project cards above. "View Complete Contact
  Sheet" expands the rest in place. Switching to a specific festival tab
  shows everything in that bucket immediately, since each bucket is already
  a handful of frames.
*/

const FILTERS = ['All', 'Vasant Gujarati Theatre Festival', 'Pratibimb Marathi Theatre Festival', 'Behind the Scenes']

/** Curated for atmosphere/backstage/venue/crew — deliberately skipping the
    more "hero" shots (lineup boards, press day, awards) that read closer to
    what already fronts the project cards above. */
const CURATED = new Set([
  'img/pratibimb-2026-tech-desk.jpeg',
  'img/pratibimb-2026-dressing-table.jpeg',
  'img/karunashtake-team-pratibimb-2026.jpeg',
  'img/vasant-2026-flowers.jpeg',
  'img/vasant-lanterns.jpg',
  'img/vasant-house-lights.jpg',
  'img/pratibimb-press-backstage.jpg',
  'img/akvarious-25-courtyard.jpg',
  'img/alive-tech-run-pune.jpg',
  'img/fundamentals-sachin-shinde.jpg',
  'img/ghashiram-kotwal.jpg',
  'img/vasant-frontage.jpg',
])

const STAGE_MARKS = ['Stage Left', 'Stage Right', 'House Left', 'Upstage', 'Downstage', 'House Right']

/** A small, stable pseudo-random tilt in [-1, 1] degrees, seeded from the
    filename so a photo's tilt never changes as filters reorder the grid. */
function tiltFor(src: string): number {
  let hash = 0
  for (let i = 0; i < src.length; i++) hash = (hash * 31 + src.charCodeAt(i)) | 0
  return ((Math.abs(hash) % 200) / 100 - 1) * 1
}

type Frame = Photo & { frame: number }

export function Gallery({ meta }: { meta: SectionMeta }): ReactElement | null {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())
  const [filter, setFilter] = useState(FILTERS[0])
  const [expanded, setExpanded] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shown: Frame[] = gallery.items
    .filter((photo) => !failed.has(photo.src))
    .map((photo, i) => ({ ...photo, frame: i + 1 }))

  const byFilter = filter === 'All' ? shown : shown.filter((p) => p.project === filter)
  const curatedFrames = filter === 'All' ? byFilter.filter((p) => CURATED.has(p.src)) : byFilter
  const restFrames = filter === 'All' ? byFilter.filter((p) => !CURATED.has(p.src)) : []
  const hasMore = restFrames.length > 0
  const visible = hasMore && !expanded ? curatedFrames : byFilter

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((v) => (v === null ? v : (v + 1) % visible.length))
      if (e.key === 'ArrowLeft') setOpenIndex((v) => (v === null ? v : (v - 1 + visible.length) % visible.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, visible.length])

  if (shown.length === 0) return null

  const step = (delta: number) =>
    setOpenIndex((v) => (v === null ? v : (v + delta + visible.length) % visible.length))

  const active = openIndex !== null ? visible[openIndex] : null

  return (
    <section id={meta.id} className="gutter py-[clamp(3.5rem,8vw,6rem)]">
      <SheetHead meta={meta} />

      <Reveal className="border border-ink-45 bg-paper-warm p-[clamp(1.25rem,4vw,2.25rem)]">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <div className="label flex flex-wrap items-baseline gap-3 text-ink-45">
            <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink-45" />
            Contact sheet
            <span className="text-ink-25">
              {shown.length} frame{shown.length === 1 ? '' : 's'}
            </span>
          </div>

          <div role="tablist" aria-label="Filter photos by project" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = f === filter
              const count = f === 'All' ? shown.length : shown.filter((p) => p.project === f).length
              if (f !== 'All' && count === 0) return null
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setFilter(f)
                    setExpanded(false)
                  }}
                  className={`label cursor-pointer border px-2.5 py-1 transition-colors duration-200 ${
                    isActive
                      ? 'border-accent-orange text-accent-orange'
                      : 'border-ink-25 text-ink-45 hover:border-ink-45 hover:text-ink-70'
                  }`}
                >
                  {f} <span className={isActive ? 'text-accent-orange/60' : 'text-ink-25'}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-12 [grid-template-columns:repeat(auto-fit,minmax(12.5rem,1fr))]">
          {curatedFrames.map((photo) => (
            <GalleryCard
              key={photo.src}
              photo={photo}
              onOpen={() => setOpenIndex(visible.indexOf(photo))}
              onImgError={() => setFailed((prev) => new Set(prev).add(photo.src))}
            />
          ))}
        </div>

        {hasMore && (
          <div
            className="grid transition-[grid-template-rows] duration-500 ease-in-out"
            style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="grid gap-x-10 gap-y-12 pt-12 [grid-template-columns:repeat(auto-fit,minmax(12.5rem,1fr))]">
                {restFrames.map((photo) => (
                  <GalleryCard
                    key={photo.src}
                    photo={photo}
                    inert={!expanded}
                    onOpen={() => setOpenIndex(visible.indexOf(photo))}
                    onImgError={() => setFailed((prev) => new Set(prev).add(photo.src))}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="label inline-flex cursor-pointer items-center gap-2 border border-ink-25 px-4 py-2 text-ink-45 transition-colors hover:border-ink hover:text-ink"
            >
              <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-current" />
              {expanded ? 'Show Fewer Frames' : `View Complete Contact Sheet (${shown.length} Frames)`}
            </button>
          </div>
        )}
      </Reveal>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setOpenIndex(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/90 p-[4vh_4vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-[min(94vw,50rem)] flex-col border-4 border-paper bg-paper shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="label flex items-center justify-between gap-3 border-b border-dashed border-ink-25 bg-paper-warm px-3 py-2 text-ink-45">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-45" />
                Capture Log
              </span>
              <span className="text-ink-70">
                Frame {String(active.frame).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}
              </span>
              <span className="hidden text-ink-25 sm:inline">
                {STAGE_MARKS[active.frame % STAGE_MARKS.length]}
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden bg-ink/5">
              <img
                src={asset(active.src)}
                alt={active.alt}
                className="mx-auto max-h-[62vh] w-auto max-w-full object-contain p-3"
              />

              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center border border-ink-25 bg-paper/90 text-ink-70 transition-colors hover:border-accent-orange hover:text-accent-orange"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center border border-ink-25 bg-paper/90 text-ink-70 transition-colors hover:border-accent-orange hover:text-accent-orange"
                  >
                    ›
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center border border-ink-25 bg-paper/90 text-ink-70 transition-colors hover:border-redline hover:text-redline"
              >
                ✕
              </button>
            </div>

            <figcaption className="overflow-y-auto border-t border-dashed border-ink-25 px-4 py-3.5">
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <b className="font-display text-[1.1rem] font-bold">{active.project}</b>
                <span className="label text-ink-45">
                  {[active.year, active.location].filter(Boolean).join(' · ')}
                </span>
              </div>
              <p className="mb-1 text-[0.9rem] font-semibold text-ink">{active.title}</p>
              <p className="text-[0.85rem] leading-snug text-ink-70">{active.alt}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}

function GalleryCard({
  photo,
  onOpen,
  onImgError,
  inert = false,
}: {
  photo: Frame
  onOpen: () => void
  onImgError: () => void
  /** True while this card sits in the collapsed (0-height) expand panel —
      keeps it out of tab order so hidden cards can't steal keyboard focus. */
  inert?: boolean
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={inert ? -1 : 0}
      aria-hidden={inert}
      aria-label={`Open frame ${String(photo.frame).padStart(2, '0')}: ${photo.title}`}
      style={{ transform: `rotate(${tiltFor(photo.src)}deg)` }}
      className="group relative cursor-pointer border border-ink-25 bg-paper p-2.5 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_20px_36px_-14px_var(--ink-45)] focus-visible:z-10 focus-visible:rotate-0"
    >
      <span className="label absolute top-0.5 left-0.5 z-30 bg-paper/90 px-1 text-[0.55rem] text-ink-45">
        {String(photo.frame).padStart(2, '0')}
      </span>

      <div className="relative overflow-hidden">
        <img
          src={asset(photo.src)}
          alt={photo.alt}
          loading="lazy"
          onError={onImgError}
          className="aspect-[4/5] w-full object-cover transition-[filter] duration-300 group-hover:brightness-[1.04]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 ring-1 ring-inset ring-ink transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-3 flex-col justify-end gap-0.5 bg-gradient-to-t from-ink/95 via-ink/75 to-transparent px-3 pt-10 pb-3 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="label text-[0.55rem] text-paper/65">{photo.project}</span>
          <span className="font-display text-[0.92rem] leading-tight font-bold text-paper">{photo.title}</span>
          <span className="label text-[0.55rem] text-paper/55">
            {[photo.year, photo.location].filter(Boolean).join(' · ')}
          </span>
          <span className="label mt-1.5 inline-flex items-center gap-1 text-[0.56rem] text-accent-orange">
            Click to Inspect
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </button>
  )
}
