'use client'

// PUL-352 · Help-Text-Stempel unter einer Form-Section („↗ Items werden auf
// INBOX eingeschränkt"). Pfeil-Prefix ist Teil der Bibliothek — Call-Sites
// liefern nur den Text, kein zusätzliches Affordanz-Glyph.

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
