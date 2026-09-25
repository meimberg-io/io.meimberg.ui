'use client'

// Select — Einzelauswahl auf Radix Select, zwei Optiken:
//   • `field` — Formularfeld (`field-shell`, volle Breite, Default `lg` = 40 px),
//   • `pill`  — Filter-/Property-Pill (border-bündiger Icon-Slot, Label-Tail,
//               Chevron; Default `xs` = 26 px).
//
// Zwei Nutzungsformen:
//   1. Convenience `<Select options={…} />` für einfache Listen.
//   2. Compound `<Select.Root><Select.Trigger>…<Select.Content><Select.Item>`
//      für reiche Fälle (eigenes Trigger-Icon, Icon-Trigger, Gruppen). Die
//      Convenience baut auf denselben Teilen.
//
// `value: null` ist die „leer/alle"-Auswahl. Radix-Values sind Strings; das
// null-Mapping läuft über einen internen Sentinel, den nur `Select.ClearItem`
// kennt.
//
// React 19: kein `forwardRef` — `ref` ist reguläre Prop.

import {createContext, useContext, type ComponentPropsWithoutRef, type ReactNode, type Ref} from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {Check, ChevronDown} from './icons'
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'
import {useFormFieldId} from '../molecules/FormField'
import {cn} from '../lib/cn'
import {CONTROL_SIZE, SHOW_FROM, type Breakpoint, type ControlSize} from '../lib/variants'

/** Radix-Value der „leer/alle"-Zeile; nach außen immer `null`. */
const CLEAR_VALUE = '__select_clear__'

export type SelectVariant = 'field' | 'pill'

const DEFAULT_SIZE: Record<SelectVariant, ControlSize> = {field: 'lg', pill: 'xs'}

// Pill-Geometrie pro Größe: Tail-Padding + Label-Cap, Chevron, Fläche.
// Fläche folgt dem typischen Ort: `xs` sitzt auf der Card-Filterleiste →
// eigene Card-Fläche; `sm` in Dialog-Property-Bars → `bg-background`;
// `md`/`lg` auf der Page-Fläche → transparent.
const PILL: Record<ControlSize, {tail: string; chevron: string; surface: string}> = {
  xs: {tail: 'gap-1.5 px-2.5 max-w-[140px]', chevron: 'size-[11px]', surface: 'bg-card'},
  sm: {tail: 'gap-1.5 px-2.5 max-w-[160px]', chevron: 'size-3', surface: 'bg-background'},
  md: {tail: 'gap-2 px-3 max-w-[180px]', chevron: 'size-3.5', surface: 'bg-transparent'},
  lg: {tail: 'gap-2 px-3 max-w-[200px]', chevron: 'size-3.5', surface: 'bg-transparent'},
}

// Field: `field-shell` liefert Border, Fläche, Padding und 40 px; kleinere
// Größen überschreiben Höhe und Padding (Utilities sortieren nach der Shell).
const FIELD: Record<ControlSize, string> = {
  xs: cn(CONTROL_SIZE.xs.height, CONTROL_SIZE.xs.text, 'px-2.5 gap-1.5'),
  sm: cn(CONTROL_SIZE.sm.height, 'px-2.5 gap-1.5'),
  md: CONTROL_SIZE.md.height,
  lg: CONTROL_SIZE.lg.height,
}

// Border-bündiges Quadrat im Pill-Trigger: Trigger-Höhe minus 2 × 1 px Border.
const TRIGGER_ICON_BOX: Record<ControlSize, string> = {
  xs: 'size-6',
  sm: 'size-7.5',
  md: 'size-8.5',
  lg: 'size-9.5',
}

const TriggerSizeContext = createContext<ControlSize>(DEFAULT_SIZE.field)

// ─── Select.Root ───────────────────────────────────────────────────────────

export interface SelectRootProps {
  value: string | null
  onValueChange: (next: string | null) => void
  disabled?: boolean
  children: ReactNode
}

function SelectRoot({value, onValueChange, disabled, children}: SelectRootProps) {
  return (
    <SelectPrimitive.Root
      value={value ?? CLEAR_VALUE}
      onValueChange={next => onValueChange(next === CLEAR_VALUE ? null : next)}
      disabled={disabled}
    >
      {children}
    </SelectPrimitive.Root>
  )
}

// ─── Select.Trigger ────────────────────────────────────────────────────────

export interface SelectTriggerProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'> {
  /** Default `field`. */
  variant?: SelectVariant
  /** Default: `field` → `lg`, `pill` → `xs`. */
  size?: ControlSize
  /** Führendes Visual. Im Pill border-bündig (z. B. `<Select.TriggerIcon>`), im Field vor dem Label. */
  leading?: ReactNode
  /** Nur `pill`: blendet Label + Chevron unterhalb des Breakpoints aus. */
  compactBelow?: Breakpoint
  /** Label. */
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

