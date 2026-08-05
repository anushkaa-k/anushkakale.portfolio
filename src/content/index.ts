import type { z } from 'zod'

import aboutYaml from '../../content/about.yaml'
import caseStudyAliveYaml from '../../content/case-study-alive.yaml'
import caseStudyVasantYaml from '../../content/case-study-vasant.yaml'
import contactYaml from '../../content/contact.yaml'
import experienceYaml from '../../content/experience.yaml'
import galleryYaml from '../../content/gallery.yaml'
import projectsYaml from '../../content/projects.yaml'
import siteYaml from '../../content/site.yaml'
import skillsYaml from '../../content/skills.yaml'
import testimonialsYaml from '../../content/testimonials.yaml'

import {
  aboutSchema,
  caseStudySchema,
  contactSchema,
  experienceSchema,
  gallerySchema,
  projectsSchema,
  siteSchema,
  skillsSchema,
  testimonialsSchema,
  type CaseStudy,
  type Photo,
  type SectionId,
  type SectionMeta,
} from './schema'

/* ==========================================================================
   Loads /content/*.yaml, checks it, and hands the rest of the app typed data.

   The YAML is bundled at build time, so there is no fetch and no loading
   state — but it is still validated, because the files are meant to be
   edited by hand and a typo should produce a clear message rather than a
   silently empty section.
   ========================================================================== */

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data)
  if (result.success) return result.data

  const problems = result.error.issues
    .map((i) => `  · ${i.path.join('.') || '(root)'} — ${i.message}`)
    .join('\n')

  throw new Error(
    `content/${file} could not be read.\n${problems}\n\n` +
      'Check the indentation and that every line still has its "key:" in front.',
  )
}

export const site = parse(siteSchema, siteYaml, 'site.yaml')
export const about = parse(aboutSchema, aboutYaml, 'about.yaml')
export const projects = parse(projectsSchema, projectsYaml, 'projects.yaml')
export const skills = parse(skillsSchema, skillsYaml, 'skills.yaml')
export const experience = parse(experienceSchema, experienceYaml, 'experience.yaml')
export const testimonials = parse(testimonialsSchema, testimonialsYaml, 'testimonials.yaml')
export const gallery = parse(gallerySchema, galleryYaml, 'gallery.yaml')
export const contact = parse(contactSchema, contactYaml, 'contact.yaml')
export const caseStudyVasant = parse(
  caseStudySchema,
  caseStudyVasantYaml,
  'case-study-vasant.yaml',
)
export const caseStudyAlive = parse(caseStudySchema, caseStudyAliveYaml, 'case-study-alive.yaml')

/** Whether a section has anything to show yet. */
const populated: Record<SectionId, () => boolean> = {
  about: () => about.body.length > 0,
  projects: () => projects.items.length > 0,
  skills: () => skills.groups.length > 0,
  experience: () => experience.items.length > 0,
  testimonials: () => testimonials.items.length > 0,
  gallery: () => gallery.items.length > 0,
  contact: () => contact.links.length > 0,
}

/**
 * The sections in page order, each with the sheet number it works out to.
 *
 * Empty sections drop out here, so an unfinished one never reaches the page
 * or leaves a navigation link pointing at nothing — the Gallery stays hidden
 * until the first photo is listed. Numbering is derived rather than stored,
 * so reordering, removing or filling in a section never leaves stale sheet
 * numbers behind.
 */
export const sections: SectionMeta[] = site.sections
  .filter((s) => populated[s.id]())
  .map((s, i) => ({ ...s, sheet: String(i + 1).padStart(2, '0') }))

export type { CaseStudy, Photo, SectionId, SectionMeta }
