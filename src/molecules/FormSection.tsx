'use client'

// PUL-352 · Form-Section — Mikro-Caps-Header mit Hairline-Trenner + Body.
// Standard-vertikaler-Abstand zwischen Sections steuert die FormDialog (via
// `gap-6`). Innerhalb der Section bleibt der Spacing-Default kompakt.

import type {ReactNode} from 'react'
import {cn} from '../lib/cn'

interface Props {
  /** Header-Text (wird automatisch UPPERCASE + tracking gerendert). */
  title: ReactNode
  /** Optionaler Beschreibungstext rechts neben Title in caption. */
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function FormSection({title, description, children, className}: Props) {
  return (
    <section className={cn('flex flex-col', className)}>
      <div className="dlg-section mb-3">
        <span>{title}</span>
        {description && (
          <span className="text-muted-foreground/70 font-normal normal-case tracking-normal">
            {description}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
