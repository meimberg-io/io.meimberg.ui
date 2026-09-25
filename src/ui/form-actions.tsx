'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from './button'
import { cn } from '../lib/cn'
import { useLabels } from '../i18n/context'

export interface FormActionsLabels {
  cancel: string
  save: string
  /** Screen-reader text of the save button while `loading`. */
  saving: string
}

const defaultLabels: FormActionsLabels = {
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving…',
}

type ButtonProps = React.ComponentProps<typeof Button>
type LabelledButtonProps = ButtonProps & { labels?: Partial<FormActionsLabels> }

export const CancelButton = React.forwardRef<HTMLButtonElement, LabelledButtonProps>(
  function CancelButton({ children, variant = 'outline', type = 'button', labels, ...rest }, ref) {
    const l = useLabels('formActions', defaultLabels, labels)
    return (
      <Button ref={ref} variant={variant} type={type} {...rest}>
        {children ?? l.cancel}
      </Button>
    )
  }
)

type SaveButtonProps = LabelledButtonProps & { loading?: boolean }

export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  function SaveButton({ children, type = 'submit', variant = 'success', loading, disabled, labels, ...rest }, ref) {
    const l = useLabels('formActions', defaultLabels, labels)
    return (
      <Button ref={ref} type={type} variant={variant} disabled={disabled || loading} {...rest}>
        {loading ? (
          <>
            <Loader2 className='size-4 animate-spin' aria-hidden='true' />
            <span className='sr-only'>{l.saving}</span>
          </>
        ) : (
          children ?? l.save
        )}
      </Button>
    )
  }
)

export function FormActions({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-end gap-2', className)} {...rest}>
      {children}
    </div>
  )
}
