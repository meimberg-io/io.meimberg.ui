import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

const TONE_CLASSES = {
  /** Auf Page-/Card-Flächen abgesetzt (Detail-Dialog-Bodies). */
  muted: 'bg-muted/40',
  /** Auf neutralen Flächen — leicht erhöhte Card-Fläche. */
  subtle: 'bg-card',
} as const

export interface InfoBannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Tönung der Box. `muted` (Default) = `bg-muted/40`, `subtle` = `bg-card`. */
  tone?: keyof typeof TONE_CLASSES
  /** Text kursiv rendern. Default `true` (Hinweis-Charakter). */
  italic?: boolean
  children: ReactNode
}

/**
 * InfoBanner — kleine Inline-Hinweis-Box („No content", „No description",
 * Empty-Hint) für Detail-Dialog-Bodies und Listen-Surfaces.
 *
 * Abgrenzung zur `<EmptyState>`-Molecule: die ist der
 * große, zentrierte Section-/Page-Empty-State; InfoBanner ist die kleine,
 * fließende Hinweiszeile.
 *
 * @example
 *   <InfoBanner>No content.</InfoBanner>
 *   <InfoBanner tone="subtle" italic={false}>No more tags available.</InfoBanner>
 */
export function InfoBanner({tone = 'muted', italic = true, className, children, ...rest}: InfoBannerProps) {
  return (
    <div
      className={cn(
        'text-sm text-muted-foreground border border-border/60 rounded-md px-4 py-3',
        TONE_CLASSES[tone],
        italic && 'italic',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
