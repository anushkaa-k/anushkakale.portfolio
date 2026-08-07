import { useEffect, useRef, useState, type ReactElement } from 'react'

import { gallery, type Photo } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, SheetHead } from '../components/Sheet'
import { asset } from '../lib/asset'

/*
  Photos are optional. A file listed in gallery.yaml but missing from
  public/img/ drops itself out, and if none of them load the sheet removes
  itself entirely — so the site looks finished before the photos arrive.

  Presented as a contact sheet, run as one horizontal filmstrip rather than
  a filtered grid: Pratibimb, then Vasant, then Behind the Scenes, each
  block introduced by a rotated blueprint divider tag. Scrolling — by
  drag, wheel, touch or the arrows — moves through the whole roll in one
  motion. The three squares above double as both a position readout
  (whichever block leads the viewport lights up as you scroll) and a
  quick jump — click one to scroll straight to that block. The back arrow
  only appears once you've scrolled past the start; the forward arrow
  hides the same way at the end.

  Frame numbers are a stable identity (hashed from the filename, not the
  on-screen position), so a photo keeps its number regardless of where it
  falls in the strip. Clicking a frame opens a lightbox with Previous/Next
  and the full caption, never truncated.
*/

const GROUP_ORDER = ['Pratibimb Marathi Theatre Festival', 'Vasant Gujarati Theatre Festival', 'Behind the Scenes']

const STAGE_MARKS = ['Stage Left', 'Stage Right', 'House Left', 'Upstage', 'Downstage', 'House Right']

/** A small, stable pseudo-random tilt in [-1, 1] degrees, seeded from the
    filename so a photo's tilt never changes as the strip reorders. */
function tiltFor(src: string): number {
  let hash = 0
  for (let i = 0; i < src.length; i++) hash = (hash * 31 + src.charCodeAt(i)) | 0
  return (Math.abs(hash) % 200) / 100 - 1
}

type Frame = Photo & { frame: number }

export function Gallery({ meta }: { meta: SectionMeta }): ReactElement | null {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeGroup, setActiveGroup] = useState(GROUP_ORDER[0])
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  const shown: Photo[] = gallery.items.filter((photo) => !failed.has(photo.src))

  /* Frame numbers follow the strip's own left-to-right display order
     (grouped by GROUP_ORDER), not the underlying yaml order — so the
     numbers read sequentially, 1 through N, as you actually scroll. */
  const ordered: Frame[] = GROUP_ORDER.flatMap((group) => shown.filter((p) => p.project === group)).map(
    (photo, i) => ({ ...photo, frame: i + 1 }),
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((v) => (v === null ? v : (v + 1) % ordered.length))
      if (e.key === 'ArrowLeft') setOpenIndex((v) => (v === null ? v : (v - 1 + ordered.length) % ordered.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, ordered.length])

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    let ticking = false
    const update = () => {
      ticking = false
      const markers = strip.querySelectorAll<HTMLElement>('[data-group-marker]')
      let current = GROUP_ORDER[0]
      markers.forEach((marker) => {
        if (marker.offsetLeft - strip.scrollLeft <= strip.clientWidth * 0.35) {
          current = marker.dataset.groupMarker ?? current
        }
      })
      setActiveGroup(current)
      setAtStart(strip.scrollLeft <= 4)
      setAtEnd(strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    strip.addEventListener('scroll', onScroll, { passive: true })
    return () => strip.removeEventListener('scroll', onScroll)
  }, [ordered.length])

  if (shown.length === 0) return null

  const step = (delta: number) =>
    setOpenIndex((v) => (v === null ? v : (v + delta + ordered.length) % ordered.length))

  const active = openIndex !== null ? ordered[openIndex] : null

  const scrollForward = () => {
    stripRef.current?.scrollBy({ left: stripRef.current.clientWidth * 0.8, behavior: 'smooth' })
  }

  const scrollBack = () => {
    stripRef.current?.scrollBy({ left: -stripRef.current.clientWidth * 0.8, behavior: 'smooth' })
  }

  const scrollToGroup = (group: string) => {
    const strip = stripRef.current
    if (!strip) return
    const markers = strip.querySelectorAll<HTMLElement>('[data-group-marker]')
    for (const marker of markers) {
      if (marker.dataset.groupMarker === group) {
        strip.scrollTo({ left: Math.max(0, marker.offsetLeft - 4), behavior: 'smooth' })
        break
      }
    }
  }

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

          <div role="group" aria-label="Jump to a section of the photo strip" className="flex flex-wrap gap-2">
            {GROUP_ORDER.map((group) => {
              const isActive = group === activeGroup
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => scrollToGroup(group)}
                  aria-current={isActive}
                  className={`label cursor-pointer border px-2.5 py-1 transition-colors duration-200 ${
                    isActive
                      ? 'border-accent-orange text-accent-orange'
                      : 'border-ink-25 text-ink-45 hover:border-ink-45 hover:text-ink-70'
                  }`}
                >
                  {group}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <div
            ref={stripRef}
            tabIndex={0}
            role="group"
            aria-label="Photo strip, scrollable left to right"
            className="no-scrollbar flex gap-x-8 overflow-x-auto scroll-smooth pt-6 pr-14 pb-8 pl-14"
          >
            {GROUP_ORDER.map((group) => {
              const photos = ordered.filter((p) => p.project === group)
              if (photos.length === 0) return null
              return (
                <div key={group} className="flex shrink-0 gap-x-8">
                  <div
                    data-group-marker={group}
                    className="flex w-12 shrink-0 flex-col items-center justify-center gap-3 self-stretch border-x border-dashed border-ink-25"
                  >
                    <span
                      className="label whitespace-nowrap text-ink-45"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {group}
                    </span>
                    <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-ink-25" />
                  </div>

                  {photos.map((photo) => (
                    <div key={photo.src} className="shrink-0">
                      <GalleryCard
                        photo={photo}
                        onOpen={() => setOpenIndex(ordered.indexOf(photo))}
                        onImgError={() => setFailed((prev) => new Set(prev).add(photo.src))}
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={scrollBack}
            aria-label="Scroll photos back"
            aria-hidden={atStart}
            tabIndex={atStart ? -1 : 0}
            className={`absolute top-1/2 left-0 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-ink-25 bg-paper/90 text-ink-70 shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[opacity,color,border-color] duration-300 hover:border-accent-orange hover:text-accent-orange ${
              atStart ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <span aria-hidden="true" className="text-lg">
              ‹
            </span>
          </button>

          <button
            type="button"
            onClick={scrollForward}
            aria-label="Scroll photos forward"
            aria-hidden={atEnd}
            tabIndex={atEnd ? -1 : 0}
            className={`absolute top-1/2 right-0 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-ink-25 bg-paper/90 text-ink-70 shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[opacity,color,border-color] duration-300 hover:border-accent-orange hover:text-accent-orange ${
              atEnd ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <span aria-hidden="true" className="text-lg">
              ›
            </span>
          </button>
        </div>
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

              {ordered.length > 1 && (
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
}: {
  photo: Frame
  onOpen: () => void
  onImgError: () => void
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open frame ${String(photo.frame).padStart(2, '0')}: ${photo.title}`}
      style={{ transform: `rotate(${tiltFor(photo.src)}deg)` }}
      className="group relative w-52 cursor-pointer border border-ink-25 bg-paper p-2.5 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_20px_36px_-14px_var(--ink-45)] focus-visible:z-10 focus-visible:rotate-0"
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
