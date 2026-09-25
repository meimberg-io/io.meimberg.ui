// ComingSoon — Platzhalter-Card für vorgesehene, aber noch nicht gebaute
// Inhalte. Sieht aus wie die spätere Card (Surface, gestrichelter Rand),
// zeigt aber nur einen dezenten Hinweis. `size` reserviert die Höhe, damit
// das Layout auch ohne echte Daten steht.

import type {HTMLAttributes, ReactNode} from 'react'
import {Icon} from './Icon'
import {Sparkles} from './icons'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

export interface ComingSoonLabels {
  /** Default-Text und Accessible Name ohne String-`title`. */
  description: string
  /** Accessible Name mit String-`title`. */
  titledStatus: (title: string) => string
}

const defaultLabels: ComingSoonLabels = {
  description: 'Coming soon',
  titledStatus: title => `"${title}" is coming soon`,
}

export type ComingSoonSize = 'sm' | 'md' | 'lg'

const MIN_HEIGHT: Record<ComingSoonSize, string> = {
  sm: 'min-h-24',
  md: 'min-h-40',
  lg: 'min-h-64',
}

export interface ComingSoonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Name des vorgesehenen Inhalts („Revenue chart", „Activity"). */
  title?: ReactNode
  /** Text unter dem Titel. Default `labels.description`. */
  description?: ReactNode
  /** Mindesthöhe: `sm` 96 · `md` 160 (Default) · `lg` 256 px. */
  size?: ComingSoonSize
  labels?: Partial<ComingSoonLabels>
}

/**
 * @example
 *   <ComingSoon title="Revenue chart" size="lg" />
 */
export function ComingSoon({
  title,
  description,
  size = 'md',
  labels,
  className,
  ...rest
}: ComingSoonProps) {
  const l = useLabels('comingSoon', defaultLabels, labels)
  const hasTitle = title != null && title !== ''
  return (
    <div
      role="status"
      aria-label={typeof title === 'string' && hasTitle ? l.titledStatus(title) : l.description}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-muted-foreground',
        MIN_HEIGHT[size],
        className,
      )}
      {...rest}
    >
      <Icon icon={Sparkles} size="lg" />
      {hasTitle && <div className="caption font-medium">{title}</div>}
      <div className="caption text-muted-foreground/80">{description ?? l.description}</div>
    </div>
  )
}
