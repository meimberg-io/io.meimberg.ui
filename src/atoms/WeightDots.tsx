'use client'

// PUL-368: Mission-Weight als 5-Dots-Skala (1..5, Default 3). Ersetzt den
// alten −/+-Stepper (1..10). Domain-frei — Konsumenten geben Wert + onChange.
//
// Pulse-Tokens (bg-primary, bg-muted-foreground …) bleiben hier im Atom,
// damit die ESLint-Regel auf Pulse-Tokens ausserhalb von atoms/ greifen kann
// (R-07).

import {cn} from '../lib/cn'

export type WeightValue = 1 | 2 | 3 | 4 | 5

const VALUES: ReadonlyArray<WeightValue> = [1, 2, 3, 4, 5]

export interface WeightDotsProps {
  /** Aktueller Wert (1..5). */
  value: WeightValue
  /** Klick auf einen Dot → neuer Wert. Nicht aufgerufen wenn `readOnly`. */
  onChange?: (value: WeightValue) => void
  /** Read-only-Modus: keine Klick-Handler, kein Cursor-Pointer. */
  readOnly?: boolean
  /** Optionale Tailwind-Klassen für den äußeren Container. */
  className?: string
  /** A11y-Label für die gesamte Gruppe (z. B. „Gewicht für Mission X"). */
  'aria-label'?: string
}

/**
 * 5 Dots als Gewichts-Skala. Gefüllte Dots = aktueller Wert, ungefüllte =
 * Rest. Klick auf Dot `n` setzt den Wert auf `n`.
 *
 * - Filled-Tone: `bg-primary` (Pulse-Token).
 * - Empty-Tone: dezenter Border + transparenter Fill.
 * - Read-Only: deaktiviert Interaktion + Hover-Affordance.
 */
export function WeightDots({
  value,
  onChange,
  readOnly,
  className,
  'aria-label': ariaLabel,
}: WeightDotsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel ?? `Gewicht ${value} von 5`}
      className={cn('inline-flex items-center gap-1', className)}
      data-testid="weight-dots"
    >
      {VALUES.map(n => {
        const filled = n <= value
        const interactive = !readOnly && !!onChange
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`Gewicht ${n}`}
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
