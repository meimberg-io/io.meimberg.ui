'use client'

// Button — Text-Button der Library. `variant` bestimmt die Form, `tone` die
// Farbe, `size` die Höhe (Control-Skala, default `md` = 36 px). `icon` ist
// ein führendes Icon als Komponenten-Referenz; der Button dimensioniert es.
// `busy` markiert eine laufende Aktion: Klicks werden ignoriert, das Icon
// dreht, die Disabled-Optik bleibt aus.

import type {ButtonHTMLAttributes, MouseEvent, Ref} from 'react'
import {Slot, Slottable} from '@radix-ui/react-slot'
import {cva} from 'class-variance-authority'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, type ControlSize, type IconComponent, type Tone} from '../lib/variants'

export type ButtonTone = Extract<Tone, 'primary' | 'neutral' | 'success' | 'destructive'>
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'

const buttonCva = cva(
  // `pointer-coarse:min-h-tap` (44px) hebt die Trefferfläche NUR auf
  // Touch-Geräten an — Desktop-Dichte (pointer:fine) bleibt unverändert.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors cursor-pointer pointer-coarse:min-h-tap disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {solid: '', outline: 'border bg-background', ghost: '', link: 'underline-offset-4 hover:underline'},
      tone: {primary: '', neutral: '', success: '', destructive: ''},
      size: {
        xs: cn(CONTROL_SIZE.xs.height, CONTROL_SIZE.xs.text, CONTROL_SIZE.xs.iconClass, 'gap-1.5 px-2.5'),
        sm: cn(CONTROL_SIZE.sm.height, CONTROL_SIZE.sm.text, CONTROL_SIZE.sm.iconClass, 'px-3'),
        md: cn(CONTROL_SIZE.md.height, CONTROL_SIZE.md.text, CONTROL_SIZE.md.iconClass, 'px-3'),
        lg: cn(CONTROL_SIZE.lg.height, CONTROL_SIZE.lg.text, CONTROL_SIZE.lg.iconClass, 'px-4 py-2'),
      },
    },
    compoundVariants: [
      {variant: 'solid', tone: 'primary', class: 'bg-primary text-primary-foreground hover:bg-primary/90'},
      {variant: 'solid', tone: 'neutral', class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'},
      {variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground hover:bg-success/90'},
      {variant: 'solid', tone: 'destructive', class: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'},
      {variant: 'outline', tone: 'neutral', class: 'border-input hover:bg-accent hover:text-accent-foreground'},
      {variant: 'outline', tone: 'primary', class: 'border-primary/30 text-primary hover:bg-primary/10'},
      {variant: 'outline', tone: 'success', class: 'border-success/30 text-success hover:bg-success/10'},
      {variant: 'outline', tone: 'destructive', class: 'border-destructive/30 text-destructive hover:bg-destructive/10'},
      {variant: 'ghost', tone: 'neutral', class: 'hover:bg-accent hover:text-accent-foreground'},
      {variant: 'ghost', tone: 'primary', class: 'text-primary hover:bg-primary/10'},
      {variant: 'ghost', tone: 'success', class: 'text-success hover:bg-success/10'},
      {variant: 'ghost', tone: 'destructive', class: 'text-destructive hover:bg-destructive/10'},
      {variant: 'link', tone: 'primary', class: 'text-primary'},
      {variant: 'link', tone: 'neutral', class: 'text-foreground'},
      {variant: 'link', tone: 'success', class: 'text-success'},
      {variant: 'link', tone: 'destructive', class: 'text-destructive'},
    ],
  },
)

export interface ButtonVariantOptions {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ControlSize
  className?: string
}

function defaultTone(variant: ButtonVariant): ButtonTone {
  return variant === 'solid' || variant === 'link' ? 'primary' : 'neutral'
}

/** Klassen des Buttons — für Elemente, die wie ein Button aussehen, aber keiner sind (z. B. Radix-Actions, Kalender-Navigation). */
export function buttonVariants({variant = 'solid', tone, size = 'md', className}: ButtonVariantOptions = {}): string {
  return cn(buttonCva({variant, tone: tone ?? defaultTone(variant), size}), className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visuelle Form. Default `solid`. */
  variant?: ButtonVariant
  /** Farbe. Default: `solid`/`link` → `primary`, `outline`/`ghost` → `neutral`. */
  tone?: ButtonTone
  /** Höhe auf der Control-Skala. Default `md` (36 px). */
  size?: ControlSize
  /** Führendes Icon; der Button setzt die Größe. */
  icon?: IconComponent
  /** Laufende Aktion: `aria-busy`, Klicks ignoriert, Icon dreht. */
  busy?: boolean
  /** Rendert das einzige Kind (z. B. einen Link) mit Button-Optik. */
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'solid',
  tone,
  size = 'md',
  icon: IconCmp,
  busy = false,
  asChild = false,
  className,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const handleClick = busy
    ? (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
    : onClick
  return (
    <Comp
      className={buttonVariants({variant, tone, size, className})}
      aria-busy={busy || undefined}
      data-busy={busy || undefined}
      onClick={handleClick}
      {...rest}
    >
      {IconCmp && <IconCmp aria-hidden className={cn(busy && 'animate-spin')} />}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}
