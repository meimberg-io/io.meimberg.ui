import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * `true` unterhalb 768 px (Tailwind `md`). Laufzeit-Umschaltung Mobil/Desktop —
 * deckt sich mit der `md:`-Breakpoint-Grenze des DS. SSR-safe (initial `false`).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
