'use client'

import type {ButtonHTMLAttributes, ComponentType, ReactNode} from 'react'
import {Icon, type IconSize} from './Icon'
import type {LucideProps} from './icons'
import {cn} from '../lib/cn'

export type ChipSize = 'sm' | 'md'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Aktiver (Toggle-)Zustand. Steuert visuelle Hervorhebung + `aria-pressed`. */
  active?: boolean
  /** Optional: führendes Lucide-Icon. */
  icon?: ComponentType<LucideProps>
  /** Optional: trailing Counter (zeigt eine kleine `caption`-Zahl rechts). */
  count?: number
  /** Optional: Tonal-Klasse für aktiven Zustand. Default: primary. */
  activeClassName?: string
  /**
   * Größen-Variante (PUL-429):
   *   - `sm` (Default): `.pill`-Geometrie, rounded-full, ~24 px hoch, 12 px Font.
   *     Für Filter-Bars, Saved-Views, Tab-artige Auswahlen.
   *   - `md`: rounded-md, 32 px hoch, 14 px Font. Für Property-Bars in
   *     Editor-Surfaces (ActionItem-Detail-Dialog etc.), wo die Chip neben
   *     Form-Triggern (Dropdown/DatePicker/TagSelector size='sm' / `h-8`)
   *     sitzt und visuell zu denen aligned sein muss.
   *
   * Größenänderungen für ALLE Chips — hier. Wer eine dritte Größe braucht,
   * erweitert den Type, ändert nicht via className-Override.
   */
  size?: ChipSize
  children?: ReactNode
}

/**
 * Pulse-Chip-Atom — klickbare Toggle-Pill für Filter, Saved-Views, Tab-artige
 * Auswahlen. `cursor-pointer` ist **in der Komponente** verankert
 * (Regel `clickable-cursor-pointer`).
 *
 * Aktiver Zustand bekommt `aria-pressed="true"` plus visuelle Hervorhebung.
 *
 * @example
 *   <Chip active={view === 'today'} onClick={() => setView('today')}>
 *     Heute
 *   </Chip>
 *   <Chip icon={Flame} count={3} active>Brennt</Chip>
 *   <Chip size="md" icon={Check} active>Erledigt</Chip>
 */
export function Chip({
  active = false,
  icon,
  count,
  activeClassName,
  size = 'sm',
  className,
  children,
  type = 'button',
  ...rest
}: ChipProps) {
  // `sm` = `.pill` (rounded-full, py-0.5 px-2, 12px font) — Filter-Bar-Variante.
  // `md` = rounded-md, h-8 px-2.5, 14px font — Property-Bar-Variante (PUL-429).
  // Beide teilen den Toggle-/Hover-/Active-State.
  const sizeClass: string =
    size === 'md'
      ? 'inline-flex items-center gap-1.5 rounded-md border h-8 px-2.5 text-sm transition-colors'
      : 'pill transition-colors'
  const iconSize: IconSize = size === 'md' ? 'sm' : 'xs'
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        sizeClass,
        'cursor-pointer focus-ring',
        active
          ? cn('border-primary bg-primary/10 text-primary', activeClassName)
          : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent/40',
        className,
      )}
      {...rest}
    >
      {icon ? <Icon icon={icon} size={iconSize} /> : null}
      <span>{children}</span>
      {typeof count === 'number' ? (
        <span className="caption tabular-nums opacity-80">{count}</span>
      ) : null}
    </button>
  )
}
