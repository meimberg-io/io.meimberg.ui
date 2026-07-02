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
 * Pulse-InfoBanner — kleine Inline-Hinweis-Box („Kein Inhalt", „Keine
 * Beschreibung", Empty-Hint) für Detail-Dialog-Bodies und Listen-Surfaces.
 *
 * Bündelt das in PUL-414 (G2a-B3 / G2b-D3 / G2b-T7) identifizierte Inline-
 * Hinweis-Box-Pattern. Abgrenzung zur `<EmptyState>`-Molecule: die ist der
 * große, zentrierte Section-/Page-Empty-State; InfoBanner ist die kleine,
 * fließende Hinweiszeile.
 *
 * @example
 *   <InfoBanner>Kein Inhalt.</InfoBanner>
 *   <InfoBanner tone="subtle" italic={false}>Keine weiteren Tags verfügbar.</InfoBanner>
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
