'use client'

// KpiTile — a single KPI with optional sparkline, delta and icon chip.
//
// API notes:
//   • `value: string | number` — strings for pre-formatted values
//     (e.g. `'12h'`, `'87 %'`).
//   • `sparklineValues` and `delta` are optional and independent.
//   • `icon` (component reference, rendered at 12 px) sits in a 20px tone chip
//     top-left; `accent` is a free ReactNode slot in the same chip and wins
//     over `icon`.
//   • No test ids are wired: `data-*`/`aria-*` pass through to the root; the
//     delta row carries `data-slot="delta"`.
//   • `tone` drives sparkline, delta and chip colour semantically.
//   • `variant` replaces separate emphasis/muted booleans (mutually exclusive).
//   • The delta's comparison text (`labels.comparison`) names the reference
//     period; the component itself has no notion of which period that is.

import type {HTMLAttributes, ReactNode} from 'react'
import {Sparkline} from '../atoms/Sparkline'
import {ArrowDown, ArrowRight, ArrowUp} from '../atoms/icons'
import {cn} from '../lib/cn'
import type {IconComponent, Tone} from '../lib/variants'
import {useLabels} from '../i18n/context'

export type KpiTone = Extract<Tone, 'neutral' | 'success' | 'warning' | 'destructive'>
export type KpiVariant = 'default' | 'emphasis' | 'muted'

export interface KpiDelta {
  /** Signed delta (positive/negative/0). */
  value: number
  direction: 'up' | 'down' | 'flat'
  /**
   * True if the change is an improvement — drives the colour.
   * Default: `direction === 'up'`. Set explicitly when "less" is good
   * (`isPositive: true` with `direction: 'down'`).
   */
  isPositive?: boolean
}

export interface KpiTileLabels {
  /** Reference text after the delta, e.g. "vs. previous period". */
  comparison: string
}

const defaultLabels: KpiTileLabels = {
  comparison: 'vs. previous period',
}

export interface KpiTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  sublabel?: string
  /** Sparkline values, ideally ≤14. Fewer than 2 values or `undefined` → no sparkline. */
  sparklineValues?: number[]
  delta?: KpiDelta
  tone?: KpiTone
  /** Icon — rendered at 12 px in a 20px tone chip top-left. */
  icon?: IconComponent
  /** Free-form ReactNode slot in the tone chip top-left — overrides `icon`. */
  accent?: ReactNode
  variant?: KpiVariant
  labels?: Partial<KpiTileLabels>
}

const TONE_TEXT: Record<KpiTone, string> = {
  neutral: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

const TONE_SPARK: Record<KpiTone, string> = {
  neutral: 'text-foreground/40',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

const TONE_CHIP: Record<KpiTone, string> = {
  neutral: 'bg-muted text-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/15 text-destructive',
}

export function KpiTile({
  label,
  value,
  sublabel,
  sparklineValues,
  delta,
  tone = 'neutral',
  icon: IconCmp,
  accent,
  variant = 'default',
  className,
  labels,
  ...rest
}: KpiTileProps) {
  const l = useLabels('kpiTile', defaultLabels, labels)
  const chip = accent ?? (IconCmp ? <IconCmp className="size-3" /> : null)
  const isMuted = variant === 'muted'
  const isEmphasis = variant === 'emphasis'
  const showSpark =
    !isMuted && sparklineValues !== undefined && sparklineValues.length >= 2
  return (
    <div
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
      {delta && <DeltaRow delta={delta} tone={tone} comparison={l.comparison} />}
    </div>
  )
}

function DeltaRow({
  delta,
  tone,
  comparison,
}: {
  delta: KpiDelta
  tone: KpiTone
  comparison: string
}) {
  if (delta.direction === 'flat' && delta.value === 0) {
    return (
      <div
        className="text-xs text-muted-foreground/60 tabular-nums"
        data-slot="delta"
      >
        — {comparison}
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
  // Tinted tiles (success/warning/destructive) keep their tile tone instead of the
  // delta heuristic — the arrow still communicates up/down.
  const visualClass = tone === 'neutral' ? colorClass : TONE_TEXT[tone]
  const sign = delta.value > 0 ? '+' : ''
  return (
    <div
      className={cn('flex items-center gap-1 text-xs tabular-nums', visualClass)}
      data-slot="delta"
    >
      <Arrow className="size-3" />
      <span>
        {sign}
        {delta.value}
      </span>
      <span className="text-muted-foreground">{comparison}</span>
    </div>
  )
}
