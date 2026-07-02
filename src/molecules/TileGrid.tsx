'use client'

// PUL-352 / PUL-462 · TileGrid — responsives Grid aus SelectableTiles.
// Generisch: Konsumenten liefern Tile-Definitionen inkl. `glyph`-Slot —
// keine domain-spezifische Hardcoded-Liste hier.

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'
import {SelectableTile} from './SelectableTile'

export interface TileDef<T extends string> {
  id: T
  label: ReactNode
  glyph: ReactNode
  glyphBackground?: string
  glyphColor?: string
  /** Wenn true: Tile gerendert, aber nicht klickbar (z. B. „in Vorbereitung"). */
  disabled?: boolean
  title?: string
  /** Pass-through Test-Hook (z. B. `bucket-provider-jira`). */
  testId?: string
}

interface Props<T extends string> {
  value: T | null
  options: ReadonlyArray<TileDef<T>>
  onChange: (next: T) => void
  /** Spaltenanzahl (default 3). */
  cols?: 2 | 3 | 4
  className?: string
}

// PUL-456: Mobile (< md) immer 2-spaltig, damit die Tiles auf 360px nicht
// auf ~97px gequetscht werden; ab md die gewünschte Spaltenzahl.
const COL_CLASS: Record<NonNullable<Props<string>['cols']>, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

export function TileGrid<T extends string>({
  value,
  options,
  onChange,
  cols = 3,
  className,
}: Props<T>) {
  return (
    <div className={cn('grid gap-2', COL_CLASS[cols], className)}>
      {options.map(opt => (
        <SelectableTile
          key={opt.id}
          label={opt.label}
          glyph={opt.glyph}
          glyphBackground={opt.glyphBackground}
          glyphColor={opt.glyphColor}
          active={opt.id === value}
          disabled={opt.disabled}
          title={opt.title}
          data-testid={opt.testId}
          onClick={() => onChange(opt.id)}
        />
      ))}
    </div>
  )
}
