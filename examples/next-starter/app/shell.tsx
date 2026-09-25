'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AppShell,
  AppSidebar,
  Breadcrumbs,
  ThemeToggle,
  UserMenu,
  type BreadcrumbEntry,
  type SidebarNavGroup,
} from '@meimberg/ui'
import { House, Settings } from '@meimberg/ui/atoms/icons'

const groups: SidebarNavGroup[] = [
  {
    label: 'Navigation',
    items: [
      { label: 'Home', href: '/', icon: <House className="h-4 w-4" /> },
      { label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]

const titles: Record<string, string> = { '/': 'Home', '/settings': 'Settings' }

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname()
  const crumbs: BreadcrumbEntry[] = [{ label: titles[path] ?? path }]

  return (
    <AppShell
      sidebar={
        <AppSidebar
          groups={groups}
          currentPath={path}
          linkComponent={Link}
          header={collapsed => <span className="heading-3">{collapsed ? 'S' : 'Starter'}</span>}
          footer={collapsed => (
            <UserMenu name="Ada Lovelace" email="ada@example.com" collapsed={collapsed} linkComponent={Link} />
          )}
        />
      }
      headerStart={<Breadcrumbs rootLabel="Starter" rootHref="/" items={crumbs} linkComponent={Link} />}
      headerEnd={<ThemeToggle />}
    >
      {children}
    </AppShell>
  )
}
