'use client'

// PUL-397 · Pulse-DatePicker — Single-Date-Picker via Popover + Calendar.
// Ersetzt App-weit `<input type="date">` und Inline-Popover+Calendar-Aufbauten.
// ESLint blockt neue `from '../ui/calendar'`-Imports außerhalb dieser
// Datei (analog `from '../ui/select'` → Dropdown.tsx).
//
// API-Entscheidungen (PUL-397 Plan):
// - Value-Typ: `string | null` als ISO-Date (YYYY-MM-DD), kein `Date`-Objekt.
//   Hintergrund: DB-Spalten (`due_at`, etc.) sind `date` (date-only, kein TZ),
//   Server-Actions akzeptieren Strings. Drop-in für `<input type="date">`.
// - Locale: `date-fns/locale/de` als Default. Override via `locale`-Prop.
// - Clear: optionaler X-Button im Trigger (`allowClear`).
// - Quick-Actions: Todoist-Stil-Shortcut-Liste über dem Kalender (`showShortcuts`,
//   Default an): Heute, Morgen, Nächstes Wochenende (Sa), Nächste Woche (Mo) und
//   — bei `allowClear` — Kein Datum.

import {useState} from 'react'
import type {ReactNode} from 'react'
import {format, parseISO, startOfToday, addDays, nextSaturday, nextMonday} from 'date-fns'
import {de} from 'date-fns/locale'
import type {Locale} from 'date-fns'
import {CalendarDays, X, Sun, Armchair, CalendarClock, Ban} from '../atoms/icons'
import type {LucideIcon} from '../atoms/icons'
import {Calendar} from '../ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {cn} from '../lib/cn'
import {formatAbsoluteDate} from '../lib/datetime'
import {useFormFieldId} from '../molecules/FormField'

/**
 * Trigger-Größen-Variante (PUL-403-followup):
 *   - `default`: 40 px (Form-Field-Standard), `w-full`, body-Font, 12 px Padding.
 *     Für klassische Form-Layouts mit Label oben + Feld drunter.
 *   - `sm`: 32 px (h-8), `w-auto`, text-sm, kompaktes Padding. Für
 *     Property-Bars in Editor-Surfaces (ActionItem-Detail-Dialog), wo der
 *     Picker neben `<Chip size='md'>` / `<OptionsDropdown size='chip'>` in
 *     einer Toolbar-Reihe sitzt. Geometrie ist auf diese Nachbar-Atoms
 *     abgestimmt (siehe Chip.tsx + FilterPillButton.tsx — beide nennen
 *     `size='sm' / h-8` als Pendant für Form-Trigger).
 */
export type DatePickerSize = 'default' | 'sm'

interface Props {
  /** YYYY-MM-DD oder null. Date-only — keine TZ-Probleme, drop-in für `<input type="date">`. */
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: ReactNode
  disabled?: boolean
  /** Untere Grenze (YYYY-MM-DD), inklusiv. */
  min?: string
  /** Obere Grenze (YYYY-MM-DD), inklusiv. */
  max?: string
  /** Default-Monat bei `value === null`. Default: heute. */
  defaultMonth?: Date
  /** Override für die Calendar-Locale. Default: `de` aus `date-fns/locale`. */
  locale?: Locale
  /** X-Button im Trigger, der `onChange(null)` feuert. */
  allowClear?: boolean
  /** Todoist-Stil-Quick-Actions über dem Kalender. Default `true`. */
  showShortcuts?: boolean
  /** Trigger-Größe. Default `default` (40 px Form-Field). `sm` (32 px) für
   *  Property-Bars — Geometrie aligned zu Chip 'md' / OptionsDropdown 'chip'.
   *  Wer eine dritte Größe braucht: hier erweitern, **nicht** per className-
   *  Override. */
  size?: DatePickerSize
  className?: string
  'data-testid'?: string
}

interface DateShortcut {
  label: string
  icon: LucideIcon
  /** Zieldatum, oder `null` um den Wert zu leeren. */
  date: Date | null
  /** Kurz-Hint rechts (z. B. "Sa. 6. Jun"). */
  hint?: string
}

