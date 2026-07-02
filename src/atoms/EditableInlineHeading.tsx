'use client'

import {useState, type KeyboardEvent, type ReactNode} from 'react'
import {cn} from '../lib/cn'
import {IconButton} from '../ui/icon-button'
import {TextField} from './TextField'
import {SaveIcon, CancelIcon, EditIcon} from '../ui/action-icons'

const SIZE_CLASSES = {
  'heading-2': 'heading-2 font-semibold',
  'heading-3': 'heading-3',
} as const

export interface EditableInlineHeadingProps {
  /** Aktueller Wert (Display + Ausgangspunkt fürs Editieren). */
  value: string
  /** Wird mit dem getrimmten neuen Wert aufgerufen, wenn der User speichert. */
  onSave: (next: string) => void
  /** Optionaler Callback beim Abbrechen (Escape / Cancel-Button). */
  onCancel?: () => void
  placeholder?: string
  /** Typo-Größe des Headings. Default `heading-2`. */
  size?: keyof typeof SIZE_CLASSES
  /** `true` → `<textarea>` (Umbruch langer Titel); Default `false` → `<input>`. */
  multiline?: boolean
  /** Extra-Buttons im Display-Mode rechts neben dem Edit-Trigger (z. B. Reset). */
  displayActions?: ReactNode
}

/**
 * Pulse-EditableInlineHeading — präsentationsloser Inline-Title-Editor:
 * Display-Mode (Wert + Edit-Trigger + optionale `displayActions`) → Edit-Mode
 * (`<input>`/`<textarea>` mit expliziten Save/Cancel-Buttons). Enter speichert,
 * Escape verwirft, Auto-Focus beim Einstieg.
 *
 * Bündelt die zwei divergent gebauten Inline-Title-Editoren (PUL-414 § G2a-B5,
 * Inbox + Signal). **Domain-frei** — Persistenz/Override-Logik bleibt im
 * Call-Site (Feature-Wrapper).
 *
 * @example
 *   <EditableInlineHeading value={title} onSave={persist} />
 */
export function EditableInlineHeading({
  value,
  onSave,
  onCancel,
  placeholder,
  size = 'heading-2',
  multiline = false,
  displayActions,
}: EditableInlineHeadingProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const startEdit = () => {
    setDraft(value)
    setEditing(true)
  }
  const save = () => {
    setEditing(false)
    onSave(draft.trim())
  }
  const cancel = () => {
    setEditing(false)
    setDraft(value)
    onCancel?.()
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !(multiline && e.shiftKey)) {
      e.preventDefault()
      save()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  if (editing) {
    const fieldClass = cn('flex-1 min-w-0', SIZE_CLASSES[size])
    return (
      <span className="inline-flex w-full items-center gap-1.5">
        {multiline ? (
          <TextField
            as="textarea"
            autoFocus
            rows={1}
            value={draft}
            placeholder={placeholder}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(fieldClass, 'resize-none')}
          />
        ) : (
          <TextField
            autoFocus
            value={draft}
            placeholder={placeholder}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className={fieldClass}
          />
        )}
        <IconButton variant="success" size="sm" onClick={save} aria-label="Speichern" title="Speichern (Enter)">
          <SaveIcon aria-hidden="true" />
        </IconButton>
        <IconButton variant="destructive" size="sm" onClick={cancel} aria-label="Abbrechen" title="Abbrechen (Esc)">
          <CancelIcon aria-hidden="true" />
        </IconButton>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={SIZE_CLASSES[size]}>{value || placeholder}</span>
      <IconButton variant="muted" size="sm" onClick={startEdit} aria-label="Titel bearbeiten" title="Titel bearbeiten">
        <EditIcon aria-hidden="true" />
      </IconButton>
      {displayActions}
    </span>
  )
}
