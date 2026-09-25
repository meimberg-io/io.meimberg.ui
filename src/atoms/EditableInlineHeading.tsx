'use client'

import {useState, type FocusEvent, type KeyboardEvent, type ReactNode} from 'react'
import {cn} from '../lib/cn'
import {IconButton} from '../ui/icon-button'
import {TextField} from './TextField'
import {SaveIcon, CancelIcon, EditIcon} from '../ui/action-icons'
import {useLabels} from '../i18n/context'

export interface EditableInlineHeadingLabels {
  save: string
  /** Tooltip des Save-Buttons (mit Tastenkürzel). */
  saveHint: string
  cancel: string
  /** Tooltip des Cancel-Buttons (mit Tastenkürzel). */
  cancelHint: string
  edit: string
}

const defaultLabels: EditableInlineHeadingLabels = {
  save: 'Save',
  saveHint: 'Save (Enter)',
  cancel: 'Cancel',
  cancelHint: 'Cancel (Esc)',
  edit: 'Edit title',
}

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
  labels?: Partial<EditableInlineHeadingLabels>
}

/**
 * EditableInlineHeading — präsentationsloser Inline-Title-Editor:
 * Display-Mode (Wert + Edit-Trigger + optionale `displayActions`) → Edit-Mode
 * (`<input>`/`<textarea>` mit expliziten Save/Cancel-Buttons). In den Edit-Mode
 * führt sowohl ein Klick auf den Titel selbst als auch das Stift-Icon. Enter
 * speichert, Escape verwirft, Fokus-Verlust speichert ebenfalls, Auto-Focus
 * beim Einstieg.
 *
 * **Domain-frei** — Persistenz/Override-Logik bleibt im Call-Site.
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
  labels,
}: EditableInlineHeadingProps) {
  const l = useLabels('editableInlineHeading', defaultLabels, labels)
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
  // Fokus verlässt die Edit-Zeile (Klick irgendwo anders hin, Tab raus) →
  // speichern statt den Entwurf stillschweigend zu verlieren. Wandert der Fokus
  // innerhalb der Zeile (Save-/Cancel-Button), passiert hier nichts — die
  // Buttons erledigen das selbst.
  const handleBlur = (e: FocusEvent<HTMLSpanElement>) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    save()
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
      <span className="inline-flex w-full items-center gap-1.5" onBlur={handleBlur}>
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
        <IconButton variant="success" size="sm" onClick={save} aria-label={l.save} title={l.saveHint}>
          <SaveIcon aria-hidden="true" />
        </IconButton>
        <IconButton variant="destructive" size="sm" onClick={cancel} aria-label={l.cancel} title={l.cancelHint}>
          <CancelIcon aria-hidden="true" />
        </IconButton>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {/* Der Titel selbst ist der primäre Edit-Trigger; das Stift-Icon bleibt als
          sichtbare Affordanz daneben. Accessible Name des Text-Buttons ist der
          Titel — so liest ein Screenreader das Edit-Label nicht doppelt. */}
      <button
        type="button"
        onClick={startEdit}
        title={l.edit}
        className={cn(
          SIZE_CLASSES[size],
          '-mx-1 cursor-text rounded-sm px-1 text-left transition-colors hover:bg-muted/60',
        )}
      >
        {value || placeholder}
      </button>
      <IconButton variant="muted" size="sm" onClick={startEdit} aria-label={l.edit} title={l.edit}>
        <EditIcon aria-hidden="true" />
      </IconButton>
      {displayActions}
    </span>
  )
}
