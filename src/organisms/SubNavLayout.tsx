'use client'

// Two-level sub-navigation (e.g. settings).
//
// Desktop (`>= md`): narrow nav sidebar left + content right. Mobile
// (`< md`): the sidebar gives way to a field <Select> that navigates to the
// sub-page. Exactly one nav is visible per breakpoint. Framework-agnostic:
// `currentPath` as prop, desktop links via the `linkComponent` slot, mobile
// navigation via `onNavigate(href)` (e.g. Next `router.push`). No page
// padding — the consumer wraps it (e.g. in <PageContainer>).

import type {ComponentType, ReactNode} from 'react'
import {Select} from '../atoms/Select'
import {useLabels} from '../i18n/context'
import {cn} from '../lib/cn'

export interface SubNavItem {
  label: string
  href: string
  /** Pre-rendered icon (desktop sidebar only; the mobile select is text-only). */
  icon?: ReactNode
}

export type SubNavLinkComponent = ComponentType<{
  href: string
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}>

export interface SubNavLayoutLabels {
  /** aria-label of the nav landmark. */
  navigation: string
  /** Placeholder of the mobile select. */
  mobilePlaceholder: string
}

const defaultLabels: SubNavLayoutLabels = {
  navigation: 'Section navigation',
  mobilePlaceholder: 'Select a section',
}

export interface SubNavLayoutProps {
  items: SubNavItem[]
  currentPath: string
  children: ReactNode
  linkComponent?: SubNavLinkComponent
  /** Mobile select navigation (e.g. `href => router.push(href)`). */
  onNavigate?: (href: string) => void
  isActive?: (href: string, currentPath: string) => boolean
  /** Takes precedence over `labels.navigation`. */
  ariaLabel?: string
  /** Takes precedence over `labels.mobilePlaceholder`. */
  mobilePlaceholder?: string
  className?: string
  labels?: Partial<SubNavLayoutLabels>
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
  ariaLabel,
  mobilePlaceholder,
  className,
  labels,
}: SubNavLayoutProps) {
  const l = useLabels('subNavLayout', defaultLabels, labels)
  const active = items.find(item => isActive(item.href, currentPath))

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:gap-8', className)}>
      <div className="md:hidden">
        <Select
          value={active?.href ?? null}
          onChange={href => onNavigate?.(href)}
          placeholder={mobilePlaceholder ?? l.mobilePlaceholder}
          options={items.map(item => ({value: item.href, label: item.label}))}
        />
      </div>

      <nav aria-label={ariaLabel ?? l.navigation} className="hidden md:block w-56 shrink-0">
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
