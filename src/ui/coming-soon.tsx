'use client'

import { cn } from '../lib/cn'
import { Sparkles } from 'lucide-react'
import { useLabels } from '../i18n/context'

export interface ComingSoonCardLabels {
  /** Default body text and accessible name without a title. */
  comingSoon: string
  /** Accessible name when a `title` is given. */
  titledStatus: (title: string) => string
}

const defaultLabels: ComingSoonCardLabels = {
  comingSoon: 'Coming soon',
  titledStatus: title => `"${title}" is coming soon`,
}

interface ComingSoonProps {
  /** Optional: short headline naming the upcoming feature. */
  title?: string
  /** Optional: body text below the headline. Default `labels.comingSoon`. */
  description?: string
  /** Optional: height of the empty area; default `md`. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
  labels?: Partial<ComingSoonCardLabels>
}

const heightMap = {
  sm: 'min-h-24',
  md: 'min-h-40',
  lg: 'min-h-64',
}

/**
 * Placeholder card for a feature that is not available yet. Matches the final
 * card look (surface, dashed border) but only shows a subtle hint.
 */
export function ComingSoon({
  title,
  description,
  size = 'md',
  className,
  labels,
}: ComingSoonProps) {
  const l = useLabels('comingSoonCard', defaultLabels, labels)
  return (
    <div
      role='status'
      aria-label={title ? l.titledStatus(title) : l.comingSoon}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center',
        heightMap[size],
        className,
      )}
    >
      <Sparkles className='size-5 text-muted-foreground' aria-hidden />
      {title && <div className='caption font-medium text-muted-foreground'>{title}</div>}
      <div className='caption text-muted-foreground/80'>
        {description ?? l.comingSoon}
      </div>
    </div>
  )
}
