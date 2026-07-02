'use client'

// PUL-397 · Pulse-SelectField — generisches Single-Select für pure Text-Options.
// Ersetzt App-weit shadcn-<Select> als Standard-Form-Baustein. ESLint blockt
// neue `from '../ui/select'`-Imports außerhalb dieser Datei.
//
// Aufbau: dünner Wrapper um shadcn-<Select> (= Radix-Select), Trigger gestyled
// passend zum `.pulse-input`-Look. Zwei Größen: `md` (40px, FormField-Default)
// und `sm` (32px, für Filter-Bars / Inline-Toolbars).
//
// Hinweis: `SelectField` ist **nicht** Teil der Pill-Compound-Familie
// (`Dropdown` + dessen App-Wrapper `ContextDropdown`/`BucketDropdown`/
// `OrgSwitcher`; das `Dropdown`-Compound lebt seit PUL-464 in `atoms/`).
// Pill-Trigger sind klein,
// border-bündig, gehören in Filter-Bars und Editor-Property-Bars. Form-Felder
// brauchen Input-Look mit voller Breite + h-10/h-8 — andere visuelle Sprache.
// Beide laufen technisch auf Radix Select, geteilt wird das Primitive, nicht
// die Optik.
//
// API-Entscheidungen (PUL-397 Plan):
// - Kein `allowClear`-Prop. Wer "Keine"-Option braucht, setzt sie selbst als
//   reguläre Option mit Sentinel-Value (z. B. `'none'`). Konsumenten machen
//   das bereits heute (ActionItemDetailDialog, NewTaskDialog).
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
  // PUL-353: Auto-Id aus FormField-Context (für `<label htmlFor>`).
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
      {/* PUL-397-followup: `focus-ring` ist die Tailwind-v4-Utility
          für den vereinheitlichten Active-State-Cue (border-primary + Glow);
          greift hier auf `[data-state="open"]` (Radix-Trigger). */}
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
