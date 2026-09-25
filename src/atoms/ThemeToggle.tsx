'use client'

import {useEffect, useMemo, useState} from 'react'
import {useTheme} from 'next-themes'
import {Sun, Moon, Monitor} from '../atoms/icons'
import {SegmentedControl, type SegmentedControlOption} from './SegmentedControl'
import {useLabels} from '../i18n/context'

/**
 * Theme-Switcher. Sitzt typischerweise in der App-Topbar.
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

export interface ThemeToggleLabels {
  light: string
  dark: string
  system: string
}

const defaultLabels: ThemeToggleLabels = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System — follows the operating system',
}

export interface ThemeToggleProps {
  labels?: Partial<ThemeToggleLabels>
  className?: string
}

export function ThemeToggle({labels, className}: ThemeToggleProps = {}) {
  const l = useLabels('themeToggle', defaultLabels, labels)
  const options = useMemo<ReadonlyArray<SegmentedControlOption<ThemeChoice>>>(() => [
    {value: 'light', icon: Sun, ariaLabel: l.light},
    {value: 'dark', icon: Moon, ariaLabel: l.dark},
    {value: 'system', icon: Monitor, ariaLabel: l.system},
  ], [l])
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  // Established mounted-Idiom — setMounted im Effect triggert einen Re-Render
  // nach Hydration, damit der Theme-spezifische Zustand erst dann rendert.

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <SegmentedControl value="system" options={options} onChange={() => {}} disabled className={className} />
  }

  return (
    <SegmentedControl<ThemeChoice>
      value={(theme as ThemeChoice | undefined) ?? 'system'}
      options={options}
      onChange={setTheme}
      className={className}
    />
  )
}
