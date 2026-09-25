'use client'

// `Dropdown` als **Compound Component** auf Radix Select: ein Compound-
// Primitive, dessen Teile Konsumenten zu eigenen Varianten komponieren.
// „Icon" ist ein Slot an Row/Pill, keine eigene Komponente.
//
// Warum Compound statt Render-Props/Mode-Flags: Radix Select IST schon ein
// Compound (`Select.Root/.Trigger/.Content/.Item`). Eine Fassade mit
// `trigger='pill'|'avatar'`, Render-Callbacks und Boolean-Flags wäre „boolean
// prop proliferation". Hier liegt die Geometrie einmal, Konsumenten
// komponieren die Teile.
//
// Zwei Nutzungsformen:
//   1. Convenience `<Dropdown options={…} />` — simple Text/Inline-Icon-Listen
//      (Status-, Prio-, Typ-Filter). Trigger-Icon = Row-Icon (beide inline).
//   2. Compound `<Dropdown.Root>…<Dropdown.Pill/.Avatar>…<Dropdown.Content>
//      <Dropdown.Row>` — reiche Fälle mit border-flush Trigger-Icon ≠ Row-Icon
//      oder Avatar-Trigger (z. B. Org-Switcher).
//      Die Convenience baut intern auf denselben Teilen → eine Quelle.
//
// Bewusst direkt auf `@radix-ui/react-select`, nicht auf `../ui/select` —
// shadcn-Defaults (Trigger `h-10 px-3`, Item `pl-8` + Indicator
// links) decken den Filter-Pill-Look nicht. Form-Felder (`SelectField`) sind
// ein eigener Input-Look-Use-Case auf shadcn-`<Select>`.
//
// React 19: kein `forwardRef` — `ref` ist reguläre Prop.

import type {ComponentPropsWithoutRef, ReactNode, Ref} from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {Check, ChevronDown} from '../atoms/icons'
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'
import {cn} from '../lib/cn'

/** Sentinel für die „Alle"/null-Option (Radix-Select-Values sind Strings). */
export const DROPDOWN_ALL_VALUE = '__all__'

export type DropdownSize = 'sm' | 'md' | 'chip'

/**
 * Geometrie-Tabelle pro Size — Höhe, Font, Chevron, Label-Cap, Tail-Padding,
 * Icon-Slot.
 *   - `sm` (26 px, 12 px Font, 24×24 Icon-Slot) — FilterBars.
 *   - `md` (36 px, 14 px Font, 34×34 Icon-Slot) — Page-Toolbars.
 *   - `chip` (32 px, 14 px Font, 30×30 Icon-Slot) — Editor-Property-Bars.
 */
export const DROPDOWN_SIZE: Record<DropdownSize, {
  height: number
  fontSize: number
  chevron: number
  tailMaxWidth: string
  tailPadding: string
  iconBox: number
}> = {
  sm: {height: 26, fontSize: 12, chevron: 11, tailMaxWidth: 'max-w-[140px]', tailPadding: 'gap-1.5 px-2.5', iconBox: 24},
  md: {height: 36, fontSize: 14, chevron: 14, tailMaxWidth: 'max-w-[180px]', tailPadding: 'gap-2 px-3', iconBox: 34},
  chip: {height: 32, fontSize: 14, chevron: 12, tailMaxWidth: 'max-w-[160px]', tailPadding: 'gap-1.5 px-2.5', iconBox: 30},
}

// Hintergrund pro Size — `sm` auf bg-card-FilterBar → eigene Card-Fläche;
// `md` auf Page-Fläche → transparent; `chip` (Dialog) → `bg-background`.
const BG_BY_SIZE: Record<DropdownSize, string> = {
  sm: 'bg-card',
  md: 'bg-transparent',
  chip: 'bg-background',
}

/** Breakpoints für `compactBelow` — versteckt den Label-Tail unter Schwellwert
 *  (icon-only-Mode für schmale Viewports). */
export type DropdownBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'

const SHOW_TAIL_AT: Record<DropdownBreakpoint, string> = {
  sm: 'hidden sm:inline-flex',
  md: 'hidden md:inline-flex',
  lg: 'hidden lg:inline-flex',
  xl: 'hidden xl:inline-flex',
  '2xl': 'hidden 2xl:inline-flex',
  none: 'inline-flex',
}

// ─── Dropdown.Root ────────────────────────────────────────────────────────
// Select.Root + null↔ALL-Sentinel-Mapping. `value: string | null` (null =
// „Alle"-Option aktiv). Wer eine andere Wert-Semantik braucht (Tri-State),
// mappt extern auf `string | null`.

