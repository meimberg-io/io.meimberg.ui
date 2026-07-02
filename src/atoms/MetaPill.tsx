import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'

const TONE_CLASSES = {
  muted: 'bg-surface-2 text-muted-foreground',
} as const

export interface MetaPillProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Optionaler führender Icon-Slot (z. B. Type-Icon, 12px). */
  icon?: ReactNode
  /**
   * Visuelle Tönung. Aktuell nur `muted` (Default) — als Prop angelegt, damit
   * spätere Tones (z. B. `accent`) ohne API-Bruch ergänzbar sind.
   */
  tone?: keyof typeof TONE_CLASSES
  /** Pill-Inhalt (Label, Counts, …). */
  children: ReactNode
}

/**
 * Pulse-MetaPill — kompakter Meta-Tag für Dialog-Header (Status-/Typ-Indikator,
 * Derived-Count). `rounded-md` Chip-Geometrie mit `bg-surface-2` + `caption` +
 * `text-muted-foreground`, optional ein führender Icon-Slot.
 *
 * Bündelt das in PUL-414 (G2a-B1) identifizierte Inline-Meta-Span-Pattern aus
 * InboxItemDetailDialog. Abgrenzung: `<Pill>` ist `rounded-full` (Pill-
 * Geometrie) und farbneutral; `<Chip>` ist ein interaktiver Toggle. MetaPill
 * ist `rounded-md` mit fixem Meta-Look, passiv.
 *
 * @example
 *   <MetaPill icon={<TaskIcon size={12} />}>Aufgabe</MetaPill>
 *   <MetaPill title="Aus diesem Item erzeugt">→ 3</MetaPill>
 */
export function MetaPill({tone = 'muted', icon, className, children, ...rest}: MetaPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 caption',
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  )
}
