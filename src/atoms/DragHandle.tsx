'use client'

// DragHandle — Griff für Drag-and-drop-Sortierung. Bewusst 24×32 px (hochkant,
// nicht quadratisch): der Griff sitzt neben Zeilen und soll schmal bleiben.
// Reicht alle Button-Props und die Ref durch, damit dnd-kit `listeners` und
// `attributes` per Spread anhängen kann.

import type {ButtonHTMLAttributes, Ref} from 'react'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'
import {GripVertical} from './icons'

export interface DragHandleLabels {
  /** A11y-Label des Griffs. */
  label: string
}

const defaultLabels: DragHandleLabels = {
  label: 'Drag to reorder',
}

export interface DragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  labels?: Partial<DragHandleLabels>
  ref?: Ref<HTMLButtonElement>
}

export function DragHandle({labels, className, type = 'button', ...rest}: DragHandleProps) {
  const l = useLabels('dragHandle', defaultLabels, labels)
  return (
    <button
      type={type}
      aria-label={l.label}
      className={cn(
        // `pointer-coarse:min-h/w-tap` (44px) hebt die Trefferfläche NUR auf
        // Touch an; `touch-none` verhindert, dass Touch-Drag die Seite scrollt.
        'inline-flex h-8 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:text-foreground cursor-grab active:cursor-grabbing touch-none pointer-coarse:min-h-tap pointer-coarse:min-w-tap outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
        className,
      )}
      {...rest}
    >
      <GripVertical aria-hidden className="size-3.5" />
    </button>
  )
}
