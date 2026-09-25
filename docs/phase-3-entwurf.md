# Phase 3 „Konsolidieren" — Entwurf

Arbeitsdokument zu `docs/konsolidierung.md` § Phase 3. Verbindliche Spezifikation für die Umsetzung; wird mit dem Release v2.0.0 gelöscht (Inhalt wandert ins README und ins CHANGELOG).

## Entscheidungen des Product Owners (2026-09-25)

- SegmentedControl hat nur die Thumb-Optik, auch in den Filterleisten (kein `variant="group"`).
- Button-Default ist `md` (36 px); Pulse-Buttons ohne size bekommen explizit `size="lg"`.
- Dialoge mit `ui/field` übernehmen die FormField-Label-Optik (keine zweite Label-Variante).

## Grundentscheidungen

- **Kein cmdk.** Die Combobox baut auf `@radix-ui/react-popover` (bereits Dependency) plus eigener Listbox mit `aria-activedescendant` (Fokus bleibt im Such-Input bzw. auf der Listbox, kein Roving Tabindex). Radix liefert Positionierung/Flip, Outside-Click, Escape, Fokus-Rückgabe; `usePopoverPosition` und der z-1000-Hack entfallen. Pulse entfernt das ungenutzte `cmdk` aus seiner `package.json`.
- **`ui/` wird reiner Vendor.** Alle Eigenbauten wandern in die Layer, auch `Button` (bekommt `tone`/`busy`/`icon`, wird `atoms/Button.tsx`, Root-Export; Subpath `ui/button` entfällt). Dokumentierte Vendor-Änderungen: `ui/card` (`interactive`), `ui/alert-dialog` (Button-Props).
- **Callbacks:** Wert-Controls haben `value` + `onChange(next)`. Nur das Compound `Select.Root` behält Radix' `onValueChange`.
- **Icons:** Eine Prop `icon` ist immer eine Komponenten-Referenz `IconComponent`, das DS setzt die Größe. Beliebige Visuals (Dots, Glyphen, Avatare) gehen als `ReactNode` in `leading`/`trailing`.
- **Test-IDs:** Das DS verdrahtet keine `data-testid`. Interne Teile markiert `data-slot="…"`. `data-*`/`aria-*` werden per Rest-Spread aufs primäre Element durchgereicht.
- **Public API:** `formatAbsoluteDate` (Pulse übernimmt den Intl-Formatter in `app/src/lib/datetime.ts`), `usePopoverPosition` (gelöscht), `DROPDOWN_SIZE` (ersetzt durch `Select.TriggerIcon`), `DROPDOWN_ALL_VALUE` (intern) fliegen raus.
- **SyncButton bleibt in Pulse** als reiner State-Wrapper (Promise, `syncing`, Re-Entry-Guard) und rendert nur DS-Props. `SyncIconButton` wird gelöscht.

## A. Vokabular

### size — eine Control-Skala

| size | Höhe | Tailwind | Text-Rolle | Icon | typischer Ort |
|---|---|---|---|---|---|
| `xs` | 26 px | `h-6.5` | `caption` | 12 px | Filterleisten (Pills, Suche, Chips) |
| `sm` | 32 px | `h-8` | `body-sm` | 14 px | Property-Bars in Dialogen, IconButtons |
| `md` | 36 px | `h-9` | `body` | 16 px | Page-Toolbars, Header-Aktionen |
| `lg` | 40 px | `h-10` | `body` | 16 px | Formularfelder, `field-shell` |

- Tabelle einmal in `src/lib/variants.ts` als `CONTROL_SIZE`, dazu Typen `ControlSize`, `Tone`, `Breakpoint`, `IconComponent` (exportiert) und die Map `SHOW_FROM` für `compactBelow`.
- Defaults: Button `md` · IconButton `sm` · Chip `xs` · Select `pill` `xs` / `field` `lg` · Combobox fest `lg` · DatePicker `lg` · SearchInput `lg` · SegmentedControl `lg` · ItemActionsMenu `sm`.
- Erlaubte Werte: Button/IconButton/Select/ItemActionsMenu alle vier · Chip `xs|sm` · DatePicker `sm|lg` · SearchInput `xs|lg` (`xs` = randlose Filterleisten-Optik) · SegmentedControl `xs|lg`.
- Eigene Skalen (dokumentierte Ausnahmen): `Icon` `xs`–`lg` (12/14/16/20) · `Avatar` `xs`–`2xl` (20/24/32/40/56/80, `2xl` neu) · `DetailDialogWrapper` `sm`–`xl` (Dialog-Breiten) · `Badge` ohne size, nur `compact`.

