import { useEffect, useRef, useState } from 'react'

/**
 * Fades a block in the first time it scrolls into view, then stops watching.
 * Falls back to "already visible" where IntersectionObserver is missing, so
 * content is never hidden by a failed enhancement.
 */
export function useReveal<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>
  shown: boolean
} {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    io.observe(node)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}
