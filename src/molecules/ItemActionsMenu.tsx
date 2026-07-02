'use client'

// PUL-413 (G1e): ItemActionsMenu — Pulse-Standard für „MoreVertical + Item-
// Aktionsmenü"-Pattern auf Item-Reihen / Cards. Konsolidiert die bisher
// identisch inline gebauten DropdownMenu-Frames in UnifiedItemRow (Garden)
// und SignalCard (Signals).
//
// Konsumenten geben **nur Menü-Inhalt** als children — typisch
// `<DropdownMenuItem>` / `<DropdownMenuSeparator>` / `<DropdownMenuSub>`
// (alle aus `@/components/ui/dropdown-menu` direkt importiert; diese
// Sub-Komponenten sind frei nutzbar, nur der Wrapper-Frame wandert in
// dieses Molecule).
//
// Trigger ist immer ein `<IconButton>` mit `<MoreVertical>`. Die
// `size`-Prop wird auf den IconButton durchgereicht.

import {type ReactNode} from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu'
import {IconButton} from '../ui/icon-button'
import {MoreVertical} from '../atoms/icons'

export interface ItemActionsMenuProps {
  /** Children sind die Menü-Inhalte (DropdownMenuItem, -Separator, -Sub).
   *  Import erfolgt direkt aus `@/components/ui/dropdown-menu`. */
  children: ReactNode
  /** Stabile Test-ID für E2E-Specs (z. B. `garden-row-actions`). */
  testId: string
  /** Trigger-Größe — `default` (size-8) oder `sm` (kompakter Icon-Slot).
   *  Default `default`. */
  size?: 'default' | 'sm'
  /** A11y-Label des Triggers. Default `Aktionen`. */
  ariaLabel?: string
  /** DropdownMenuContent-Alignment. Default `end` (rechtsbündig zum Trigger). */
  align?: 'start' | 'center' | 'end'
}

/**
 * Pulse-ItemActionsMenu — IconButton (MoreVertical) + DropdownMenu-Frame
 * für Item-Aktionsmenüs auf Item-Cards / -Reihen.
 *
 * @example
 *   <ItemActionsMenu testId="garden-row-actions">
 *     <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem onClick={onDelete} className="text-destructive">
 *       Delete
 *     </DropdownMenuItem>
 *   </ItemActionsMenu>
 */
export function ItemActionsMenu({
  children,
  testId,
  size = 'default',
  ariaLabel = 'Aktionen',
  align = 'end',
}: ItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size={size} aria-label={ariaLabel} data-testid={testId}>
          <MoreVertical />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
