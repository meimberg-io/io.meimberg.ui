'use client'

import type { HTMLAttributes } from 'react'
import { Loader2 } from '../atoms/icons'
import { Button, type ButtonProps } from '../atoms/Button'
import { cn } from '../lib/cn'
import { useLabels } from '../i18n/context'

export interface FormActionsLabels {
  cancel: string
  save: string
  /** Screen-reader text of the save button while `busy`. */
  saving: string
}

const defaultLabels: FormActionsLabels = {
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving…',
}

type LabelledButtonProps = ButtonProps & { labels?: Partial<FormActionsLabels> }

export function CancelButton({ children, variant = 'outline', size = 'lg', type = 'button', labels, ...rest }: LabelledButtonProps) {
  const l = useLabels('formActions', defaultLabels, labels)
  return (
    <Button variant={variant} size={size} type={type} {...rest}>
      {children ?? l.cancel}
    </Button>
  )
}

export function SaveButton({ children, type = 'submit', tone = 'success', size = 'lg', busy, icon, labels, ...rest }: LabelledButtonProps) {
  const l = useLabels('formActions', defaultLabels, labels)
  return (
    <Button type={type} tone={tone} size={size} busy={busy} icon={busy ? Loader2 : icon} {...rest}>
      {busy ? <span className='sr-only'>{l.saving}</span> : (children ?? l.save)}
    </Button>
  )
}

export function FormActions({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-end gap-2', className)} {...rest}>
      {children}
    </div>
  )
}
