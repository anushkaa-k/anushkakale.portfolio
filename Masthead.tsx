import type { ReactElement } from 'react'

import { sections, site } from '../content'
import { useScrollSpy } from '../hooks/useScrollSpy'
import type { Mode } from '../hooks/useLights'

/* The sticky header: name mark, sheet navigation, and the House Lights
   switch that turns the working drawing into a cyanotype. */

const NAV_IDS = sections.map((s) => s.id)

export function Masthead({
  mode,
  onToggle,
}: {
  mode: Mode
  onToggle: () => void
}): ReactElement {
  const active = useScrollSpy(NAV_IDS)

  return (
    <header className="gutter sticky top-0 z-50 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink-25 bg-paper/90 py-3 backdrop-blur-md">
      <a href="#top" className="grid leading-tight no-underline">
        <span className="font-display text-[1.12rem] font-bold">{site.meta.name}</span>
        <span className="label text-[0.58rem] text-ink-70">{site.meta.role}</span>
      </a>

      <nav aria-label="Sections" className="order-3 w-full lg:order-none lg:ml-auto lg:w-auto">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`label border-b pb-0.5 text-[0.68rem] no-underline transition-colors ${
                  active === s.id
                    ? 'border-redline text-ink'
                    : 'border-transparent text-ink-70 hover:text-ink'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={mode === 'blueprint'}
        className="ml-auto inline-flex shrink-0 cursor-pointer items-center gap-2.5 border border-ink-25 px-2.5 py-1.5 text-ink-70 transition-colors hover:border-ink-45 hover:text-ink lg:ml-0"
      >
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full border border-current ${
            mode === 'blueprint' ? 'bg-transparent' : 'bg-redline shadow-[0_0_0_3px_rgb(164_64_42/0.22)]'
          }`}
        />
        <span className="label">{mode === 'blueprint' ? 'House Lights' : 'Lights Out'}</span>
      </button>
    </header>
  )
}
