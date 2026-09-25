// Badge — passive Markierung (Status, Counter, Meta-Tag, Link-Badge). Nicht
// klickbar; für Toggles und entfernbare Filter siehe `Chip`.
//
// `tone` ist die Farbe, `variant` die Form (`solid` gefüllt · `soft` getönt ·
// `outline` Rand · `plain` ohne Chrome), `shape` die Rundung. Geometrie aus
// der `pill`-Utility. Domain-Tints (Stage, Status, Vocab) setzt ein
// App-Wrapper per `className` auf `variant="outline"` — die einzige
// legitime Farb-Nutzung von `className`.
//
// Die Klassen-Strings stehen als Literale, damit Tailwind sie beim Scan der
// Package-Quelle findet.

import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'
import type {Tone} from '../lib/variants'

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'plain'
export type BadgeShape = 'pill' | 'rounded'

const TONE_CLASS: Record<BadgeVariant, Record<Tone, string>> = {
  solid: {
    neutral: 'border-transparent bg-secondary text-secondary-foreground',
    primary: 'border-transparent bg-primary text-primary-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    warning: 'border-transparent bg-warning text-warning-foreground',
    info: 'border-transparent bg-info text-info-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
  },
  soft: {
    neutral: 'border-transparent bg-surface-2 text-muted-foreground',
    primary: 'border-transparent bg-primary/10 text-primary',
    success: 'border-transparent bg-success/10 text-success',
    warning: 'border-transparent bg-warning/10 text-warning',
    info: 'border-transparent bg-info/10 text-info',
    destructive: 'border-transparent bg-destructive/10 text-destructive',
  },
  outline: {
    neutral: 'border-border text-foreground',
    primary: 'border-primary/30 text-primary',
    success: 'border-success/30 text-success',
    warning: 'border-warning/30 text-warning',
    info: 'border-info/30 text-info',
    destructive: 'border-destructive/30 text-destructive',
  },
  // `plain` neutral erbt die Textfarbe der Umgebung.
  plain: {
    neutral: '',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    destructive: 'text-destructive',
  },
}

const PLAIN_CLASS = 'rounded-none border-0 bg-transparent p-0 gap-1.5 min-w-0'
const COMPACT_CLASS = 'px-1.5 min-w-5 justify-center text-center'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Farbe. Default `neutral`. */
  tone?: Tone
  /** Form. Default `soft`. */
  variant?: BadgeVariant
  /** Rundung: `pill` (Default, rounded-full) oder `rounded` (rounded-md, Meta-Tag). */
  shape?: BadgeShape
  /** Schmales Padding mit stabiler Mindestbreite (Counter in engen Slots). */
  compact?: boolean
  /** Slot vor dem Label — Icon, Glyph oder `BadgeDot`. */
  leading?: ReactNode
  /** Slot nach dem Label (z. B. External-Link-Icon). */
  trailing?: ReactNode
  /** Nur `leading` sichtbar; ein String-Label wird zum `title`, das Label bleibt für Screenreader. */
  iconOnly?: boolean
  /** Rendert das Badge als Link in neuem Tab. */
  href?: string
  children?: ReactNode
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  shape = 'pill',
  compact = false,
  leading,
  trailing,
  iconOnly = false,
  href,
  title,
  className,
  children,
  ...rest
}: BadgeProps) {
  const cls = cn(
    'pill font-medium tabular-nums',
    shape === 'rounded' && 'rounded-md',
    compact && COMPACT_CLASS,
    variant === 'plain' && PLAIN_CLASS,
    TONE_CLASS[variant][tone],
    href && 'pill-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    className,
  )
  const resolvedTitle = title ?? (iconOnly && typeof children === 'string' ? children : undefined)
  const content = (
    <>
      {leading}
      {children != null && (
        <span data-slot="label" className={iconOnly ? 'sr-only' : 'truncate'}>{children}</span>
      )}
      {!iconOnly && trailing}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={resolvedTitle}
        className={cls}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    )
  }

  return (
    <span title={resolvedTitle} className={cls} {...rest}>
      {content}
    </span>
  )
}

export interface BadgeDotProps {
  className?: string
}

/** 6-px-Punkt in der Textfarbe des Badges (`bg-current`) — für `leading`. */
export function BadgeDot({className}: BadgeDotProps) {
  return <span aria-hidden className={cn('inline-block size-1.5 shrink-0 rounded-full bg-current', className)} />
}
