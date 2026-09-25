'use client'

// Single-Date-Picker via Popover + Calendar. Ersetzt `<input type="date">`.
// ESLint blockt `from '../ui/calendar'`-Imports außerhalb dieser Datei
// (die übrigen Vendor-Primitives kapseln die Atoms genauso).
//
// API-Entscheidungen:
// - Value-Typ: `string | null` als ISO-Date (YYYY-MM-DD), kein `Date`-Objekt —
//   date-only ohne TZ-Probleme, drop-in für `<input type="date">`.
// - Locale: Kalender aus `useDateLocale()`, Trigger-Text und Hints aus
//   `useUiLocale()`. Override der Kalender-Locale via `locale`-Prop.
// - Clear: optionaler X-Button im Trigger (`allowClear`).
// - Quick-Actions über dem Kalender (`showShortcuts`, Default an): Heute,
//   Morgen, Nächstes Wochenende (Sa), Nächste Woche (Mo) und — bei
//   `allowClear` — Kein Datum.

import {useState} from 'react'
import type {ButtonHTMLAttributes, MouseEvent, ReactNode} from 'react'
import {format, parseISO, startOfToday, addDays, nextSaturday, nextMonday} from 'date-fns'
import type {Locale} from 'date-fns'
import {CalendarDays, X, Sun, Armchair, CalendarClock, Ban} from '../atoms/icons'
import {Calendar} from '../ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, type IconComponent} from '../lib/variants'
import {formatAbsoluteDate} from '../lib/datetime'
import {useFormFieldId} from '../molecules/FormField'
import {useDateLocale, useLabels, useUiLocale} from '../i18n/context'

/**
 * Trigger-Größe auf der Control-Skala:
 *   - `lg` (Default): 40 px, `w-full` — Formularfelder mit Label darüber.
 *   - `sm`: 32 px, `w-auto` — Property-Bars in Dialogen neben
 *     `<Chip size="sm">` / `<Select size="sm">`.
 */
export type DatePickerSize = 'sm' | 'lg'

const SIZE_CLASS: Record<DatePickerSize, string> = {
  sm: cn(CONTROL_SIZE.sm.height, CONTROL_SIZE.sm.text, 'w-auto gap-1.5 px-2.5'),
  lg: cn(CONTROL_SIZE.lg.height, CONTROL_SIZE.lg.text, 'w-full gap-2 px-3'),
}

export interface DatePickerLabels {
  placeholder: string
  clear: string
  today: string
  tomorrow: string
  nextWeekend: string
  nextWeek: string
  noDate: string
}

const defaultLabels: DatePickerLabels = {
  placeholder: 'Pick a date…',
  clear: 'Clear date',
  today: 'Today',
  tomorrow: 'Tomorrow',
  nextWeekend: 'Next weekend',
  nextWeek: 'Next week',
  noDate: 'No date',
}

export interface DatePickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange' | 'children' | 'type' | 'placeholder'> {
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
  /** Override für die Calendar-Locale. Default: `useDateLocale()`. */
  locale?: Locale
  /** X-Button im Trigger, der `onChange(null)` feuert. */
  allowClear?: boolean
  /** Quick-Actions über dem Kalender. Default `true`. */
  showShortcuts?: boolean
  /** Trigger-Größe. Default `lg` (40 px). `sm` (32 px) für Property-Bars.
   *  Weitere Größen hier ergänzen, **nicht** per className-Override. */
  size?: DatePickerSize
  labels?: Partial<DatePickerLabels>
}

interface DateShortcut {
  label: string
  icon: IconComponent
  /** Zieldatum, oder `null` um den Wert zu leeren. */
  date: Date | null
  /** Kurz-Hint rechts (z. B. "Sat, Jun 6"). */
  hint?: string
}

/** Baut die Quick-Action-Shortcuts relativ zu heute. */
function buildShortcuts(
  today: Date,
  uiLocale: string,
  labels: DatePickerLabels,
  allowClear: boolean,
): DateShortcut[] {
  const weekday = new Intl.DateTimeFormat(uiLocale, {weekday: 'short'})
  const weekdayDate = new Intl.DateTimeFormat(uiLocale, {weekday: 'short', day: 'numeric', month: 'short'})

  const tomorrow = addDays(today, 1)
  const weekend = nextSaturday(today)
  const nextWeek = nextMonday(today)

  const shortcuts: DateShortcut[] = [
    {label: labels.today, icon: CalendarDays, date: today, hint: weekday.format(today)},
    {label: labels.tomorrow, icon: Sun, date: tomorrow, hint: weekday.format(tomorrow)},
    {label: labels.nextWeekend, icon: Armchair, date: weekend, hint: weekdayDate.format(weekend)},
    {label: labels.nextWeek, icon: CalendarClock, date: nextWeek, hint: weekdayDate.format(nextWeek)},
  ]

  if (allowClear) shortcuts.push({label: labels.noDate, icon: Ban, date: null})

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
  placeholder,
  disabled,
  min,
  max,
  defaultMonth,
  locale,
  allowClear,
  showShortcuts = true,
  size = 'lg',
  labels,
  className,
  id: ownId,
  ...rest
}: DatePickerProps) {
  const contextId = useFormFieldId()
  const l = useLabels('datePicker', defaultLabels, labels)
  const uiLocale = useUiLocale()
  const contextDateLocale = useDateLocale()
  const calendarLocale = locale ?? contextDateLocale
  const [open, setOpen] = useState(false)
  const parsed = parseValue(value)
  const minDate = parseValue(min ?? null)
  const maxDate = parseValue(max ?? null)
  const month = parsed ?? defaultMonth ?? startOfToday()

  const shortcuts = buildShortcuts(startOfToday(), uiLocale, l, Boolean(allowClear))
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

  const handleClear = (event: MouseEvent) => {
    // Verhindert, dass das Popover öffnet, wenn der User auf den X-Button klickt.
    event.stopPropagation()
    onChange(null)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* `focus-ring` greift auch auf `[data-state="open"]` (Radix-Trigger)
          und ersetzt den `focus:ring-*`. */}
      <PopoverTrigger
        {...rest}
        id={ownId ?? contextId}
        type="button"
        disabled={disabled}
        className={cn(
          'focus-ring inline-flex items-center rounded-md border border-input bg-background text-left transition-colors cursor-pointer',
          SIZE_CLASS[size],
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
          {parsed ? formatAbsoluteDate(parsed, 'list', uiLocale) : (placeholder ?? l.placeholder)}
        </span>
        {allowClear && parsed && (
          <span
            role="button"
            tabIndex={-1}
            aria-label={l.clear}
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
          locale={calendarLocale}
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
