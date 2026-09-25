// Convenience-Wrapper für Dashboard-Section-Cards. Wrappt shadcn-<Card> mit
// padding-Prop, damit das wiederkehrende Section-Padding (p-5) als
// Library-Garantie statt Call-Site-Convention lebt.
//
// Konsumenten geben Layout-Klassen (lg:col-span-2, overflow-hidden, …) via
// `className` weiter; Padding wählen sie via Prop.

import type {HTMLAttributes, ReactNode} from 'react'
import {Card} from '../ui/card'
import {cn} from '../lib/cn'

const PADDING_CLASSES = {
  // Default — Dashboard-Sections.
  dashboard: 'p-5',
  // Kompakter — z. B. klickbare Karten mit eigener Hover-Logik.
  compact: 'p-4',
  // Kein Padding — wenn der Konsument einen Item-Listen-Frame baut und
  // das Padding intern verwaltet (z. B. gruppierte Listen).
  none: '',
} as const

export interface DashboardCardProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Padding-Variante.
   * - `dashboard` (Default): `p-5` — Standard für Dashboard-Sections.
   * - `compact`: `p-4` — kompakter (z. B. klickbare Karten).
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
