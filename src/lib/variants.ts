// Gemeinsames Vokabular der Controls: eine Größen-Skala, semantische Töne,
// Breakpoints für `compactBelow` und der Icon-Komponenten-Typ.
//
// Die Klassen-Strings stehen hier als Literale, damit Tailwind sie beim Scan
// der Package-Quelle findet.

import type {ComponentType} from 'react'
import type {LucideProps} from 'lucide-react'
import type {IconSize} from '../atoms/Icon'

/** Control-Skala: xs 26 · sm 32 · md 36 · lg 40 px. */
export type ControlSize = 'xs' | 'sm' | 'md' | 'lg'

/** Semantische Farbe. `neutral` mappt auf die Grautöne (`--secondary`, `--surface-2`, `--muted-foreground`). */
export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'destructive'

/** Tailwind-Breakpoint für `compactBelow`; `none` = nie kompakt. */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'

/** Icon als Komponenten-Referenz (Lucide oder kompatibel); die Komponente setzt die Größe. */
export type IconComponent = ComponentType<LucideProps>

export interface ControlSizeSpec {
  /** Höhe in px. */
  px: number
  /** Tailwind-Höhenklasse. */
  height: string
  /** Quadrat derselben Höhe (Icon-only-Controls). */
  square: string
  /** Typografie-Rolle. */
  text: string
  /** Icon-Größe auf der `Icon`-Skala. */
  icon: IconSize
  /** Icon-Größe als Klasse für verschachtelte SVGs. */
  iconClass: string
}

export const CONTROL_SIZE: Record<ControlSize, ControlSizeSpec> = {
  xs: {px: 26, height: 'h-6.5', square: 'size-6.5', text: 'caption', icon: 'xs', iconClass: '[&_svg]:size-3'},
  sm: {px: 32, height: 'h-8', square: 'size-8', text: 'body-sm', icon: 'sm', iconClass: '[&_svg]:size-3.5'},
  md: {px: 36, height: 'h-9', square: 'size-9', text: 'body', icon: 'md', iconClass: '[&_svg]:size-4'},
  lg: {px: 40, height: 'h-10', square: 'size-10', text: 'body', icon: 'md', iconClass: '[&_svg]:size-4'},
}

/** Sichtbarkeit eines Labels mit `compactBelow`: unterhalb des Breakpoints ausgeblendet. */
export const SHOW_FROM: Record<Breakpoint, string> = {
  sm: 'hidden sm:inline-flex',
  md: 'hidden md:inline-flex',
  lg: 'hidden lg:inline-flex',
  xl: 'hidden xl:inline-flex',
  '2xl': 'hidden 2xl:inline-flex',
  none: 'inline-flex',
}