### tone — semantische Farbe

`Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'destructive'`

`neutral` → `--secondary`/`--surface-2`/`--muted-foreground`; sonst das gleichnamige Token. Umbenennungen: `warn` → `warning`, `danger` → `destructive`, `muted` → `neutral`, Button-`default` → `primary`.

### variant — visuelle Form, nie Farbe

- Button: `solid | outline | ghost | link`
- IconButton: `quiet | ghost` (`quiet` = heute: in Ruhe muted, Ton erst bei Hover; `ghost` = Ton schon in Ruhe)
- Badge: `solid | soft | outline | plain`
- Select: `field | pill`
- EmptyState: `plain | dashed` (heute `tone`)
- InfoBanner: `muted | subtle` (heute `tone`)
- KpiTile: `variant` bleibt (`default | emphasis | muted`), neu `tone: neutral|success|warning|destructive`

### Weitere Regeln

- `className` an jeder Komponente in atoms/molecules/organisms (nachzurüsten u. a. Donut, EditableInlineHeading, EditableSection, Sparkline, ThemeToggle, EmptyState, ItemActionsMenu, PageHeader, SelectableTile, SelectedItemsBar, AppShell, FormDialog, IconUploadCropDialog, RouteErrorState, UserMenu).
- `compactBelow?: Breakpoint` (`'sm'|'md'|'lg'|'xl'|'2xl'|'none'`) blendet das Label unterhalb des Breakpoints aus — an `Select.Trigger` (pill) und `Chip`.
- `busy?: boolean` an Button/IconButton: `aria-busy`, `data-busy`, Klicks ignoriert, keine Disabled-Optik, Icon dreht (`animate-spin`).

## B. Konsolidierungen

### B0. Buttons (Fundament)

```ts
// atoms/Button.tsx (ersetzt ui/button.tsx; Subpath entfällt)
type ButtonTone = Extract<Tone, 'primary' | 'neutral' | 'success' | 'destructive'>
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'  // default 'solid'
  tone?: ButtonTone          // default: solid/link → 'primary', outline/ghost → 'neutral'
  size?: ControlSize         // default 'md'
  icon?: IconComponent       // führendes Icon, vom Button dimensioniert
  busy?: boolean
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}
export { Button, buttonVariants }

// atoms/IconButton.tsx (ersetzt ui/icon-button.tsx)
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'quiet' | 'ghost'  // default 'quiet'
  tone?: ButtonTone            // default 'neutral'
  size?: ControlSize           // default 'sm'; Box/Icon: xs 26/12, sm 32/14, md 36/16, lg 40/16
  busy?: boolean
  ref?: Ref<HTMLButtonElement>
}
```

Button alt → neu: `variant="default"` → weglassen · `secondary` → `tone="neutral"` · `success`/`destructive` → `tone` · `outline`/`ghost`/`link` bleiben · `size="sm"` (36) → `md` · ohne size (40) → `size="lg"` · `lg` (44) → `lg` · `size="icon"` → `<IconButton size="lg">`.

IconButton alt → neu: `variant="muted|primary|success|destructive"` → `tone="neutral|primary|success|destructive"` · `size="default"` → `sm` (Icon 14 statt 16 px).

AlertDialogAction `variant="destructive"` → `tone="destructive"`. `SaveButton`/`CancelButton` → `molecules/FormActions.tsx`, `SaveButton.loading` → `busy`.

Pulse-Workarounds: `SyncIconButton` → `<IconButton variant="ghost" tone="primary" busy>`; SyncButton mit Label → `<Button tone="primary" icon={RefreshCw} busy>`; `className='h-[26px] gap-1.5 px-2.5'` → `size="xs"`.

### B1. Selects — `Select` (Radix Select) + `Combobox` (Radix Popover)

