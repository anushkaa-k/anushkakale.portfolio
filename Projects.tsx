import type { ReactElement } from 'react'

import { projects } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

/* Each project is drawn as a plate: numbered header, the figures set as
   dimensions, and a link out to the work. */

export function Projects({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal className="grid gap-px border border-ink-45 bg-ink-25 [grid-template-columns:repeat(auto-fit,minmax(19rem,1fr))]">
        {projects.items.map((project, i) => (
          <article
            key={project.title}
            className="flex flex-col bg-paper p-6 transition-colors hover:bg-paper-warm"
          >
            <div className="mb-4 flex justify-between gap-4 border-b border-dashed border-ink-25 pb-3.5">
              <span className="label text-ink-45">
                Plate {String(i + 1).padStart(2, '0')}
              </span>
              <span className="label text-ink-45">{project.year}</span>
            </div>

            <h3 className="font-display text-2xl leading-tight font-bold">{project.title}</h3>
            <p className="mt-1 text-[0.9rem] text-ink-70">{project.org}</p>

            {project.metrics.length > 0 && (
              <dl className="my-6 grid gap-x-4 gap-y-3.5 border-t border-ink-12 pt-5 [grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr))]">
                {project.metrics.map((metric) => (
                  <div key={metric.k}>
                    <dt className="label text-[0.58rem] text-ink-45">{metric.k}</dt>
                    <dd className="mt-1 font-display text-[1.3rem] leading-none font-bold">
                      {metric.v}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-auto self-start border-b border-ink-25 pb-1 text-ink-70 no-underline transition-colors hover:border-redline hover:text-ink"
              >
                {project.link.label} ↗
              </a>
            )}
          </article>
        ))}
      </Reveal>
    </Sheet>
  )
}
