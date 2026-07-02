'use client'

// PUL-352 · Form-Row — Grid-Wrapper für ein- oder mehrspaltige Layouts in
// einer Form-Section. `cols=1` → Block-Layout (Gap nach unten), `cols=2` →
// gleichbreite Spalten, beliebige Grid-Templates als String („1fr 240px",
// „auto 1fr auto").

import type {CSSProperties, ReactNode} from 'react'
import {cn} from '../lib/cn'

interface Props {
  /** Spalten-Definition: numerisch (`1`/`2`/...) oder rohe grid-template-
   *  columns-Value („1fr 240px"). */
  cols?: number | string
  /** Horizontaler Gap zwischen Spalten (default 12px = `gap-3`). */
  gap?: 1 | 2 | 3 | 4
  children: ReactNode
  className?: string
}

const GAP_CLASS: Record<NonNullable<Props['gap']>, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
}

export function FormRow({cols = 1, gap = 3, children, className}: Props) {
  const gapClass = GAP_CLASS[gap]
  // cols=1 → reines Block-Layout, kein Grid (und nichts zu kollabieren).
  if (typeof cols === 'number' && cols === 1) {
    return <div className={cn('flex flex-col', gapClass, className)}>{children}</div>
  }
  // PUL-456: Mehrspaltig → `form-row-grid`-Utility (1 Spalte < md, Desktop-
  // Template ab md aus `--form-row-cols`). Template numerisch oder roh ("1fr 240px").
  const template = typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols
  return (
    <div
      className={cn('form-row-grid items-start', gapClass, className)}
      style={{'--form-row-cols': template} as CSSProperties}
    >
      {children}
    </div>
  )
}
