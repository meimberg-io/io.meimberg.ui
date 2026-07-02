'use client'

// PUL-462 (Schritt 7): IconBadge — generischer Badge-Kern der Pulse-Badge-
// Familie (AccountBadge, OrgBadge, RelationBadge, StageBadge, StatusBadge,
// BucketLinkBadge). Der Kern ordnet drei Slots in einer wählbaren Hülle an:
// `leading` (Icon ODER gefärbter Dot), Label (`children`), `trailing`
// (z. B. External-Link-Icon).
//
// Bewusst TONE-NEUTRAL: die semantische Farbe (Stage-/Status-/Provider-Tint)
// ist Pulse-Domain und wird vom jeweiligen Wrapper via `className` gereicht —
// der gefärbte Dot erbt die Textfarbe über `bg-current`. Kein `tone`-Enum im
// Package (D1/D2: domain-frei).

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

export type IconBadgeVariant = 'outline' | 'plain' | 'chip'

export interface IconBadgeProps {
  /** Leading-Slot links vor dem Label — Icon, Glyph oder gefärbter Dot. */
  leading?: ReactNode
  /** Label. Entfällt visuell bei `iconOnly`. */
  children?: ReactNode
  /** Trailing-Slot rechts (z. B. External-Link-Icon). */
  trailing?: ReactNode
  /** Nur den Leading-Slot rendern; Label geht in `title` (Tooltip). */
  iconOnly?: boolean
  /** Setzt das Badge als Link (öffnet in neuem Tab). Ohne → nicht-interaktiver Span. */
  href?: string
  /**
   * Hülle:
   * - `outline` (default): Badge-Geometrie (`pill`), transparenter Rand — der
   *   Wrapper bringt den Tint via `className`.
   * - `plain`: nackter Inline-Flex ohne Chrome (Icon + Label mit Gap).
   * - `chip`: Surface-2-Chip (weicher Hintergrund, kleinere Caption).
   */
  variant?: IconBadgeVariant
  /** Tooltip; bei `iconOnly` der Ersatz fürs Label. */
  title?: string
  className?: string
}

const VARIANT_CLASS: Record<IconBadgeVariant, string> = {
  outline: 'pill border-transparent',
  plain: 'inline-flex items-center gap-1.5 min-w-0',
  chip: 'inline-flex items-center gap-1.5 rounded-md caption px-1.5 py-0.5 bg-surface-2 text-muted-foreground',
}

/** 6px Tone-Dot, der die Textfarbe des Badges erbt (`bg-current`). */
export function IconBadgeDot({className}: {className?: string}) {
  return (
    <span
      className={cn('inline-block rounded-full shrink-0 bg-current', className)}
      style={{width: 6, height: 6}}
      aria-hidden
    />
  )
}

export function IconBadge({
  leading,
  children,
  trailing,
  iconOnly = false,
  href,
  variant = 'outline',
  title,
  className,
}: IconBadgeProps) {
  const content = (
    <>
      {leading}
      {!iconOnly && children != null && <span className='truncate'>{children}</span>}
      {!iconOnly && trailing}
    </>
  )
  const cls = cn(VARIANT_CLASS[variant], className)
  const resolvedTitle = title ?? (iconOnly && typeof children === 'string' ? children : undefined)

  if (href) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        title={resolvedTitle}
        className={cn(cls, 'hover:text-foreground transition-colors')}
      >
        {content}
      </a>
    )
  }

  return (
    <span title={resolvedTitle} className={cls}>
      {content}
    </span>
  )
}
