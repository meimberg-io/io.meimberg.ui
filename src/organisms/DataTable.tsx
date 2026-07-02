'use client'

// PUL-456 · DataTable — responsives Daten-Grid-Primitive. Auf `≥ md` eine
// klassische Tabelle (ui/table), auf `< md` pro Zeile eine Card mit Label:Wert-
// Liste. Generisch über Column-Definitionen, keine Domain-Kopplung — Konsumenten
// liefern `columns` + `rows` + `getRowKey`.
//
// Verbindliches Mobile-Muster „Tabellen → Stacked Cards" (guidelines.md §
// Responsive / Mobile). Das alte `ui/table` direkt für Daten-Grids zu nutzen ist
// damit Drift (PUL-461 flaggt es) — neue Daten-Tabellen laufen über dieses Primitive.

import type {ReactNode} from 'react'
import {useIsMobile} from '../hooks/use-mobile'
import {Card} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import {cn} from '../lib/cn'

export interface DataTableColumn<Row> {
  /** Stabiler Key der Spalte (React-key + Mobile-Card-Zeilen-key). */
  key: string
  /** Spaltenkopf (Desktop) + Default-Label in der Mobile-Card. */
  header: ReactNode
  /** Zellen-Renderer für eine Zeile. */
  cell: (row: Row) => ReactNode
  /** Abweichendes Label in der Mobile-Card (default: `header`). */
  cardLabel?: ReactNode
  /** Kein Label in der Mobile-Card, nur der Wert (z. B. Aktionen-Spalte). */
  hideOnCard?: boolean
  /** Optionale Klassen für `<TableHead>` (Desktop). */
  headerClassName?: string
  /** Optionale Klassen für `<TableCell>` (Desktop). */
  cellClassName?: string
}

interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[]
  rows: Row[]
  getRowKey: (row: Row) => string
  className?: string
}

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  className,
}: DataTableProps<Row>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {rows.map(row => (
          <Card key={getRowKey(row)} className="flex flex-col gap-2 p-4">
            {columns.map(col =>
              col.hideOnCard ? (
                <div key={col.key} className="flex justify-end">
                  {col.cell(row)}
                </div>
              ) : (
                <div key={col.key} className="flex items-start justify-between gap-3">
                  <span className="caption text-muted-foreground shrink-0">
                    {col.cardLabel ?? col.header}
                  </span>
                  <span className="body-sm min-w-0 text-right">{col.cell(row)}</span>
                </div>
              ),
            )}
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('bg-card rounded-lg border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key} className={col.headerClassName}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow key={getRowKey(row)}>
              {columns.map(col => (
                <TableCell key={col.key} className={col.cellClassName}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
