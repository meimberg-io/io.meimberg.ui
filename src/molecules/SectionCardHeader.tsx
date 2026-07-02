// PUL-433 (G3b): Pulse-Wrapper für Section-Header in Dashboard-Cards.
// Title + optional Subtitle + optional Action-Link rechts. Slot-Props-API
// analog <PageHeader> / <FormDialog> (siehe guidelines.md § Slot-Pattern).
//
// Vor G3b haben mehrere Stellen (Mission-Detail-Page Section-Header,
// ContextMissionsGrid-Header) das Pattern inline mit `<header>` + `<h2
// heading-3>` + `<p caption>` reimplementiert. Alle in G3b auf diese
// Komponente migriert (Spec PUL-433, G2-Discovery § G2c-M2 + G2d-G1).
//
// Title-Größen-Variants:
//   - `heading-3` (Default) — DashboardCard-Sections (Mission-Detail).
//   - `base` — eingebettete Sections ohne eigene Card (ContextMissionsGrid).
//
// Page-Title (heading-1) gehört in <PageHeader>, nicht hier.

import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

const TITLE_CLASSES = {
  'heading-3': 'heading-3 text-foreground',
  base: 'text-base font-semibold text-foreground',
} as const

export interface SectionCardHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Section-Title. ReactNode statt nur string — Konsumenten können
   * Inline-Count, Highlight-Spans o. ä. mitgeben (z. B. `<>Missions
   * <span className="caption text-muted-foreground tabular-nums">(
   * {count})</span></>`).
   */
  title: ReactNode
  /**
   * Title-Größen-Variante.
   * - `heading-3` (Default): `heading-3 text-foreground` — Pulse-Standard
   *   für DashboardCard-Section-Headers (Mission-Detail).
   * - `base`: `text-base font-semibold text-foreground` — kompakter, für
   *   eingebettete Sections ohne eigene Card (z. B. ContextMissionsGrid).
   */
  titleSize?: keyof typeof TITLE_CLASSES
  /**
   * Subtitle/Beschreibung unterhalb des Titels. Optional, ReactNode für
   * Highlight-Spans (analog `<PageHeader description>`).
   */
  subtitle?: ReactNode
  /**
   * Action-Slot rechts vom Title-Block (typisch ein Link „Alle anzeigen
   * →" oder „+ Neue Mission"). Wenn gesetzt, wird der Header zu `flex
   * items-baseline justify-between` statt vertikalem Stack.
   */
  action?: ReactNode
}

export function SectionCardHeader({
  title,
  titleSize = 'heading-3',
  subtitle,
  action,
  className,
  ...rest
}: SectionCardHeaderProps) {
  const hasAction =
    action !== undefined && action !== null && action !== false
  return (
    <header
      className={cn(
        'mb-3',
        hasAction && 'flex items-baseline justify-between gap-3',
        className,
      )}
      {...rest}
    >
      {hasAction ? (
        <div>
          <h2 className={TITLE_CLASSES[titleSize]}>{title}</h2>
          {subtitle && (
            <p className="caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
      ) : (
        <>
          <h2 className={TITLE_CLASSES[titleSize]}>{title}</h2>
          {subtitle && (
            <p className="caption text-muted-foreground">{subtitle}</p>
          )}
        </>
      )}
      {action}
    </header>
  )
}
