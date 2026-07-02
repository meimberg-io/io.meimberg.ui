'use client'

// PUL-352 · Pulse-Input — vereinheitlichte Input-Komponente für das v3-
// Form-System. Eine Komponente für `<input>` UND `<textarea>` — nutzt die
// gleiche `.pulse-input` CSS-Klasse (40px Höhe, 1.5px Border, 8px Radius,
// Primary-Glow im Focus). Quelle: docs/frontend/redesign/source/v3/mission/
// Buckets.html § .pulse-input.
//
// PUL-352 Followup — `leadingIcon` / `trailingIcon` als Slots: das Padding-
// Adjustment wird inline gesetzt, damit der CSS-Cascade-Fight gegen `pl-9` /
// `pr-9` nicht mehr stattfindet. Konsumenten geben nur das Icon, die
// Geometrie regelt der Primitive.

import {forwardRef} from 'react'
import type {InputHTMLAttributes, ReactNode, TextareaHTMLAttributes} from 'react'
import {cn} from '../lib/cn'
import {useFormFieldId} from '../molecules/FormField'

type CommonProps = {
  /** Icon links im Input (nur für `as='input'`). Wird absolut positioniert
   *  und das `padding-left` des Inputs entsprechend erhöht. */
  leadingIcon?: ReactNode
  /** Icon rechts im Input (nur für `as='input'`). Wird absolut positioniert
   *  und das `padding-right` des Inputs entsprechend erhöht. */
  trailingIcon?: ReactNode
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & CommonProps & {as?: 'input'}
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {as: 'textarea'}

export type TextFieldProps = InputProps | TextareaProps

// Typguard, damit TS in den Branches die richtigen DOM-Attribute zulässt.
function isTextarea(props: TextFieldProps): props is TextareaProps {
  return props.as === 'textarea'
}

// Helper: `as`-Prop entfernen, damit es nicht auf dem DOM-Element landet.
function stripAs<T extends {as?: unknown}>(props: T): Omit<T, 'as'> {
  const {as: _omit, ...rest} = props
  void _omit
  return rest
}

// Icon-Slab-Breite: 14px-Icon (Lucide-Default in der FilterBar) + 12px
// Außenrand + 10px Innenabstand = 36px Padding. Reicht auch für 16px-Icons.
const ICON_SLAB = 36

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  function TextField(props, ref) {
    // PUL-353: Wenn der Konsument keine explizite `id` setzt, fallback auf
    // die Id, die `<FormField>` per Context liefert — damit das umgebende
    // `<label htmlFor>` auch auto-matched.
    const contextId = useFormFieldId()
    if (isTextarea(props)) {
      const {className, id: ownId, ...rest} = stripAs(props)
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={ownId ?? contextId}
          className={cn('field-shell focus-ring', className)}
          {...rest}
        />
      )
    }
    const {
      className,
      type = 'text',
      leadingIcon,
      trailingIcon,
      style: userStyle,
      id: ownId,
      ...rest
    } = stripAs(props) as InputProps

    const hasLeading = !!leadingIcon
    const hasTrailing = !!trailingIcon

    // Padding-Adjustment per inline style — schlägt jede `padding`-Regel aus
    // `.pulse-input` (egal in welchem Layer).
    const paddingStyle: React.CSSProperties = {}
    if (hasLeading) paddingStyle.paddingLeft = ICON_SLAB
    if (hasTrailing) paddingStyle.paddingRight = ICON_SLAB

    const inputEl = (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        id={ownId ?? contextId}
        className={cn('field-shell focus-ring', className)}
        style={{...paddingStyle, ...userStyle}}
        {...rest}
      />
    )

    if (!hasLeading && !hasTrailing) return inputEl

    return (
      <div className="relative w-full">
        {hasLeading && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none inline-flex items-center"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}
        {inputEl}
        {hasTrailing && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center"
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}
      </div>
    )
  },
)
