'use client'

// PUL-464 (S2): AppSidebar — generische, config-getriebene App-Navigation.
//
// Framework-agnostisch: der aktuelle Pfad kommt als `currentPath`-Prop (der
// Consumer reicht z. B. Next `usePathname()` rein), Links rendern über ein
// `linkComponent`-Slot (Default: `<a>`; Next-Apps geben `next/link` rein →
// Prefetch/Client-Nav). Keine Domain-Kenntnis: Nav-Struktur, Icons, Badges
// und Header/Footer liefert der Consumer als Daten/Slots.
//
// Muss innerhalb von <AppShell> (bzw. einem SidebarProvider) gerendert werden —
// nutzt `useSidebar()` für Collapsed-State + Mobile-Off-Canvas-Close.

import type {ComponentType, ReactNode} from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'
import {cn} from '../lib/cn'

export interface SidebarNavItem {
  label: string
  href: string
  /** Vorgerendertes Leading-Icon (Consumer kontrolliert Icon-System). */
  icon?: ReactNode
  /** Trailing-Badge (z. B. Counter-Pill). Wird bei collapsed ausgeblendet. */
  badge?: ReactNode
}

export interface SidebarNavGroup {
  /** Optionaler Caps-Header über der Gruppe. */
  label?: string
  items: SidebarNavItem[]
}

export type SidebarLinkComponent = ComponentType<{
  href: string
  onClick?: () => void
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}>

export interface AppSidebarProps {
  groups: SidebarNavGroup[]
  /** Aktueller Pfad (z. B. Next `usePathname()`). */
  currentPath: string
  /** Aktiv-Heuristik. Default: exakt für `/`, sonst Prefix-Match. */
  isActive?: (href: string, currentPath: string) => boolean
  /** Link-Renderer. Default `<a>`. Next-Apps: `next/link`. */
  linkComponent?: SidebarLinkComponent
  /** Zusätzlicher Callback bei Navigation (Mobile-Close macht die Komponente selbst). */
  onNavigate?: () => void
  /** Header-Slot (Logo/Brand). Bekommt den Collapsed-State. */
  header?: (collapsed: boolean) => ReactNode
  /** Footer-Slot (z. B. User-Menü). Bekommt den Collapsed-State. */
  footer?: (collapsed: boolean) => ReactNode
  className?: string
}

const DefaultLink: SidebarLinkComponent = ({href, children, ...rest}) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

function defaultIsActive(href: string, currentPath: string): boolean {
  return href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`)
}

export function AppSidebar({
  groups,
  currentPath,
  isActive = defaultIsActive,
  linkComponent: Link = DefaultLink,
  onNavigate,
  header,
  footer,
  className,
}: AppSidebarProps) {
  const {state, isMobile, setOpenMobile} = useSidebar()
  const collapsed = state === 'collapsed'

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false)
    onNavigate?.()
  }

  return (
    <Sidebar collapsible="icon" className={cn('border-r border-sidebar-border', className)}>
      <SidebarContent>
        {header ? <div className="flex items-center gap-3 px-4 py-5">{header(collapsed)}</div> : null}

        {groups.map((group, gi) => (
          <SidebarGroup key={group.label ?? gi}>
            {group.label ? (
              <SidebarGroupLabel className="caption uppercase tracking-widest text-muted-foreground/60 font-semibold">
                {group.label}
              </SidebarGroupLabel>
            ) : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const active = isActive(item.href, currentPath)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          onClick={handleNavigate}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-2 hover:bg-sidebar-accent group',
                            active && 'bg-sidebar-accent text-sidebar-primary font-medium',
                          )}
                        >
                          {/* Icon-Größe kontrolliert der Consumer (Lucide h-4 w-4,
                              Avatar/OrgIcon size-5 …) — hier nur shrink-0. */}
                          {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge ? <span className="ml-auto">{item.badge}</span> : null}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {footer ? (
        <SidebarFooter className="border-t border-sidebar-border p-3">{footer(collapsed)}</SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