`atoms/Select.tsx` ersetzt `atoms/Dropdown.tsx`, `atoms/SelectField.tsx`, `ui/select.tsx`.

```ts
interface SelectOption<T extends string> { value: T; label: ReactNode; leading?: ReactNode; meta?: ReactNode; disabled?: boolean }
type SelectBase<T extends string> = {
  value: T | null
  options: ReadonlyArray<SelectOption<T>>
  variant?: 'field' | 'pill'        // default 'field'
  size?: ControlSize                // default field→'lg', pill→'xs'
  placeholder?: ReactNode
  compactBelow?: Breakpoint         // nur pill
  disabled?: boolean
  id?: string                       // sonst useFormFieldId()
  className?: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange' | 'children'>
export type SelectProps<T extends string> = SelectBase<T> & (
  | { clearLabel?: undefined; onChange: (value: T) => void }
  | { clearLabel: string; onChange: (value: T | null) => void }  // „Alle"-Zeile, null = geleert
)
// Compound:
Select.Root        // { value: string|null; onValueChange(next: string|null); disabled?; children }
Select.Trigger     // { variant?; size?; leading?; compactBelow?; children } + Radix-Trigger-Props; setzt SizeContext
Select.TriggerIcon // { tone?: 'neutral'|'primary'; children } — border-bündiges Quadrat (Höhe−2)
Select.IconTrigger // { tooltip: string; children } (ex Dropdown.Avatar)
Select.Content     // { minWidth? = 200; maxHeight? = 'min(360px, var(--radix-select-content-available-height))' }
Select.Item        // { value; leading?; meta?; disabled?; children }
Select.ClearItem   // { leading?; children } (ex AllRow)
Select.Separator
Select.GroupLabel  // { children }
```

`atoms/Combobox.tsx` ersetzt `atoms/RichSelect.tsx` und `hooks/use-popover-position.ts`.

```ts
interface ComboboxItem { id: string; label: ReactNode; sub?: ReactNode; disabled?: boolean }
interface ComboboxLabels { placeholder; searchPlaceholder; noResults; noOptions }  // Key 'combobox'
interface ComboboxProps<T extends ComboboxItem> extends Omit<ComponentPropsWithoutRef<'button'>, 'value'|'onChange'|'children'> {
  items: ReadonlyArray<T>
  value: string | null
  onChange: (id: string, item: T) => void
  searchable?: boolean
  filterItem?: (item: T, query: string) => boolean
  renderSelected?: (item: T) => ReactNode
  renderItem?: (item: T) => ReactNode
  leading?: ReactNode
  placeholder?: ReactNode
  searchPlaceholder?: string
  disabled?: boolean
  id?: string
  className?: string
  labels?: Partial<ComboboxLabels>
}
```

Combobox-Verhalten: Trigger `button[role=combobox][aria-haspopup=listbox][aria-expanded][aria-controls]`; Listbox-ID aus `useId()`, Option-IDs `${listId}-${i}`. Mit `searchable` hat das Input den Fokus (`role=combobox`, `aria-activedescendant`, `aria-autocomplete=list`), sonst die Listbox (`tabIndex=0`, `aria-activedescendant`). ↑/↓ (begrenzt, disabled übersprungen), Home/End, Enter wählt; Escape/Tab schließen (Radix). Hover setzt aktiv. Beim Öffnen aktiv: gewählter Eintrag, sonst erster aktivierbarer; `scrollIntoView({block:'nearest'})`. Query-Reset beim Schließen. Portal über Radix. `data-testid` auf dem Trigger.

