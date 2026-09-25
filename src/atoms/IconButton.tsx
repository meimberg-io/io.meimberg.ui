'use client'

// IconButton — quadratischer Button nur mit Icon (als Kind). `variant`
// bestimmt, wann der Ton sichtbar wird: `quiet` ist in Ruhe gedämpft und
// zeigt den Ton erst bei Hover, `ghost` zeigt ihn schon in Ruhe.
// Box/Icon: xs 26/12 · sm 32/14 (Default) · md 36/16 · lg 40/16.

import type {ButtonHTMLAttributes, MouseEvent, Ref} from 'react'
import {cva} from 'class-variance-authority'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, type ControlSize} from '../lib/variants'
import type {ButtonTone} from './Button'

export type IconButtonVariant = 'quiet' | 'ghost'

const iconButtonCva = cva(
  // `pointer-coarse:min-h/w-tap` (44px) hebt die Trefferfläche NUR auf
  // Touch an; Desktop bleibt kompakt.
  'inline-flex items-center justify-center rounded-md transition-colors cursor-pointer pointer-coarse:min-h-tap pointer-coarse:min-w-tap disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {quiet: 'text-muted-foreground', ghost: ''},
      tone: {neutral: '', primary: '', success: '', destructive: ''},
      size: {
        xs: cn(CONTROL_SIZE.xs.square, CONTROL_SIZE.xs.iconClass),
        sm: cn(CONTROL_SIZE.sm.square, CONTROL_SIZE.sm.iconClass),
        md: cn(CONTROL_SIZE.md.square, CONTROL_SIZE.md.iconClass),
        lg: cn(CONTROL_SIZE.lg.square, CONTROL_SIZE.lg.iconClass),
      },
    },
    compoundVariants: [
      {variant: 'quiet', tone: 'neutral', class: 'hover:text-foreground hover:bg-foreground/10'},
      {variant: 'quiet', tone: 'primary', class: 'hover:text-primary hover:bg-primary/10'},
      {variant: 'quiet', tone: 'success', class: 'hover:text-success hover:bg-success/10'},
      {variant: 'quiet', tone: 'destructive', class: 'hover:text-destructive hover:bg-destructive/10'},
      {variant: 'ghost', tone: 'neutral', class: 'text-foreground hover:bg-accent hover:text-accent-foreground'},
      {variant: 'ghost', tone: 'primary', class: 'text-primary hover:bg-primary/10'},
      {variant: 'ghost', tone: 'success', class: 'text-success hover:bg-success/10'},
      {variant: 'ghost', tone: 'destructive', class: 'text-destructive hover:bg-destructive/10'},
    ],
  },
)

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `quiet` (Default): Ton erst bei Hover · `ghost`: Ton schon in Ruhe. */
  variant?: IconButtonVariant
  /** Farbe. Default `neutral`. */
  tone?: ButtonTone
  /** Box-Größe auf der Control-Skala. Default `sm` (32 px). */
  size?: ControlSize
  /** Laufende Aktion: `aria-busy`, Klicks ignoriert, Icon dreht. */
  busy?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({
  variant = 'quiet',
  tone = 'neutral',
  size = 'sm',
  busy = false,
  type = 'button',
  className,
  onClick,
  ...rest
}: IconButtonProps) {
  const handleClick = busy
    ? (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
    : onClick
  return (
    <button
      type={type}
      className={cn(iconButtonCva({variant, tone, size}), busy && '[&_svg]:animate-spin', className)}
      aria-busy={busy || undefined}
      data-busy={busy || undefined}
      onClick={handleClick}
      {...rest}
    />
  )
}
