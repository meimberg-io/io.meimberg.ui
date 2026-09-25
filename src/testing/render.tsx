// Render-Helper für Component-Tests mit @meimberg/ui: mountet die Komponente
// im Provider-Contract (`UiProviders`: Theme, Tooltip, Sprache) und liefert
// eine vorbereitete userEvent-Instanz mit.
//
// App-eigene Provider (QueryClient, Router-Mocks, …) kommen über `wrapper` —
// er liegt AUSSEN um UiProviders, analog zum Root-Layout einer App.
//
//   const {user} = renderWithUi(<MyForm />, {messages: de.messages})
//   await user.click(screen.getByRole('button', {name: 'Speichern'}))

import {render, type RenderOptions, type RenderResult} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ComponentType, ReactElement, ReactNode} from 'react'

import {UiProviders, type UiProvidersProps} from '../providers'
import {Toaster} from '../ui/sonner'

export type UiProvidersConfig = Omit<UiProvidersProps, 'children'>

export interface RenderWithUiOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Vollständige UiProviders-Konfiguration (theme, locale, dateLocale, messages, …),
   *  z. B. `{...de}` aus `@meimberg/ui/i18n/de`. */
  providers?: UiProvidersConfig
  /** Kurzform für `providers.messages`; gewinnt gegen `providers`. */
  messages?: UiProvidersProps['messages']
  /** Kurzform für `providers.locale`; gewinnt gegen `providers`. */
  locale?: UiProvidersProps['locale']
  /** Kurzform für `providers.dateLocale`; gewinnt gegen `providers`. */
  dateLocale?: UiProvidersProps['dateLocale']
  /** Sonner-`<Toaster>` innerhalb von UiProviders mitmounten (für Toast-Assertions). */
  withToaster?: boolean
  /** Zusätzlicher App-Provider-Wrapper, liegt außen um UiProviders. */
  wrapper?: ComponentType<{children: ReactNode}>
}

export interface RenderWithUiResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>
}

export function renderWithUi(
  ui: ReactElement,
  {
    providers,
    messages,
    locale,
    dateLocale,
    withToaster = false,
    wrapper: AppWrapper,
    ...options
  }: RenderWithUiOptions = {},
): RenderWithUiResult {
  const config: UiProvidersConfig = {
    ...providers,
    ...(messages !== undefined && {messages}),
    ...(locale !== undefined && {locale}),
    ...(dateLocale !== undefined && {dateLocale}),
  }

  function Wrapper({children}: {children: ReactNode}) {
    const content = (
      <UiProviders {...config}>
        {children}
        {withToaster && <Toaster />}
      </UiProviders>
    )
    return AppWrapper ? <AppWrapper>{content}</AppWrapper> : content
  }

  const user = userEvent.setup()
  const result = render(ui, {wrapper: Wrapper, ...options})
  return {...result, user}
}
