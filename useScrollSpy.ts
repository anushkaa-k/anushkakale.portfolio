import { useEffect, useState } from 'react'

/**
 * Returns the id of whichever section currently occupies the middle of the
 * viewport, so the masthead can underline the sheet you are reading.
 */
export function useScrollSpy(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null)

    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [ids])

  return active
}