function SelectTrigger({
  variant = 'field', size, leading, compactBelow = 'none', children, className, id, ...rest
}: SelectTriggerProps) {
  const contextId = useFormFieldId()
  const effectiveSize = size ?? DEFAULT_SIZE[variant]
  const chevron = PILL[effectiveSize].chevron

  if (variant === 'field') {
    return (
      <TriggerSizeContext.Provider value={effectiveSize}>
        <SelectPrimitive.Trigger
          id={id ?? contextId}
          data-slot="select-trigger"
          // `focus-ring` greift auch auf `[data-state="open"]`.
          className={cn(
            'field-shell focus-ring cursor-pointer hover:bg-accent/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            FIELD[effectiveSize],
            className,
          )}
          {...rest}
        >
          {leading}
          <span className="flex-1 min-w-0 truncate">{children}</span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className={cn('shrink-0 text-muted-foreground', chevron)} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </TriggerSizeContext.Provider>
    )
  }

  return (
    <TriggerSizeContext.Provider value={effectiveSize}>
      <SelectPrimitive.Trigger
        id={id ?? contextId}
        data-slot="select-trigger"
        className={cn(
          // `align-middle`: inline-flex defaultet auf baseline → Höhenversatz
          // zwischen Pills mit verschiedenen Icon-Höhen.
          'pill-hover inline-flex items-center align-middle rounded-md border border-border overflow-hidden cursor-pointer text-muted-foreground',
          CONTROL_SIZE[effectiveSize].height,
          CONTROL_SIZE[effectiveSize].text,
          PILL[effectiveSize].surface,
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:bg-accent/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
      >
        {leading}
        <span data-slot="select-label" className={cn('items-center min-w-0 font-medium', PILL[effectiveSize].tail, SHOW_FROM[compactBelow])}>
          <span className="truncate">{children}</span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className={cn('shrink-0', chevron)} />
          </SelectPrimitive.Icon>
        </span>
      </SelectPrimitive.Trigger>
    </TriggerSizeContext.Provider>
  )
}

// ─── Select.TriggerIcon ────────────────────────────────────────────────────
// Border-bündiges Quadrat für `leading` am Pill-Trigger; die Kantenlänge
// folgt der Trigger-Größe. Eigene Tönung (z. B. Kategorie-Farbe) per className.

export interface SelectTriggerIconProps {
  /** Default `neutral`. */
  tone?: 'neutral' | 'primary'
  className?: string
  children: ReactNode
}

function SelectTriggerIcon({tone = 'neutral', className, children}: SelectTriggerIconProps) {
  const size = useContext(TriggerSizeContext)
  return (
    <span
      data-slot="select-trigger-icon"
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden [&_svg]:size-3.5',
        TRIGGER_ICON_BOX[size],
        tone === 'primary' ? 'bg-primary/12 text-primary' : 'bg-surface-2 text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

// ─── Select.IconTrigger ────────────────────────────────────────────────────
// Icon-only-Trigger (z. B. Org-Switcher) mit Tooltip. `children` = das Icon.

export interface SelectIconTriggerProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'> {
  /** Tooltip-Text und accessible Name. */
  tooltip: string
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

function SelectIconTrigger({tooltip, children, className, ...rest}: SelectIconTriggerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SelectPrimitive.Trigger
          aria-label={tooltip}
          data-slot="select-trigger"
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2 rounded-md cursor-pointer hover:bg-accent/50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            className,
          )}
          {...rest}
        >
          {children}
        </SelectPrimitive.Trigger>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

// ─── Select.Content ────────────────────────────────────────────────────────
// Portal-Panel. `z-60` liegt über Dialog-Overlay und -Content (beide z-50).

const DEFAULT_MAX_HEIGHT = 'min(360px, var(--radix-select-content-available-height))'

export interface SelectContentProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, 'children'> {
  children: ReactNode
  /** Mindestbreite in px; mindestens aber Trigger-Breite. Default 200. */
  minWidth?: number
  /** CSS-Länge oder px. Default `min(360px, verfügbare Höhe)`. */
  maxHeight?: number | string
  ref?: Ref<HTMLDivElement>
}

function SelectContent({
  children, minWidth = 200, maxHeight = DEFAULT_MAX_HEIGHT, className, position = 'popper', sideOffset = 6, align = 'start', style, ...rest
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        align={align}
        data-slot="select-content"
        className={cn(
          'relative z-60 overflow-hidden bg-card border border-border rounded-lg shadow-floating',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        style={{minWidth: `max(${minWidth}px, var(--radix-select-trigger-width))`, maxHeight, ...style}}
        {...rest}
      >
        <SelectPrimitive.Viewport className="p-0">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ─── Select.Item / Select.ClearItem ────────────────────────────────────────

export interface SelectItemProps {
  value: string
  /** Führendes Visual (Dot, Icon, Avatar, Glyph, …). */
  leading?: ReactNode
  /** Sekundärer Text rechts vor dem Häkchen (z. B. Kürzel). */
  meta?: ReactNode
  disabled?: boolean
  className?: string
  children: ReactNode
}

function SelectItem({value, leading, meta, disabled, className, children}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      data-slot="select-item"
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 body-sm text-left text-foreground cursor-pointer outline-none transition-colors select-none',
        'data-[highlighted]:bg-accent/50',
        'data-[state=checked]:bg-accent/30',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
    >
      {leading}
      <SelectPrimitive.ItemText asChild>
        <span className="flex-1 truncate">{children}</span>
      </SelectPrimitive.ItemText>
      {meta != null && <span className="caption text-muted-foreground mono ml-2 shrink-0">{meta}</span>}
      <SelectPrimitive.ItemIndicator asChild>
        <Check strokeWidth={3} className="size-3 text-primary shrink-0" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export interface SelectClearItemProps {
  leading?: ReactNode
  children: ReactNode
}

/** „Alle"/leer-Zeile — wählt `null`. */
function SelectClearItem({leading, children}: SelectClearItemProps) {
  return (
    <SelectItem value={CLEAR_VALUE} leading={leading}>
      {children}
    </SelectItem>
  )
}

// ─── Select.Separator / Select.GroupLabel ──────────────────────────────────

function SelectSeparator({className}: {className?: string}) {
  return <SelectPrimitive.Separator className={cn('my-1 h-px bg-border', className)} />
}

/** Nicht wählbare Überschrift über einer Gruppe von Items. */
function SelectGroupLabel({className, children}: {className?: string; children: ReactNode}) {
  return (
    <div data-slot="select-group-label" className={cn('px-3 pt-2 pb-1 caption font-medium text-muted-foreground select-none', className)}>
      {children}
    </div>
  )
}

// ─── Convenience ───────────────────────────────────────────────────────────

export interface SelectOption<T extends string> {
  value: T
  label: ReactNode
  /** Führendes Visual in Zeile und (bei Auswahl) im Trigger. */
  leading?: ReactNode
  /** Sekundärer Text rechts in der Zeile. */
  meta?: ReactNode
  disabled?: boolean
}

type SelectBase<T extends string> = {
  value: T | null
  options: ReadonlyArray<SelectOption<T>>
  /** Default `field`. */
  variant?: SelectVariant
  /** Default: `field` → `lg`, `pill` → `xs`. */
  size?: ControlSize
  /** Trigger-Inhalt ohne Auswahl (ohne `clearLabel`). */
  placeholder?: ReactNode
  /** Nur `pill`: blendet das Label unterhalb des Breakpoints aus. */
  compactBelow?: Breakpoint
  disabled?: boolean
  /** Default: ID aus dem umgebenden `FormField`. */
  id?: string
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange' | 'children'>

export type SelectProps<T extends string> = SelectBase<T> & (
  | {clearLabel?: undefined; onChange: (value: T) => void}
  /** `clearLabel` fügt oben eine „Alle"-Zeile ein; Auswahl → `onChange(null)`. */
  | {clearLabel: string; onChange: (value: T | null) => void}
)

export function Select<T extends string>(props: SelectProps<T>) {
  const {
    value, options, variant = 'field', size, placeholder, compactBelow, disabled, id, className,
    clearLabel, onChange, ...rest
  } = props
  const selected = value != null ? options.find(o => o.value === value) ?? null : null

  const handleChange = (next: string | null) => {
    if (clearLabel !== undefined) onChange(next as T | null)
    else if (next !== null) onChange(next as T)
  }

  // Pill: Wert mit „Alle"-Präfix als accessible Name („Status: Open"). Field
  // bekommt den Namen vom <label> des FormField.
  const selectedText = selected && typeof selected.label === 'string' ? selected.label : null
  const pillAriaLabel = variant !== 'pill'
    ? undefined
    : selectedText != null
      ? (clearLabel ? `${clearLabel}: ${selectedText}` : selectedText)
      : clearLabel

  // Convenience-Leading ist ein kleines Inline-Symbol, kein border-bündiges
  // Quadrat — im Pill daher links eingerückt.
  const leading = selected?.leading == null
    ? undefined
    : variant === 'pill'
      ? <span className="inline-flex shrink-0 items-center pl-2.5">{selected.leading}</span>
      : <span className="inline-flex shrink-0 items-center">{selected.leading}</span>

  const emptyContent = clearLabel ?? placeholder
  const triggerContent = selected
    ? selected.label
    : variant === 'field'
      ? <span className="text-muted-foreground">{emptyContent}</span>
      : emptyContent

  return (
    <SelectRoot value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger
        variant={variant}
        size={size}
        compactBelow={compactBelow}
        leading={leading}
        id={id}
        className={className}
        aria-label={pillAriaLabel}
        {...rest}
      >
        {triggerContent}
      </SelectTrigger>
      <SelectContent>
        {clearLabel !== undefined && <SelectClearItem>{clearLabel}</SelectClearItem>}
        {options.map(o => (
          <SelectItem key={o.value} value={o.value} disabled={o.disabled} leading={o.leading} meta={o.meta}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

Select.Root = SelectRoot
Select.Trigger = SelectTrigger
Select.TriggerIcon = SelectTriggerIcon
Select.IconTrigger = SelectIconTrigger
Select.Content = SelectContent
Select.Item = SelectItem
Select.ClearItem = SelectClearItem
Select.Separator = SelectSeparator
Select.GroupLabel = SelectGroupLabel
