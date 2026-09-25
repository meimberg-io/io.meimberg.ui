'use client'

// ItemActionsMenu — standard "MoreVertical + item actions" menu for item rows
// and cards.
//
// Consumers pass **only the menu content** as children — typically
// `<DropdownMenuItem>` / `<DropdownMenuSeparator>` / `<DropdownMenuSub>` from
// `ui/dropdown-menu`; only the trigger + content frame lives here.
//
// The trigger is always an `<IconButton>` with `<MoreVertical>`; `size` is
// passed through to it.

import {type ReactNode} from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu'
import {IconButton} from '../atoms/IconButton'
import type {ControlSize} from '../lib/variants'
import {MoreVertical} from '../atoms/icons'
import {useLabels} from '../i18n/context'

export interface ItemActionsMenuLabels {
  /** Accessible name of the trigger button. */
  trigger: string
}

const defaultLabels: ItemActionsMenuLabels = {
  trigger: 'Actions',
}

export interface ItemActionsMenuProps {
  /** Menu content (DropdownMenuItem, -Separator, -Sub) from `ui/dropdown-menu`. */
  children: ReactNode
  /** Stable test id of the trigger for E2E specs (e.g. `row-actions`). */
  testId: string
  /** Trigger size — `default` (size-8) or `sm` (compact icon slot).
   *  Default `default`. */
  size?: 'default' | 'sm'
  /** Accessible label of the trigger. Takes precedence over `labels.trigger`. */
  ariaLabel?: string
  /** DropdownMenuContent alignment. Default `end` (right-aligned to the trigger). */
  align?: 'start' | 'center' | 'end'
  labels?: Partial<ItemActionsMenuLabels>
}

// Both trigger sizes share the 32 px box of the control scale.
const TRIGGER_SIZE: Record<NonNullable<ItemActionsMenuProps['size']>, ControlSize> = {
  default: 'sm',
  sm: 'sm',
}

/**
 * ItemActionsMenu — IconButton (MoreVertical) + DropdownMenu frame for item
 * action menus on cards / rows.
 *
 * @example
 *   <ItemActionsMenu testId="row-actions">
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
  ariaLabel,
  align = 'end',
  labels,
}: ItemActionsMenuProps) {
  const l = useLabels('itemActionsMenu', defaultLabels, labels)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size={TRIGGER_SIZE[size]} aria-label={ariaLabel ?? l.trigger} data-testid={testId}>
          <MoreVertical />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
