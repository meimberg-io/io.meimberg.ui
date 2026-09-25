// Section-Header für Dashboard-Cards: Title + optional Subtitle + optional
// Action rechts. Slot-Props-API analog <PageHeader> / <FormDialog>.
//
// Title-Größen-Variants:
//   - `heading-3` (Default) — Sections in einer DashboardCard.
//   - `base` — eingebettete Sections ohne eigene Card.
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
   * Inline-Count, Highlight-Spans o. ä. mitgeben (z. B. `<>Projects
   * <span className="caption text-muted-foreground tabular-nums">(
   * {count})</span></>`).
   */
  title: ReactNode
  /**
   * Title-Größen-Variante.
   * - `heading-3` (Default): `heading-3 text-foreground` — Standard für
   *   Section-Header in einer DashboardCard.
   * - `base`: `text-base font-semibold text-foreground` — kompakter, für
   *   eingebettete Sections ohne eigene Card.
   */
  titleSize?: keyof typeof TITLE_CLASSES
  /**
   * Subtitle/Beschreibung unterhalb des Titels. Optional, ReactNode für
   * Highlight-Spans (analog `<PageHeader description>`).
   */
  subtitle?: ReactNode
  /**
   * Action-Slot rechts vom Title-Block (typisch ein Link „View all →"
   * oder „+ New"). Wenn gesetzt, wird der Header zu `flex
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
