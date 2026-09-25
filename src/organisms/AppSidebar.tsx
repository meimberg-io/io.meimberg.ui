'use client'

// Generic, config-driven app navigation.
//
// Framework-agnostic: the current path comes in as `currentPath` (e.g. Next
// `usePathname()`), links render through the `linkComponent` slot (default
// `<a>`; Next apps pass `next/link` for prefetch/client navigation). Nav
// structure, icons, badges and header/footer are supplied as data/slots.
//
// Must be rendered inside <AppShell> (or a SidebarProvider) — uses
// `useSidebar()` for the collapsed state and closing the mobile off-canvas.

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
  /** Pre-rendered leading icon (the consumer owns the icon system). */
  icon?: ReactNode
  /** Trailing badge (e.g. a counter pill). Hidden when collapsed. */
  badge?: ReactNode
}

export interface SidebarNavGroup {
  /** Optional caps header above the group. */
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

/** Context passed to the `header`/`footer` render functions. */
export interface AppSidebarSlotContext {
  /** Desktop sidebar collapsed to the icon rail. */
  collapsed: boolean
  /** Sidebar renders as the mobile off-canvas sheet. */
  isMobile: boolean
  /** Closes the mobile off-canvas (no-op on desktop), e.g. after a click in the footer menu. */
  closeMobile: () => void
}

export type AppSidebarSlot = (ctx: AppSidebarSlotContext) => ReactNode

export interface AppSidebarProps {
  groups: SidebarNavGroup[]
  /** Current path (e.g. Next `usePathname()`). */
  currentPath: string
  /** Active heuristic. Default: exact for `/`, prefix match otherwise. */
  isActive?: (href: string, currentPath: string) => boolean
  /** Link renderer. Default `<a>`. Next apps: `next/link`. */
  linkComponent?: SidebarLinkComponent
  /** Extra callback on navigation (the component closes the mobile sidebar itself). */
  onNavigate?: () => void
  /** Header slot (logo/brand). */
  header?: AppSidebarSlot
  /** Footer slot (e.g. user menu). */
  footer?: AppSidebarSlot
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
  const closeMobile = () => {
    if (isMobile) setOpenMobile(false)
  }
  const ctx: AppSidebarSlotContext = {collapsed, isMobile, closeMobile}

  const handleNavigate = () => {
    closeMobile()
    onNavigate?.()
  }

  return (
    <Sidebar collapsible="icon" className={cn('border-r border-sidebar-border', className)}>
      <SidebarContent>
        {header ? <div className="flex items-center gap-3 px-4 py-5">{header(ctx)}</div> : null}

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
                          {/* The consumer controls icon size (Lucide h-4 w-4,
                              avatar size-5 …) — only shrink-0 here. */}
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
        <SidebarFooter className="border-t border-sidebar-border p-3">{footer(ctx)}</SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