Mapping:
- `Dropdown` → `<Select variant="pill">`; `size` `sm` → `xs`, `chip` → `sm`, `md` → `md`; `allLabel=X` (Default `allowClear`) → `clearLabel=X`; `allLabel=X allowClear={false}` → `placeholder=X`; Option-`icon` → `leading`.
- `Dropdown.Root/.Content/.Separator` → `Select.Root/.Content/.Separator`; `Dropdown.Pill` → `Select.Trigger variant="pill"` (`icon` → `leading`); `Dropdown.Avatar` → `Select.IconTrigger`; `Dropdown.Row` → `Select.Item`; `Dropdown.AllRow` → `Select.ClearItem`; `DROPDOWN_SIZE[x].iconBox` → `<Select.TriggerIcon tone>`; `style={{maxHeight…}}` entfällt.
- Typen: `DropdownSize` → `ControlSize`, `DropdownBreakpoint` → `Breakpoint`.
- `SelectField` → `<Select>` (field): `size="md"` → Default `lg`, `sm` bleibt.
- `RichSelect` → `Combobox`: `selected={item}` → `value={item?.id ?? null}`; `onSelect(item)` → `onChange((id, item) => …)`; `leadingIcon` → `leading`; `estimatedHeight` entfällt; `RichSelectItem` → `ComboboxItem`.
- DS-intern: `organisms/SubNavLayout.tsx` → `Select`; DS-ESLint-Whitelist nur noch `atoms/DatePicker.tsx`.

### B2. Badge (passiv) + Chip (interaktiv) + SegmentedControl

`atoms/Badge.tsx` ersetzt Pill, CounterPill, MetaPill, IconBadge, IconBadgeDot, `ui/badge`.

```ts
interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  tone?: Tone                                      // default 'neutral'
  variant?: 'solid' | 'soft' | 'outline' | 'plain' // default 'soft'
  shape?: 'pill' | 'rounded'                       // default 'pill'
  compact?: boolean                                // px-1.5 min-w-5 text-center
  leading?: ReactNode
  trailing?: ReactNode
  iconOnly?: boolean                               // Label → title
  href?: string                                    // <a target=_blank rel=noopener>
  children?: ReactNode
}
export function BadgeDot({ className }: { className?: string })
```

`solid`: `bg-{t} text-{t}-foreground` (neutral: `bg-secondary`) · `soft`: `bg-{t}/10 text-{t}` (neutral: `bg-surface-2 text-muted-foreground`) · `outline`: `border-{t}/30 text-{t}` (neutral: `border-border text-foreground`) · `plain`: ohne Chrome. Basis `pill font-medium tabular-nums`, Element `span`. Domain-Tints (Stage, Status, Vocab) setzen App-Wrapper per className auf `variant="outline"` — dokumentiert als einzige legitime Farb-Nutzung von className.

`atoms/Chip.tsx` (Rewrite) ersetzt Chip, FilterChip und Pulses PillToggle/DueChip.

```ts
interface ChipCommon {
  tone?: Tone                 // default 'primary'
  size?: 'xs' | 'sm'          // 26 / 32, default 'xs'
  icon?: IconComponent
  leading?: ReactNode
  compactBelow?: Breakpoint
  className?: string
  children?: ReactNode
}
type ChipToggleProps = ChipCommon & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  active?: boolean; count?: number; onRemove?: undefined
}
type ChipRemovableProps = ChipCommon & Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  onRemove: () => void; prefix?: ReactNode; labels?: Partial<ChipLabels>   // {remove}; Key 'chip'
}
export type ChipProps = ChipToggleProps | ChipRemovableProps
```

Mapping: ui/badge `default` → `solid primary`, `secondary` → `solid neutral`, `destructive` → `solid destructive`, `outline` → `outline` · Overrides `border-success/30 text-success` → `variant="outline" tone="success"` (warning analog) · `caption px-1.5 py-0` → `compact` · `CounterPill` → `<Badge>` (`size="compact"` → `compact`) · `MetaPill` → `<Badge shape="rounded">` (`icon` → `leading`) · `IconBadge` `outline` → `variant="outline"`, `plain` → `variant="plain"`, `chip` → `shape="rounded"` · `FilterChip` → `<Chip onRemove>` (`label` → `prefix`, `size` → `xs`, `tone="custom"` → className, `ariaLabel` → `labels={{remove}}`) · `Chip` `size="sm"` (22) → `xs`, `md` → `sm`, `activeClassName` → `tone` · Pulse `PillToggle`/`DueChip` → `Chip`.

`atoms/SegmentedControl.tsx` ersetzt SegControl und SegmentedSwitch (Optik: gleitender Thumb).

