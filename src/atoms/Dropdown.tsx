'use client'

// PUL-446-followup: `Dropdown` als **Compound Component** (Vercel
// composition-patterns) auf Radix Select. Es gibt KEINE „L1/L2/L3"-Ebenen —
// ein Compound-Primitive + dünne explizite Varianten (Context/Bucket/
// OrgSwitcher), die seine Teile komponieren. „Icon" ist ein Slot an Row/Pill,
// keine eigene Komponente.
//
// Warum Compound statt Render-Props/Mode-Flags: Radix Select IST schon ein
// Compound (`Select.Root/.Trigger/.Content/.Item`). Frühere Iterationen haben
// das in eine `DropdownWithIcon`-Fassade mit `trigger='pill'|'avatar'`,
// `renderTriggerIcon`/`renderRowIcon`-Callbacks + `allowAll`/`extraRow`-Flags
// gewickelt — genau die „boolean prop proliferation", die das composition-
// patterns-Skill (HIGH-Prio) verbietet. Hier liegt die Pulse-Geometrie einmal,
// Konsumenten komponieren die Teile.
//
// Zwei Nutzungsformen:
//   1. Convenience `<Dropdown options={…} />` — simple Text/Inline-Icon-Listen
//      (Status-, Prio-, Typ-Filter). Trigger-Icon = Row-Icon (beide inline).
//   2. Compound `<Dropdown.Root>…<Dropdown.Pill/.Avatar>…<Dropdown.Content>
//      <Dropdown.Row>` — reiche Fälle mit border-flush Trigger-Icon ≠ Row-Icon
//      (ContextDropdown, BucketDropdown) oder Avatar-Trigger (OrgSwitcher).
//      Die Convenience baut intern auf denselben Teilen → eine Quelle.
//
// Geometrie (Höhe/Font/Chevron/Padding/Icon-Box) ist 1:1 das alte
// FilterPillButton + FilterPopover-Design (Pre-Cascade, pixelverifiziert).
// Bewusst direkt auf `@radix-ui/react-select`, nicht auf `@/components/ui/
// select` — shadcn-Defaults (Trigger `h-10 px-3`, Item `pl-8` + Indicator
// links) decken den Filter-Pill-Look nicht. Form-Felder (`molecules/form/
// Dropdown`) sind ein eigener Input-Look-Use-Case auf shadcn-`<Select>`.
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
 * Icon-Slot. 1:1 aus dem alten FilterPillButton (PUL-320/-384/-429).
 *   - `sm` (26 px, 12 px Font, 24×24 Icon-Slot) — FilterBars (Todo, Inbox).
 *   - `md` (36 px, 14 px Font, 34×34 Icon-Slot) — Missions-Toolbar.
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

// Hintergrund pro Size — `sm` (Todo) auf bg-card-FilterBar → eigene Card-
// Fläche; `md` (Missions) auf Page-Fläche → transparent; `chip` (Dialog) →
// `bg-background`.
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
// mappt extern auf `string | null` (siehe ContextDropdown inbox).

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
        // Pulse-Fix (aus FilterPillButton): inline-flex defaultet auf `baseline`
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
// Portal + Popover-Panel. Wie der alte FilterPopoverContent: `bg-card border
// rounded-lg shadow-floating`, `p-0` Viewport, `minWidth=200`, `sideOffset=6`.

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
// Auswahl-Zeile (Select.Item). Markup 1:1 wie alter FilterPopoverRow:
// `flex items-center gap-2.5 px-3 py-2`, selected → `bg-accent/30`, Check
// rechts (12 px). `icon`/`meta` sind Slots, `children` das Label.

interface DropdownRowProps {
  value: string
  disabled?: boolean
  /** Führendes Visual (Dot, Icon, ContextChip, ProviderGlyph, …). */
  icon?: ReactNode
  /** Trailing vor dem Check (z. B. Provider-Label mono). */
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
  const ariaLabel = selected && typeof selected.label === 'string' ? `${emptyLabel}: ${selected.label}` : emptyLabel
  // Convenience-Icons sind kleine Inline-Symbole (size-4), keine border-flush
  // Squares. Daher mit linkem Padding (`pl-2.5`, konsistent zur Row-`gap-2.5`)
  // statt am Border zu kleben. Der flush `icon`-Slot bleibt den Compound-
  // Usages (Bucket/Context: full-height Square) vorbehalten.
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
