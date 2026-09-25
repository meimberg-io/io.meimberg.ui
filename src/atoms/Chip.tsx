'use client'

// Chip — interaktive Pill in zwei Formen:
//   · Toggle (Default): `<button aria-pressed>` für Filter, Saved-Views,
//     Tab-artige Auswahlen; `active` tönt ihn im `tone`, `count` zeigt eine
//     Zahl rechts.
//   · Entfernbar (`onRemove`): `<span>` mit ✕-Button für angewendete Filter;
//     immer im `tone` getönt, `prefix` steht gedämpft vor dem Wert.
// Größen auf der Control-Skala: `xs` 26 px (Filterleisten, rounded-full),
// `sm` 32 px (Property-Bars neben Form-Triggern, rounded-md).
// `compactBelow` blendet das Label unterhalb des Breakpoints aus; Icon,
// Count und ✕ bleiben.
//
// Die Klassen-Strings stehen als Literale, damit Tailwind sie beim Scan der
// Package-Quelle findet.

import type {ButtonHTMLAttributes, HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, SHOW_FROM, type Breakpoint, type IconComponent, type Tone} from '../lib/variants'
import {useLabels} from '../i18n/context'
import {Icon} from './Icon'
import {CloseIcon} from './icons'

export type ChipSize = 'xs' | 'sm'

export interface ChipLabels {
  /** a11y-Label des ✕-Buttons. */
  remove: string
}

const defaultLabels: ChipLabels = {
  remove: 'Remove filter',
}

const SIZE_CLASS: Record<ChipSize, string> = {
  xs: cn(CONTROL_SIZE.xs.height, CONTROL_SIZE.xs.text, 'gap-1.5 rounded-full px-2.5'),
  sm: cn(CONTROL_SIZE.sm.height, CONTROL_SIZE.sm.text, 'gap-1.5 rounded-md px-2.5'),
}

/** Getönter Zustand: aktiver Toggle und entfernbarer Chip. */
const TINT_CLASS: Record<Tone, string> = {
  neutral: 'border-foreground/20 bg-secondary text-foreground',
  primary: 'border-primary/30 bg-primary/10 text-primary',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
  destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
}

const IDLE_CLASS = 'border-border text-muted-foreground hover:text-foreground hover:bg-accent/40'

interface ChipCommon {
  /** Farbe des getönten Zustands. Default `primary`. */
  tone?: Tone
  /** `xs` 26 px (Default) · `sm` 32 px. */
  size?: ChipSize
  /** Führendes Icon; der Chip setzt die Größe. */
  icon?: IconComponent
  /** Beliebiges führendes Visual (Dot, Glyph, Avatar) — Alternative zu `icon`. */
  leading?: ReactNode
  /**
   * Label unterhalb dieses Breakpoints ausblenden (Icon bleibt). Ein
   * String-Label wird dann zum `aria-label` (Toggle) bzw. `title`
   * (entfernbar); bei Nicht-String-Labels `aria-label` selbst setzen.
   */
  compactBelow?: Breakpoint
  className?: string
  children?: ReactNode
}

export type ChipToggleProps = ChipCommon &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'prefix'> & {
    /** Aktiver Toggle-Zustand (`aria-pressed`). */
    active?: boolean
    /** Zahl rechts neben dem Label. */
    count?: number
    onRemove?: undefined
    prefix?: undefined
    labels?: undefined
  }

export type ChipRemovableProps = ChipCommon &
  Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'prefix'> & {
    /** Rendert den ✕-Button. */
    onRemove: () => void
    /** Gedämpfter Prefix vor dem Wert (z. B. „Project:"). */
    prefix?: ReactNode
    labels?: Partial<ChipLabels>
    active?: undefined
    count?: undefined
  }

export type ChipProps = ChipToggleProps | ChipRemovableProps

function labelClass(compactBelow: Breakpoint | undefined): string | undefined {
  return compactBelow ? cn(SHOW_FROM[compactBelow], 'items-center gap-1') : undefined
}

/** Accessible Name, wenn das sichtbare Label ausgeblendet werden kann. */
function compactName(compactBelow: Breakpoint | undefined, children: ReactNode): string | undefined {
  return compactBelow && compactBelow !== 'none' && typeof children === 'string' ? children : undefined
}

function Leading({icon, leading, size}: Pick<ChipCommon, 'icon' | 'leading'> & {size: ChipSize}) {
  if (icon) return <Icon icon={icon} size={CONTROL_SIZE[size].icon} />
  return <>{leading}</>
}

export function Chip(props: ChipProps) {
  if (props.onRemove !== undefined) return <RemovableChip {...props} />
  return <ToggleChip {...props} />
}

function ToggleChip({
  tone = 'primary',
  size = 'xs',
  icon,
  leading,
  compactBelow,
  active = false,
  count,
  className,
  children,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: ChipToggleProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      aria-label={ariaLabel ?? compactName(compactBelow, children)}
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap border cursor-pointer transition-colors focus-ring',
        SIZE_CLASS[size],
        active ? TINT_CLASS[tone] : IDLE_CLASS,
        className,
      )}
      {...rest}
    >
      <Leading icon={icon} leading={leading} size={size} />
      {children != null && <span data-slot="label" className={labelClass(compactBelow)}>{children}</span>}
      {typeof count === 'number' && <span data-slot="count" className="caption tabular-nums opacity-80">{count}</span>}
    </button>
  )
}

function RemovableChip({
  tone = 'primary',
  size = 'xs',
  icon,
  leading,
  compactBelow,
  onRemove,
  prefix,
  labels,
  title,
  className,
  children,
  ...rest
}: ChipRemovableProps) {
  const l = useLabels('chip', defaultLabels, labels)
  return (
    <span
      title={title ?? compactName(compactBelow, children)}
      className={cn('inline-flex shrink-0 items-center whitespace-nowrap border', SIZE_CLASS[size], TINT_CLASS[tone], className)}
      {...rest}
    >
      <Leading icon={icon} leading={leading} size={size} />
      {(prefix != null || children != null) && (
        <span data-slot="label" className={cn('inline-flex items-center gap-1', labelClass(compactBelow))}>
          {prefix != null && <span className="text-muted-foreground">{prefix}</span>}
          {children}
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={l.remove}
        className="-mr-1 inline-flex items-center justify-center rounded-full p-0.5 cursor-pointer hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon icon={CloseIcon} size={CONTROL_SIZE[size].icon} />
      </button>
    </span>
  )
}
