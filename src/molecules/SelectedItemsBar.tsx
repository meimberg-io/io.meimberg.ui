'use client'

import type {ReactNode} from 'react'
import {Button} from '../atoms/Button'
import {CloseIcon} from '../atoms/icons'
import {useLabels} from '../i18n/context'

export interface SelectedItemsBarLabels {
  /** Prefix label on the left. */
  selected: string
  /** Text of the clear-all button. */
  clearAll: string
}

const defaultLabels: SelectedItemsBarLabels = {
  selected: 'Selected:',
  clearAll: 'Clear all',
}

export interface SelectedItemsBarProps {
  /** Prefix label on the left. Takes precedence over `labels.selected`. */
  label?: string
  /** Bulk-clear handler (renders the clear-all button on the right). */
  onClearAll: () => void
  /** Text of the clear-all button. Takes precedence over `labels.clearAll`. */
  clearLabel?: string
  /** The selected item chips/badges (content-agnostic). */
  children: ReactNode
  labels?: Partial<SelectedItemsBarLabels>
}

/**
 * SelectedItemsBar — "applied items bar" for multi-select surfaces:
 * prefix label + item slot (children) + clear-all button.
 *
 * Content-agnostic: the concrete item chips come as `children` from the call
 * site, so the molecule stays free of domain modules.
 *
 * @example
 *   <SelectedItemsBar onClearAll={clearAll}>
 *     {selected.map(t => <Pill key={t.id}>{t.name}</Pill>)}
 *   </SelectedItemsBar>
 */
export function SelectedItemsBar({
  label,
  onClearAll,
  clearLabel,
  children,
  labels,
}: SelectedItemsBarProps) {
  const l = useLabels('selectedItemsBar', defaultLabels, labels)
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <span className="caption text-muted-foreground">{label ?? l.selected}</span>
      {children}
      <Button type="button" variant="ghost" icon={CloseIcon} className="ml-auto" onClick={onClearAll}>
        {clearLabel ?? l.clearAll}
      </Button>
    </div>
  )
}
