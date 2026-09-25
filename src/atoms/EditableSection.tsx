'use client'

// EditableSection — Section-Header-Atom für Listen, die einen
// View-/Edit-Toggle haben. Liefert nur den Header (Titel + optional Subtitle,
// rechts: icon-only `+`-Button und icon-only Edit-Pencil-Toggle); die Liste
// selbst rendert der Caller. So bleibt der Atom rein präsentations-fokussiert
// — Daten-/Reorder-Logik gehört nicht in ein Atom.

import type {ReactNode} from 'react'
import {Pencil, Plus} from './icons'
import {Button} from './Button'
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

interface Props {
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
  labels,
}: Props) {
  const l = useLabels('editableSection', defaultLabels, labels)
  const add = addLabel ?? l.add
  const edit = editLabel ?? l.edit
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
          <IconButton variant="ghost" onClick={onAdd} aria-label={add} title={add}>
            <Plus aria-hidden />
          </IconButton>
        )}
        {onToggleEdit && (
          <Button
            variant={editing ? 'solid' : 'ghost'}
            size="sm"
            icon={Pencil}
            className={cn('w-8 px-0', !editing && 'text-muted-foreground')}
            onClick={onToggleEdit}
            aria-pressed={editing}
            aria-label={edit}
            title={edit}
          />
        )}
      </div>
    </header>
  )
}
