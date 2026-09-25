// Lean test wrapper for @meimberg/ui: ThemeProvider (next-themes, for
// ThemeToggle), TooltipProvider and a prepared userEvent. Deliberately no
// data layer and no Toaster — design-system components have no data binding.
// Pass `messages` to render with app-wide labels (e.g. the German package).
//
// Not part of the package exports — test infrastructure only.

import {ThemeProvider} from 'next-themes'
import {render, type RenderOptions, type RenderResult} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactElement, ReactNode} from 'react'

import {TooltipProvider} from '../ui/tooltip'
import {UiI18nProvider, type UiMessagesOverride} from '../i18n/context'

function createProviders(messages?: UiMessagesOverride) {
  return function Providers({children}: {children: ReactNode}) {
    return (
      <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
        <UiI18nProvider messages={messages}>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </UiI18nProvider>
      </ThemeProvider>
    )
  }
}

interface RenderWithProvidersResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** App-wide label overrides, as passed to `<UiProviders messages>`. */
  messages?: UiMessagesOverride
}

export function renderWithProviders(
  ui: ReactElement,
  {messages, ...options}: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const user = userEvent.setup()
  const result = render(ui, {wrapper: createProviders(messages), ...options})
  return {...result, user}
}
