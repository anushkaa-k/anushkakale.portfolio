import { Fragment, type ReactElement } from 'react'

import { skills } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { useMediaQuery } from '../hooks/useMediaQuery'

/* Laid out like an actual spreadsheet — the tool she runs productions on —
   rather than a generic set of cards: column letters, row numbers, a
   formula bar, cell borders. Same skills.yaml data underneath.

   The sheet is wider than a phone and scrolls sideways, which is true to
   the thing it imitates. Cells are drawn tighter there so more columns land
   in view at once — small enough to take in, still wide enough that a skill
   does not break into one word per line. */

export function Skills({ meta }: { meta: SectionMeta }): ReactElement {
  const compact = useMediaQuery('(max-width: 767px)')
  const cols = skills.groups
  const rows = Math.max(0, ...cols.map((g) => g.items.length))
  const gutter = compact ? '2rem' : '2.75rem'
  const column = compact ? '8.5rem' : '11rem'

  return (
    <Sheet meta={meta}>
      <Reveal>
        <div className="overflow-x-auto border border-ink-45">
          <div className="min-w-[36rem] md:min-w-[47rem]">
            {/* title bar */}
            <div className="label flex items-center gap-3 border-b border-ink-45 bg-paper-warm px-2.5 py-2 text-ink-45 md:px-3.5 md:py-2.5">
              <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink-45" />
              skills.xlsx
              <span className="ml-auto text-ink-25">Read-only</span>
            </div>

            {/* formula bar */}
            <div className="label flex items-center gap-3 border-b border-dashed border-ink-25 px-2.5 py-1.5 text-ink-70 md:px-3.5 md:py-2">
              <span className="border border-ink-25 px-2 py-0.5 text-[0.6rem] text-ink-45">B2</span>
              <span className="text-ink-25">fx</span>
              <span className="truncate text-[0.62rem]">
                =SKILLSET({cols.map((g) => `"${g.name}"`).join(', ')})
              </span>
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `${gutter} repeat(${cols.length}, minmax(${column}, 1fr))`,
              }}
            >
              {/* column-letter row */}
              <div className="border-r border-b border-ink-25 bg-paper-warm" />
              {cols.map((group, i) => (
                <div
                  key={`col-${group.name}`}
                  className="label border-r border-b border-ink-25 bg-paper-warm px-2 py-1.5 text-center text-ink-45 last:border-r-0 md:px-3 md:py-2"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}

              {/* header row: row "1" holds the group names */}
              <div className="label border-r border-b border-ink-25 bg-paper-warm px-1 py-2 text-center text-ink-45 md:px-2">
                1
              </div>
              {cols.map((group) => (
                <div
                  key={`head-${group.name}`}
                  className="border-r border-b border-ink-25 bg-paper-warm px-2.5 py-2.5 text-center font-display text-[0.88rem] leading-tight font-bold last:border-r-0 md:px-3.5 md:py-3 md:text-[0.98rem]"
                >
                  {group.name}
                </div>
              ))}

              {/* one row per skill, cells left blank where a column runs out */}
              {Array.from({ length: rows }, (_, r) => (
                <Fragment key={`row-${r}`}>
                  <div className="label border-r border-b border-ink-25 bg-paper-warm px-1 py-2 text-center text-ink-45 md:px-2">
                    {r + 2}
                  </div>
                  {cols.map((group) => (
                    <div
                      key={`${group.name}-${r}`}
                      className="border-r border-b border-ink-25 bg-paper px-2.5 py-2 text-[0.8rem] text-ink-70 last:border-r-0 md:px-3.5 md:py-2.5 md:text-[0.86rem]"
                    >
                      {group.items[r] ?? ''}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Sheet>
  )
}