/** Baut die Quick-Action-Shortcuts relativ zu heute (Todoist-Stil). */
function buildShortcuts(today: Date, locale: Locale, allowClear: boolean): DateShortcut[] {
  const weekday = (date: Date) => format(date, 'EEEEEE', {locale})
  const dayMonth = (date: Date) => format(date, 'd. MMM', {locale})

  const tomorrow = addDays(today, 1)
  const weekend = nextSaturday(today)
  const nextWeek = nextMonday(today)

  const shortcuts: DateShortcut[] = [
    {label: 'Heute', icon: CalendarDays, date: today, hint: `${weekday(today)}.`},
    {label: 'Morgen', icon: Sun, date: tomorrow, hint: `${weekday(tomorrow)}.`},
    {label: 'Nächstes Wochenende', icon: Armchair, date: weekend, hint: `${weekday(weekend)}. ${dayMonth(weekend)}`},
    {label: 'Nächste Woche', icon: CalendarClock, date: nextWeek, hint: `${weekday(nextWeek)}. ${dayMonth(nextWeek)}`},
  ]

  if (allowClear) shortcuts.push({label: 'Kein Datum', icon: Ban, date: null})

  return shortcuts
}

function parseValue(value: string | null): Date | null {
  if (!value) return null
  try {
    return parseISO(value)
  } catch {
    return null
  }
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Datum wählen…',
  disabled,
  min,
  max,
  defaultMonth,
  locale = de,
  allowClear,
  showShortcuts = true,
  size = 'default',
  className,
  'data-testid': testId,
}: Props) {
  const contextId = useFormFieldId()
  const [open, setOpen] = useState(false)
  const parsed = parseValue(value)
  const minDate = parseValue(min ?? null)
  const maxDate = parseValue(max ?? null)
  const month = parsed ?? defaultMonth ?? startOfToday()

  const shortcuts = buildShortcuts(startOfToday(), locale, Boolean(allowClear))
  const isShortcutDisabled = (date: Date) =>
    Boolean((minDate && date < minDate) || (maxDate && date > maxDate))

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(null)
    } else {
      onChange(format(date, 'yyyy-MM-dd'))
    }
    setOpen(false)
  }

  const handleClear = (event: React.MouseEvent) => {
    // Verhindert, dass das Popover öffnet, wenn der User auf den X-Button klickt.
    event.stopPropagation()
    onChange(null)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* PUL-397-followup: `focus-ring` ist die Tailwind-v4-Utility
          für den vereinheitlichten Active-State-Cue (border-primary + Glow);
          greift hier auf `[data-state="open"]` (Radix-Trigger). Der vorherige
          `focus:ring-*` entfällt — der Glow ersetzt den Ring. */}
      <PopoverTrigger
        id={contextId}
        type="button"
        disabled={disabled}
        data-testid={testId}
        className={cn(
          'focus-ring inline-flex items-center rounded-md border border-input bg-background text-left transition-colors cursor-pointer',
          size === 'sm'
            ? 'h-8 w-auto gap-1.5 px-2.5 py-1 text-sm'
            : 'h-10 w-full gap-2 px-3 py-2 body',
          'hover:bg-accent/50 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background',
          className,
        )}
      >
        <CalendarDays
          width={14}
          height={14}
          className="text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <span className={cn('flex-1 truncate', !parsed && 'text-muted-foreground')}>
          {parsed ? formatAbsoluteDate(parsed, 'list') : placeholder}
        </span>
        {allowClear && parsed && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Datum löschen"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground shrink-0 inline-flex items-center justify-center"
          >
            <X width={14} height={14} />
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {showShortcuts && (
          <div className="flex flex-col border-b border-border p-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon
              const itemDisabled = shortcut.date
                ? isShortcutDisabled(shortcut.date)
                : false
              const active = shortcut.date
                ? value === format(shortcut.date, 'yyyy-MM-dd')
                : value == null
              return (
                <button
                  key={shortcut.label}
                  type="button"
                  disabled={itemDisabled}
                  onClick={() => handleSelect(shortcut.date ?? undefined)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                    'hover:bg-accent disabled:pointer-events-none disabled:opacity-40',
                    !itemDisabled && 'cursor-pointer',
                    active && 'bg-accent font-medium',
                  )}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="flex-1">{shortcut.label}</span>
                  {shortcut.hint && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {shortcut.hint}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
        <Calendar
          mode="single"
          selected={parsed ?? undefined}
          defaultMonth={month}
          onSelect={handleSelect}
          locale={locale}
          disabled={(date: Date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
