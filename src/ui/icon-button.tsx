'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/cn'

const iconButtonVariants = cva(
  // PUL-456: `pointer-coarse:min-h/w-tap` (44px) hebt die Trefferfläche NUR auf
  // Touch an (sm/default size-8 = 32px → 44px-Floor); Desktop bleibt kompakt.
  'inline-flex items-center justify-center rounded-md transition-colors cursor-pointer pointer-coarse:min-h-tap pointer-coarse:min-w-tap disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        muted:
          'text-muted-foreground hover:text-foreground hover:bg-foreground/10',
        primary:
          'text-muted-foreground hover:text-primary hover:bg-primary/10',
        success:
          'text-muted-foreground hover:text-success hover:bg-success/10',
        destructive:
          'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
      },
      size: {
        sm: 'size-8 [&_svg]:size-3.5',
        default: 'size-8 [&_svg]:size-4',
        lg: 'size-10 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'muted',
      size: 'default',
    },
  }
)

const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & VariantProps<typeof iconButtonVariants>
>(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(iconButtonVariants({ variant, size, className }))}
    {...props}
  />
))
IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
