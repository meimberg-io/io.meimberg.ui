'use client'

// PUL-352 · Form-Field — Label/Hint/Slot/Error in einheitlichem Spacing.
// Konsumenten liefern den eigentlichen Input als `children`; wir kümmern uns
// um Label-Abstand (`mb-1.5`), Optional-Hint rechts neben Label, sowie
// Required-Marker und Error-Footer.
//
// PUL-353: `FormFieldContext` propagiert die generierte `id` an Children,
// damit `<label htmlFor>` ↔ `<input id>` auch ohne expliziten `htmlFor`-Prop
// auto-verknüpft werden (Voraussetzung für `getByLabelText` in Tests + a11y).
// Atoms wie `TextField` consumen den Context.

import {createContext, useContext, useId} from 'react'
import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

interface FormFieldContextValue {
  id: string
}
const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/** Atoms (TextField etc.) lesen die generierte Field-Id darüber, damit der
 *  `label htmlFor` auto-matched. Keine API-Erweiterung am Consumer nötig. */
export function useFormFieldId(): string | undefined {
  return useContext(FormFieldContext)?.id
}

interface Props {
  /** Label-Text oder -Node. */
  label: ReactNode
  /** Kleiner Hint rechts vom Label (z. B. "(optional)"). */
  hint?: ReactNode
  /** Wenn true: roter Stern hinter Label. */
  required?: boolean
  /** Wenn gesetzt: roter Footer-Text unter Children. */
  error?: ReactNode
  /** Beschreibungstext unter dem Label, über dem Slot (optional). */
  description?: ReactNode
  /** Slot — i.d.R. `<TextField>` / `<RichSelect>` / etc. */
  children: ReactNode
  className?: string
  /** Eigene id für a11y-Verknüpfung — sonst auto via useId. */
  htmlFor?: string
}

export function FormField({
  label,
  hint,
  required,
  error,
  description,
  children,
  className,
  htmlFor,
}: Props) {
  const autoId = useId()
  const id = htmlFor ?? autoId
  return (
    <FormFieldContext.Provider value={{id}}>
      <div className={cn('min-w-0', className)}>
        {/* Label-Text steht DIREKT als Children — testing-library's
         *  `getByLabelText('Title')` matched gegen den textContent.
         *  Required-Marker läuft per CSS-`::after` (siehe `.form-field-required`
         *  in globals.css), damit der Asterisk NICHT in textContent landet. */}
        <label
          htmlFor={id}
          className={cn(
            'caption text-muted-foreground mb-1.5 block',
            required && 'form-field-required',
          )}
        >
          {label}
          {hint && (
            <span className="ml-1.5 text-muted-foreground/70 font-normal">{hint}</span>
          )}
        </label>
        {description && (
          <p className="caption text-muted-foreground/80 mb-1.5 leading-relaxed">{description}</p>
        )}
        {children}
        {error && <p className="caption text-destructive mt-1.5">{error}</p>}
      </div>
    </FormFieldContext.Provider>
  )
}
