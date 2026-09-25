'use client'

// FormField — Label/Hint/Beschreibung/Slot/Fehler in einheitlichem Spacing.
// Konsumenten liefern das eigentliche Control als `children`.
//
// Label ↔ Control: Die Field-ID läuft auf zwei Wegen zum Control —
//   1. per Context (`useFormFieldId`), den die DS-Controls (TextField,
//      DatePicker, Select, …) lesen,
//   2. per `cloneElement`, wenn das einzige Kind ein Element ohne eigene `id`
//      ist und kein `htmlFor` gesetzt ist — damit funktionieren auch rohe
//      `<input>`/`<textarea>`/`ui/input`.
// Bringt das Kind eine eigene `id` mit, zeigt das Label darauf.

import {Children, Fragment, cloneElement, createContext, isValidElement, useContext, useId} from 'react'
import type {ReactElement, ReactNode} from 'react'
import {cn} from '../lib/cn'

interface FormFieldContextValue {
  id: string
}
const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/** Field-ID des umgebenden `<FormField>` — Controls setzen sie als `id`, wenn sie keine eigene haben. */
export function useFormFieldId(): string | undefined {
  return useContext(FormFieldContext)?.id
}

export interface FormFieldProps {
  /** Label-Text oder -Node. */
  label: ReactNode
  /** Kleiner Hint rechts vom Label (z. B. „(optional)"). */
  hint?: ReactNode
  /** Roter Stern hinter dem Label (per CSS, nicht im Accessible Name). */
  required?: boolean
  /** Fehlertext unter dem Control. */
  error?: ReactNode
  /** Beschreibung unter dem Label, über dem Control. */
  description?: ReactNode
  /** Das Control — i. d. R. ein DS-Control oder ein einzelnes `<input>`/`<textarea>`. */
  children: ReactNode
  className?: string
  /** Explizite Control-ID (wenn das Control tiefer verschachtelt ist). Sonst Kind-`id` oder `useId()`. */
  htmlFor?: string
}

type IdProps = {id?: string}

/** Das einzige Kind, wenn es ein echtes Element ist (kein Fragment, kein Text, keine Liste). */
function singleElement(children: ReactNode): ReactElement<IdProps> | null {
  if (Children.count(children) !== 1 || !isValidElement<IdProps>(children)) return null
  return children.type === Fragment ? null : children
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
}: FormFieldProps) {
  const autoId = useId()
  const child = singleElement(children)
  const childId = child?.props.id
  const id = htmlFor ?? childId ?? autoId
  // Mit explizitem `htmlFor` setzt der Caller die ID selbst (verschachteltes Control).
  const content = child && childId == null && htmlFor == null ? cloneElement(child, {id}) : children
  return (
    <FormFieldContext.Provider value={{id}}>
      <div className={cn('min-w-0', className)}>
        {/* Label-Text steht direkt als Kind — `getByLabelText('Title')`
         *  matcht gegen den textContent. Der Required-Stern läuft per
         *  CSS-`::after` (`form-field-required`), damit er nicht im
         *  Accessible Name landet. */}
        <label
          htmlFor={id}
          className={cn('caption text-muted-foreground mb-1.5 block', required && 'form-field-required')}
        >
          {label}
          {hint && <span className="ml-1.5 text-muted-foreground/70 font-normal">{hint}</span>}
        </label>
        {description && (
          <p className="caption text-muted-foreground/80 mb-1.5 leading-relaxed">{description}</p>
        )}
        {content}
        {error && <p className="caption text-destructive mt-1.5">{error}</p>}
      </div>
    </FormFieldContext.Provider>
  )
}
