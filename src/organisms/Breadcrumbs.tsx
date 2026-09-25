'use client'

// Renders an already RESOLVED list of crumbs.
//
// Deliberately dumb: resolving path segments to labels (vocabulary, IDs,
// resource titles) belongs to the consumer and happens BEFORE this component.
// Only presentation here (root + separators + links + current page) via the
// shadcn breadcrumb primitives. Link renderer as slot (default `<a>`).

import type {ComponentType, ReactNode} from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import {useLabels} from '../i18n/context'

export interface BreadcrumbEntry {
  label: ReactNode
  /** Without href → not linked (usually the current page). */
  href?: string
}

export type BreadcrumbLinkComponent = ComponentType<{
  href: string
  className?: string
  children: ReactNode
}>

export interface BreadcrumbsLabels {
  /** aria-label of the nav landmark. */
  navigation: string
}

const defaultLabels: BreadcrumbsLabels = {
  navigation: 'Breadcrumb',
}

export interface BreadcrumbsProps {
  /** Resolved crumbs; the last entry is rendered as the current page. */
  items: BreadcrumbEntry[]
  /** Optional root entry on the far left (e.g. product name → `/`). */
  rootLabel?: ReactNode
  rootHref?: string
  linkComponent?: BreadcrumbLinkComponent
  className?: string
  labels?: Partial<BreadcrumbsLabels>
}

const DefaultLink: BreadcrumbLinkComponent = ({href, children, ...rest}) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

const LINK_CLS = 'text-muted-foreground hover:text-foreground'

export function Breadcrumbs({
  items,
  rootLabel,
  rootHref = '/',
  linkComponent: Link = DefaultLink,
  className,
  labels,
}: BreadcrumbsProps) {
  const l = useLabels('breadcrumbs', defaultLabels, labels)
  return (
    <Breadcrumb className={className} aria-label={l.navigation}>
      <BreadcrumbList>
        {rootLabel != null ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild className={LINK_CLS}>
              <Link href={rootHref}>{rootLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}
        {items.map((c, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={i} className="contents">
              {(rootLabel != null || i > 0) && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !c.href ? (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className={LINK_CLS}>
                    <Link href={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
