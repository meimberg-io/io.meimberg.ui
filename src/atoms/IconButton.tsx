'use client'

// IconButton — quadratischer Button nur mit Icon (als Kind). `variant`
// bestimmt die Form und wann der Ton sichtbar wird: `quiet` ist in Ruhe
// gedämpft und zeigt den Ton erst bei Hover, `ghost` zeigt ihn schon in Ruhe,
// `outline` hat einen Rahmen (Ton bei Hover), `solid` ist mit dem Ton gefüllt.
// `pressed` macht den Button zum Toggle: im Zustand „an" hält er den Ton auch
// in Ruhe.
// Box/Icon: xs 26/12 · sm 32/14 (Default) · md 36/16 · lg 40/16. Bewusst keine
// Zwischengrößen und kein Icon-Override — krumme Stufen waren die Drift-Quelle.

import type {ButtonHTMLAttributes, MouseEvent, Ref} from 'react'
import {Slot} from '@radix-ui/react-slot'
import {cva} from 'class-variance-authority'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, type ControlSize, type Tone} from '../lib/variants'

export type IconButtonVariant = 'quiet' | 'ghost' | 'outline' | 'solid'
export type IconButtonTone = Extract<Tone, 'neutral' | 'primary' | 'success' | 'warning' | 'destructive'>
export type IconButtonShape = 'rounded' | 'circle'

