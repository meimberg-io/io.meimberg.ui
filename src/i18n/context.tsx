'use client'

// Sprach-Mechanismus von @meimberg/ui.
//
// Jede Komponente mit UI-Text hat englische Default-Labels (im Komponenten-File,
// Typ `<Name>Labels`) und liest sie über `useLabels`. Überschreiben lässt sich
// das an zwei Stellen, die spätere gewinnt:
//   1. App-weit über `<UiProviders messages={…}>` (z. B. das deutsche Paket
//      aus `@meimberg/ui/i18n/de`),
//   2. pro Instanz über die `labels`-Prop der Komponente.
// Zahlen und Daten formatieren die Komponenten mit `useUiLocale()` (BCP-47)
// bzw. `useDateLocale()` (date-fns-Locale für Kalender und Datumsmuster).

import {createContext, useContext, useMemo, type ReactNode} from 'react'
import type {Locale} from 'date-fns'
import {enUS} from 'date-fns/locale'
import type {UiMessages} from './messages'

/** App-weite Label-Overrides: pro Komponente ein Teil ihrer Labels. */
export type UiMessagesOverride = {[K in keyof UiMessages]?: Partial<UiMessages[K]>}

interface UiI18n {
  locale: string
  dateLocale: Locale
  messages: Partial<Record<string, object>>
}

const DEFAULT_LOCALE = 'en-US'

const UiI18nContext = createContext<UiI18n>({locale: DEFAULT_LOCALE, dateLocale: enUS, messages: {}})

export interface UiI18nProviderProps {
  /** BCP-47-Locale für Intl-Formatierung (Zahlen, Daten). Default `en-US`. */
  locale?: string
  /** date-fns-Locale für Kalender und Datumsmuster. Default `enUS`. */
  dateLocale?: Locale
  /** App-weite Label-Overrides, z. B. `de.messages` aus `@meimberg/ui/i18n/de`. */
  messages?: UiMessagesOverride
  children: ReactNode
}

export function UiI18nProvider({locale = DEFAULT_LOCALE, dateLocale = enUS, messages, children}: UiI18nProviderProps) {
  const value = useMemo(() => ({locale, dateLocale, messages: messages ?? {}}), [locale, dateLocale, messages])
  return <UiI18nContext.Provider value={value}>{children}</UiI18nContext.Provider>
}

export function useUiLocale(): string {
  return useContext(UiI18nContext).locale
}

export function useDateLocale(): Locale {
  return useContext(UiI18nContext).dateLocale
}

/**
 * Löst die Labels einer Komponente auf: englische Defaults ← App-weite
 * Messages (`key`) ← Instanz-Overrides (`override`).
 */
export function useLabels<T extends object>(key: keyof UiMessages, defaults: T, override?: Partial<T>): T {
  const app = useContext(UiI18nContext).messages[key] as Partial<T> | undefined
  return useMemo(() => ({...defaults, ...app, ...override}), [defaults, app, override])
}
