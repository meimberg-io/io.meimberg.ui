'use client'

// Config-driven filter bar. Pages pass a list of field configs; the component
// renders search / select / toggle / chips-multi / segmented / custom in the
// given order, with an `actions` slot on the right. Domain-specific controls
// go into a `custom` field; `toneClass` on chips/segmented is a
// consumer-supplied className, so no colour semantics live here.

import type {ReactNode} from 'react'
import {Button} from '../ui/button'
import {Label} from '../ui/label'
import {Switch} from '../ui/switch'
import {SearchInput} from '../atoms/SearchInput'
import {Dropdown} from '../atoms/Dropdown'
import {useLabels} from '../i18n/context'
import {cn} from '../lib/cn'

export type FilterBarValue = Record<string, string | string[] | boolean | null>
type FilterFieldValue = string | string[] | boolean | null

type SelectOption = {value: string; label: string}
type ChipsOption = {value: string; label: string; toneClass?: string}

interface SearchField {
  kind: 'search'
  key: string
  placeholder?: string
  debounceMs?: number
}

interface SelectFieldConfig {
  kind: 'select'
  key: string
  label: string
  options: readonly SelectOption[]
  allowAll?: boolean
  allLabel?: string
  width?: string
}

interface ToggleField {
  kind: 'toggle'
  key: string
  label: string
}

/** Multi-select chip group (toggle per chip). Value = `string[]`. */
interface ChipsMultiField {
  kind: 'chipsMulti'
  key: string
  label?: string
  options: readonly ChipsOption[]
}

/** Single-select segmented control. `null` = no filter; clicking again toggles back. */
interface SegmentedField {
  kind: 'segmented'
  key: string
  label?: string
  options: readonly {value: string; label: string; icon?: ReactNode; toneClass?: string}[]
}

/**
 * Arbitrary consumer control (render slot) for domain-specific filters.
 * Receives the current value for `key` and a setter.
 */
interface CustomField {
  kind: 'custom'
  key: string
  render: (value: FilterFieldValue, setValue: (v: FilterFieldValue) => void) => ReactNode
}

export type FilterField =
  | SearchField
  | SelectFieldConfig
  | ToggleField
  | ChipsMultiField
  | SegmentedField
  | CustomField

export interface FilterBarLabels {
  reset: string
}

const defaultLabels: FilterBarLabels = {
  reset: 'Reset filters',
}

interface Props {
  fields: readonly FilterField[]
  value: FilterBarValue
  onChange: (next: FilterBarValue) => void
  onReset?: () => void
  actions?: ReactNode
  className?: string
  labels?: Partial<FilterBarLabels>
}

export function FilterBar({fields, value, onChange, onReset, actions, className, labels}: Props) {
  const l = useLabels('filterBar', defaultLabels, labels)
  const patch = (key: string, v: FilterFieldValue) => onChange({...value, [key]: v})

  return (
    <div className={cn('flex flex-wrap items-center gap-3 mb-6', className)}>
      {fields.map(field => {
        if (field.kind === 'search') {
          return (
            <SearchInput
              key={field.key}
              value={String(value[field.key] ?? '')}
              onChange={v => patch(field.key, v)}
              placeholder={field.placeholder}
              debounceMs={field.debounceMs}
              className="w-full md:w-auto"
            />
          )
        }
        if (field.kind === 'select') {
          const current = value[field.key]
          const stringValue = typeof current === 'string' ? current : null
          return (
            <Dropdown
              key={field.key}
              allLabel={field.allLabel ?? field.label}
              value={stringValue}
              onChange={v => patch(field.key, v)}
              options={field.options.map(o => ({value: o.value, label: o.label}))}
              allowClear={field.allowAll !== false}
            />
          )
        }
        if (field.kind === 'custom') {
          return <span key={field.key}>{field.render(value[field.key] ?? null, v => patch(field.key, v))}</span>
        }
        if (field.kind === 'chipsMulti') {
          const current = value[field.key]
          const active = Array.isArray(current) ? current : []
          const activeSet = new Set(active)
          return (
            <div key={field.key} className="flex items-center gap-1.5">
              {field.label && <span className="caption text-muted-foreground select-none mr-1">{field.label}</span>}
              {field.options.map(opt => {
                const isActive = activeSet.has(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      const nextSet = new Set(active)
                      if (nextSet.has(opt.value)) nextSet.delete(opt.value)
                      else nextSet.add(opt.value)
                      patch(field.key, field.options.map(o => o.value).filter(v => nextSet.has(v)))
                    }}
                    className={cn(
                      'inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full cursor-pointer',
                      'caption font-semibold tabular-nums border transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-ring',
                      isActive
                        ? cn('text-white border-transparent', opt.toneClass ?? 'bg-primary')
                        : 'bg-card text-muted-foreground border-border hover:bg-accent/40',
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )
        }
        if (field.kind === 'segmented') {
          const current = value[field.key]
          const activeValue = typeof current === 'string' ? current : null
          return (
            <div key={field.key} className="flex items-center gap-1">
              {field.label && <span className="caption text-muted-foreground select-none mr-1">{field.label}</span>}
              {field.options.map(opt => {
                const isActive = activeValue === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => patch(field.key, isActive ? null : opt.value)}
                    className={cn(
                      'inline-flex items-center gap-1 h-7 px-2 rounded-full border caption cursor-pointer',
                      'transition-colors focus:outline-none focus:ring-2 focus:ring-ring',
                      isActive
                        ? cn('font-semibold', opt.toneClass ?? 'bg-primary/15 border-primary/40 text-primary')
                        : 'bg-card text-muted-foreground border-border hover:bg-accent/40',
                    )}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )
        }
        // toggle
        const inputId = `filter-${field.key}`
        return (
          <div key={field.key} className="flex items-center gap-2">
            <Switch id={inputId} checked={value[field.key] === true} onCheckedChange={v => patch(field.key, v)} />
            <Label htmlFor={inputId} className="body cursor-pointer select-none">
              {field.label}
            </Label>
          </div>
        )
      })}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          {l.reset}
        </Button>
      )}
    </div>
  )
}