interface DropdownRootProps {
  value: string | null
  onValueChange: (next: string | null) => void
  disabled?: boolean
  children: ReactNode
}

function DropdownRoot({value, onValueChange, disabled, children}: DropdownRootProps) {
  return (
    <SelectPrimitive.Root
      value={value ?? DROPDOWN_ALL_VALUE}
      onValueChange={v => onValueChange(v === DROPDOWN_ALL_VALUE ? null : v)}
      disabled={disabled}
    >
      {children}
    </SelectPrimitive.Root>
  )
}

// ─── Dropdown.Pill ──────────────────────────────────────────────────────────
// Filter-Pill-Trigger: border-flush Icon-Slot + Label-Tail + Chevron.
// `icon` ist ein Slot (ReactNode), `children` das Label.

interface DropdownPillProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'> {
  size?: DropdownSize
  /** Border-flush Icon (oder kleines Inline-Icon). Vor dem Tail-Span. */
  icon?: ReactNode
  /** Label im Tail-Span. */
  children: ReactNode
  /** Versteckt Tail (Label + Chevron) unter diesem Breakpoint (icon-only). */
  compactBelow?: DropdownBreakpoint
  ref?: Ref<HTMLButtonElement>
}

function DropdownPill({size = 'sm', icon, children, compactBelow = 'none', className, style, ...rest}: DropdownPillProps) {
  const geo = DROPDOWN_SIZE[size]
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'pill-hover inline-flex items-center align-middle rounded-md border border-border cursor-pointer overflow-hidden text-muted-foreground',
        BG_BY_SIZE[size],
        'focus:outline-none data-[state=open]:bg-accent/40',
        className,
      )}
      style={{
        height: geo.height,
        fontSize: geo.fontSize,
        fontWeight: 500,
        // inline-flex defaultet auf `baseline`
        // → divergente Baselines bei verschiedenen Icon-Höhen → Höhenversatz.
        verticalAlign: 'middle',
        ...style,
      }}
      {...rest}
    >
      {icon}
      <span className={cn('items-center min-w-0', geo.tailPadding, geo.tailMaxWidth, SHOW_TAIL_AT[compactBelow])}>
        <span className="truncate">{children}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown width={geo.chevron} height={geo.chevron} className="shrink-0" />
        </SelectPrimitive.Icon>
      </span>
    </SelectPrimitive.Trigger>
  )
}

// ─── Dropdown.Avatar ──────────────────────────────────────────────────────
// Icon-only-Trigger (Org-Switcher-Form) + Tooltip. `children` = das Icon.

interface DropdownAvatarProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'> {
  /** Tooltip-Text + a11y-Label. */
  tooltip: string
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

