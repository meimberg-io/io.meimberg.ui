'use client'

// PUL-352 · Rich-Select — Dropdown mit Auto-Flip (öffnet nach oben, wenn
// unten zu wenig Platz ist), Sub-Text in Items, Custom-Render-Slots. Höhe
// 40px (über `.rich-select`-Klasse). Quelle:
// docs/frontend/redesign/source/v3/mission/Buckets.html § .rich-select.
//
// PUL-352 Followup — Popover via `createPortal` ans <body>, damit sie nicht
// von Eltern-Containern mit `overflow: hidden` (z. B. FormDialog-Shell)
// clipped wird. Position + Flip rechnet `usePopoverPosition` aus dem
// Trigger-Rect.
//
// PUL-397 — `searchable`-Modus: Suchfeld am Top des Popovers. Default-Filter
// macht Substring-Match auf `label + sub`. Search-Query resettet beim Close
// (vorhersehbares Verhalten — kein „stale Filter" beim Re-Open). Ersetzt
// die alte `TimezoneSelect`-Eigenimplementation.

import {useEffect, useMemo, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import type {ReactNode} from 'react'
import {ChevronDown, Search} from '../atoms/icons'
import {usePopoverPosition} from '../hooks/use-popover-position'

export interface RichSelectItem {
  /** Stabile id für `key` + Selektion. */
  id: string
  /** Wird im Trigger gerendert (default-renderSelected) und im Item-Header. */
  label: ReactNode
  /** Optional: kleine Caption-Zeile unter `label` im Item. */
  sub?: ReactNode
  /** Lässt das Item disabled rendern (z. B. „Bitte erst Account wählen"). */
  disabled?: boolean
}

interface Props<T extends RichSelectItem> {
  items: ReadonlyArray<T>
  selected: T | null
  onSelect: (item: T) => void
  /** Was im Trigger gerendert wird (default: `selected.label`). */
  renderSelected?: (item: T) => ReactNode
  /** Was im Dropdown pro Item gerendert wird (default: label+sub). */
  renderItem?: (item: T) => ReactNode
  /** Icon links im Trigger, wenn nichts gewählt. */
  leadingIcon?: ReactNode
  /** Placeholder-Text, wenn `selected === null`. */
  placeholder?: ReactNode
  disabled?: boolean
  /** Geschätzte Popup-Höhe für die Flip-Entscheidung. Default 320px. */
  estimatedHeight?: number
  /** PUL-397: Wenn true, rendert ein Suchfeld am Top des Popovers.
   *  Default-Filter: case-insensitive substring auf `String(label) + ' ' + String(sub)`.
   *  Query resettet beim Schließen. */
  searchable?: boolean
  /** PUL-397: Custom-Filter überschreibt den Default-Filter. */
  filterItem?: (item: T, query: string) => boolean
  /** PUL-397: Placeholder im Search-Input. Default „Suchen…". */
  searchPlaceholder?: string
  /** Test-Hook. */
  'data-testid'?: string
}

// Höhe des Search-Headers — wird zur estimatedHeight addiert, damit Auto-Flip
// die richtige Entscheidung trifft.
const SEARCH_HEADER_HEIGHT = 44

function defaultFilter<T extends RichSelectItem>(item: T, query: string): boolean {
  const haystack = `${String(item.label ?? '')} ${String(item.sub ?? '')}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export function RichSelect<T extends RichSelectItem>({
  items,
  selected,
  onSelect,
  renderSelected,
  renderItem,
  leadingIcon,
  placeholder = 'Wählen…',
  disabled,
  estimatedHeight = 320,
  searchable = false,
  filterItem,
  searchPlaceholder = 'Suchen…',
  'data-testid': testId,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listboxId = `rich-select-listbox-${testId ?? 'default'}`

  // Items filtern wenn searchable & Query gesetzt.
  const filteredItems = useMemo(() => {
    if (!searchable || query.trim() === '') return items
    const f = filterItem ?? defaultFilter
    return items.filter(item => f(item, query))
  }, [items, searchable, query, filterItem])

  const effectiveHeight = useMemo(() => {
    const itemsHeight = filteredItems.length * 56 + 16
    const headerExtra = searchable ? SEARCH_HEADER_HEIGHT : 0
    return Math.min(estimatedHeight, itemsHeight + headerExtra)
  }, [filteredItems.length, searchable, estimatedHeight])

  const {triggerRef, popoverRef, position, direction} = usePopoverPosition({
    open,
    width: 'trigger',
    estimatedHeight: effectiveHeight,
  })

  // PUL-397: zentrale close-Funktion — resettet die Search-Query beim
  // Schließen (vorhersehbares Verhalten beim Wieder-Öffnen). Würde sonst
  // im Effect mit setState gehen, was `react-hooks/set-state-in-effect`
  // flagged.
  const closePopover = () => {
    setOpen(false)
    if (searchable) setQuery('')
  }

  // Outside-Click + Escape schließen. Klicks INNERHALB des Portal-Popovers
  // gelten nicht als „outside" — sonst würde das Item-Click den Select
  // direkt wieder schließen, bevor onSelect feuert.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      closePopover()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover()
    }
    const t = window.setTimeout(() => {
      document.addEventListener('mousedown', onClick)
      document.addEventListener('keydown', onKey)
    }, 0)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
    // closePopover ist Ref-stable (kein useCallback nötig), weil es nur
    // setState-Setter referenziert.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, triggerRef, popoverRef, searchable])

  // Auto-Fokus beim Öffnen — User kann sofort tippen.
  useEffect(() => {
    if (!searchable || !open) return
    // Fokus nach dem Mount des Portal-Popovers — kurzes setTimeout, weil das
    // Input erst nach `createPortal` + Position-Compute im DOM hängt.
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open, searchable])

  const triggerContent: ReactNode = selected
    ? (renderSelected ?? defaultRenderSelected)(selected)
    : (
      <>
        {leadingIcon}
        <span className="body-sm text-muted-foreground flex-1 truncate">{placeholder}</span>
      </>
    )

  return (
    <div className="relative" ref={triggerRef} data-testid={testId}>
      <button
        type="button"
        disabled={disabled}
        data-open={open}
        onClick={() => !disabled && setOpen(v => !v)}
        className="field-shell focus-ring cursor-pointer hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
        // ARIA-Konformes Combobox-Pattern: trigger ist `role="combobox"` +
        // `aria-haspopup` + `aria-expanded`. Bei `searchable` zeigt der
        // Popover ein Searchbox+Listbox-Composite — das matched WAI-ARIA 1.2
        // Combobox-with-Listbox-Popup.
        role="combobox"
        aria-haspopup={searchable ? 'dialog' : 'listbox'}
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
      >
        {triggerContent}
        <ChevronDown width={13} height={13} className="text-muted-foreground shrink-0" />
      </button>
      {open && position && createPortal(
        <div
          ref={popoverRef}
          // PUL-420 (G5): Popover-Look inline (war `.rich-select-menu` in
          // globals.css). `pointer-events-auto`: Radix-Dialog setzt während
          // Open `body { pointer-events: none }` — das Portal erbt das, ohne
          // Override wären die Items click-tot.
          className="pointer-events-auto flex max-h-80 flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-[var(--elev-floating)]"
          data-direction={direction}
          // Marker für FormDialog: Klick/Escape auf diesem Portal-Popover
          // schließt NICHT den umgebenden Dialog (siehe FormDialog.tsx).
          data-portal-popover=""
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            // z-100 reicht nicht, wenn der Popover innerhalb eines Dialogs
            // mit `backdrop-filter` rendert — das Overlay erzeugt einen
            // eigenen Stacking-Context, der den Popover-Portal überdeckt.
            // Pulse Dialog-Overlay sitzt bei z-50, Dialog-Content bei z-50;
            // wir wählen 1000 als sicheren Wert über allen Pulse-Layern.
            zIndex: 1000,
          }}
        >
          {searchable && (
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
              <Search
                width={14}
                height={14}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                role="searchbox"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div id={listboxId} role="listbox" className="min-h-0 flex-1 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-3 caption text-muted-foreground">
                {searchable && query.trim() !== '' ? 'Nichts gefunden' : 'Keine Optionen'}
              </div>
            ) : (
              filteredItems.map(item => {
                const active = selected?.id === item.id
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={active}
                    aria-disabled={item.disabled}
                    data-active={active}
                    data-disabled={item.disabled || undefined}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 transition-colors duration-100 hover:bg-accent data-[active=true]:bg-accent"
                    onClick={() => {
                      if (item.disabled) return
                      onSelect(item)
                      closePopover()
                    }}
                  >
                    {(renderItem ?? defaultRenderItem)(item)}
                  </div>
                )
              })
            )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

function defaultRenderSelected<T extends RichSelectItem>(item: T): ReactNode {
  return (
    <span className="body-sm text-foreground flex-1 truncate font-medium">{item.label}</span>
  )
}

function defaultRenderItem<T extends RichSelectItem>(item: T): ReactNode {
  return (
    <div className="flex-1 min-w-0">
      <div className="body-sm text-foreground truncate">{item.label}</div>
      {item.sub && <div className="caption text-muted-foreground truncate">{item.sub}</div>}
    </div>
  )
}
