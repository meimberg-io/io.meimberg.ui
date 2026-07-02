'use client'

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { cn } from '../lib/cn'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CLASS: Record<Size, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: Size
  icon?: ReactNode
  iconBgClass?: string
  title: ReactNode
  description?: ReactNode
  headerAside?: ReactNode
  footer?: ReactNode
  className?: string
  children: ReactNode
}

export function DetailDialogWrapper({
  open,
  onOpenChange,
  size = 'md',
  icon,
  iconBgClass = 'bg-surface-2',
  title,
  description,
  headerAside,
  footer,
  className,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          SIZE_CLASS[size],
          'bg-card max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0',
          className,
        )}
      >
        <DialogHeader className='border-b border-border/40 px-6 pt-6 pb-4 pr-16'>
          <div className='flex items-start gap-3'>
            {icon && (
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-xl',
                  iconBgClass,
                )}
              >
                {icon}
              </div>
            )}
            <div className='min-w-0 flex-1'>
              <DialogTitle className='truncate'>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            {headerAside && <div className='shrink-0'>{headerAside}</div>}
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>{children}</div>

        {footer && (
          <DialogFooter className='border-t border-border/40 px-6 py-4'>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
