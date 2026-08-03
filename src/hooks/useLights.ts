import { useCallback, useEffect, useState } from 'react'

/* The House Lights switch. "paper" is the working drawing, "blueprint" is
   the same sheet with the lights out. The choice is remembered. */

export type Mode = 'paper' | 'blueprint'

const KEY = 'ak-mode'
const THEME_COLOR: Record<Mode, string> = {
  paper: '#f4f3ea',
  blueprint: '#0d2033',
}

function stored(): Mode | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'paper' || v === 'blueprint' ? v : null
  } catch {
    return null // private browsing, storage disabled
  }
}

export function useLights(): { mode: Mode; toggle: () => void } {
  const [mode, setMode] = useState<Mode>(() => stored() ?? 'paper')

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[mode])
    try {
      localStorage.setItem(KEY, mode)
    } catch {
      // nothing to do — the mode still applies for this visit
    }
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => (m === 'blueprint' ? 'paper' : 'blueprint'))
  }, [])

  return { mode, toggle }
}