```ts
interface SegmentedControlOption<T extends string> { value: T; label?: ReactNode; icon?: IconComponent; ariaLabel?: string }
interface SegmentedControlProps<T extends string> {
  value: T; options: ReadonlyArray<SegmentedControlOption<T>>; onChange: (next: T) => void
  size?: 'xs' | 'lg'   // default 'lg'
  disabled?: boolean; className?: string; 'aria-label'?: string
}
```

`SegControl` → `size="xs"`; `SegmentedSwitch` → Default `lg`; Icon-Element in `label` → `icon`; ThemeToggle nutzt `icon: Sun|Moon|Monitor`.

### B3. Weitere Dubletten

- **ComingSoon:** `atoms/ComingSoon` bleibt, `ui/coming-soon` wird gelöscht. Props `title?`, `description?`, `size?: 'sm'|'md'|'lg'` (min-h 24/40/64, default `md`), `labels`, HTMLAttributes. i18n-Key `comingSoonCard` entfällt.
- **Avatar:** Atom bleibt, baut intern auf `ui/avatar` (Radix, Bild-Fallback). Props `src`, `initials`, `colorSeed`, `label`, `size: 'xs'…'2xl'`, `shape?: 'rounded'|'circle'` (default `rounded`), `tone?: 'auto'|'primary'|'neutral'` (default `auto`), `showTitle`, `className`. UserMenu nutzt das Atom.
- **Field → FormField:** `ui/field` wird gelöscht. `FormField` injiziert die Field-ID per cloneElement, wenn das Kind ein einzelnes Element ohne `id` ist (zusätzlich zum Context).
- **FormDialog:** privater `SubmitButton` und Inline-`CheckIcon` weg. Footer: `<Button tone={submitTone} icon={submitBusy ? Loader2 : submitIcon ?? (tone==='success' ? Check : undefined)} busy={submitBusy} data-testid={submitTestId}>`, Cancel `<Button variant="ghost">`, beide `md`. Umbenannt: `submitVariant` → `submitTone`, `submitPending` → `submitBusy`, `submitIcon` → `IconComponent`. Neu `className`. `data-portal-popover`-Sonderregel entfällt.
- **Icons:** `IconComponent = ComponentType<LucideProps>`. `Icon` bleibt. `ui/lucide-icon` → `atoms/IconByName` (`{name, size?: IconSize='md', className}`). `IconByKey` gelöscht. `ui/action-icons` → benannte Aliase in `atoms/icons.ts` (Subpath entfällt). `ui/icon-picker` → `molecules/IconPicker` (Root-Export). Icon-Props auf `IconComponent`: `PageHeader.actionIcon`, `EmptyState.icon`, `Chip.icon`, DatePicker-Shortcuts, `KpiTile.icon`, `UserMenuItem.icon`, `SegmentedControlOption.icon`, `FormDialog.submitIcon`. `TextField.leadingIcon/trailingIcon` → `leading/trailing`.
- **Radix-Toast:** `ui/toast.tsx`, `hooks/use-toast.ts`, `@radix-ui/react-toast` löschen.

### B4. `ui/` ausräumen

`ui/button` → `atoms/Button` · `ui/icon-button` → `atoms/IconButton` · `ui/lucide-icon` → `atoms/IconByName` · `ui/action-icons` → `atoms/icons` · `ui/icon-picker` → `molecules/IconPicker` · `ui/card-actions` → `molecules/CardActions` · `ui/form-actions` → `molecules/FormActions` · `ui/coming-soon`, `ui/field`, `ui/badge`, `ui/select`, `ui/toast` → siehe oben. README-Abschnitt „Vendor-Änderungen".

### B5. Konsistenz

- Test-IDs: `PageHeader` `page-header-action` und `EmptyState` `empty-state-action` entfallen; `KpiTile` `kpi-tile-delta` → `data-slot="delta"`; `ItemActionsMenu.testId` (Pflicht) → optionales `data-testid` am Trigger.
- KpiTile `tone` `warn` → `warning`, `danger` → `destructive`. EmptyState/InfoBanner `tone` → `variant`. ItemActionsMenu `size: ControlSize` (`default` → `sm`). DatePicker `size` `default` → `lg`.

### B6. Filter

