'use client'

import {useEffect, useState} from 'react'
import {useTheme} from 'next-themes'
import {Sun, Moon} from '../atoms/icons'
import {Button} from '../ui/button'
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'

/**
 * Pulse-Theme-Toggle (PUL-319). Wandert vom Sidebar-Footer in die App-Topbar.
 *
 * Verhalten: binary toggle Light ↔ Dark. System-Preference-Cycle ist bewusst
 * nicht abgedeckt (ggf. eigenes Folge-Ticket).
 *
 * Diese Datei ist die **einzige** Stelle im App-Code, an der `setTheme(...)`
 * aufgerufen werden darf (ESLint `no-restricted-syntax` in eslint.config.mjs).
 *
 * SSR-Safe: `next-themes` resolved das aktive Theme erst nach Mount (liest
 * localStorage / system preference). Bis dahin rendern wir einen leeren
 * 36×36 px Placeholder, damit Hydration-Markup stabil bleibt.
 */
export function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  // Established mounted-Idiom — setMounted im Effect triggert einen Re-Render
  // nach Hydration, damit das Theme-spezifische Markup erst dann rendert.
   
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // SSR + erster Client-Render: stabiler Placeholder ohne Theme-Info.
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground"
        aria-hidden
        tabIndex={-1}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const targetLabel = isDark ? 'In den Light Mode wechseln' : 'In den Dark Mode wechseln'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={targetLabel}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{targetLabel}</TooltipContent>
    </Tooltip>
  )
}
