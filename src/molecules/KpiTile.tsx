// PUL-361 · Konsolidierte KpiTile — eine Atom-Variante fuer alle KPI-Surfaces
// (Context-Dashboard, Missions-Liste, Mission-Detail). Loest die Page-lokale
// Missions-Variante (`app/(app)/missions/components/KpiTile.tsx`) ab.
//
// API-Design:
//   • `value: string | number` — Strings fuer Surfaces, die formatierte Werte
//     reichen (z. B. `'12h'`, `'87 %'`).
//   • `sparklineValues` und `delta` sind optional — Missions-Surfaces zeigen
//     keine Deltas; ContextKpiStrip nutzt beide; Mission-Detail nur Sparkline.
//   • `icon` rendert in einem 20px Tone-Chip oben links (Missions-Pattern).
//   • `accent` ist ein freier ReactNode-Slot in einem Tone-Chip oben links;
//     ueberschreibt `icon` wenn beide gesetzt sind.
//   • `tone` steuert Sparkline-, Delta- und Chip-Farbe semantisch.
//   • `variant: 'default' | 'emphasis' | 'muted'` ersetzt die alten
//     emphasis/muted-Booleans (kann nicht beides gleichzeitig sein).
//
// Drift-Schutz: die App-ESLint-Config (`no-restricted-imports`) blockt jeden
// KpiTile-Import-Pfad ausserhalb `@meimberg/ui` — siehe app/eslint.config.mjs.

import type {HTMLAttributes, ReactNode} from 'react'
import {Sparkline} from '../atoms/Sparkline'
import {ArrowDown, ArrowRight, ArrowUp} from '../atoms/icons'
import {cn} from '../lib/cn'

export type KpiTone = 'neutral' | 'success' | 'warn' | 'danger'
export type KpiVariant = 'default' | 'emphasis' | 'muted'

export interface KpiDelta {
  /** Signed delta (positiv/negativ/0). */
  value: number
  direction: 'up' | 'down' | 'flat'
  /**
   * True wenn der Wert eine Verbesserung darstellt — steuert Farbe.
   * Default: `direction === 'up'`. Explizit setzen wenn „weniger Ueberfaellige"
   * gut ist (`isPositive: true` bei `direction: 'down'`).
   */
  isPositive?: boolean
}

export interface KpiTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  sublabel?: string
  /** Sparkline-Werte, idealerweise ≤14. Bei <2 Werten oder `undefined` → kein Sparkline. */
  sparklineValues?: number[]
  delta?: KpiDelta
  tone?: KpiTone
  /** Icon-Slot — rendert in einem 20px Tone-Chip oben links. */
  icon?: ReactNode
  /** Free-form ReactNode-Slot im Tone-Chip oben links — ueberschreibt `icon`. */
  accent?: ReactNode
  variant?: KpiVariant
}

const TONE_TEXT: Record<KpiTone, string> = {
  neutral: 'text-foreground',
  success: 'text-success',
  warn: 'text-warning',
  danger: 'text-destructive',
}

const TONE_SPARK: Record<KpiTone, string> = {
  neutral: 'text-foreground/40',
  success: 'text-success',
  warn: 'text-warning',
  danger: 'text-destructive',
}

const TONE_CHIP: Record<KpiTone, string> = {
  neutral: 'bg-muted text-foreground',
  success: 'bg-success/15 text-success',
  warn: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/15 text-destructive',
}

export function KpiTile({
  label,
  value,
  sublabel,
  sparklineValues,
  delta,
  tone = 'neutral',
  icon,
  accent,
  variant = 'default',
  className,
  ...rest
}: KpiTileProps) {
  const chip = accent ?? icon
  const isMuted = variant === 'muted'
  const isEmphasis = variant === 'emphasis'
  const showSpark =
    !isMuted && sparklineValues !== undefined && sparklineValues.length >= 2
  return (
    <div
      data-testid="kpi-tile"
      data-tone={tone}
      data-variant={variant}
      className={cn(
        'rounded-lg border border-border bg-card p-4 flex flex-col gap-2',
        isEmphasis && 'ring-1 ring-success/30',
        className,
      )}
      {...rest}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {chip && (
            <span
              aria-hidden
              className={cn(
                'inline-flex items-center justify-center rounded-md shrink-0 size-5',
                TONE_CHIP[tone],
              )}
            >
              {chip}
            </span>
          )}
          <div
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate"
            title={label}
          >
            {label}
          </div>
        </div>
        {showSpark && (
          <Sparkline
            values={sparklineValues!}
            width={70}
            height={28}
            className={cn('shrink-0', TONE_SPARK[tone])}
          />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'text-3xl font-semibold tabular-nums leading-none',
            isMuted ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {value}
        </span>
        {sublabel && (
          <span className="text-sm text-muted-foreground truncate">{sublabel}</span>
        )}
      </div>
      {delta && <DeltaRow delta={delta} tone={tone} />}
    </div>
  )
}

function DeltaRow({delta, tone}: {delta: KpiDelta; tone: KpiTone}) {
  if (delta.direction === 'flat' && delta.value === 0) {
    return (
      <div
        className="text-xs text-muted-foreground/60 tabular-nums"
        data-testid="kpi-tile-delta"
      >
        — vs. letzte Woche
      </div>
    )
  }
  const Arrow =
    delta.direction === 'up' ? ArrowUp : delta.direction === 'down' ? ArrowDown : ArrowRight
  const isPositive = delta.isPositive ?? delta.direction === 'up'
  const colorClass = isPositive
    ? 'text-success'
    : delta.direction === 'flat'
    ? 'text-muted-foreground/60'
    : 'text-destructive'
  // Tone-Override: getintete Tiles (success/warn/danger) tragen ihren Tile-Tone
  // statt der Delta-Heuristik — Pfeil-Richtung kommuniziert weiterhin Up/Down.
  const visualClass = tone === 'neutral' ? colorClass : TONE_TEXT[tone]
  const sign = delta.value > 0 ? '+' : ''
  return (
    <div
      className={cn('flex items-center gap-1 text-xs tabular-nums', visualClass)}
      data-testid="kpi-tile-delta"
    >
      <Arrow className="size-3" />
      <span>
        {sign}
        {delta.value}
      </span>
      <span className="text-muted-foreground">vs. letzte Woche</span>
    </div>
  )
}
