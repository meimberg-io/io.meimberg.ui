import type {ReactNode} from 'react'
import {Button} from '../ui/button'
import {CloseIcon} from '../ui/action-icons'

export interface SelectedItemsBarProps {
  /** Prefix-Label links. Default „Ausgewählt:". */
  label?: string
  /** Bulk-Clear-Handler (rendert den ClearAll-Button rechts). */
  onClearAll: () => void
  /** Beschriftung des ClearAll-Buttons. Default „Alle entfernen". */
  clearLabel?: string
  /** Die ausgewählten Item-Chips/Badges (content-agnostisch). */
  children: ReactNode
}

/**
 * Pulse-SelectedItemsBar — „applied items bar" für Multi-Select-Surfaces:
 * Prefix-Label + Item-Slot (children) + ClearAll-Button.
 *
 * Content-agnostisch: die konkreten Item-Chips (z. B. `<TagBadge>`) inkl. ihrer
 * Domain-Auflösung kommen als `children` vom Call-Site — die Molecule selbst
 * importiert keine Domain-Module. Bündelt das in PUL-414 (G2b-T2) identifizierte
 * Selection-Bar-Pattern aus tags-view.
 *
 * @example
 *   <SelectedItemsBar onClearAll={clearAll}>
 *     {selected.map(t => <TagBadge key={t.id} tag={t} onRemove={() => remove(t.id)} />)}
 *   </SelectedItemsBar>
 */
export function SelectedItemsBar({
  label = 'Ausgewählt:',
  onClearAll,
  clearLabel = 'Alle entfernen',
  children,
}: SelectedItemsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
      <span className="caption text-muted-foreground">{label}</span>
      {children}
      <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={onClearAll}>
        <CloseIcon /> {clearLabel}
      </Button>
    </div>
  )
}
