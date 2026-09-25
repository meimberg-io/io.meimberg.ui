// FilterBar — der Karten-Rahmen der Listen-Filterleisten. `bg-card`-Karte mit 1,5-px-Border, `shadow-card`,
// `p-3`; die Controls (Select-Pills, Chips, SearchInput `size="xs"`) kommen
// als children und stehen in einer umbrechenden Flex-Reihe. `below` rendert
// eine Zeile unter der Karte im selben Margin-Block (z. B. aktive Filter-Chips).

import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Controls der Leiste. */
  children: ReactNode
  /** CSS-Farbe der 1,5-px-Border (z. B. ein aktiver Kontext-Tint). Default `--border`. */
  tint?: string | null
  /** Zeile unter der Karte (aktive Filter-Chips). */
  below?: ReactNode
  /** Zusatz-Klassen für die Karte, gemerged auf `flex flex-wrap items-center gap-x-3 gap-y-2`. */
  contentClassName?: string
}

export function FilterBar({children, tint, below, contentClassName, className, ...rest}: FilterBarProps) {
  return (
    <div className={cn('mb-5', className)} {...rest}>
      <div
        data-slot="content"
        className={cn(
          'flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border-[1.5px] border-border bg-card p-3 shadow-card transition-colors',
          contentClassName,
        )}
        // Der Tint ist eine Laufzeit-Farbe (z. B. aus Daten) — als Klasse nicht ausdrückbar.
        style={tint ? {borderColor: tint} : undefined}
      >
        {children}
      </div>
      {below}
    </div>
  )
}
