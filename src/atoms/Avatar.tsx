// PUL-462 (Schritt 7): Avatar — generischer Bild-oder-Initialen-Avatar mit
// deterministischer Hash-Hintergrundfarbe. Kern von OrgIcon (Domain-Wrapper
// bleibt in app/ und leitet Initialen aus dem Org-Label ab).

import {cn} from '../lib/cn'

const sizeMap = {
  xs: 'size-5 caption',
  sm: 'size-6 caption',
  md: 'size-8 caption',
  lg: 'size-10 body',
  xl: 'size-14 body',
}

export type AvatarSize = keyof typeof sizeMap

export interface AvatarProps {
  /** Public URL eines Bildes. Wenn gesetzt: Bild rendern statt Initialen. */
  src?: string | null
  /** Initialen (1–2 Zeichen), gezeigt wenn kein `src`. */
  initials?: string
  /**
   * Stabiler Hash-Input für die Hintergrundfarbe. Nur eine Hash-Quelle, kein
   * Identifier. Fallback: `initials`.
   */
  colorSeed?: string | null
  /** Accessible name + `alt` fürs Bild + optionaler Tooltip. */
  label?: string
  size?: AvatarSize
  className?: string
  showTitle?: boolean
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

/**
 * Deterministische Hintergrundfarbe aus Hash. HSL hält Sättigung/Helligkeit
 * konstant, sodass jeder Hue lesbaren Kontrast zu weißer Schrift hat.
 */
function colorsFromKey(key: string): {background: string; foreground: string} {
  const hue = hashString(key) % 360
  return {
    background: `hsl(${hue} 60% 45%)`,
    foreground: 'hsl(0 0% 100%)',
  }
}

export function Avatar({
  src,
  initials = '?',
  colorSeed,
  label,
  size = 'md',
  className,
  showTitle = true,
}: AvatarProps) {
  const colors = colorsFromKey(colorSeed || initials)

  return (
    <div
      title={showTitle ? label : undefined}
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md overflow-hidden shrink-0 font-semibold select-none',
        sizeMap[size],
        className,
      )}
      style={src ? undefined : {backgroundColor: colors.background, color: colors.foreground}}
    >
      {src ? (
        <img src={src} alt={label ?? ''} className='h-full w-full object-cover' />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
