'use client'

// PUL-464 (S2): SubNavLayout — Zwei-Ebenen-Sub-Navigation (z. B. Settings).
//
// Desktop (`>= md`): schmale Nav-Sidebar links + Content rechts. Mobile
// (`< md`): die Sidebar weicht einem <SelectField>, das zur Sub-Page navigiert.
// Genau eine Nav ist je Breakpoint sichtbar. Config-getrieben + framework-
// agnostisch: `currentPath` als Prop, Desktop-Links über `linkComponent`-Slot,
// Mobile-Navigation über `onNavigate(href)` (Consumer reicht z. B. Next
// `router.push` rein). Kein Page-Padding — der Consumer wrappt (z. B. in
// <PageContainer>).

import type {ComponentType, ReactNode} from 'react'
import {SelectField} from '../atoms/SelectField'
import {cn} from '../lib/cn'

export interface SubNavItem {
  label: string
  href: string
  /** Vorgerendertes Icon (nur Desktop-Sidebar; das Mobile-Select ist Text-only). */
  icon?: ReactNode
}

export type SubNavLinkComponent = ComponentType<{
  href: string
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}>

export interface SubNavLayoutProps {
  items: SubNavItem[]
  currentPath: string
  children: ReactNode
  linkComponent?: SubNavLinkComponent
  /** Mobile-Select-Navigation (z. B. `href => router.push(href)`). */
  onNavigate?: (href: string) => void
  isActive?: (href: string, currentPath: string) => boolean
  ariaLabel?: string
  mobilePlaceholder?: string
  className?: string
}

const DefaultLink: SubNavLinkComponent = ({href, children, ...rest}) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

function defaultIsActive(href: string, currentPath: string): boolean {
  return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function SubNavLayout({
  items,
  currentPath,
  children,
  linkComponent: Link = DefaultLink,
  onNavigate,
  isActive = defaultIsActive,
  ariaLabel = 'Sub-Navigation',
  mobilePlaceholder,
  className,
}: SubNavLayoutProps) {
  const active = items.find(item => isActive(item.href, currentPath))

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:gap-8', className)}>
      <div className="md:hidden">
        <SelectField
          value={active?.href ?? null}
          onChange={href => onNavigate?.(href)}
          placeholder={mobilePlaceholder}
          options={items.map(item => ({value: item.href, label: item.label}))}
        />
      </div>

      <nav aria-label={ariaLabel} className="hidden md:block w-56 shrink-0">
        <ul className="flex flex-col gap-0.5">
          {items.map(item => {
            const isCurrent = isActive(item.href, currentPath)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 body transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    isCurrent ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground',
                  )}
                >
                  {item.icon ? <span className="flex size-4 shrink-0 items-center justify-center">{item.icon}</span> : null}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
