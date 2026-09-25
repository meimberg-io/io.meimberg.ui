// Owned by area core — utilities, providers, i18n, toast, buttons, icons and
// the shared control vocabulary. Add exports of components in this area here.
export { cn } from '../lib/cn'
export { useIsMobile } from '../hooks/use-mobile'
export type { Breakpoint, ControlSize, IconComponent, Tone } from '../lib/variants'

// Provider-Contract (Contexts, die @meimberg/ui voraussetzt).
export { UiProviders } from '../providers'
export type { UiProvidersProps } from '../providers'

// Sprache: Labels, Locale. Deutsches Paket: `@meimberg/ui/i18n/de`.
export { UiI18nProvider, useUiLocale, useDateLocale, useLabels } from '../i18n/context'
export type { UiI18nProviderProps, UiMessagesOverride } from '../i18n/context'
export type { UiMessages } from '../i18n/messages'

// Toast: <Toaster> und toast() (sonner) kuratiert aus dem Root-Barrel. sonner
// ist Peer-Dependency, damit App und DS denselben Toast-Store teilen.
export { Toaster, toast } from '../ui/sonner'

export * from '../atoms/Button'
export * from '../atoms/IconButton'
export { Icon } from '../atoms/Icon'
export type { IconProps, IconSize } from '../atoms/Icon'
export * from '../atoms/IconByName'
