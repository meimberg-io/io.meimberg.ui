import type {HTMLAttributes, ReactNode} from 'react'
import {Icon} from './Icon'
import {Sparkles} from './icons'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

export interface ComingSoonLabels {
  description: string
}

const defaultLabels: ComingSoonLabels = {
  description: 'Coming soon',
}

export interface ComingSoonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optionaler Name des vorgesehenen Inhalts („Revenue chart", „Activity"). */
  title?: ReactNode
  /** Beschreibungstext. Überschreibt `labels.description`. */
  description?: ReactNode
  /**
   * Aspect-Ratio für Höhen-Reservierung (`'16 / 9'`, `'video'`, etc.). Layouts
   * bleiben damit auch ohne echte Daten korrekt. Default: keine Reservierung —
   * die Card nimmt nur ihren Inhalt ein.
   */
  aspectRatio?: string
  labels?: Partial<ComingSoonLabels>
}

/**
 * ComingSoon — Platzhalter-Card für konzeptionell vorgesehene, aber noch
 * nicht gebaute Inhalte. Sichtbar dezent (gestrichelter Rand +
 * muted-foreground), aber im Layout raumfüllend.
 *
 * @example
 *   <ComingSoon title="Revenue chart" aspectRatio="16 / 5" />
 */
export function ComingSoon({
  title,
  description,
  aspectRatio,
  labels,
  className,
  style,
  ...rest
}: ComingSoonProps) {
  const l = useLabels('comingSoon', defaultLabels, labels)
  const text = description ?? l.description
  const ariaLabel = typeof text === 'string'
    ? (typeof title === 'string' ? `${text}: ${title}` : text)
    : undefined
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        'rounded-lg border border-dashed border-border bg-card/40',
        'p-6 text-muted-foreground',
        className,
      )}
      style={aspectRatio ? {aspectRatio, ...style} : style}
      {...rest}
    >
      <Icon icon={Sparkles} size="md" />
      {title != null && <div className="body-sm font-medium">{title}</div>}
      <div className="caption">{text}</div>
    </div>
  )
}
