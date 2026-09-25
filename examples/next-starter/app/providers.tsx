'use client'

import type { ReactNode } from 'react'
import { Toaster, UiProviders } from '@meimberg/ui'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProviders theme={{ defaultTheme: 'system', enableSystem: true }}>
      {children}
      {/* Innerhalb von UiProviders, damit der Toaster dem Theme folgt. */}
      <Toaster />
    </UiProviders>
  )
}