- `organisms/FilterBar` (config-getrieben, ungenutzt) wird gelöscht, samt i18n-Key `filterBar`.
- Neu `molecules/FilterBar` aus Pulses `FilterBarShell`:

```ts
interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode
  tint?: string | null        // CSS-Farbe der 1,5-px-Border; default --border
  below?: ReactNode           // Zeile unter der Karte (aktive Filter-Chips)
  contentClassName?: string   // gemerged auf 'flex flex-wrap items-center gap-x-3 gap-y-2'
}
```

- `FilterSearch` → `SearchInput size="xs"` (randlos, 26 px, 14-px-Icon, `aria-label` = Placeholder, `w-full md:w-[200px]`); SearchInput behält Clear (IconButton `xs`) und `debounceMs`.

### B7. API-Lücken aus Pulse

- `ui/card`: `interactive?: boolean` → `hover-card cursor-pointer`.
- PageHeader:

```ts
interface PageHeaderProps {
  title: ReactNode; description?: ReactNode
  leading?: ReactNode   // Glyph/Avatar vor dem Titelblock
  meta?: ReactNode      // Zeile unter der Beschreibung
  actionLabel?: string; actionIcon?: IconComponent; onAction?: () => void
  children?: ReactNode; className?: string
}
```

- AppSidebar: `header`/`footer` bekommen `(ctx: {collapsed: boolean; isMobile: boolean; closeMobile: () => void}) => ReactNode`.
- UserMenu:

```ts
type UserMenuItem =
  | { label: string; icon?: IconComponent; href: string }
  | { label: string; icon?: IconComponent; onSelect: () => void; tone?: 'neutral' | 'destructive' }
// + className; Popover schließt bei jeder Item-Aktivierung; footer bleibt.
```

### B8. Tests

Jedes Paket testet, was es baut. Zusätzlich: AppSidebar (Active-State, collapsed, `closeMobile`), DataTable, DetailDialogWrapper, DashboardCard, SectionCardHeader, ScrollableContent, Breadcrumbs (Link-Slot, Labels), Button, IconButton, IconByName, Select, Combobox (Keyboard, eindeutige IDs, im FormDialog).

## C. Pulse-Migration — riskante Stellen

1. **Stille Bedeutungsänderung von `sm`** (Typecheck findet sie nicht): Dropdown `size='sm'` in `MembersToolbar.tsx`, `ClusterHero.tsx`, `BucketPicker.tsx` → `xs`; `size="chip"` in `ObjectiveAssignField.tsx` → `sm`; `ContextDropdown size='sm'` in `InboxItemDetailDialog.tsx` → `xs`; Wrapper-Defaults `BucketDropdown`/`ContextDropdown` `'sm'` → `'xs'`. Nach der Migration nach `size=` an allen Select-/Chip-/Button-Aufrufen greppen.
2. **Tests:** `BucketAttachDialog.test.tsx` (Test-ID sitzt jetzt auf dem Trigger) · `PillToggle.test`/`DueChip.test` löschen · `e2e/capture-signal.spec.ts` `page-header-action` → `getByRole('button', {name})`.
3. **Pulse-ESLint:** Meldungen zu `<select>` (→ Select/Combobox), Verbote für `@meimberg/ui/ui/select` entfallen, PUL-352 → `<Card interactive>`, PUL-413 → `leading`/`meta`, neues Verbot `@meimberg/ui/ui/avatar`.
4. **Pulse-Skripte:** `library-enforcement-allowlist.json` (3 PageHeader-Einträge raus), `check-library-enforcement.ts` (Pill → Badge), `check-atom-overrides.ts` (Kommentar), check-stories (gelöschte Stories).
5. **Combobox im FormDialog:** Popover (Radix-Portal, z-50) gegenüber dem Dialog im Browser prüfen (BucketDialog); falls nötig `z-[60]`.
6. **Sichtbare Deltas** (abgenommen, siehe Entscheidungen): SegControl-Optik, Chip 22 → 26 px, FilterChip ~28 → 26 px, Field-Dialoge mit FormField-Labels, EmailInboxRow-Avatar 36 → 40 px, IconButton-Icon 16 → 14 px (2×), Login-Button 44 → 40 px, FormDialog-Cancel 40 → 36 px.

