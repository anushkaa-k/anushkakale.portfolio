/**
 * Resolves a file in /public against the deployment base path, so the same
 * build works from a domain root and from a GitHub Pages project URL.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** True for links that leave the site (or open a mail or phone app). */
export function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href)
}