function DropdownAvatar({tooltip, children, className, ...rest}: DropdownAvatarProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SelectPrimitive.Trigger
          aria-label={tooltip}
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2 rounded-md cursor-pointer hover:bg-accent/50 focus:outline-none',
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

// ─── Dropdown.Content ───────────────────────────────────────────────────────
// Portal + Popover-Panel: `bg-card border rounded-lg shadow-floating`, `p-0`
// Viewport, `minWidth=200`, `sideOffset=6`.

interface DropdownContentProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, 'children'> {
  children: ReactNode
  minWidth?: number
  maxHeight?: number
  ref?: Ref<HTMLDivElement>
}

function DropdownContent({
  children, minWidth = 200, maxHeight, className, position = 'popper', sideOffset = 6, align = 'start', style, ...rest
}: DropdownContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'relative z-50 overflow-hidden bg-card border border-border rounded-lg shadow-floating',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        style={{minWidth, ...(maxHeight ? {maxHeight, overflowY: 'auto'} : {}), ...style}}
        {...rest}
      >
        <SelectPrimitive.Viewport className="p-0">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// ─── Dropdown.Row / Dropdown.AllRow ─────────────────────────────────────────
// Auswahl-Zeile (Select.Item): `flex items-center gap-2.5 px-3 py-2`,
// selected → `bg-accent/30`, Check rechts (12 px). `icon`/`meta` sind Slots, `children` das Label.

interface DropdownRowProps {
  value: string
  disabled?: boolean
  /** Führendes Visual (Dot, Icon, Avatar, Glyph, …). */
  icon?: ReactNode
  /** Trailing vor dem Check (z. B. Kürzel in mono). */
  meta?: ReactNode
  children: ReactNode
}

function DropdownRow({value, disabled, icon, meta, children}: DropdownRowProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 body-sm text-left text-foreground cursor-pointer outline-none transition-colors select-none',
        'hover:bg-accent/50 focus:bg-accent/50',
        'data-[state=checked]:bg-accent/30',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      )}
    >
      {icon}
      <SelectPrimitive.ItemText asChild>
        <span className="flex-1 truncate">{children}</span>
      </SelectPrimitive.ItemText>
      {meta != null && <span className="caption text-muted-foreground mono ml-2 shrink-0">{meta}</span>}
      <SelectPrimitive.ItemIndicator asChild>
        <Check width={12} height={12} strokeWidth={3} className="text-primary shrink-0" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

/** Row, vorgebunden an den „Alle"-Sentinel — versteckt den ALL_VALUE-String. */
function DropdownAllRow({icon, children}: {icon?: ReactNode; children: ReactNode}) {
  return (
    <DropdownRow value={DROPDOWN_ALL_VALUE} icon={icon}>
      {children}
    </DropdownRow>
  )
}

// ─── Dropdown.Separator ─────────────────────────────────────────────────────
function DropdownSeparator({className}: {className?: string}) {
  return <SelectPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-muted', className)} />
}

// ─── Convenience: options-array Dropdown (Text + Inline-Icon) ───────────────

export interface DropdownOption<T extends string> {
  value: T
  label: ReactNode
  /** Optionales Inline-Icon (Trigger bei aktiver Option + Row). */
  icon?: ReactNode
  /** Optionaler Meta-Text rechts in der Row. */
  meta?: ReactNode
  disabled?: boolean
}

interface DropdownProps<T extends string> {
  value: T | null
  onChange: (next: T | null) => void
  options: ReadonlyArray<DropdownOption<T>>
  /** Trigger-Empty-State + Label der null-Option. */
  allLabel?: string
  /** Empty-State-Label ohne null-Option (z. B. Form-Pflicht). */
  placeholder?: ReactNode
  /** null-Option anbieten. Default `true`. */
  allowClear?: boolean
  disabled?: boolean
  size?: DropdownSize
  className?: string
  id?: string
  'data-testid'?: string
}

export function Dropdown<T extends string>({
  value, onChange, options, allLabel, placeholder, allowClear = true,
  disabled, size = 'sm', className, id, 'data-testid': testId,
}: DropdownProps<T>) {
  const selected = value != null ? options.find(o => o.value === value) ?? null : null
  const emptyLabel = allLabel ?? ''
  const selectedText = selected && typeof selected.label === 'string' ? selected.label : null
  // Ohne `allLabel` kein „: <Wert>"-Präfix; ohne beides übernimmt der
  // Trigger-Inhalt den accessible Name.
  const ariaLabel = selectedText != null
    ? (allLabel ? `${allLabel}: ${selectedText}` : selectedText)
    : allLabel || undefined
  // Convenience-Icons sind kleine Inline-Symbole (size-4), keine border-flush
  // Squares. Daher mit linkem Padding (`pl-2.5`, konsistent zur Row-`gap-2.5`)
  // statt am Border zu kleben. Der flush `icon`-Slot bleibt den Compound-
  // Usages (full-height Square) vorbehalten.
  const triggerIcon = selected?.icon != null
    ? <span className="inline-flex shrink-0 items-center pl-2.5">{selected.icon}</span>
    : undefined
  return (
    <DropdownRoot value={value} onValueChange={v => onChange(v as T | null)} disabled={disabled}>
      <DropdownPill size={size} icon={triggerIcon} className={className} id={id} data-testid={testId} aria-label={ariaLabel}>
        {selected ? selected.label : placeholder ?? emptyLabel}
      </DropdownPill>
      <DropdownContent>
        {allowClear && allLabel != null && <DropdownAllRow>{allLabel}</DropdownAllRow>}
        {options.map(o => (
          <DropdownRow key={o.value} value={o.value} disabled={o.disabled} icon={o.icon} meta={o.meta}>
            {o.label}
          </DropdownRow>
        ))}
      </DropdownContent>
    </DropdownRoot>
  )
}

// Compound-Teile als Statics — `<Dropdown.Root>…<Dropdown.Pill>…` für reiche
// Fälle; `<Dropdown options={…} />` als Convenience für simple Listen.
Dropdown.Root = DropdownRoot
Dropdown.Pill = DropdownPill
Dropdown.Avatar = DropdownAvatar
Dropdown.Content = DropdownContent
Dropdown.Row = DropdownRow
Dropdown.AllRow = DropdownAllRow
Dropdown.Separator = DropdownSeparator
