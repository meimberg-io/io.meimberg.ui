'use client'

// ItemActionsMenu — standard "MoreVertical + item actions" menu for item rows
// and cards.
//
// Consumers pass **only the menu content** as children — typically
// `<DropdownMenuItem>` / `<DropdownMenuSeparator>` / `<DropdownMenuSub>` from
// `ui/dropdown-menu`; only the trigger + content frame lives here.
//
// The trigger is always an `<IconButton>` with `<MoreVertical>`; `size`,
// `className` and `data-testid` are passed through to it.

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
  /** Trigger size on the control scale. Default `sm` (32 px). */
  size?: ControlSize
  /** Accessible label of the trigger. Takes precedence over `labels.trigger`. */
  ariaLabel?: string
  /** DropdownMenuContent alignment. Default `end` (right-aligned to the trigger). */
  align?: 'start' | 'center' | 'end'
  /** Extra classes for the trigger button. */
  className?: string
  /** Test id of the trigger (optional, e.g. `row-actions`). */
  'data-testid'?: string
  labels?: Partial<ItemActionsMenuLabels>
}

/**
 * ItemActionsMenu — IconButton (MoreVertical) + DropdownMenu frame for item
 * action menus on cards / rows.
 *
 * @example
 *   <ItemActionsMenu data-testid="row-actions">
 *     <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem onClick={onDelete} className="text-destructive">
 *       Delete
 *     </DropdownMenuItem>
 *   </ItemActionsMenu>
 */
export function ItemActionsMenu({
  children,
  size = 'sm',
  ariaLabel,
  align = 'end',
  className,
  'data-testid': testId,
  labels,
}: ItemActionsMenuProps) {
  const l = useLabels('itemActionsMenu', defaultLabels, labels)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton size={size} className={className} aria-label={ariaLabel ?? l.trigger} data-testid={testId}>
          <MoreVertical />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
