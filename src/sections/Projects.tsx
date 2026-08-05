import type { ReactElement } from 'react'

import { projects } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'

/* Each project is drawn as a plate: numbered header, the figures set as
   dimensions, and a link out to the work.

   The first two plates are Featured Case Studies — a heavier inset frame,
   a bolder title and a "View Case Study" CTA. The rest are Supporting
   Productions: same plate, quieter treatment, a plain "Project Summary"
   link. Tier comes from position, not extra content, so the row stays
   exactly the height it was — nothing here adds a line to any card. */

export function Projects({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <Reveal className="grid gap-px border border-ink-45 bg-ink-25 [grid-template-columns:repeat(auto-fit,minmax(19rem,1fr))]">
        {projects.items.map((project, i) => {
          const featured = i < 2

          return (
            <article
              key={project.title}
              className={`group flex flex-col bg-paper p-6 transition-[background-color,box-shadow,transform] duration-300 ease-out hover:z-10 hover:-translate-y-0.5 hover:bg-paper-warm hover:shadow-[0_10px_24px_-12px_var(--ink-25),0_0_22px_-8px_var(--accent-orange)] ${
                featured ? 'ring-1 ring-inset ring-ink/70 hover:ring-ink' : 'hover:ring-1 hover:ring-inset hover:ring-ink-25'
              }`}
            >
              <div className="mb-4 flex justify-between gap-4 border-b border-dashed border-ink-25 pb-3.5">
                <span className="label text-ink-45">
                  Plate {String(i + 1).padStart(2, '0')}
                  {featured && (
                    <>
                      <span className="mx-1.5 text-ink-25">/</span>
                      <span className="font-bold text-redline">Featured</span>
                    </>
                  )}
                </span>
                <span className="label text-ink-45">{project.year}</span>
              </div>

              <h3
                className={`font-display text-2xl leading-tight ${featured ? 'font-extrabold' : 'font-semibold'}`}
              >
                {project.title}
              </h3>
              <p className="mt-1 text-[0.9rem] text-ink-70">{project.org}</p>

              {project.metrics.length > 0 && (
                <dl className="my-6 grid gap-x-4 gap-y-3.5 border-t border-ink-12 pt-5 [grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr))]">
                  {project.metrics.map((metric) => {
                    const long = metric.v.length > 14
                    return (
                      <div key={metric.k} className={long ? 'col-span-full' : undefined}>
                        <dt className="label text-[0.58rem] text-ink-45">{metric.k}</dt>
                        <dd
                          className={`mt-1 font-display font-bold ${
                            long ? 'text-[1rem] leading-snug' : 'text-[1.3rem] leading-none'
                          }`}
                        >
                          {metric.v}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              )}

              {project.link &&
                (featured ? (
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label mt-auto inline-flex w-fit items-center gap-2 self-start border-2 border-ink/70 px-4 py-2 font-semibold text-ink no-underline transition-colors hover:border-accent-orange hover:bg-accent-orange hover:text-paper"
                  >
                    View Case Study
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                ) : (
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label mt-auto flex items-center gap-1.5 self-start border-b border-ink-25 pb-1 text-ink-45 no-underline transition-colors hover:border-ink-45 hover:text-ink-70"
                  >
                    Project Summary
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                ))}
            </article>
          )
        })}
      </Reveal>
    </Sheet>
  )
}
