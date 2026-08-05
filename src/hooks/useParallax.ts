import { useEffect, useRef, useState } from 'react'

/**
 * Tracks how far an element's centre sits from the viewport's centre, scaled
 * down and clamped, for a gentle scroll-driven drift on a background layer.
 * Recomputed on scroll/resize via rAF throttling so it never runs more than
 * once per frame.
 */
export function useParallax<T extends HTMLElement>(
  strength = 0.08,
  max = 18,
): { ref: React.RefObject<T | null>; offset: number } {
  const ref = useRef<T>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let ticking = false
    const measure = () => {
      ticking = false
      const rect = node.getBoundingClientRect()
      const delta = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * strength
      setOffset(Math.max(-max, Math.min(max, delta)))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength, max])

  return { ref, offset }
}
