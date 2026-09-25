'use client'

// PUL-462 (AK 8): Provider-Contract von @meimberg/ui.
//
// Manche Primitives setzen React-Contexts voraus:
//   • Theme (next-themes) — ThemeToggle liest/setzt das Theme.
//   • Tooltip (Radix TooltipProvider) — Dropdown & Co. rendern Tooltips.
//
// `UiProviders` bündelt genau diese Contexts, damit eine Consumer-App das
// Package mit einem einzigen Wrapper lauffähig mounten kann. Den <Toaster>
// setzt die App innerhalb von UiProviders (sonst folgt er dem Theme nicht).

import type {ReactNode} from 'react'
import {ThemeProvider} from 'next-themes'
import {TooltipProvider} from './ui/tooltip'

type ThemeConfig = {
  attribute?: 'class' | 'data-theme'
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export interface UiProvidersProps {
  children: ReactNode
  /** next-themes-Konfiguration. Default: `class` / `dark` / disableTransitionOnChange. */
  theme?: ThemeConfig
  /** Radix-Tooltip `delayDuration` in ms. Default 300. */
  tooltipDelayDuration?: number
}

const DEFAULT_THEME: ThemeConfig = {
  attribute: 'class',
  defaultTheme: 'dark',
  disableTransitionOnChange: true,
}

/**
 * Minimaler Context-Wrapper, den @meimberg/ui voraussetzt. App 2 mountet
 * `<UiProviders>` einmal am Root; Consumer mit eigenem Provider-Stack können
 * stattdessen ThemeProvider (next-themes) + TooltipProvider (Radix) direkt
 * setzen — das ist der dokumentierte Contract.
 */
export function UiProviders({children, theme, tooltipDelayDuration = 300}: UiProvidersProps) {
  return (
    <ThemeProvider {...DEFAULT_THEME} {...theme}>
      <TooltipProvider delayDuration={tooltipDelayDuration}>{children}</TooltipProvider>
    </ThemeProvider>
  )
}
