'use client'

// PUL-464 (S2): AppShell — App-Gerüst: Sidebar + Topbar (Trigger + Slots) + Main.
//
// Rein strukturell/generisch: stellt den SidebarProvider bereit, rendert die
// (vom Consumer konfigurierte) Sidebar links, eine Topbar mit Off-Canvas-
// Trigger + zwei Slots (`headerStart` = z. B. Breadcrumb, `headerEnd` = z. B.
// Action-Buttons) und den scrollbaren Main-Bereich. Kein eigenes Content-
// Padding — Pages bringen ihr Padding selbst mit (z. B. via PageContainer).

import type {ReactNode} from 'react'
import {SidebarProvider, SidebarTrigger} from '../ui/sidebar'

export interface AppShellProps {
  /** Konfigurierte <AppSidebar> (oder eigene Sidebar). */
  sidebar: ReactNode
  /** Topbar links neben dem Trigger (z. B. Breadcrumb). */
  headerStart?: ReactNode
  /** Topbar rechts (z. B. Action-Buttons). */
  headerEnd?: ReactNode
  children: ReactNode
}

export function AppShell({sidebar, headerStart, headerEnd, children}: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {sidebar}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-surface-1">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            {headerStart}
            {headerEnd ? <div className="ml-auto flex items-center gap-2">{headerEnd}</div> : null}
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
