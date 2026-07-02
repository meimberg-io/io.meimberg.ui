import type {HTMLAttributes} from 'react'
import {cn} from '../lib/cn'

export type PillProps = HTMLAttributes<HTMLSpanElement>

/**
 * Pulse-Pill-Atom — generische Pill-Geometrie für Counter, Status-Label,
 * Badges. Nutzt die `.pill`-Utility aus globals.css (inline-flex, rounded-full,
 * gap-1, py-0.5 px-2, 12 px / 16 px Typo, 1 px Border).
 *
 * Tone/Color wird via className am Call-Site (oder über höhere Molecules wie
 * `Tag` / `StatusPill`) bestimmt — `Pill` selbst ist farbneutral.
 *
 * Klickbar = nicht hier. Für interaktive Pills siehe `Chip`.
 *
 * @example
 *   <Pill className="bg-muted text-muted-foreground border-transparent">12</Pill>
 */
export function Pill({className, ...rest}: PillProps) {
  return <span className={cn('pill', className)} {...rest} />
}
