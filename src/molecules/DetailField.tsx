'use client'

// DetailField — Definition-Zeile für Detail-Dialoge: feste Label-Spalte +
// Wert-Slot. Ersetzt das bisher je Detail-Dialog einkopierte lokale `FieldRow`
// (AccountDetailDialog, RoutingTargetDetailDialog). Read-Display-Pendant zu
// `FormField` (das die editierbaren Form-Inputs mit Label/Hint/Error trägt).
// Der Wert-Slot ist bewusst frei: Text, Badge, Select oder Fehler-Block.

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

interface Props {
  /** Label in der linken Spalte (Caption, muted). */
  label: ReactNode
  /** Wert-Slot rechts — Text, Badge, Select, Fehler-Block o. Ä. */
  children: ReactNode
  /** Vertikale Ausrichtung. `start` (default) für mehrzeilige Werte
   *  (Fehler-Blöcke, lange Identifier); `center` für einzeilige Zeilen. */
  align?: 'start' | 'center'
  className?: string
}

export function DetailField({label, children, align = 'start', className}: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-[140px_1fr] gap-3',
        align === 'center' ? 'items-center' : 'items-start',
        className,
      )}
    >
      <span className={cn('caption text-muted-foreground', align === 'start' && 'pt-1')}>
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
