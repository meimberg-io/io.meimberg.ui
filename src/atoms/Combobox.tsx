'use client'

// Combobox — Einzelauswahl mit reichen Einträgen (Label + Sub-Zeile, eigene
// Render-Slots) und optionaler Suche. Trigger im Formularfeld-Look
// (`field-shell`, 40 px).
//
// Aufbau: Radix Popover (Portal, Positionierung/Flip, Outside-Click, Escape,
// Fokus-Rückgabe) plus eigene Listbox. Der Fokus bleibt im Such-Input bzw.
// auf der Listbox; die aktive Option läuft über `aria-activedescendant`
// (kein Roving Tabindex). Die Such-Query setzt sich beim Schließen zurück.

import {useEffect, useId, useMemo, useRef, useState} from 'react'
import type {ComponentPropsWithoutRef, KeyboardEvent, ReactNode} from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {ChevronDown, Search} from './icons'
import {useFormFieldId} from '../molecules/FormField'
import {useLabels} from '../i18n/context'
import {cn} from '../lib/cn'

export interface ComboboxLabels {
  /** Trigger ohne Auswahl. */
  placeholder: string
  searchPlaceholder: string
  /** Leere Trefferliste bei aktiver Suche. */
  noResults: string
  /** Leere Item-Liste ohne Suche. */
  noOptions: string
}

const defaultLabels: ComboboxLabels = {
  placeholder: 'Select…',
  searchPlaceholder: 'Search…',
  noResults: 'No results',
  noOptions: 'No options',
}

export interface ComboboxItem {
  /** Stabile ID für Key und Auswahl. */
  id: string
  label: ReactNode
  /** Caption-Zeile unter dem Label (Default-Render). */
  sub?: ReactNode
  disabled?: boolean
}

export interface ComboboxProps<T extends ComboboxItem>
  extends Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange' | 'children'> {
  items: ReadonlyArray<T>
  value: string | null
  onChange: (id: string, item: T) => void
  /** Suchfeld über der Liste. Default-Filter: Substring auf `label` + `sub`. */
  searchable?: boolean
  filterItem?: (item: T, query: string) => boolean
  /** Trigger-Inhalt bei Auswahl (Default: Label). */
  renderSelected?: (item: T) => ReactNode
  /** Zeilen-Inhalt (Default: Label + Sub). */
  renderItem?: (item: T) => ReactNode
  /** Führendes Visual im Trigger, solange nichts gewählt ist. */
  leading?: ReactNode
  /** Hat Vorrang vor `labels.placeholder`. */
  placeholder?: ReactNode
  /** Hat Vorrang vor `labels.searchPlaceholder`. */
  searchPlaceholder?: string
  disabled?: boolean
  /** Default: ID aus dem umgebenden `FormField`. */
  id?: string
  className?: string
  labels?: Partial<ComboboxLabels>
}

