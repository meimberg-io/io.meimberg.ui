'use client'

import { useState, useMemo, createElement } from 'react'
import { icons, Search } from 'lucide-react'
import { CancelIcon } from './action-icons'
import { cn } from '../lib/cn'
import {
  Popover, PopoverContent, PopoverTrigger,
} from './popover'
import { Button } from './button'
import { IconButton } from './icon-button'
import { useLabels } from '../i18n/context'

// Lucide icon picker. Stores kebab-case icon names (e.g. 'lightbulb',
// 'flask-conical').

export interface IconPickerLabels {
  /** Trigger text while no icon is selected. */
  trigger: string
  searchPlaceholder: string
  /** Title of the clear button. */
  clear: string
  noResults: string
  /** Hint below the grid while not searching. */
  searchHint: (total: number) => string
}

const defaultLabels: IconPickerLabels = {
  trigger: 'Choose icon…',
  searchPlaceholder: 'Search icons…',
  clear: 'Remove icon',
  noResults: 'No icons found',
  searchHint: total => `Search to browse all ${total} icons`,
}

interface IconPickerProps {
  value: string | null
  onChange: (icon: string | null) => void
  className?: string
  /** Trigger text while no icon is selected. Takes precedence over `labels.trigger`. */
  triggerLabel?: string
  labels?: Partial<IconPickerLabels>
}

function toKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function toPascal(name: string): string {
  return name
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

const allIcons = Object.keys(icons).map(pascal => ({
  pascal,
  kebab: toKebab(pascal),
}))

const MAX_DISPLAY = 200

export function IconPicker({ value, onChange, className, triggerLabel, labels }: IconPickerProps) {
  const l = useLabels('iconPicker', defaultLabels, labels)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return allIcons.slice(0, MAX_DISPLAY)
    const q = search.toLowerCase()
    return allIcons.filter(i => i.kebab.includes(q)).slice(0, MAX_DISPLAY)
  }, [search])

  const handleSelect = (kebab: string) => {
    onChange(kebab)
    setOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange(null)
    setOpen(false)
    setSearch('')
  }

  const valuePascal = value ? toPascal(value) : ''
  const IconComponent =
    valuePascal && (icons[valuePascal as keyof typeof icons] as React.ElementType | undefined)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'justify-start gap-2 caption cursor-pointer h-8',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          {IconComponent ? (
            <>
              {createElement(IconComponent, { className: 'size-4 shrink-0' })}
              <span className='truncate'>{value}</span>
            </>
          ) : (
            <span>{triggerLabel ?? l.trigger}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[320px] p-0' side='left' align='start' sideOffset={8}>
        <div className='flex items-center gap-2 border-b border-border px-3 py-2'>
          <Search className='size-4 text-muted-foreground shrink-0' />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={l.searchPlaceholder}
            className='flex-1 bg-transparent caption outline-none placeholder:text-muted-foreground'
            autoFocus
          />
          {value && (
            <IconButton size='sm' onClick={handleClear} title={l.clear} aria-label={l.clear}>
              <CancelIcon />
            </IconButton>
          )}
        </div>
        <div
          className='grid grid-cols-8 gap-1 p-2 max-h-[280px] overflow-y-auto'
          onWheel={e => e.stopPropagation()}
        >
          {filtered.map(({ pascal, kebab }) => {
            const Icon = icons[pascal as keyof typeof icons] as React.ElementType
            return (
              <IconButton
                key={kebab}
                size='default'
                onClick={() => handleSelect(kebab)}
                title={kebab}
                className={value === kebab ? 'bg-primary/20 text-primary' : undefined}
              >
                {createElement(Icon)}
              </IconButton>
            )
          })}
          {filtered.length === 0 && (
            <p className='col-span-8 py-6 text-center caption text-muted-foreground italic'>
              {l.noResults}
            </p>
          )}
        </div>
        {!search.trim() && (
          <p className='border-t border-border px-3 py-1.5 caption text-muted-foreground text-center'>
            {l.searchHint(allIcons.length)}
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}

// This file imports the full Lucide registry — load `IconPicker` lazily
// (e.g. `next/dynamic`). For rendering a single icon use `./lucide-icon`.
