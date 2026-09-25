'use client'

// SearchInput — Such-Eingabe mit Lupe, Clear-Button und optionalem Debounce.
//
// Größen:
//   • `lg` (Default, 40 px): umrandetes Formularfeld (`ui/input`).
//   • `xs` (26 px): randlose Filterleisten-Optik (ex Pulse `FilterSearch`) —
//     fügt sich in die 26-px-Reihe der Pills/Chips einer `FilterBar` ein,
//     `w-full md:w-[200px]`.
// Der Accessible Name ist der Placeholder, sofern kein `aria-label` kommt.

import {useEffect, useState, type ChangeEvent, type InputHTMLAttributes} from 'react'
import {Input} from '../ui/input'
import {IconButton} from './IconButton'
import {CloseIcon, Search} from './icons'
import {cn} from '../lib/cn'
import {useLabels} from '../i18n/context'

export interface SearchInputLabels {
  placeholder: string
  clear: string
}

const defaultLabels: SearchInputLabels = {
  placeholder: 'Search…',
  clear: 'Clear search',
}

export type SearchInputSize = 'xs' | 'lg'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size' | 'type' | 'placeholder'> {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  /** `lg` (Default) = umrandetes 40-px-Feld · `xs` = randlose 26-px-Filterleisten-Optik. */
  size?: SearchInputSize
  /** Verzögert `onChange` um n ms nach dem letzten Tastendruck. Default 0 (sofort). */
  debounceMs?: number
  labels?: Partial<SearchInputLabels>
  /** Klassen des Wrappers (Breite, Position). */
  className?: string
}

const WRAPPER: Record<SearchInputSize, string> = {
  xs: 'relative w-full md:w-[200px]',
  lg: 'relative flex-1 min-w-[200px] max-w-sm',
}

const ICON: Record<SearchInputSize, string> = {
  xs: 'left-3 size-3.5',
  lg: 'left-3 size-4',
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  size = 'lg',
  debounceMs = 0,
  labels,
  className,
  'aria-label': ariaLabel,
  ...rest
}: SearchInputProps) {
  const l = useLabels('searchInput', defaultLabels, labels)
  const [inner, setInner] = useState(value)
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setInner(value)
  }

  useEffect(() => {
    if (debounceMs <= 0) return
    if (inner === value) return
    const t = setTimeout(() => onChange(inner), debounceMs)
    return () => clearTimeout(t)
  }, [inner, debounceMs]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (next: string) => {
    setInner(next)
    if (debounceMs <= 0) onChange(next)
  }

  const placeholderText = placeholder ?? l.placeholder
  const inputProps = {
    ...rest,
    type: 'text',
    value: inner,
    onChange: (e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
    placeholder: placeholderText,
    'aria-label': ariaLabel ?? placeholderText,
  }

  return (
    <div className={cn(WRAPPER[size], className)} data-size={size}>
      <Search
        aria-hidden
        className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none', ICON[size])}
      />
      {size === 'xs' ? (
        <input
          {...inputProps}
          className="w-full h-6.5 body-sm bg-transparent rounded-md pl-9 pr-8 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-accent/30 transition-colors"
        />
      ) : (
        <Input {...inputProps} className="pl-9 pr-9" />
      )}
      {inner && (
        <IconButton
          size="xs"
          className={cn('absolute top-1/2 -translate-y-1/2', size === 'xs' ? 'right-0' : 'right-1.5')}
          onClick={() => handleChange('')}
          aria-label={l.clear}
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  )
}
