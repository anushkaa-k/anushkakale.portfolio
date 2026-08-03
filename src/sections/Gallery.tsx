import { useEffect, useState, type ReactElement } from 'react'

import { gallery } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, SheetHead } from '../components/Sheet'
import { asset } from '../lib/asset'

/*
  Photos are optional. A file listed in gallery.yaml but missing from
  public/img/ drops itself out, and if none of them load the sheet removes
  itself entirely — so the site looks finished before the photos arrive.

  Presented as a contact sheet: each print mounted on its own card, given a
  small alternating tilt as if pinned up for review, numbered like frames on
  a roll. Clicking a frame opens it full-size.
*/

const TILTS = [-2, 1.4, -1, 2, -1.6, 1.2, -1.2, 1.8]

export function Gallery({ meta }: { meta: SectionMeta }): ReactElement | null {
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())
  const [open, setOpen] = useState<number | null>(null)

  const shown = gallery.items.filter((photo) => !failed.has(photo.src))

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (shown.length === 0) return null

  return (
    <section id={meta.id} className="gutter py-[clamp(3.5rem,8vw,6rem)]">
      <SheetHead meta={meta} />

      <Reveal className="border border-ink-45 bg-paper-warm p-[clamp(1.25rem,4vw,2.25rem)]">
        <div className="label mb-8 flex flex-wrap items-baseline gap-3 text-ink-45">
          <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink-45" />
          Contact sheet
          <span className="text-ink-25">
            {shown.length} frame{shown.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid gap-x-10 gap-y-12 [grid-template-columns:repeat(auto-fit,minmax(12.5rem,1fr))]">
          {shown.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${photo.alt}`}
              style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
              className="group relative cursor-pointer border border-ink-25 bg-paper p-2.5 pb-8 text-left shadow-[0_8px_18px_-10px_var(--ink-45)] transition-transform duration-300 ease-out hover:z-10 hover:rotate-0 hover:shadow-[0_16px_30px_-12px_var(--ink-45)] focus-visible:z-10 focus-visible:rotate-0"
            >
              <span className="label absolute top-0.5 left-0.5 z-10 bg-paper/90 px-1 text-[0.55rem] text-ink-45">
                {String(i + 1).padStart(2, '0')}
              </span>
              <img
                src={asset(photo.src)}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
                onError={() => setFailed((prev) => new Set(prev).add(photo.src))}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-2.5 bottom-8 opacity-0 ring-1 ring-inset ring-ink transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="label absolute right-2.5 bottom-2 left-2.5 truncate text-[0.6rem] text-ink-45">
                {photo.alt}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      {open !== null && shown[open] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shown[open].alt}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/85 p-[6vh_6vw] backdrop-blur-sm"
        >
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[min(90vw,42rem)] border-4 border-paper bg-paper p-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <img
              src={asset(shown[open].src)}
              alt={shown[open].alt}
              className="max-h-[76vh] w-full object-contain"
            />
            <figcaption className="label mt-2 flex items-center justify-between gap-4 px-1 py-1 text-ink-70">
              <span className="truncate">{shown[open].alt}</span>
              <button
                type="button"
                onClick={() => setOpen(null)}
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