## D. Arbeitspakete

Reihenfolge: **WP0 → (WP1 ‖ WP2 ‖ WP3 ‖ WP4) → Tag `v2.0.0-next.2` → WP5 (3 Lanes) → WP6.**

- **WP0 Fundament (seriell, DS):** `lib/variants.ts`; `atoms/Button`, `atoms/IconButton` (+ Codemod aller DS-Aufrufer, inkl. `ui/alert-dialog`); `atoms/icons.ts` (Aliase), `atoms/IconByName`, `atoms/Icon` (Typ), `IconByKey`/`ui/action-icons` löschen; Moves `molecules/IconPicker`, `CardActions`, `FormActions` (`busy`); löschen `ui/toast`, `hooks/use-toast`, `organisms/FilterBar`; geteilte Dateien in Endform: `src/index.ts` → `export * from './exports/{core,selects,badges,forms,layout}'`, `src/i18n/messages.ts` → `UiMessages extends` Area-Interfaces aus `src/i18n/areas/*.ts`, `src/i18n/de/index.ts` → Spread aus `src/i18n/de/areas/*.ts`; `package.json` (`@radix-ui/react-toast`, `./ui/action-icons` raus); `formatAbsoluteDate`/`usePopoverPosition` aus dem Root; `examples/next-starter`.
- **WP1 Selects (DS):** `atoms/Select`, `atoms/Combobox`; löschen `Dropdown`, `SelectField`, `RichSelect`, `ui/select`, `hooks/use-popover-position`; `organisms/SubNavLayout`, DS-ESLint; `exports/selects.ts`, i18n selects-Areas, `i18n/de/combobox.ts`.
- **WP2 Badge/Chip/SegmentedControl (DS):** `atoms/Badge`, `atoms/Chip`, `atoms/SegmentedControl`, `atoms/ThemeToggle`; löschen Pill, CounterPill, MetaPill, FilterChip, IconBadge, SegControl, SegmentedSwitch, `ui/badge`; `exports/badges.ts`, i18n badges-Areas, `i18n/de/chip.ts`.
- **WP3 Formulare/Medien (DS):** `atoms/ComingSoon` (+ `ui/coming-soon` löschen), `atoms/Avatar`, `molecules/FormField` (+ `ui/field` löschen), `organisms/FormDialog`, `atoms/TextField`, `atoms/DatePicker`, `atoms/EditableInlineHeading`, `atoms/EditableSection`, `organisms/IconUploadCropDialog`; `exports/forms.ts`, i18n forms-Areas.
- **WP4 Layout/Shell/Filter/Tests (DS):** `molecules/FilterBar` (neu), `atoms/SearchInput`, `ui/card`, `molecules/PageHeader`, `EmptyState`, `KpiTile`, `atoms/InfoBanner`, `molecules/ItemActionsMenu`, `organisms/AppSidebar`, `UserMenu`; className nachrüsten (Donut, Sparkline, SelectableTile, SelectedItemsBar, AppShell, route-error-state); neue Tests; `examples/next-starter/app/shell.tsx`; `exports/layout.ts`, i18n layout-Areas.
- **WP5 Pulse-Migration (3 Lanes):** Lane C zuerst (Dependency-Bump, `cmdk` raus, `app/src/components/**`, `app/src/lib/**`, `app/src/test/**`, `app/e2e/**`, `app/eslint.config.mjs`, `app/scripts/**`, `globals.css`, `providers.tsx`); Lane A `app/src/app/(app)/{settings,missions,contexts,buckets}/**` + `(auth)/**`; Lane B `app/src/app/(app)/{inbox,todo,garden,signals,tags}/**` + übrige `app/src/app/**`. Wrapper-APIs aus Lane C bleiben in den Prop-Namen stabil.
- **WP6 Release/Doku (DS, dann Pulse-Pin):** README (Struktur, Import-Pfade, API-Konventionen = Abschnitt A, Vendor-Änderungen), Changeset mit Tabelle alt → neu, `konsolidierung.md` Phase 3 erledigt, v2.0.0, Pulse pinnt `#v2.0.0`.
