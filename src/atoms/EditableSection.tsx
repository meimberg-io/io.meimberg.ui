'use client'

// PUL-386: EditableSection — Section-Header-Atom für Listen, die einen
// View-/Edit-Toggle haben. Liefert nur den Header (Titel + optional Subtitle,
// rechts: icon-only `+`-Button und icon-only Edit-Pencil-Toggle); die Liste
// selbst rendert der Caller. So bleibt der Atom rein präsentations-fokussiert
// — Daten-/Reorder-Logik gehört nicht in ein Atom.

import type {ReactNode} from 'react'
import {Pencil, Plus} from './icons'
import {Button} from '../ui/button'
import {cn} from '../lib/cn'

interface Props {
  title: ReactNode
  subtitle?: ReactNode
  /** Optional: nur rendern wenn `editing === false`. Wenn editing-Toggle leer,
   *  immer rendern. */
  onAdd?: () => void
  addLabel?: string
  /** Wenn gesetzt, wird der Edit-Pencil-Toggle gerendert. */
  editing?: boolean
  onToggleEdit?: () => void
  editLabel?: string
}

export function EditableSection({
  title,
  subtitle,
  onAdd,
  addLabel = 'Hinzufügen',
  editing = false,
  onToggleEdit,
  editLabel = 'Bearbeiten',
}: Props) {
  return (
    <header className="flex items-baseline justify-between mb-3">
      <div>
        {typeof title === 'string' ? (
          <h2 className="heading-3 text-foreground">{title}</h2>
        ) : (
          title
        )}
        {subtitle && (
          <p className="caption text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        {onAdd && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-8 w-8"
            onClick={onAdd}
            aria-label={addLabel}
            title={addLabel}
          >
            <Plus width={16} height={16} aria-hidden />
          </Button>
        )}
        {onToggleEdit && (
          <Button
            variant={editing ? 'default' : 'ghost'}
            size="icon"
            className={cn(
              'cursor-pointer h-8 w-8',
              editing ? '' : 'text-muted-foreground',
            )}
            onClick={onToggleEdit}
            aria-pressed={editing}
            aria-label={editLabel}
            title={editLabel}
          >
            <Pencil width={14} height={14} aria-hidden />
          </Button>
        )}
      </div>
    </header>
  )
}
