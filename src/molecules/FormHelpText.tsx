'use client'

// Help text below a form section. The arrow prefix is part of the component —
// call sites pass only the text, no extra affordance glyph.

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

interface Props {
  children: ReactNode
  className?: string
}

export function FormHelpText({children, className}: Props) {
  return (
    <p className={cn('caption text-muted-foreground mt-2 leading-relaxed', className)}>
      <span aria-hidden="true" className="mr-1">↗</span>
      {children}
    </p>
  )
}
