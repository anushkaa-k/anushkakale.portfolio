import type { ReactElement } from 'react'

import { projects } from '../content'
import type { SectionMeta } from '../content'
import { Reveal, Sheet } from '../components/Sheet'
import { asset, isExternal } from '../lib/asset'

/* Each project is drawn as a plate: numbered header, the figures set as
   dimensions, and a link out to the work.

   The first two plates are Featured Case Studies — a heavier inset frame,
   a bolder title, a "View Case Study" CTA and an optional second outbound
   CTA (e.g. Instagram). The rest are Supporting Productions: same plate,
   quieter treatment, a single plain outbound link. Tier comes from
   position, not extra content.

   Below `md` this desktop grid is replaced outright by MobileProjectList,
   not shrunk into it — four dense dashboard plates don't compress into a
   phone width gracefully, so mobile gets its own simpler, spacious card
   design (no metrics, generous padding) instead of a squeezed version of
   the desktop one. The two layouts share the same data, nothing else. */

/* The mobile card: plate number + featured badge, title, org/type, year,
   then whatever link(s) the project actually has — a featured project
   gets a "View Case Study" button plus an optional Instagram link, a
   supporting production gets just its one outbound link. No metrics, no
   forced height — the card is only as tall as its own content. */
function MobileProjectCard({ project, index }: { project: (typeof projects.items)[number]; index: number }): ReactElement {
  const featured = index < 2

  return (
    <article className="flex flex-col gap-4 border border-ink-45 bg-paper p-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="label text-ink-45">
          Plate {String(index + 1).padStart(2, '0')}
          {featured && (
            <>
              <span className="mx-1.5 text-ink-25">/</span>
              <span className="font-bold text-redline">Featured</span>
            </>
          )}
        </span>
        <span className="label text-ink-45">{project.year}</span>
      </div>

      <div>
        <h3 className={`font-display text-2xl leading-tight ${featured ? 'font-extrabold' : 'font-semibold'}`}>
          {project.title}
        </h3>
        <p className="mt-1.5 text-[0.95rem] text-ink-70">{project.org}</p>
      </div>

      {project.link && (
        <div className="flex flex-wrap items-center gap-3">
          {featured ? (
            <a
              href={isExternal(project.link.href) ? project.link.href : asset(project.link.href)}
              {...(isExternal(project.link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="label inline-flex items-center gap-2 border-2 border-ink/70 px-5 py-3 font-semibold text-ink no-underline"
            >
              View Case Study
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-flex items-center gap-2 border border-ink-25 px-5 py-3 text-ink-70 no-underline"
            >
              {project.link.label}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {featured && project.instagram && (
            <a
              href={project.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-flex items-center gap-2 border border-ink-25 px-5 py-3 text-ink-70 no-underline"
            >
              {project.instagram.label}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </article>
  )
}

function MobileProjectList(): ReactElement {
  return (
    <Reveal className="flex flex-col gap-4 md:hidden">
      {projects.items.map((project, i) => (
        <MobileProjectCard key={project.title} project={project} index={i} />
      ))}
    </Reveal>
  )
}

export function Projects({ meta }: { meta: SectionMeta }): ReactElement {
  return (
    <Sheet meta={meta}>
      <MobileProjectList />

      <Reveal className="hidden gap-px border border-ink-45 bg-ink-25 md:grid md:grid-cols-4">
        {projects.items.map((project, i) => {
          const featured = i < 2

          return (
            <article
              key={project.title}
              className={`group flex flex-col bg-paper p-[clamp(1rem,2vw,1.5rem)] transition-[background-color,box-shadow,transform] duration-300 ease-out hover:z-10 hover:-translate-y-0.5 hover:bg-paper-warm hover:shadow-[0_10px_24px_-12px_var(--ink-25),0_0_22px_-8px_var(--accent-orange)] ${
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
                className={`font-display text-[clamp(1.15rem,1.7vw,1.5rem)] leading-tight ${featured ? 'font-extrabold' : 'font-semibold'}`}
              >
                {project.title}
              </h3>
              <p className="mt-1 text-[0.9rem] text-ink-70">{project.org}</p>

              {project.metrics.length > 0 && (
                <dl className="my-6 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-ink-12 pt-5">
                  {project.metrics.map((metric) => {
                    const long = metric.v.length > 14
                    return (
                      <div key={metric.k} className={long ? 'col-span-full' : undefined}>
                        <dt className="label text-[0.58rem] text-ink-45">{metric.k}</dt>
                        <dd
                          className={`mt-1 font-display font-bold ${
                            long
                              ? 'text-[clamp(0.85rem,1.1vw,1rem)] leading-snug'
                              : 'text-[clamp(1rem,1.5vw,1.3rem)] leading-none'
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
                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <a
                      href={isExternal(project.link.href) ? project.link.href : asset(project.link.href)}
                      {...(isExternal(project.link.href)
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="label inline-flex w-fit items-center gap-2 self-start border-2 border-ink/70 px-4 py-2 font-semibold text-ink no-underline transition-colors hover:border-accent-orange hover:bg-accent-orange hover:text-paper"
                    >
                      View Case Study
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                    {project.instagram && (
                      <a
                        href={project.instagram.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label ml-auto inline-flex w-fit items-center gap-2 self-start border border-ink-25 px-4 py-2 text-ink-70 no-underline transition-[color,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-ink-45 hover:text-ink hover:shadow-[0_14px_28px_-16px_var(--ink-45),0_0_20px_-8px_var(--accent-orange)]"
                      >
                        {project.instagram.label}
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                ) : (
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label mt-auto flex items-center gap-1.5 self-start border-b border-ink-25 pb-1 text-ink-45 no-underline transition-colors hover:border-ink-45 hover:text-ink-70"
                  >
                    {project.link.label}
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
