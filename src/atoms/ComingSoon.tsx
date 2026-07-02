import type {HTMLAttributes} from 'react'
import {Icon} from './Icon'
import {Sparkles} from './icons'
import {cn} from '../lib/cn'

export interface ComingSoonProps extends HTMLAttributes<HTMLDivElement> {
  /** Sprechender Name des Dashlets („KPI-Strip", „Posteingang", „Throughput"). */
  label: string
  /**
   * Logischer Dashlet-Identifier. Wird als `data-dashlet`-Attribut gerendert.
   * Pilot-Tickets nutzen das später, um Platzhalter gezielt zu ersetzen
   * (und ggf. Lint-Regeln gegen unaufgelöste Platzhalter).
   */
  dashlet?: string
  /**
   * Aspect-Ratio für Höhen-Reservierung (`'16 / 9'`, `'video'`, etc.). Pilot-
   * Layouts bleiben damit auch ohne echte Daten korrekt. Default: keine
   * Reservierung — die Card nimmt nur ihren Inhalt ein.
   */
  aspectRatio?: string
}

/**
 * Pulse-ComingSoon-Atom — Platzhalter-Card im Look des echten Dashlets.
 * Wird in Pilot-Tickets (R-03 … R-06) eingesetzt, wenn der Dashlet
 * konzeptionell vorgesehen ist, aber das zugehörige Feature-Ticket
 * (F-01 … F-20) noch nicht grün ist.
 *
 * Sichtbar dezent (gestrichelter Rand + muted-foreground), aber im Layout
 * raumfüllend.
 *
 * @example
 *   <ComingSoon label="KPI-Strip" dashlet="context-kpi-strip" aspectRatio="16 / 5" />
 */
export function ComingSoon({
  label,
  dashlet,
  aspectRatio,
  className,
  style,
  ...rest
}: ComingSoonProps) {
  return (
    <div
      data-dashlet={dashlet}
      role="status"
      aria-label={`Kommt bald: ${label}`}
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
      <div className="caption">Kommt bald: {label}</div>
    </div>
  )
}
