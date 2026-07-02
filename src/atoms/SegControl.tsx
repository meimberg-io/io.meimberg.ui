'use client'

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

export interface SegControlOption<T extends string> {
  value: T
  label: ReactNode
  /** Optionales führendes Icon (z. B. Layout-Glyph für Display-Toggles). */
  icon?: ReactNode
  /** a11y-Label + Tooltip, v. a. wenn `label` icon-lastig/knapp ist. */
  ariaLabel?: string
}

interface Props<T extends string> {
  value: T
  options: ReadonlyArray<SegControlOption<T>>
  onChange: (next: T) => void
  className?: string
}

/**
 * Pulse-SegControl — kompakter Segmented-Switch im Button-Group-Stil
 * (`inline-flex rounded-md border overflow-hidden`, kein sliding-thumb) für
 * Sort-/Display-Toggles.
 *
 * Bündelt das in PUL-414 (G2b-T1) identifizierte Inline-Button-Group-Pattern
 * (SortToggle / DisplayToggle in tags-view). Abgrenzung zur
 * `<SegmentedSwitch>`-Molecule: die nutzt einen gleitenden Thumb (`.type-seg`-
 * CSS) und ist form-orientiert; SegControl ist die schlanke Button-Group.
 *
 * @example
 *   <SegControl
 *     value={sort}
 *     onChange={setSort}
 *     options={[{value: 'count', label: 'Häufigkeit'}, …]}
 *   />
 */
export function SegControl<T extends string>({value, options, onChange, className}: Props<T>) {
  return (
    <div
      role="radiogroup"
      className={cn('inline-flex rounded-md border border-border overflow-hidden caption', className)}
    >
      {options.map(o => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.ariaLabel}
            title={o.ariaLabel}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1.5 transition-colors cursor-pointer',
              on
                ? 'bg-accent text-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {o.icon}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
