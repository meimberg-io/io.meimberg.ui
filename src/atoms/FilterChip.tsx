import type {HTMLAttributes, ReactNode} from 'react'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

export interface FilterChipLabels {
  /** a11y-Label des ✕-Buttons. */
  remove: string
}

const defaultLabels: FilterChipLabels = {
  remove: 'Remove filter',
}

/** FilterChip-Größen — sm (kompakt, z. B. Tag-Filter) / md (prominent). */
type FilterChipSize = 'sm' | 'md'

const SIZE_CLASSES: Record<FilterChipSize, string> = {
  sm: 'gap-1 px-2 py-0.5 caption',
  md: 'gap-2 px-3 py-1 body-sm',
}

const TONE_CLASSES = {
  /** Standard-Tint in der Primärfarbe. */
  primary: 'bg-primary/10 text-primary border border-primary/30',
  /** Kein eigener Tint — Call-Site liefert dynamische Farben via `className`
   *  (z. B. Tag-Vocab-Klassen). */
  custom: '',
} as const

export interface FilterChipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Optionaler Prefix vor dem Wert (z. B. „Project:"). */
  label?: ReactNode
  /** Remove-Handler — rendert den ✕-Button. */
  onRemove: () => void
  /** a11y-Label des ✕-Buttons. Überschreibt `labels.remove`. */
  ariaLabel?: string
  /** Größe entlang der geteilten Filter-Control-Achse. Default `sm`. */
  size?: FilterChipSize
  /**
   * Tönung. `primary` (Default) = Primär-Tint mit Border; `custom` = kein
   * Tint, Call-Site liefert Farben via `className` (dynamische Vocab-Tints).
   */
  tone?: keyof typeof TONE_CLASSES
  /** Der angezeigte Filter-Wert. */
  children: ReactNode
  labels?: Partial<FilterChipLabels>
}

/**
 * FilterChip — entfernbare Applied-Filter-Markierung (Label + Wert +
 * ✕-Remove). Größe an die geteilte `FilterPillSize`-Achse der Filter-Control-
 * Familie gekoppelt.
 *
 * Abgrenzung: `<Chip>` ist ein Toggle (aria-pressed), `<Pill>` passiv ohne
 * Interaktion — FilterChip ist „applied filter display + remove".
 *
 * @example
 *   <FilterChip size="md" label="Project:" onRemove={clear}>
 *     {project.name}
 *   </FilterChip>
 */
export function FilterChip({
  label,
  onRemove,
  ariaLabel,
  size = 'sm',
  tone = 'primary',
  className,
  children,
  labels,
  ...rest
}: FilterChipProps) {
  const l = useLabels('filterChip', defaultLabels, labels)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full',
        SIZE_CLASSES[size],
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {label != null && <span className="text-muted-foreground">{label}</span>}
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label={ariaLabel ?? l.remove}
        className="inline-flex items-center justify-center cursor-pointer hover:opacity-70"
        style={{lineHeight: 1}}
      >
        ✕
      </button>
    </span>
  )
}
