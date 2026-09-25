'use client'

// Avatar — Bild-oder-Initialen-Avatar. Baut auf `ui/avatar` (Radix): das Bild
// erscheint erst, wenn es geladen ist; bis dahin und bei Ladefehlern stehen
// die Initialen. `tone="auto"` färbt den Initialen-Hintergrund deterministisch
// aus `colorSeed` (Fallback `initials`), `primary`/`neutral` nutzen Tokens.
// Domain-Wrapper leiten die Initialen z. B. aus einem Org- oder User-Namen ab.
//
// Eigene Größen-Skala (dokumentierte Ausnahme zur Control-Skala):
// xs 20 · sm 24 · md 32 · lg 40 · xl 56 · 2xl 80 px.

import {Avatar as AvatarRoot, AvatarFallback, AvatarImage} from '../ui/avatar'
import {cn} from '../lib/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarShape = 'rounded' | 'circle'
export type AvatarTone = 'auto' | 'primary' | 'neutral'

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: 'size-5 caption',
  sm: 'size-6 caption',
  md: 'size-8 caption',
  lg: 'size-10 body',
  xl: 'size-14 body',
  '2xl': 'size-20 heading-2',
}

const SHAPE_CLASS: Record<AvatarShape, string> = {
  rounded: 'rounded-md',
  circle: 'rounded-full',
}

const TONE_CLASS: Record<AvatarTone, string> = {
  auto: '',
  primary: 'bg-primary/15 text-primary',
  neutral: 'bg-muted text-muted-foreground',
}

export interface AvatarProps {
  /** Bild-URL. Solange es lädt oder wenn es fehlschlägt: Initialen. */
  src?: string | null
  /** Initialen (1–2 Zeichen). Default `?`. */
  initials?: string
  /** Stabiler Hash-Input für die Hintergrundfarbe bei `tone="auto"`. Fallback `initials`. */
  colorSeed?: string | null
  /** Accessible Name (`role="img"`) und optionaler Tooltip. */
  label?: string
  /** Default `md` (32 px). */
  size?: AvatarSize
  /** Default `rounded`. */
  shape?: AvatarShape
  /** Farbe der Initialen-Fläche. Default `auto` (Hash-Farbe). */
  tone?: AvatarTone
  /** `label` als `title`-Tooltip. Default `true`. */
  showTitle?: boolean
  className?: string
}

/** Deterministischer 32-bit-Hash (FNV-1a) — stabil zwischen Renders/Sessions. */
function hashString(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

const HUE_RANGE = 360

/** Sättigung/Helligkeit konstant, damit jeder Hue lesbaren Kontrast zu weißer Schrift hat. */
function hashColors(key: string): {backgroundColor: string; color: string} {
  const hue = hashString(key) % HUE_RANGE
  return {backgroundColor: `hsl(${hue} 60% 45%)`, color: 'hsl(0 0% 100%)'}
}

export function Avatar({
  src,
  initials = '?',
  colorSeed,
  label,
  size = 'md',
  shape = 'rounded',
  tone = 'auto',
  showTitle = true,
  className,
}: AvatarProps) {
  return (
    <AvatarRoot
      role={label ? 'img' : undefined}
      aria-label={label}
      title={showTitle ? label : undefined}
      data-tone={tone}
      className={cn(
        'inline-flex items-center justify-center font-semibold select-none',
        SIZE_CLASS[size],
        SHAPE_CLASS[shape],
        className,
      )}
    >
      {src ? <AvatarImage src={src} alt="" className="object-cover" /> : null}
      <AvatarFallback
        className={cn(SHAPE_CLASS[shape], TONE_CLASS[tone])}
        style={tone === 'auto' ? hashColors(colorSeed || initials) : undefined}
      >
        {initials}
      </AvatarFallback>
    </AvatarRoot>
  )
}
