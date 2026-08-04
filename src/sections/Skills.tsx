import { Fragment, type ReactElement } from 'react'

import { skills } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

/* Laid out like an actual spreadsheet — the tool she runs productions on —
   rather than a generic set of cards: column letters, row numbers, a
   formula bar, cell borders. Same skills.yaml data underneath. */

export function Skills({ meta }: { meta: SectionMeta }): ReactElement {
  const cols = skills.groups
  const rows = Math.max(0, ...cols.map((g) => g.items.length))

  return (
    <Sheet meta={meta}>
      <Reveal>
        <div className="overflow-x-auto border border-ink-45">
          {/* title bar */}
          <div className="label flex items-center gap-3 border-b border-ink-45 bg-paper-warm px-3.5 py-2.5 text-ink-45">
            <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border border-ink-45" />
            skills.xlsx
            <span className="ml-auto text-ink-25">Read-only</span>
          </div>

          {/* formula bar */}
          <div className="label flex items-center gap-3 border-b border-dashed border-ink-25 px-3.5 py-2 text-ink-70">
            <span className="border border-ink-25 px-2 py-0.5 text-[0.6rem] text-ink-45">B2</span>
            <span className="text-ink-25">fx</span>
            <span className="truncate text-[0.62rem]">
              =SKILLSET({cols.map((g) => `"${g.name}"`).join(', ')})
            </span>
          </div>

          <div
            className="grid min-w-[42rem]"
            style={{ gridTemplateColumns: `2.75rem repeat(${cols.length}, minmax(11rem, 1fr))` }}
          >
            {/* column-letter row */}
            <div className="border-r border-b border-ink-25 bg-paper-warm" />
            {cols.map((group, i) => (
              <div
                key={`col-${group.name}`}
                className="label border-r border-b border-ink-25 bg-paper-warm px-3 py-2 text-center text-ink-45 last:border-r-0"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}

            {/* header row: row "1" holds the group names */}
            <div className="label border-r border-b border-ink-25 bg-paper-warm px-2 py-2 text-center text-ink-45">
              1
            </div>
            {cols.map((group) => (
              <div
                key={`head-${group.name}`}
                className="border-r border-b border-ink-25 bg-paper-warm px-3.5 py-3 font-display text-[0.98rem] leading-tight font-bold text-accent-orange last:border-r-0"
              >
                {group.name}
              </div>
            ))}

            {/* one row per skill, cells left blank where a column runs out */}
            {Array.from({ length: rows }, (_, r) => (
              <Fragment key={`row-${r}`}>
                <div className="label border-r border-b border-ink-25 bg-paper-warm px-2 py-2 text-center text-ink-45">
                  {r + 2}
                </div>
                {cols.map((group) => (
                  <div
                    key={`${group.name}-${r}`}
                    className="border-r border-b border-ink-25 bg-paper px-3.5 py-2.5 text-[0.86rem] text-ink-70 last:border-r-0"
                  >
                    {group.items[r] ?? ''}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>

        {skills.applies && (
          <div className="mt-10">
            <h3 className="label mb-4 text-ink-45">{skills.applies.label}</h3>
            <ul className="grid gap-px border border-ink-25 bg-ink-25">
              {skills.applies.items.map((item) => (
                <li
                  key={item.k}
                  className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2 bg-paper px-4.5 py-3.5"
                >
                  <b className="font-display text-[1.1rem] font-bold">{item.k}</b>
                  <span aria-hidden="true" className="text-redline">
                    →
                  </span>
                  <i className="text-[0.92rem] not-italic text-ink-70">{item.v}</i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Reveal>
    </Sheet>
  )
}
