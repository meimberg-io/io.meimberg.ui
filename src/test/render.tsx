// PUL-462 (Schritt 6): Schlanker Test-Wrapper für @meimberg/ui —
// Pendant zu app/src/test/component/render.tsx, reduziert auf das, was
// domain-freie Primitives brauchen: ThemeProvider (next-themes, für
// ThemeToggle), TooltipProvider und ein vorbereiteter userEvent. Bewusst
// KEIN QueryClient und KEIN Toaster — DS-Komponenten haben keine
// Daten-Anbindung; wer das braucht, gehört nicht ins Package.
//
// Nicht Teil der Package-Exports — reine Test-Infrastruktur.

import {ThemeProvider} from 'next-themes'
import {render, type RenderOptions, type RenderResult} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {ReactElement, ReactNode} from 'react'

import {TooltipProvider} from '../ui/tooltip'

function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
      <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
    </ThemeProvider>
  )
}

interface RenderWithProvidersResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
): RenderWithProvidersResult {
  const user = userEvent.setup()
  const result = render(ui, {wrapper: Providers, ...options})
  return {...result, user}
}