const iconButtonCva = cva(
  // `pointer-coarse:min-h/w-tap` (44px) hebt die Trefferfläche NUR auf
  // Touch an; Desktop bleibt kompakt.
  'inline-flex items-center justify-center transition-colors cursor-pointer pointer-coarse:min-h-tap pointer-coarse:min-w-tap disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        quiet: 'text-muted-foreground',
        ghost: '',
        outline: 'border border-border bg-card text-muted-foreground',
        solid: '',
      },
      tone: {neutral: '', primary: '', success: '', warning: '', destructive: ''},
      size: {
        xs: cn(CONTROL_SIZE.xs.square, CONTROL_SIZE.xs.iconClass),
        sm: cn(CONTROL_SIZE.sm.square, CONTROL_SIZE.sm.iconClass),
        md: cn(CONTROL_SIZE.md.square, CONTROL_SIZE.md.iconClass),
        lg: cn(CONTROL_SIZE.lg.square, CONTROL_SIZE.lg.iconClass),
      },
      shape: {rounded: 'rounded-md', circle: 'rounded-full'},
      pressed: {true: '', false: ''},
    },
    compoundVariants: [
      // Ruhe + Hover
      {variant: 'quiet', tone: 'neutral', class: 'hover:text-foreground hover:bg-foreground/10'},
      {variant: 'quiet', tone: 'primary', class: 'hover:text-primary hover:bg-primary/10'},
      {variant: 'quiet', tone: 'success', class: 'hover:text-success hover:bg-success/10'},
      {variant: 'quiet', tone: 'warning', class: 'hover:text-warning hover:bg-warning/10'},
      {variant: 'quiet', tone: 'destructive', class: 'hover:text-destructive hover:bg-destructive/10'},
      {variant: 'ghost', tone: 'neutral', class: 'text-foreground hover:bg-accent hover:text-accent-foreground'},
      {variant: 'ghost', tone: 'primary', class: 'text-primary hover:bg-primary/10'},
      {variant: 'ghost', tone: 'success', class: 'text-success hover:bg-success/10'},
      {variant: 'ghost', tone: 'warning', class: 'text-warning hover:bg-warning/10'},
      {variant: 'ghost', tone: 'destructive', class: 'text-destructive hover:bg-destructive/10'},
      {variant: 'outline', tone: 'neutral', class: 'hover:text-foreground hover:border-foreground/30 hover:bg-surface-2'},
      {variant: 'outline', tone: 'primary', class: 'hover:text-primary hover:border-primary/30 hover:bg-primary/10'},
      {variant: 'outline', tone: 'success', class: 'hover:text-success hover:border-success/30 hover:bg-success/10'},
      {variant: 'outline', tone: 'warning', class: 'hover:text-warning hover:border-warning/30 hover:bg-warning/10'},
      {variant: 'outline', tone: 'destructive', class: 'hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10'},
      {variant: 'solid', tone: 'neutral', class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'},
      {variant: 'solid', tone: 'primary', class: 'bg-primary text-primary-foreground hover:bg-primary/90'},
      {variant: 'solid', tone: 'success', class: 'bg-success text-success-foreground hover:bg-success/90'},
      {variant: 'solid', tone: 'warning', class: 'bg-warning text-warning-foreground hover:bg-warning/90'},
      {variant: 'solid', tone: 'destructive', class: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'},
      // Gedrückt: Ton auch in Ruhe. Steht nach den Ruhe-Klassen, damit
      // tailwind-merge die gedämpfte Ruhe-Farbe verdrängt.
      {variant: ['quiet', 'ghost'], tone: 'neutral', pressed: true, class: 'text-foreground bg-foreground/10'},
      {variant: ['quiet', 'ghost'], tone: 'primary', pressed: true, class: 'text-primary bg-primary/10'},
      {variant: ['quiet', 'ghost'], tone: 'success', pressed: true, class: 'text-success bg-success/10'},
      {variant: ['quiet', 'ghost'], tone: 'warning', pressed: true, class: 'text-warning bg-warning/10'},
      {variant: ['quiet', 'ghost'], tone: 'destructive', pressed: true, class: 'text-destructive bg-destructive/10'},
      {variant: 'outline', tone: 'neutral', pressed: true, class: 'text-foreground border-foreground/30 bg-surface-2'},
      {variant: 'outline', tone: 'primary', pressed: true, class: 'text-primary border-primary/30 bg-primary/10'},
      {variant: 'outline', tone: 'success', pressed: true, class: 'text-success border-success/30 bg-success/10'},
      {variant: 'outline', tone: 'warning', pressed: true, class: 'text-warning border-warning/30 bg-warning/10'},
      {variant: 'outline', tone: 'destructive', pressed: true, class: 'text-destructive border-destructive/30 bg-destructive/10'},
      {variant: 'solid', tone: 'neutral', pressed: true, class: 'inset-ring-2 inset-ring-secondary-foreground/20'},
      {variant: 'solid', tone: 'primary', pressed: true, class: 'inset-ring-2 inset-ring-primary-foreground/25'},
      {variant: 'solid', tone: 'success', pressed: true, class: 'inset-ring-2 inset-ring-success-foreground/25'},
      {variant: 'solid', tone: 'warning', pressed: true, class: 'inset-ring-2 inset-ring-warning-foreground/25'},
      {variant: 'solid', tone: 'destructive', pressed: true, class: 'inset-ring-2 inset-ring-destructive-foreground/25'},
    ],
  },
)

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `quiet` (Default): Ton erst bei Hover · `ghost`: Ton in Ruhe · `outline`: Rahmen, Ton bei Hover · `solid`: mit dem Ton gefüllt. */
  variant?: IconButtonVariant
  /** Farbe. Default `neutral`. */
  tone?: IconButtonTone
  /** Box-Größe auf der Control-Skala. Default `sm` (32 px). Keine Zwischengrößen. */
  size?: ControlSize
  /** Ecken: `rounded` (Default, `rounded-md`) oder `circle` (`rounded-full`). */
  shape?: IconButtonShape
  /**
   * Toggle-Zustand. Gesetzt → `aria-pressed` + `data-state="on|off"`; „an"
   * hält den Ton auch in Ruhe. Hover-Reveal-Wrapper sollten einen gedrückten
   * Button nicht verstecken — das entscheidet die Aufrufstelle (z. B. über
   * `data-state="on"`).
   */
  pressed?: boolean
  /** Laufende Aktion: `aria-busy`, Klicks ignoriert, Icon dreht. */
  busy?: boolean
  /** Rendert das einzige Kind (z. B. einen Link) mit IconButton-Optik. */
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({
  variant = 'quiet',
  tone = 'neutral',
  size = 'sm',
  shape = 'rounded',
  pressed,
  busy = false,
  asChild = false,
  type = 'button',
  className,
  onClick,
  ...rest
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const handleClick = busy
    ? (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()
    : onClick
  const isToggle = pressed !== undefined
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        iconButtonCva({variant, tone, size, shape, pressed: pressed ?? false}),
        busy && '[&_svg]:animate-spin',
        className,
      )}
      aria-pressed={isToggle ? pressed : undefined}
      data-state={isToggle ? (pressed ? 'on' : 'off') : undefined}
      aria-busy={busy || undefined}
      data-busy={busy || undefined}
      onClick={handleClick}
      {...rest}
    />
  )
}
