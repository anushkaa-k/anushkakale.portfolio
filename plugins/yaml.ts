import { readFileSync } from 'node:fs'

import { parse } from 'yaml'
import type { Plugin } from 'vite'

/**
 * Turns `import data from './thing.yaml'` into the parsed document, so the
 * content files in /content are bundled at build time with no runtime fetch.
 *
 * Editing a YAML file triggers a normal hot reload; a syntax error surfaces
 * with the file name attached rather than as a blank page.
 */
export function yaml(): Plugin {
  return {
    name: 'content-yaml',
    transform(_code, id) {
      if (!/\.ya?ml$/.test(id)) return null
      try {
        const data: unknown = parse(readFileSync(id, 'utf8'))
        return { code: `export default ${JSON.stringify(data)}`, map: null }
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        this.error(`Could not parse ${id}\n${detail}`)
      }
    },
  }
}
