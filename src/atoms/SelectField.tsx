'use client'

// SelectField — generisches Single-Select für pure Text-Options, Standard-
// Form-Baustein. ESLint blockt `from '../ui/select'`-Imports außerhalb dieser
// Datei.
//
// Aufbau: dünner Wrapper um shadcn-<Select> (= Radix-Select), Trigger gestyled
// passend zum Input-Look. Zwei Größen: `md` (40px, FormField-Default) und
// `sm` (32px, für Filter-Bars / Inline-Toolbars).
//
// Hinweis: `SelectField` ist **nicht** Teil der Pill-Compound-Familie
// (`Dropdown`). Pill-Trigger sind klein, border-bündig, gehören in Filter-Bars
// und Editor-Property-Bars. Form-Felder brauchen Input-Look mit voller Breite
// + h-10/h-8 — andere visuelle Sprache. Beide laufen technisch auf Radix
// Select, geteilt wird das Primitive, nicht die Optik.
//
// API-Entscheidungen:
// - Kein `allowClear`-Prop. Wer eine "Keine"-Option braucht, setzt sie selbst
//   als reguläre Option mit Sentinel-Value (z. B. `'none'`).
// - Width via `className` oder Container — `size` steuert nur die Höhe.

import type {ReactNode} from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {cn} from '../lib/cn'
import {useFormFieldId} from '../molecules/FormField'

export interface SelectFieldOption<T extends string> {
  value: T
  label: ReactNode
  disabled?: boolean
}

interface Props<T extends string> {
  value: T | null
  options: ReadonlyArray<SelectFieldOption<T>>
  onChange: (value: T) => void
  placeholder?: ReactNode
  disabled?: boolean
  /** `'md'` (40px, FormField-Default) oder `'sm'` (32px, Filter-Bars). */
  size?: 'sm' | 'md'
  className?: string
  'data-testid'?: string
}

export function SelectField<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  disabled,
  size = 'md',
  className,
  'data-testid': testId,
}: Props<T>) {
  // Auto-Id aus FormField-Context (für `<label htmlFor>`).
  const contextId = useFormFieldId()
  // Radix-Select akzeptiert nur Strings — bei null lassen wir es undefined,
  // damit das Placeholder gerendert wird.
  const triggerClass = size === 'sm' ? 'h-8 rounded-md text-sm' : 'h-10 rounded-md'

  return (
    <Select
      value={value ?? undefined}
      onValueChange={v => onChange(v as T)}
      disabled={disabled}
    >
      {/* `focus-ring` greift auch auf `[data-state="open"]` (Radix-Trigger). */}
      <SelectTrigger
        id={contextId}
        className={cn('focus-ring', triggerClass, className)}
        data-testid={testId}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
