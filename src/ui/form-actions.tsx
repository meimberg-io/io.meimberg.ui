'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from './button'
import { cn } from '../lib/cn'

type ButtonProps = React.ComponentProps<typeof Button>

export const CancelButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function CancelButton({ children = 'Abbrechen', variant = 'outline', type = 'button', ...rest }, ref) {
    return (
      <Button ref={ref} variant={variant} type={type} {...rest}>
        {children}
      </Button>
    )
  }
)

type SaveButtonProps = ButtonProps & { loading?: boolean }

export const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  function SaveButton({ children = 'Speichern', type = 'submit', variant = 'success', loading, disabled, ...rest }, ref) {
    return (
      <Button ref={ref} type={type} variant={variant} disabled={disabled || loading} {...rest}>
        {loading ? <Loader2 className='size-4 animate-spin' aria-hidden='true' /> : children}
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
