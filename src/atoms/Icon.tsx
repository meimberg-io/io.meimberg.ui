// Icon-Atom. Wrapper um Lucide mit einheitlicher Größen-Skala.
//
// Lucide-Icons werden separat via `@meimberg/ui/atoms/icons` re-exportiert
// (siehe icons.ts) — diese Datei enthält nur die `Icon`-Wrapper-Komponente.
//
// Call-Sites:
//   import { Icon } from '@meimberg/ui'
//   import { Folder } from './icons'
//   <Icon icon={Folder} size="md" />

import type { ComponentProps, SVGProps } from 'react'
import type { IconComponent } from '../lib/variants'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg'

export const ICON_PIXELS: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
}

export interface IconProps extends Omit<ComponentProps<'svg'>, 'children'> {
  /** Lucide-Icon (oder anderes SVG-Forwarding-Component) als Component-Reference. */
  icon: IconComponent
  /** Größen-Skala. Default: `md` (16 px). */
  size?: IconSize
}

/**
 * Icon-Wrapper. Einheitliche Größen-Skala (`xs`/`sm`/`md`/`lg`),
 * `currentColor` als Farbe (kann durch `text-*`-Klasse am Parent gesteuert
 * werden), `aria-hidden` per Default (rein dekorativ).
 *
 * @example
 *   import { Icon } from '@meimberg/ui'
 *   import { Folder } from '@meimberg/ui/atoms/icons'
 *   <Icon icon={Folder} size="md" />
 *   <Icon icon={Inbox} size="lg" className="text-primary" />
 */
export function Icon({ icon: Cmp, size = 'md', ...rest }: IconProps) {
  const px = ICON_PIXELS[size]
  return <Cmp width={px} height={px} aria-hidden {...(rest as SVGProps<SVGSVGElement>)} />
}
