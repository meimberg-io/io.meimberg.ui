'use client'

import * as React from 'react'
import { Label } from './label'

interface FieldProps {
  /** Label text. ReactNode to support inline decorations (asterisk, "(optional)" hints). */
  label: React.ReactNode
  /** Override the auto-generated input id (rare; only when the child isn't directly
   *  the input — e.g. when wrapped in a positioning <div>). */
  htmlFor?: string
  /** Helper text shown below the input. */
  description?: React.ReactNode
  /** Inline error text shown below the input. Overrides `description` when set. */
  error?: React.ReactNode
  /** Wrapper class — for `mb-…` or grid placement, not for the input itself. */
  className?: string
  /** The input / textarea element. ID will be injected via cloneElement when the
   *  child doesn't already carry one. For wrapper-around-input layouts, pass
   *  `htmlFor` explicitly and set the id on your input manually. */
  children: React.ReactNode
}

/**
 * MIPUL-275 — Shared Label↔Input wrapper.
 *
 * Hängt das `<Label>` und die geslotted `<Input>`/`<Textarea>` über `htmlFor`/`id`
 * automatisch zusammen. ID wird intern via `useId()` generiert. Damit greifen
 * `getByLabelText` in Component-Tests und Klick-auf-Label fokussiert das Input.
 *
 * Verwendung:
 * ```tsx
 * <Field label="Title">
 *   <Input value={title} onChange={...} />
 * </Field>
 * ```
 */
export function Field({
  label,
  htmlFor,
  description,
  error,
  className,
  children,
}: FieldProps) {
  const generatedId = React.useId()
  const id = htmlFor ?? generatedId

  // Wenn das Kind ein einzelnes Element ist und keine eigene `id` mitbringt,
  // klonen wir es mit der generierten `id`. Bei Wrapper-Layouts (z. B. <div>
  // mit relativem Positioning um das Input) übergibt der Caller stattdessen
  // `htmlFor` und setzt die `id` selbst auf das Input.
  const child =
    React.isValidElement(children) && (children.props as {id?: string}).id == null
      ? React.cloneElement(children as React.ReactElement<{id?: string}>, { id })
      : children

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{child}</div>
      {error ? (
        <p className="caption text-destructive mt-1">{error}</p>
      ) : description ? (
        <p className="caption text-muted-foreground mt-1">{description}</p>
      ) : null}
    </div>
  )
}
