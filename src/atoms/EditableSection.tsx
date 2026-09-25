'use client'

// EditableSection — Section-Header-Atom für Listen, die einen
// View-/Edit-Toggle haben. Liefert nur den Header (Titel + optional Subtitle,
// rechts: icon-only `+`-Button und icon-only Edit-Pencil-Toggle); die Liste
// selbst rendert der Caller. So bleibt der Atom rein präsentations-fokussiert
// — Daten-/Reorder-Logik gehört nicht in ein Atom.

import type {ReactNode} from 'react'
import {Pencil, Plus} from './icons'
import {IconButton} from './IconButton'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

export interface EditableSectionLabels {
  add: string
  edit: string
}

const defaultLabels: EditableSectionLabels = {
  add: 'Add',
  edit: 'Edit',
}

export interface EditableSectionProps {
  title: ReactNode
  subtitle?: ReactNode
  /** Optional: nur rendern wenn `editing === false`. Wenn editing-Toggle leer,
   *  immer rendern. */
  onAdd?: () => void
  /** Überschreibt `labels.add`. */
  addLabel?: string
  /** Wenn gesetzt, wird der Edit-Pencil-Toggle gerendert. */
  editing?: boolean
  onToggleEdit?: () => void
  /** Überschreibt `labels.edit`. */
  editLabel?: string
  /** Extra-Klassen am Header (z. B. anderer Abstand als `mb-3`). */
  className?: string
  labels?: Partial<EditableSectionLabels>
}

export function EditableSection({
  title,
  subtitle,
  onAdd,
  addLabel,
  editing = false,
  onToggleEdit,
  editLabel,
  className,
  labels,
}: EditableSectionProps) {
  const l = useLabels('editableSection', defaultLabels, labels)
  const add = addLabel ?? l.add
  const edit = editLabel ?? l.edit
  return (
    <header className={cn('flex items-baseline justify-between mb-3', className)}>
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
          <IconButton variant="ghost" onClick={onAdd} aria-label={add} title={add}>
            <Plus aria-hidden />
          </IconButton>
        )}
        {onToggleEdit && (
          // Aktiv (Edit-Modus): Ton schon in Ruhe sichtbar (`ghost` +
          // `primary`), sonst gedämpft bis Hover.
          <IconButton
            variant={editing ? 'ghost' : 'quiet'}
            tone={editing ? 'primary' : 'neutral'}
            className={cn(editing && 'bg-primary/10')}
            onClick={onToggleEdit}
            aria-pressed={editing}
            aria-label={edit}
            title={edit}
          >
            <Pencil aria-hidden />
          </IconButton>
        )}
      </div>
    </header>
  )
}
