import { Fragment, useEffect, type ReactElement } from 'react'

import { sections, site, type SectionId, type SectionMeta } from './content'
import { Hero } from './components/Hero'
import { Masthead } from './components/Masthead'
import { Reveal } from './components/Sheet'
import { Divider } from './drawings/Banner'
import { useLights } from './hooks/useLights'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Gallery } from './sections/Gallery'
import { Interlude } from './sections/Interlude'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Testimonials } from './sections/Testimonials'

/* ==========================================================================
   The page is assembled from `sections` in content/site.yaml, not from a
   hard-coded order here. Reordering that list reorders the page and
   renumbers the sheets; deleting an entry removes the section and drops it
   from the navigation. Adding a new kind of section means one new component
   and one new line in this registry.
   ========================================================================== */

const SECTIONS: Record<SectionId, (props: { meta: SectionMeta }) => ReactElement | null> = {
  about: About,
  projects: Projects,
  skills: Skills,
  experience: Experience,
  testimonials: Testimonials,
  gallery: Gallery,
  contact: Contact,
}

/** The pull-quote sits after this section, wherever it ends up in the order. */
const QUOTE_AFTER: SectionId = 'testimonials'

export default function App(): ReactElement {
  const { mode, toggle } = useLights()

  /* This is a client-rendered app, so a URL that already carries a hash on
     load — arriving from the "Back to Projects" link on a case study page,
     say — has the browser attempt its native jump-to-anchor before React
     has rendered the target section, and it never retries once the section
     exists. Once mounted, every section is already in the DOM (nothing
     below the fold is lazy-mounted), so this just finishes what the
     browser couldn't. */
  useEffect(() => {
    if (!window.location.hash) return
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
  }, [])

  return (
    <>
      <a
        href="#main"
        className="label absolute -left-[999px] top-0 z-100 bg-ink px-4 py-3 text-paper focus:left-0"
      >
        Skip to content
      </a>

      <Masthead mode={mode} onToggle={toggle} />
      <Hero />

      <main id="main">
        {sections.map((meta, i) => {
          const Section = SECTIONS[meta.id]
          const last = i === sections.length - 1
          return (
            <Fragment key={meta.id}>
              <Section meta={meta} />
              {meta.id === QUOTE_AFTER && <Interlude />}
              {!last && meta.id !== QUOTE_AFTER && (
                <Reveal>
                  <Divider variant={i} />
                </Reveal>
              )}
            </Fragment>
          )
        })}
      </main>

      <footer className="gutter flex flex-wrap justify-between gap-4 border-t-2 border-ink py-5 text-ink-45">
        <span className="label">{site.footer}</span>
        <span className="label">Do not scale off this drawing</span>
      </footer>
    </>
  )
}
