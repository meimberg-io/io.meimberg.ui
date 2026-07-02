import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'
import {Pill} from './Pill'

const TONE_CLASSES = {
  muted: 'bg-surface-2 text-muted-foreground border-transparent',
  primary: 'bg-primary/10 text-primary border-transparent',
} as const

const SIZE_CLASSES = {
  // Default: erbt das `.pill`-Padding (py-0.5 px-2) aus globals.css.
  default: '',
  // Kompakt: für enge Slots (Sidebar-Menüitems, Group-Header-Inline-Counts).
  // `min-w-[20px] text-center` sorgt für stabile Tabular-Breite bei
  // einstelligen Werten — Spalten-Counts sollen nicht hin- und herzappeln.
  compact: 'px-1.5 min-w-[20px] text-center',
} as const

export interface CounterPillProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Visuelle Tönung.
   * - `muted` (Default) — neutrale Standard-Counter (Group-Header, Sidebar).
   * - `primary` — Hervorhebung (Pulse-Cyan), z. B. für Unread-Indikatoren.
   */
  tone?: keyof typeof TONE_CLASSES
  /**
   * Größenvariante.
   * - `default` (Default) — Standard-Counter (Group-Header).
   * - `compact` — schmaleres Padding + `min-w-[20px]`-Stabilisierung für
   *   enge Slots (Sidebar-Menüitem, Mini-Counter im Action-Strip).
   */
  size?: keyof typeof SIZE_CLASSES
  /** Counter-Wert oder kurzer Label-Text (z. B. `12`, `5 ungelesen`). */
  children: ReactNode
}

/**
 * Pulse-Counter-Pill — numerischer Badge mit konsistenter Tönung + Tabular-Nums.
 *
 * Bündelt das mehrfach inline-replicierte Counter-Pill-Pattern (Group-Header-
 * Anzahl, Sidebar-Unread-Count, Unread-Badge im Posteingang) aus PUL-413 G1b
 * in einem Atom. `<CounterPill>` setzt `font-medium tabular-nums border-
 * transparent` plus die ausgewählte Tone- + Size-Variante; rendert intern
 * über `<Pill>` (gleiche Pill-Geometrie aus `globals.css` `.pill`).
 *
 * Konsumenten geben **nur Layout-Klassen** am Call-Site (z. B. `ml-auto`,
 * `gap-1`). Tone und Size sind Props — kein direktes Tailwind-Override am
 * Call-Site (siehe `guidelines.md` § Style-Linie).
 *
 * @example
 *   // Standard-Group-Header-Counter:
 *   <CounterPill>{items.length}</CounterPill>
 *
 *   // Compact-Counter in Sidebar:
 *   <CounterPill className="ml-auto" size="compact">{count}</CounterPill>
 *
 *   // Brand-Counter mit Label:
 *   <CounterPill tone="primary">{unreadCount} ungelesen</CounterPill>
 */
export function CounterPill({
  tone = 'muted',
  size = 'default',
  className,
  children,
  ...rest
}: CounterPillProps) {
  return (
    <Pill
      className={cn(
        'font-medium tabular-nums',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Pill>
  )
}
