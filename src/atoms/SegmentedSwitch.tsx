'use client'

// PUL-352 · Segmented-Switch mit gleitendem Thumb. Generische N-Optionen-
// Variante des v3-Mockups `type-seg` (Inbox/Task). Quelle:
// docs/frontend/redesign/source/v3/mission/Buckets.html § .type-seg.
//
// Thumb-Breite und -Position werden über CSS-Custom-Properties berechnet
// (`--seg-count`, `--seg-index`), damit dieselbe Klasse für 2, 3 oder mehr
// Optionen funktioniert — ohne JS-Maße.

import type {ReactNode} from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  /** Optional — weglassen für icon-only-Segmente (dann `ariaLabel` setzen). */
  label?: ReactNode
  icon?: ReactNode
  /** Optionaler a11y-Label-Override, falls `label` fehlt oder ein Icon ist. */
  ariaLabel?: string
}

interface Props<T extends string> {
  value: T
  options: ReadonlyArray<SegmentedOption<T>>
  onChange: (next: T) => void
  /** Komplette Komponente disabled rendern. */
  disabled?: boolean
}

export function SegmentedSwitch<T extends string>({value, options, onChange, disabled}: Props<T>) {
  const index = Math.max(0, options.findIndex(o => o.value === value))
  // PUL-420 (G5): Look inline in der Komponente (war `.type-seg*` in
  // globals.css). Inline-Style trägt die zwei CSS-Properties; der Thumb liest
  // `--seg-count`/`--seg-index` via calc() für Breite + Position.
  const style = {
    '--seg-count': options.length,
    '--seg-index': index,
  } as React.CSSProperties
  return (
    <div
      className="relative flex h-10 rounded-lg bg-surface-2 p-1"
      style={style}
      role="radiogroup"
      data-disabled={disabled || undefined}
    >
      <span
        className="absolute inset-y-1 rounded-md bg-card shadow-[var(--elev-card)] transition-transform duration-[250ms] ease-[cubic-bezier(0.4,1.2,0.5,1)]"
        style={{
          width: 'calc((100% - 8px) / var(--seg-count, 2))',
          transform: 'translateX(calc(var(--seg-index, 0) * 100%))',
        }}
        aria-hidden="true"
      />
      {options.map(opt => {
        const on = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={opt.ariaLabel}
            data-on={on}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className="relative z-[1] flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-0 bg-transparent px-3 text-[13px] font-medium text-muted-foreground transition-colors duration-150 data-[on=true]:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {opt.icon}
            {opt.label != null && <span>{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
