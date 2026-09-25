'use client'

// SegmentedControl — Einfachauswahl aus 2+ Optionen mit gleitendem Thumb.
// Semantik: `radiogroup` mit `radio`-Segmenten und Roving Tabindex; ←/→
// (bzw. ↑/↓) wählen das vorige/nächste Segment (umlaufend), Home/End das
// erste/letzte.
//
// Größen: `lg` 40 px (Default, Formulare, volle Breite) · `xs` 26 px
// (Filterleisten, inhaltsbreit). Die Segmente sind gleich breit
// (`auto-cols-fr`), damit der Thumb über `--seg-count`/`--seg-index` per
// calc() positioniert werden kann — ohne JS-Maße.

import {useRef, type CSSProperties, type KeyboardEvent, type ReactNode} from 'react'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, type IconComponent} from '../lib/variants'
import {Icon} from './Icon'

export type SegmentedControlSize = 'xs' | 'lg'

export interface SegmentedControlOption<T extends string> {
  value: T
  /** Sichtbares Label; weglassen für Icon-only-Segmente (dann `ariaLabel` setzen). */
  label?: ReactNode
  /** Icon vor dem Label; die Komponente setzt die Größe. */
  icon?: IconComponent
  /** Accessible Name (und Tooltip bei Icon-only). */
  ariaLabel?: string
}

export interface SegmentedControlProps<T extends string> {
  value: T
  options: ReadonlyArray<SegmentedControlOption<T>>
  onChange: (next: T) => void
  /** `lg` 40 px (Default) · `xs` 26 px. */
  size?: SegmentedControlSize
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

// Thumb-Inset = Container-Padding (p-1 bzw. p-0.5), damit der Thumb bündig sitzt.
const SIZE_CLASS: Record<SegmentedControlSize, {root: string; thumb: string; segment: string}> = {
  lg: {
    root: cn('grid', CONTROL_SIZE.lg.height, 'rounded-lg p-1'),
    thumb: 'inset-y-1 left-1 w-[calc((100%-8px)/var(--seg-count))] rounded-md',
    segment: 'gap-2 rounded-md px-3 body-sm',
  },
  xs: {
    root: cn('inline-grid', CONTROL_SIZE.xs.height, 'rounded-md p-0.5'),
    thumb: 'inset-y-0.5 left-0.5 w-[calc((100%-4px)/var(--seg-count))] rounded-[4px]',
    segment: 'gap-1 rounded-[4px] px-2 caption',
  },
}

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown'])
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp'])

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  size = 'lg',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const selected = options.findIndex(o => o.value === value)
  const index = Math.max(0, selected)
  const s = SIZE_CLASS[size]
  const style = {'--seg-count': options.length, '--seg-index': index} as CSSProperties

  const select = (i: number) => {
    const opt = options[i]
    if (!opt) return
    refs.current[i]?.focus()
    if (opt.value !== value) onChange(opt.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1
    let next: number | null = null
    if (NEXT_KEYS.has(e.key)) next = index === last ? 0 : index + 1
    else if (PREV_KEYS.has(e.key)) next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    select(next)
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : onKeyDown}
      className={cn('relative grid-flow-col auto-cols-fr bg-surface-2', s.root, className)}
      style={style}
    >
      <span
        aria-hidden
        data-slot="thumb"
        className={cn(
          'absolute translate-x-[calc(var(--seg-index)*100%)] bg-card shadow-[var(--elev-card)] transition-transform duration-[250ms] ease-[cubic-bezier(0.4,1.2,0.5,1)]',
          s.thumb,
        )}
      />
      {options.map((opt, i) => {
        const on = i === selected
        const tabbable = i === index
        return (
          <button
            key={opt.value}
            ref={el => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={opt.ariaLabel}
            title={opt.label == null ? opt.ariaLabel : undefined}
            data-on={on}
            tabIndex={tabbable ? 0 : -1}
            disabled={disabled}
            onClick={() => select(i)}
            className={cn(
              'relative z-[1] flex min-w-0 cursor-pointer items-center justify-center whitespace-nowrap border-0 bg-transparent font-medium text-muted-foreground transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring data-[on=true]:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
              s.segment,
            )}
          >
            {opt.icon && <Icon icon={opt.icon} size={CONTROL_SIZE[size].icon} />}
            {opt.label != null && <span>{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
