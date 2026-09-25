'use client'

// Gewichts-Skala als Dots (1..max, Default-Max 5). Domain-frei — Konsumenten
// geben Wert + onChange.
//
// Die Farb-Tokens (bg-primary, bg-muted-foreground …) bleiben hier im Atom,
// damit die ESLint-Regel gegen Tokens ausserhalb von atoms/ greifen kann.

import type {HTMLAttributes} from 'react'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

const DEFAULT_MAX = 5

export interface WeightDotsLabels {
  /** Basis für die a11y-Labels: Gruppe „<label> 3 / 5", Dot „<label> 3". */
  label: string
}

const defaultLabels: WeightDotsLabels = {
  label: 'Weight',
}

export interface WeightDotsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Aktueller Wert (1..max). */
  value: number
  /** Anzahl der Dots. Default 5. */
  max?: number
  /** Klick auf einen Dot → neuer Wert. Nicht aufgerufen wenn `readOnly`. */
  onChange?: (value: number) => void
  /** Read-only-Modus: keine Klick-Handler, kein Cursor-Pointer. */
  readOnly?: boolean
  /** A11y-Label für die gesamte Gruppe (z. B. „Weight for project X"). Default aus `labels.label`. */
  'aria-label'?: string
  labels?: Partial<WeightDotsLabels>
}

/**
 * Dots als Gewichts-Skala. Gefüllte Dots = aktueller Wert, ungefüllte =
 * Rest. Klick auf Dot `n` setzt den Wert auf `n`.
 *
 * - Filled-Tone: `bg-primary`.
 * - Empty-Tone: dezenter Border + transparenter Fill.
 * - Read-Only: deaktiviert Interaktion + Hover-Affordance.
 */
export function WeightDots({
  value,
  max = DEFAULT_MAX,
  onChange,
  readOnly,
  className,
  'aria-label': ariaLabel,
  labels,
  ...rest
}: WeightDotsProps) {
  const l = useLabels('weightDots', defaultLabels, labels)
  const values = Array.from({length: max}, (_, i) => i + 1)
  return (
    <div
      role="group"
      {...rest}
      aria-label={ariaLabel ?? `${l.label} ${value} / ${max}`}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {values.map(n => {
        const filled = n <= value
        const interactive = !readOnly && !!onChange
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${l.label} ${n}`}
            disabled={!interactive}
            onClick={e => {
              e.stopPropagation()
              if (interactive) onChange(n)
            }}
            className={cn(
              'inline-flex items-center justify-center shrink-0',
              'h-3 w-3 rounded-full border transition-[background-color,border-color,transform] duration-150',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default disabled:opacity-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              filled
                ? 'bg-primary border-primary'
                : 'bg-transparent border-muted-foreground/40',
            )}
          />
        )
      })}
    </div>
  )
}
