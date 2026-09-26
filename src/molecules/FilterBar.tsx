// FilterBar — der Karten-Rahmen der Listen-Filterleisten. `bg-card`-Karte mit
// 1,5-px-Border, `shadow-card`, `p-3`. Die Controls kommen über feste Slots,
// damit die Reihenfolge nicht pro Seite neu erfunden wird:
//
//   filters → view → [ml-auto: search → actions]
//
// Jeder Slot ist eine eigene, umbrechende Gruppe (`data-slot`). Unter `md`
// bricht alles um; die Endgruppe mit Suche nimmt dann die volle Breite ein
// (`SearchInput size="xs"` ist dort `w-full`). `below` rendert eine Zeile
// unter der Karte im selben Margin-Block (z. B. aktive Filter-Chips).

import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Linke Gruppe: Filter und Sortierung als `Select variant="pill"`, an/aus-Filter als `Chip`. */
  filters?: ReactNode
  /** Ansichts-Umschalter nach den Filtern, z. B. `SegmentedControl size="xs"`. Nie für Sortierung. */
  view?: ReactNode
  /** Rechtsbündige Gruppe (`ml-auto`), zuerst: `SearchInput size="xs"`. */
  search?: ReactNode
  /** Rechts nach der Suche: sekundäre Aktionen, z. B. `Button variant="ghost" size="xs"`. */
  actions?: ReactNode
  /** CSS-Farbe der 1,5-px-Border (z. B. ein aktiver Kontext-Tint). Default `--border`. */
  tint?: string | null
  /** Zeile unter der Karte (aktive Filter-Chips). */
  below?: ReactNode
  /** Zusatz-Klassen für die Karte, gemerged auf `flex flex-wrap items-center gap-x-3 gap-y-2`. */
  contentClassName?: string
}

const GROUP = 'flex flex-wrap items-center gap-x-3 gap-y-2'

export function FilterBar({
  filters,
  view,
  search,
  actions,
  tint,
  below,
  contentClassName,
  className,
  ...rest
}: FilterBarProps) {
  const hasEnd = search != null || actions != null
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
        {filters != null && <div data-slot="filters" className={cn(GROUP, 'min-w-0')}>{filters}</div>}
        {view != null && <div data-slot="view" className="flex items-center">{view}</div>}
        {hasEnd && (
          <div data-slot="end" className={cn(GROUP, 'ml-auto', search != null && 'max-md:w-full')}>
            {search != null && <div data-slot="search" className="max-md:w-full">{search}</div>}
            {actions != null && <div data-slot="actions" className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
      </div>
      {below}
    </div>
  )
}
