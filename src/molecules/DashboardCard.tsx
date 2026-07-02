// PUL-432 (G3a): Pulse-Convenience-Wrapper für Dashboard-Section-Cards.
// Wrappt shadcn-<Card> mit padding-Prop, damit das wiederkehrende
// Dashboard-Section-Padding (p-5) als Library-Garantie statt Call-Site-
// Convention lebt.
//
// Konsumenten geben Layout-Klassen (lg:col-span-2, overflow-hidden, …) via
// `className` weiter; Padding wählen sie via Prop. Vor G3a haben 10
// App-Stellen den Card-Frame inline reimplementiert (siehe G2-Discovery
// § G2c-M1 in `docs/frontend/g2-discovery.md`) — alle in G3a auf diese
// Komponente migriert. ESLint-Boundary (PUL-432) blockt Drift.

import type {HTMLAttributes, ReactNode} from 'react'
import {Card} from '../ui/card'
import {cn} from '../lib/cn'

const PADDING_CLASSES = {
  // Default — Mission-Detail- / Context-Dashboard-Sections.
  dashboard: 'p-5',
  // Kompakter — z. B. BucketCard mit eigener Hover-Logik.
  compact: 'p-4',
  // Kein Padding — wenn der Konsument einen Item-Listen-Frame baut und
  // das Padding intern verwaltet (z. B. inbox-view Group-Container).
  none: '',
} as const

export interface DashboardCardProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Padding-Variante.
   * - `dashboard` (Default): `p-5` — Standard für Mission-Detail- /
   *   Context-Dashboard-Sections.
   * - `compact`: `p-4` — kompakter (z. B. BucketCard).
   * - `none`: kein Padding — Konsument setzt es selbst (Item-Listen-Frame).
   */
  padding?: keyof typeof PADDING_CLASSES
  children?: ReactNode
}

export function DashboardCard({
  padding = 'dashboard',
  className,
  children,
  ...rest
}: DashboardCardProps) {
  return (
    <Card className={cn(PADDING_CLASSES[padding], className)} {...rest}>
      {children}
    </Card>
  )
}
