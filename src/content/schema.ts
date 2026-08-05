import { z } from 'zod'

/* ==========================================================================
   The shape of the YAML in /content.

   These schemas are the single definition of the content model: the
   TypeScript types below are inferred from them, so the types and the
   validation can never drift apart. If someone edits a YAML file into an
   invalid state, the site says exactly which file and which field, instead
   of rendering a blank section.
   ========================================================================== */

/** A small label/value pair — legend rows, project figures, applicability. */
const pair = z.object({
  k: z.string(),
  v: z.string(),
})

const link = z.object({
  label: z.string(),
  href: z.string(),
})

/* ---- site.yaml ----------------------------------------------------------- */

export const siteSchema = z.object({
  meta: z.object({
    name: z.string(),
    role: z.string(),
    title: z.string(),
    description: z.string(),
    /** A pipe character is a line break. */
    headline: z.string(),
    standfirst: z.string(),
    location: z.string(),
  }),
  /** Page order. Sheet numbers are derived from this list, not stored. */
  sections: z
    .array(
      z.object({
        id: z.enum([
          'about',
          'projects',
          'skills',
          'experience',
          'testimonials',
          'gallery',
          'contact',
        ]),
        label: z.string(),
        title: z.string(),
        scale: z.string(),
      }),
    )
    .min(1),
  quote: z
    .object({
      text: z.string(),
      author: z.string(),
    })
    .optional(),
  footer: z.string(),
  hero: z.object({
    /** The secondary headline under her name. A pipe character is a line break. */
    tagline: z.string(),
    /** The credibility strip under the standfirst. Empty list hides the row. */
    stats: z.array(pair).default([]),
    cta: z.object({
      primary: link,
      /** Delete this to show only the primary button. */
      secondary: link.optional(),
    }),
  }),
})

/* ---- one file per sheet -------------------------------------------------- */

export const aboutSchema = z.object({
  lead: z.string(),
  body: z.array(z.string()),
  facts: z.array(pair),
  owns: z
    .object({
      label: z.string(),
      items: z.array(z.string()),
    })
    .optional(),
  /** The understated note at the very end of the section. */
  status: z.string().optional(),
})

export const projectsSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      org: z.string(),
      year: z.string(),
      metrics: z.array(pair).default([]),
      link: link.optional(),
    }),
  ),
})

export const skillsSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string(),
      items: z.array(z.string()),
    }),
  ),
})

export const experienceSchema = z.object({
  items: z.array(
    z.object({
      period: z.string(),
      title: z.string(),
      org: z.string(),
      notes: z.array(z.string()).default([]),
    }),
  ),
})

export const testimonialsSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
    }),
  ),
})

export const gallerySchema = z.object({
  items: z.array(
    z.object({
      src: z.string(),
      alt: z.string(),
      /** Filter-tab bucket: a festival name, or "Behind the Scenes". */
      project: z.string(),
      /** Short title shown on hover and in the lightbox. */
      title: z.string(),
      year: z.string().optional(),
      location: z.string().optional(),
    }),
  ),
})

export const contactSchema = z.object({
  lead: z.string(),
  note: z.string().optional(),
  block: z.object({
    drawn: z.string(),
    discipline: z.string(),
    status: z.string(),
    revision: z.string(),
    updated: z.string(),
  }),
  links: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      href: z.string(),
    }),
  ),
})

/* ---- case-study-*.yaml ----------------------------------------------------
   Each case study is its own static page (built as a separate HTML entry —
   see vite.config.ts), one YAML file per project. The shape is generic so a
   second case study can reuse it without a new schema. */

export const caseStudySchema = z.object({
  title: z.string(),
  role: z.string(),
  org: z.string(),
  year: z.string(),
  /** The Executive Dashboard tiles, in display order. */
  metrics: z.array(pair),
  /** Short paragraphs — 2 or 3, meant to fit one viewport alongside the poster. */
  context: z.array(z.string()),
  /** Optional: the page shows a "poster pending" placeholder until this is set
      and the file exists in public/. */
  poster: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
})

/* ---- inferred types ------------------------------------------------------ */

export type Site = z.infer<typeof siteSchema>
export type SectionId = Site['sections'][number]['id']
export type SectionMeta = Site['sections'][number] & { sheet: string }

export type About = z.infer<typeof aboutSchema>
export type Projects = z.infer<typeof projectsSchema>
export type Project = Projects['items'][number]
export type Skills = z.infer<typeof skillsSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Testimonials = z.infer<typeof testimonialsSchema>
export type Gallery = z.infer<typeof gallerySchema>
export type Photo = Gallery['items'][number]
export type Contact = z.infer<typeof contactSchema>
export type Pair = z.infer<typeof pair>
export type CaseStudy = z.infer<typeof caseStudySchema>
