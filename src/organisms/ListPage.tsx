// ListPage — Listen-Seite auf Basis von `Page`: Header → `intro` (KPI-Leiste,
// Shortcut-Tabs) → `FilterBar` → Liste (`children`). Die Filter-Slots gehen
// unverändert an die `FilterBar`, die damit ihre feste Reihenfolge behält;
// ohne einen der Slots `filters`/`view`/`search`/`filterActions` entfällt die
// Leiste ganz.
//
// Vertikaler Rhythmus: Header `mb-8` (PageHeader), Intro `mb-4`, FilterBar
// `mb-5` — wie die bestehenden Listen-Seiten.

import type {ReactNode} from 'react'
import {FilterBar} from '../molecules/FilterBar'
import {Page, type PageProps} from './Page'

export interface ListPageProps extends PageProps {
  /** Zwischen Header und Filterleiste, z. B. KPI-Leiste oder Shortcut-Tabs. */
  intro?: ReactNode
  /** FilterBar `filters`: Select-Pills (Filter, Sortierung), Chips. */
  filters?: ReactNode
  /** FilterBar `view`: Ansichts-Umschalter (`SegmentedControl size="xs"`). */
  view?: ReactNode
  /** FilterBar `search`: `SearchInput size="xs"`. */
  search?: ReactNode
  /** FilterBar `actions`: sekundäre Aktionen (`Button variant="ghost" size="xs"`). */
  filterActions?: ReactNode
  /** FilterBar `tint`. */
  filterTint?: string | null
  /** FilterBar `below`: Zeile unter der Leiste (aktive Filter-Chips). */
  filterBelow?: ReactNode
}

export function ListPage({
  intro,
  filters,
  view,
  search,
  filterActions,
  filterTint,
  filterBelow,
  children,
  ...page
}: ListPageProps) {
  const hasFilterBar = filters != null || view != null || search != null || filterActions != null
  return (
    <Page {...page}>
      {intro != null && <div data-slot="intro" className="mb-4">{intro}</div>}
      {hasFilterBar && (
        <FilterBar
          filters={filters}
          view={view}
          search={search}
          actions={filterActions}
          tint={filterTint}
          below={filterBelow}
        />
      )}
      {children}
    </Page>
  )
}