function defaultFilter<T extends ComboboxItem>(item: T, query: string): boolean {
  const haystack = `${String(item.label ?? '')} ${String(item.sub ?? '')}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function filterItems<T extends ComboboxItem>(
  items: ReadonlyArray<T>, query: string, searchable: boolean, filterItem?: (item: T, query: string) => boolean,
): ReadonlyArray<T> {
  if (!searchable || query.trim() === '') return items
  const f = filterItem ?? defaultFilter
  return items.filter(item => f(item, query))
}

/** Nächster aktivierbarer Index ab `from` in Richtung `step`; bleibt an den Enden stehen. */
function findEnabled<T extends ComboboxItem>(list: ReadonlyArray<T>, from: number, step: 1 | -1): number {
  for (let i = from; i >= 0 && i < list.length; i += step) {
    if (!list[i].disabled) return i
  }
  return -1
}

export function Combobox<T extends ComboboxItem>({
  items,
  value,
  onChange,
  searchable = false,
  filterItem,
  renderSelected,
  renderItem,
  leading,
  placeholder,
  searchPlaceholder,
  disabled,
  id,
  className,
  labels,
  onKeyDown: onTriggerKeyDown,
  ...rest
}: ComboboxProps<T>) {
  const l = useLabels('combobox', defaultLabels, labels)
  const contextId = useFormFieldId()
  const listId = useId()
  const optionId = (index: number) => `${listId}-${index}`

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => filterItems(items, query, searchable, filterItem),
    [items, query, searchable, filterItem],
  )
  const selected = value != null ? items.find(item => item.id === value) ?? null : null

  const handleOpenChange = (next: boolean) => {
    if (disabled && next) return
    setOpen(next)
    if (next) {
      // Beim Öffnen: gewählter Eintrag, sonst erster aktivierbarer.
      const selectedIndex = items.findIndex(item => item.id === value && !item.disabled)
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : findEnabled(items, 0, 1))
    } else {
      setQuery('')
    }
  }

  const choose = (item: T) => {
    if (item.disabled) return
    onChange(item.id, item)
    handleOpenChange(false)
  }

  useEffect(() => {
    if (!open || activeIndex < 0) return
    document.getElementById(optionId(activeIndex))?.scrollIntoView({block: 'nearest'})
    // optionId leitet sich nur aus listId ab.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex, listId])

  const handleListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const next = findEnabled(filtered, activeIndex + 1, 1)
        if (next >= 0) setActiveIndex(next)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prev = findEnabled(filtered, activeIndex < 0 ? filtered.length - 1 : activeIndex - 1, -1)
        if (prev >= 0) setActiveIndex(prev)
        break
      }
      case 'Home':
        event.preventDefault()
        setActiveIndex(findEnabled(filtered, 0, 1))
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(findEnabled(filtered, filtered.length - 1, -1))
        break
      case 'Enter': {
        event.preventDefault()
        const item = filtered[activeIndex]
        if (item) choose(item)
        break
      }
      case 'Tab':
        // Schließt; Radix gibt den Fokus an den Trigger zurück.
        event.preventDefault()
        handleOpenChange(false)
        break
    }
  }

  const handleQueryChange = (next: string) => {
    setQuery(next)
    setActiveIndex(findEnabled(filterItems(items, next, searchable, filterItem), 0, 1))
  }

  const activeDescendant = open && activeIndex >= 0 && activeIndex < filtered.length ? optionId(activeIndex) : undefined
  const emptyText = searchable && query.trim() !== '' ? l.noResults : l.noOptions

  return (
    // modal: eigener Scroll-Lock am Popup. Ohne ihn blockiert der Scroll-Lock
    // eines umgebenden Dialogs das Mausrad in der (portalisierten) Liste.
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} modal>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          id={id ?? contextId}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          data-slot="combobox-trigger"
          className={cn(
            'field-shell focus-ring cursor-pointer hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          onKeyDown={event => {
            onTriggerKeyDown?.(event)
            if (event.defaultPrevented) return
            if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
              event.preventDefault()
              handleOpenChange(true)
            }
          }}
          {...rest}
        >
          {selected ? (
            (renderSelected ?? defaultRenderSelected)(selected)
          ) : (
            <>
              {leading}
              <span className="body-sm text-muted-foreground flex-1 truncate">{placeholder ?? l.placeholder}</span>
            </>
          )}
          <ChevronDown className="size-[13px] text-muted-foreground shrink-0" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          data-slot="combobox-content"
          onOpenAutoFocus={event => {
            event.preventDefault()
            if (searchable) inputRef.current?.focus()
            else listRef.current?.focus()
          }}
          // `z-60` liegt über Dialog-Overlay und -Content (beide z-50).
          className={cn(
            'z-60 flex flex-col overflow-hidden rounded-[calc(var(--radius)+2px)] border border-border bg-card shadow-floating outline-none',
            'w-(--radix-popover-trigger-width) max-h-[min(320px,var(--radix-popover-content-available-height))]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          )}
        >
          {searchable && (
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
              <Search className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeDescendant}
                value={query}
                onChange={event => handleQueryChange(event.target.value)}
                onKeyDown={handleListKeyDown}
                placeholder={searchPlaceholder ?? l.searchPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent body-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={searchable ? undefined : 0}
            aria-activedescendant={searchable ? undefined : activeDescendant}
            onKeyDown={searchable ? undefined : handleListKeyDown}
            className="min-h-0 flex-1 overflow-y-auto outline-none"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-3 caption text-muted-foreground">{emptyText}</div>
            ) : (
              filtered.map((item, index) => (
                <div
                  key={item.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={item.id === value}
                  aria-disabled={item.disabled || undefined}
                  data-active={index === activeIndex || undefined}
                  data-disabled={item.disabled || undefined}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 px-3 py-2 transition-colors duration-100',
                    'data-active:bg-accent aria-selected:not-data-active:bg-accent/60',
                    'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                  )}
                  // Fokus bleibt im Input bzw. auf der Listbox.
                  onMouseDown={event => event.preventDefault()}
                  onMouseMove={() => {
                    if (!item.disabled && index !== activeIndex) setActiveIndex(index)
                  }}
                  onClick={() => choose(item)}
                >
                  {(renderItem ?? defaultRenderItem)(item)}
                </div>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function defaultRenderSelected<T extends ComboboxItem>(item: T): ReactNode {
  return <span className="body-sm text-foreground flex-1 truncate font-medium">{item.label}</span>
}

function defaultRenderItem<T extends ComboboxItem>(item: T): ReactNode {
  return (
    <div className="flex-1 min-w-0">
      <div className="body-sm text-foreground truncate">{item.label}</div>
      {item.sub && <div className="caption text-muted-foreground truncate">{item.sub}</div>}
    </div>
  )
}
