'use client'

// PUL-464 (S2): Breadcrumbs — rendert eine bereits AUFGELÖSTE Krümel-Liste.
//
// Bewusst dumm: die Segment→Label-Auflösung (Vokabular, UUID-Handling,
// Resource-Titel) ist Consumer-Domäne und passiert VOR dieser Komponente.
// Hier nur die Darstellung (Root + Trenner + Links + aktuelle Seite) über die
// shadcn-Breadcrumb-Primitives. Link-Renderer als Slot (Default `<a>`).

import type {ComponentType, ReactNode} from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

export interface BreadcrumbEntry {
  label: ReactNode
  /** Ohne href → nicht-verlinkt (i. d. R. die aktuelle Seite). */
  href?: string
}

export type BreadcrumbLinkComponent = ComponentType<{
  href: string
  className?: string
  children: ReactNode
}>

export interface BreadcrumbsProps {
  /** Aufgelöste Krümel; der letzte Eintrag wird als aktuelle Seite gerendert. */
  items: BreadcrumbEntry[]
  /** Optionaler Wurzel-Eintrag ganz links (z. B. Produktname → `/`). */
  rootLabel?: ReactNode
  rootHref?: string
  linkComponent?: BreadcrumbLinkComponent
  className?: string
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
}: BreadcrumbsProps) {
  return (
    <Breadcrumb className={className}>
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
