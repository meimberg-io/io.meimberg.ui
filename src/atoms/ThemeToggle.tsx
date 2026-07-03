'use client'

import {useEffect, useState} from 'react'
import {useTheme} from 'next-themes'
import {Sun, Moon, Monitor} from '../atoms/icons'
import {SegmentedSwitch, type SegmentedOption} from './SegmentedSwitch'

/**
 * Theme-Switcher (PUL-319, System-Mode ergänzt). Sitzt in der App-Topbar.
 *
 * Verhalten: Segmented Control mit drei Zuständen Light / Dark / System.
 * "System" folgt der OS-Preference (`prefers-color-scheme`) — dafür muss der
 * `ThemeProvider` mit `enableSystem` laufen.
 *
 * Diese Datei ist die **einzige** Stelle im App-Code, an der `setTheme(...)`
 * aufgerufen werden darf (ESLint-Regel in der Consumer-Config).
 *
 * `value` liest `theme` (die *Einstellung* — 'light' | 'dark' | 'system'),
 * NICHT `resolvedTheme` (das aufgelöste 'light'|'dark'), damit "System" als
 * eigener Zustand sichtbar bleibt.
 *
 * SSR-Safe: `next-themes` resolved die Einstellung erst nach Mount (liest
 * localStorage / system preference). Bis dahin rendern wir denselben, aber
 * disabled Control in Segmented-Größe → kein Layout-Shift, kein Flash von
 * Theme-Info im SSR-Markup.
 */

type ThemeChoice = 'light' | 'dark' | 'system'

const THEME_OPTIONS: ReadonlyArray<SegmentedOption<ThemeChoice>> = [
  {value: 'light', icon: <Sun width={15} height={15} />, ariaLabel: 'Light Mode'},
  {value: 'dark', icon: <Moon width={15} height={15} />, ariaLabel: 'Dark Mode'},
  {value: 'system', icon: <Monitor width={15} height={15} />, ariaLabel: 'System — folgt dem Betriebssystem'},
]

export function ThemeToggle() {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  // Established mounted-Idiom — setMounted im Effect triggert einen Re-Render
  // nach Hydration, damit der Theme-spezifische Zustand erst dann rendert.

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <SegmentedSwitch value="system" options={THEME_OPTIONS} onChange={() => {}} disabled />
  }

  return (
    <SegmentedSwitch<ThemeChoice>
      value={(theme as ThemeChoice | undefined) ?? 'system'}
      options={THEME_OPTIONS}
      onChange={setTheme}
    />
  )
}
