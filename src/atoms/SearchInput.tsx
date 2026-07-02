'use client'

import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { IconButton } from '../ui/icon-button'
import { Search } from '../atoms/icons'
import { CloseIcon } from '../ui/action-icons'
import { cn } from '../lib/cn'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchInput({
  value, onChange, placeholder = 'Search…', debounceMs = 0, className,
}: Props) {
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

  return (
    <div className={cn('relative flex-1 min-w-[200px] max-w-sm', className)}>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
      <Input
        value={inner}
        onChange={e => handleChange(e.target.value)}
        placeholder={placeholder}
        className='pl-9 pr-9'
      />
      {inner && (
        <IconButton
          size='sm'
          className='absolute right-1 top-1/2 -translate-y-1/2'
          onClick={() => handleChange('')}
          aria-label='Suche leeren'
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  )
}
