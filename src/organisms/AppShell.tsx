'use client'

// App frame: sidebar + top bar (trigger + slots) + main.
//
// Purely structural: provides the SidebarProvider, renders the consumer's
// sidebar on the left, a top bar with the off-canvas trigger and two slots
// (`headerStart`, e.g. breadcrumbs; `headerEnd`, e.g. action buttons) and the
// scrollable main area. No content padding — pages bring their own (e.g. via
// PageContainer).

import type {ReactNode} from 'react'
import {SidebarProvider, SidebarTrigger} from '../ui/sidebar'
import {useLabels} from '../i18n/context'

export interface AppShellLabels {
  /** Accessible name of the sidebar toggle in the top bar. */
  toggleSidebar: string
}

const defaultLabels: AppShellLabels = {
  toggleSidebar: 'Toggle sidebar',
}

export interface AppShellProps {
  /** Configured <AppSidebar> (or a custom sidebar). */
  sidebar: ReactNode
  /** Top bar next to the trigger (e.g. breadcrumbs). */
  headerStart?: ReactNode
  /** Top bar, right side (e.g. action buttons). */
  headerEnd?: ReactNode
  children: ReactNode
  labels?: Partial<AppShellLabels>
}

export function AppShell({sidebar, headerStart, headerEnd, children, labels}: AppShellProps) {
  const l = useLabels('appShell', defaultLabels, labels)
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {sidebar}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-surface-1">
            <SidebarTrigger
              className="text-muted-foreground hover:text-foreground"
              aria-label={l.toggleSidebar}
              title={l.toggleSidebar}
            />
            {headerStart}
            {headerEnd ? <div className="ml-auto flex items-center gap-2">{headerEnd}</div> : null}
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
