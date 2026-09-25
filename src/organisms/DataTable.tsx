'use client'

// Responsive data grid. On `≥ md` a classic table (ui/table), on `< md` one
// card per row with a label:value list. Generic via column definitions —
// consumers pass `columns` + `rows` + `getRowKey`.
//
// This is the mobile pattern "tables → stacked cards": use it for data grids
// instead of `ui/table` directly.

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
  /** Stable column key (React key + mobile card row key). */
  key: string
  /** Column header (desktop) + default label in the mobile card. */
  header: ReactNode
  /** Cell renderer for a row. */
  cell: (row: Row) => ReactNode
  /** Different label in the mobile card (default: `header`). */
  cardLabel?: ReactNode
  /** No label in the mobile card, value only (e.g. an actions column). */
  hideOnCard?: boolean
  /** Optional classes for `<TableHead>` (desktop). */
  headerClassName?: string
  /** Optional classes for `<TableCell>` (desktop). */
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
