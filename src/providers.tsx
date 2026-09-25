'use client'

// Provider-Contract von @meimberg/ui.
//
// Manche Primitives setzen React-Contexts voraus:
//   • Theme (next-themes) — ThemeToggle liest/setzt das Theme, Dark Mode hängt
//     an der Klasse `.dark`.
//   • Tooltip (Radix TooltipProvider) — Dropdown & Co. rendern Tooltips.
//   • Sprache (UiI18nProvider) — Labels, Zahlen- und Datumsformat.
//
// `UiProviders` bündelt genau diese Contexts, damit eine Consumer-App das
// Package mit einem einzigen Wrapper lauffähig mounten kann. Den <Toaster>
// setzt die App innerhalb von UiProviders (sonst folgt er dem Theme nicht).

import type {ReactNode} from 'react'
import type {Locale} from 'date-fns'
import {ThemeProvider} from 'next-themes'
import {TooltipProvider} from './ui/tooltip'
import {UiI18nProvider, type UiMessagesOverride} from './i18n/context'

type ThemeConfig = {
  defaultTheme?: 'light' | 'dark' | 'system'
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export interface UiProvidersProps {
  children: ReactNode
  /** next-themes-Konfiguration. Default: `system` / enableSystem / disableTransitionOnChange. */
  theme?: ThemeConfig
  /** Radix-Tooltip `delayDuration` in ms. Default 300. */
  tooltipDelayDuration?: number
  /** BCP-47-Locale für Zahlen und Daten. Default `en-US`. */
  locale?: string
  /** date-fns-Locale für Kalender und Datumsmuster. Default `enUS`. */
  dateLocale?: Locale
  /** App-weite Label-Overrides, z. B. `de.messages` aus `@meimberg/ui/i18n/de`. */
  messages?: UiMessagesOverride
}

const DEFAULT_THEME: ThemeConfig = {
  defaultTheme: 'system',
  enableSystem: true,
  disableTransitionOnChange: true,
}

/**
 * Minimaler Context-Wrapper, den @meimberg/ui voraussetzt. Die App mountet
 * `<UiProviders>` einmal am Root. Deutsch: `<UiProviders {...de}>` mit
 * `import {de} from '@meimberg/ui/i18n/de'`.
 */
export function UiProviders({
  children,
  theme,
  tooltipDelayDuration = 300,
  locale,
  dateLocale,
  messages,
}: UiProvidersProps) {
  return (
    <ThemeProvider attribute="class" {...DEFAULT_THEME} {...theme}>
      <UiI18nProvider locale={locale} dateLocale={dateLocale} messages={messages}>
        <TooltipProvider delayDuration={tooltipDelayDuration}>{children}</TooltipProvider>
      </UiI18nProvider>
    </ThemeProvider>
  )
}
