# @meimberg/ui

## 2.1.0

### Minor Changes

- 3d5dce1: Neuer Export `@meimberg/ui/eslint`: die DS-Nutzungsregeln für Apps als Bausteine (`restrictedImportPaths`, `restrictedImportPatterns`, `restrictedSyntax`) plus fertiges Flat-Config-Array `recommended` (auch Default-Export). Deckt `lucide-react` nur über `atoms/icons`, rohe `<input>`/`<textarea>`/`<select>`, `heading-1`-Titel, `max-w-[1440px]`, Inline-Card-Frames, `hover-lift`, `setTheme`, Vendor-Primitives mit DS-Wrapper (`ui/avatar`, `ui/calendar`, `ui/sonner`, `react-day-picker`), direkte Radix-Importe und pfadbasierte `KpiTile`-Importe ab. Apps mit eigenen Restriktionslisten spreaden die Bausteine in jeden Block (Flat Config merged Rule-Optionen nicht), siehe README § ESLint-Regeln für Apps. Der Next-Starter lintet mit `recommended` (`pnpm lint`).
- 3d5dce1: Test-Tooling für Apps (Konsolidierung Phase 4, Schritt 2).

  - `@meimberg/ui/testing/setup`: Vitest-Setup mit jest-dom-Matchern und jsdom-Polyfills (`matchMedia`, `ResizeObserver`, Pointer-Capture, `scrollIntoView`, Range-Rects); polyfillt nur, was fehlt.
  - `@meimberg/ui/testing`: `renderWithUi(ui, options?)` rendert in `UiProviders` (Optionen `providers`, `messages`/`locale`/`dateLocale`, `withToaster`, `wrapper` für App-Provider) und liefert eine `userEvent`-Instanz `user` mit.
  - Bin `meimberg-ui-check-stories`: Story-Coverage-Check für Apps (`--root`, `--src`, `--layers`, `--ignore`, `--ignore-dirs`, `--allowlist`), nimmt Server-Components aus.
  - Neue optionale Peers für die Test-Exporte: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.

## 2.0.0

### Major Changes

- 96a4b67: Neutral und anpassbar (Konsolidierung Phase 2).

  **Sprache**

  - Alle Komponenten-Texte sind englisch und über einen Label-Mechanismus überschreibbar: App-weit per `<UiProviders messages={…}>`, pro Instanz per `labels`-Prop. Label-Typen `<Komponente>Labels`, Gesamt-Typ `UiMessages`, Hooks `useLabels`/`useUiLocale`/`useDateLocale`.
  - Deutsches Paket: `import {de} from '@meimberg/ui/i18n/de'` → `<UiProviders {...de}>` (Labels, `de-DE`, date-fns-Locale).
  - **Migration:** Apps, die bisher die deutschen Defaults genutzt haben, übergeben `{...de}` an `UiProviders`.
  - `formatAbsoluteDate(date, mode, locale)`: `locale` ist jetzt Pflicht.
  - DatePicker: Kalender-Locale und Datumsformat kommen aus dem Provider (Default `en-US`/`enUS`); bisher war `de` fest, das Trigger-Label ignorierte die `locale`-Prop.

  **Theme**

  - Neutrale Default-Palette (Slate + blaues Primary), `--info` eigenständig. **Migration:** Eine App, die das bisherige Aussehen behalten will, überschreibt die Farb-Tokens nach dem Tokens-Import (siehe README § Eigene Marke).
  - Neue Tokens `--warning-foreground`, `--info-foreground`; Typografie über `--type-<rolle>-size/-leading`; `rounded-xl/2xl`, Form-Felder und Dialoge leiten sich von `--radius` ab.
  - `heading-*`, `body`, `body-sm`, `caption`, `pill`, `pill-hover`, `hover-card`, `skeleton-shimmer` sind `@utility` statt plain Klassen: Varianten wie `max-sm:body-sm` funktionieren jetzt.
  - `UiProviders`: Default-Theme `system` mit `enableSystem`; die Option `attribute: 'data-theme'` entfällt (Dark Mode hängt an `.dark`).

  **Produkt-Neutralität**

  - `ComingSoon` (Atom): `label` → `title`, `dashlet`/`data-dashlet` entfallen.
  - `ui/coming-soon`: `dashlet` entfällt, `title` optional.
  - `WeightDots`: `value`/`onChange` als `number`, neue Prop `max` (Default 5), Typ `WeightValue` und fest verdrahtetes `data-testid` entfallen (dafür `data-testid`-Prop).
  - `KpiTile`: Vergleichstext als Label `comparison` (Default „vs. previous period").
  - `EmptyState`: Action-Button-`data-testid` `page-header-action` → `empty-state-action`.
  - `MarkdownRenderer`: Sonderfall für eine Pulse-Route entfernt (relative URLs sind unverändert erlaubt).
  - `MarkdownEditor`: `window.prompt` für Links/Bilder durch ein Inline-Popover ersetzt.
  - `SubNavLayout`, `IconUploadCropDialog`: Text-Defaults kommen aus den Labels.
  - Stories, Kommentare und Foundations ohne Pulse-Bezug; Storybook mit Sprach-Umschalter und Demo-Marke.

- 89c4d48: Konsolidiert (Konsolidierung Phase 3). Einheitliches Vokabular: `size` `xs|sm|md|lg` (26/32/36/40 px), `tone` `neutral|primary|success|warning|info|destructive`, `variant` beschreibt nur die Form. `icon`-Props sind Komponenten-Referenzen (`IconComponent`), keine fest verdrahteten `data-testid` mehr.

  **Buttons** — `Button`/`IconButton` sind Atoms im Root (`@meimberg/ui/ui/button`, `ui/icon-button` entfallen). Button: `variant` `solid|outline|ghost|link` + `tone`, `size` Default `md` (36 px, bisher 40 → `size="lg"`), neu `icon`, `busy`. Mapping: `variant="default"` → weglassen, `secondary` → `tone="neutral"`, `success`/`destructive` → `tone`, `size="sm"` → `md`, `size="icon"` → `<IconButton size="lg">`. IconButton: `variant="muted|primary|success|destructive"` → `tone`, `variant` `quiet|ghost`, `size="default"` → `sm`. `AlertDialogAction variant="destructive"` → `tone="destructive"`. `SaveButton`/`CancelButton` aus dem Root, `loading` → `busy`.

  **Selects** — `Select` (Radix Select, `variant` `field|pill`, Compound `Select.Root/Trigger/TriggerIcon/IconTrigger/Content/Item/ClearItem/Separator/GroupLabel`) ersetzt `Dropdown` und `SelectField`; `Combobox` (Radix Popover, Tastatur-Navigation, eindeutige IDs) ersetzt `RichSelect`. Mapping: `Dropdown` → `Select variant="pill"` (`size` `sm` → `xs`, `chip` → `sm`; `allLabel` → `clearLabel` bzw. `placeholder` bei `allowClear={false}`; Option-`icon` → `leading`), `Dropdown.Pill` → `Select.Trigger variant="pill"`, `.Avatar` → `.IconTrigger`, `.Row` → `.Item`, `.AllRow` → `.ClearItem`, `DROPDOWN_SIZE[…].iconBox` → `Select.TriggerIcon`; `SelectField` → `Select` (`size="md"` → Default `lg`); `RichSelect` → `Combobox` (`selected` → `value` = ID, `onSelect(item)` → `onChange(id, item)`, `leadingIcon` → `leading`), i18n-Key `richSelect` → `combobox`.

  **Badges** — `Badge` (`tone`, `variant` `solid|soft|outline|plain`, `shape`, `compact`, `leading`/`trailing`, `iconOnly`, `href`) + `BadgeDot` ersetzen `Pill`, `CounterPill`, `MetaPill`, `IconBadge`, `IconBadgeDot`, `ui/badge`. `Chip` vereint Toggle- und entfernbare Chips (ersetzt `FilterChip`; `label` → `prefix`, `size` `sm` → `xs`, `md` → `sm`, `activeClassName` → `tone`), neu `compactBelow`; i18n-Key `filterChip` → `chip`. `SegmentedControl` (`size` `xs|lg`, Thumb-Optik) ersetzt `SegControl`/`SegmentedSwitch`.

  **Formulare** — `ui/field` → `FormField` (injiziert die ID auch per cloneElement), `ui/coming-soon` → `ComingSoon` (i18n `comingSoonCard` → `comingSoon`), `Avatar` mit `shape`/`tone`/`2xl`. `FormDialog`: `submitVariant` → `submitTone`, `submitPending` → `submitBusy`, `submitIcon` als Komponente. `TextField` `leadingIcon/trailingIcon` → `leading/trailing`. `DatePicker` `size="default"` → `lg`.

  **Layout** — `FilterBar` (neu als Molecule; die config-getriebene Organism-Variante entfällt), `SearchInput size="xs"` (Filterleisten-Optik), `Card interactive`, `PageHeader` `leading`/`meta`, `EmptyState`/`InfoBanner` `tone` → `variant`, `KpiTile` `tone` `warn` → `warning`, `danger` → `destructive`, `icon` als Komponente, `ItemActionsMenu` `testId` → `data-testid`, `size` → `ControlSize`. `AppSidebar` `header`/`footer` bekommen `({collapsed, isMobile, closeMobile})`. `UserMenu`-Items mit `onSelect` und `tone`.

  **Entfernt** — `IconByKey`, `ui/lucide-icon` (→ `IconByName`), `ui/action-icons` (→ Aliase in `@meimberg/ui/atoms/icons`), `ui/icon-picker` (→ Subpath `@meimberg/ui/molecules/icon-picker`), `ui/card-actions`/`ui/form-actions` (→ Root), Radix-Toast (`ui/toast`, `use-toast`), `formatAbsoluteDate` und `usePopoverPosition` aus dem Public API.

### Patch Changes

- e1de300: Deutsches Paket: Der Schließen-Button oben rechts im Dialog heißt „Dialog schließen", damit er sich von einem „Schließen" im Footer unterscheidet.

## 2.0.0-next.2

### Major Changes

- 89c4d48: Konsolidiert (Konsolidierung Phase 3). Einheitliches Vokabular: `size` `xs|sm|md|lg` (26/32/36/40 px), `tone` `neutral|primary|success|warning|info|destructive`, `variant` beschreibt nur die Form. `icon`-Props sind Komponenten-Referenzen (`IconComponent`), keine fest verdrahteten `data-testid` mehr.

  **Buttons** — `Button`/`IconButton` sind Atoms im Root (`@meimberg/ui/ui/button`, `ui/icon-button` entfallen). Button: `variant` `solid|outline|ghost|link` + `tone`, `size` Default `md` (36 px, bisher 40 → `size="lg"`), neu `icon`, `busy`. Mapping: `variant="default"` → weglassen, `secondary` → `tone="neutral"`, `success`/`destructive` → `tone`, `size="sm"` → `md`, `size="icon"` → `<IconButton size="lg">`. IconButton: `variant="muted|primary|success|destructive"` → `tone`, `variant` `quiet|ghost`, `size="default"` → `sm`. `AlertDialogAction variant="destructive"` → `tone="destructive"`. `SaveButton`/`CancelButton` aus dem Root, `loading` → `busy`.

  **Selects** — `Select` (Radix Select, `variant` `field|pill`, Compound `Select.Root/Trigger/TriggerIcon/IconTrigger/Content/Item/ClearItem/Separator/GroupLabel`) ersetzt `Dropdown` und `SelectField`; `Combobox` (Radix Popover, Tastatur-Navigation, eindeutige IDs) ersetzt `RichSelect`. Mapping: `Dropdown` → `Select variant="pill"` (`size` `sm` → `xs`, `chip` → `sm`; `allLabel` → `clearLabel` bzw. `placeholder` bei `allowClear={false}`; Option-`icon` → `leading`), `Dropdown.Pill` → `Select.Trigger variant="pill"`, `.Avatar` → `.IconTrigger`, `.Row` → `.Item`, `.AllRow` → `.ClearItem`, `DROPDOWN_SIZE[…].iconBox` → `Select.TriggerIcon`; `SelectField` → `Select` (`size="md"` → Default `lg`); `RichSelect` → `Combobox` (`selected` → `value` = ID, `onSelect(item)` → `onChange(id, item)`, `leadingIcon` → `leading`), i18n-Key `richSelect` → `combobox`.

  **Badges** — `Badge` (`tone`, `variant` `solid|soft|outline|plain`, `shape`, `compact`, `leading`/`trailing`, `iconOnly`, `href`) + `BadgeDot` ersetzen `Pill`, `CounterPill`, `MetaPill`, `IconBadge`, `IconBadgeDot`, `ui/badge`. `Chip` vereint Toggle- und entfernbare Chips (ersetzt `FilterChip`; `label` → `prefix`, `size` `sm` → `xs`, `md` → `sm`, `activeClassName` → `tone`), neu `compactBelow`; i18n-Key `filterChip` → `chip`. `SegmentedControl` (`size` `xs|lg`, Thumb-Optik) ersetzt `SegControl`/`SegmentedSwitch`.

  **Formulare** — `ui/field` → `FormField` (injiziert die ID auch per cloneElement), `ui/coming-soon` → `ComingSoon` (i18n `comingSoonCard` → `comingSoon`), `Avatar` mit `shape`/`tone`/`2xl`. `FormDialog`: `submitVariant` → `submitTone`, `submitPending` → `submitBusy`, `submitIcon` als Komponente. `TextField` `leadingIcon/trailingIcon` → `leading/trailing`. `DatePicker` `size="default"` → `lg`.

  **Layout** — `FilterBar` (neu als Molecule; die config-getriebene Organism-Variante entfällt), `SearchInput size="xs"` (Filterleisten-Optik), `Card interactive`, `PageHeader` `leading`/`meta`, `EmptyState`/`InfoBanner` `tone` → `variant`, `KpiTile` `tone` `warn` → `warning`, `danger` → `destructive`, `icon` als Komponente, `ItemActionsMenu` `testId` → `data-testid`, `size` → `ControlSize`. `AppSidebar` `header`/`footer` bekommen `({collapsed, isMobile, closeMobile})`. `UserMenu`-Items mit `onSelect` und `tone`.

  **Entfernt** — `IconByKey`, `ui/lucide-icon` (→ `IconByName`), `ui/action-icons` (→ Aliase in `@meimberg/ui/atoms/icons`), `ui/icon-picker` (→ Subpath `@meimberg/ui/molecules/icon-picker`), `ui/card-actions`/`ui/form-actions` (→ Root), Radix-Toast (`ui/toast`, `use-toast`), `formatAbsoluteDate` und `usePopoverPosition` aus dem Public API.

## 2.0.0-next.1

### Patch Changes

- e1de300: Deutsches Paket: Der Schließen-Button oben rechts im Dialog heißt „Dialog schließen", damit er sich von einem „Schließen" im Footer unterscheidet.

## 2.0.0-next.0

### Major Changes

- Neutral und anpassbar (Konsolidierung Phase 2).

  **Sprache**

  - Alle Komponenten-Texte sind englisch und über einen Label-Mechanismus überschreibbar: App-weit per `<UiProviders messages={…}>`, pro Instanz per `labels`-Prop. Label-Typen `<Komponente>Labels`, Gesamt-Typ `UiMessages`, Hooks `useLabels`/`useUiLocale`/`useDateLocale`.
  - Deutsches Paket: `import {de} from '@meimberg/ui/i18n/de'` → `<UiProviders {...de}>` (Labels, `de-DE`, date-fns-Locale).
  - **Migration:** Apps, die bisher die deutschen Defaults genutzt haben, übergeben `{...de}` an `UiProviders`.
  - `formatAbsoluteDate(date, mode, locale)`: `locale` ist jetzt Pflicht.
  - DatePicker: Kalender-Locale und Datumsformat kommen aus dem Provider (Default `en-US`/`enUS`); bisher war `de` fest, das Trigger-Label ignorierte die `locale`-Prop.

  **Theme**

  - Neutrale Default-Palette (Slate + blaues Primary), `--info` eigenständig. **Migration:** Eine App, die das bisherige Aussehen behalten will, überschreibt die Farb-Tokens nach dem Tokens-Import (siehe README § Eigene Marke).
  - Neue Tokens `--warning-foreground`, `--info-foreground`; Typografie über `--type-<rolle>-size/-leading`; `rounded-xl/2xl`, Form-Felder und Dialoge leiten sich von `--radius` ab.
  - `heading-*`, `body`, `body-sm`, `caption`, `pill`, `pill-hover`, `hover-card`, `skeleton-shimmer` sind `@utility` statt plain Klassen: Varianten wie `max-sm:body-sm` funktionieren jetzt.
  - `UiProviders`: Default-Theme `system` mit `enableSystem`; die Option `attribute: 'data-theme'` entfällt (Dark Mode hängt an `.dark`).

  **Produkt-Neutralität**

  - `ComingSoon` (Atom): `label` → `title`, `dashlet`/`data-dashlet` entfallen.
  - `ui/coming-soon`: `dashlet` entfällt, `title` optional.
  - `WeightDots`: `value`/`onChange` als `number`, neue Prop `max` (Default 5), Typ `WeightValue` und fest verdrahtetes `data-testid` entfallen (dafür `data-testid`-Prop).
  - `KpiTile`: Vergleichstext als Label `comparison` (Default „vs. previous period").
  - `EmptyState`: Action-Button-`data-testid` `page-header-action` → `empty-state-action`.
  - `MarkdownRenderer`: Sonderfall für eine Pulse-Route entfernt (relative URLs sind unverändert erlaubt).
  - `MarkdownEditor`: `window.prompt` für Links/Bilder durch ein Inline-Popover ersetzt.
  - `SubNavLayout`, `IconUploadCropDialog`: Text-Defaults kommen aus den Labels.
  - Stories, Kommentare und Foundations ohne Pulse-Bezug; Storybook mit Sprach-Umschalter und Demo-Marke.

## 1.3.0

### Minor Changes

- b9c538a: Einbaubar in neue Apps (Konsolidierung Phase 1).

  - `@meimberg/ui/tokens` bringt `@source` auf die Package-Quelle mit. Consumer brauchen keinen eigenen `@source`-Pfad in ihre `node_modules` mehr (bisher fehlten ohne ihn alle Utility-Klassen, die nur im DS vorkommen).
  - Neue Utility `hover-reveal` in `@meimberg/ui/tokens`: blendet Aktionen per Hover/Fokus im `group`-Container ein, auf Geräten ohne Hover dauerhaft sichtbar.
  - Fix `CardActions`: nutzt `hover-reveal` statt eines Viewport-Gates (`md:opacity-0`). Auf dem iPad (breiter als `md`, kein Hover) waren die Aktionen bisher unsichtbar.
  - Peer-Dependencies: `next-themes`, `sonner`, `tailwindcss@^4`, `tw-animate-css` sowie optional `@tailwindcss/typography` (MarkdownRenderer/-Editor). **Migration:** Die App installiert `next-themes` und `sonner` selbst, falls noch nicht vorhanden. So gibt es genau eine Instanz von Theme-Context und Toast-Store.
  - README-Setup neu geschrieben, lauffähige Vorlage unter `examples/next-starter/`, CI baut Checks, Storybook und die Vorlage.

## 1.2.5

### Patch Changes

- EditableInlineHeading: Klick auf den Titel startet den Edit-Mode — nicht mehr nur das Stift-Icon.

## 1.2.4

### Patch Changes

- cdfff09: EditableInlineHeading: Fokus-Verlust speichert den Entwurf, statt ihn zu
  verwerfen. Bisher wurde nur bei Enter oder Klick auf den ✓-Button gespeichert —
  wer einen neuen Titel tippte und dann direkt eine andere Aktion im selben Dialog
  anklickte, verlor die Eingabe kommentarlos. Der Save läuft jetzt auch bei
  `focusout` der Edit-Zeile; wandert der Fokus innerhalb der Zeile (Save-/Cancel-
  Button), bleibt das Verhalten unverändert.

## 1.2.3

### Patch Changes

- Calendar/DatePicker: Die Monats-Navigations-Chevrons (‹ ›) liegen jetzt vertikal
  auf einer Linie mit dem Monats-Label. Zuvor saßen sie durch `top-0` am
  Padding-Rand des rdp-root und wirkten gegenüber dem Label (im gepaddeten
  Content) nach oben verrutscht; `top-3` kompensiert das `p-3`.

## 1.2.2

### Patch Changes

- Calendar/DatePicker: Die Monats-Navigations-Chevrons (‹ ›) überlappen nicht
  mehr die Shortcut-Liste oben im Popover. react-day-picker v9 rendert die Nav
  als Sibling des Monats (nicht mehr in der `relative` Caption wie v8); die
  `absolute` Buttons hängten sich mangels positioniertem Vorfahren an das Radix
  `PopoverContent` und landeten am oberen Rand über „Heute/Morgen/…". Fix:
  `position: relative` auf den DayPicker-Root, analog zur Anforderung aus der
  react-day-picker `style.css`.

## 1.2.1

### Patch Changes

- DetailDialogWrapper: `description` darf jetzt beliebigen Block-Inhalt tragen
  (z. B. eine Meta-Pill-Reihe). Zuvor rendert Radix die Description als `<p>`;
  ein `<div>` darin war ungültiges HTML und löste einen Hydration-Error aus
  (real aufgetreten in Pulse' InboxItemDetailDialog). Fix: Description via
  `asChild` in einen `<div>` rendern — id/aria-Verdrahtung und Styling bleiben
  erhalten. String-Descriptions funktionieren unverändert.

## 1.2.0

### Minor Changes

- DetailField: Definition-Zeile für Detail-Dialoge (feste Label-Spalte + freier
  Wert-Slot). Read-Display-Pendant zu `FormField`. Ersetzt das bisher je
  Detail-Dialog einkopierte lokale `FieldRow` und behebt damit dessen
  Duplizierung (no-half-generalization). `align`-Prop (`start` default für
  mehrzeilige Werte, `center` für einzeilige Zeilen).

## 1.1.1

### Patch Changes

- 76d629b: Dark-Mode: invertierten Glow an Dialogen/Cards entfernt. Die `--elev-*`-Schatten
  waren im Dark-Mode `foreground`-basiert (= nahezu weiß) und ergaben einen hellen
  Halo statt eines Schattens. Jetzt schwarz-basiert; Elevation trägt die hellere
  Surface (`bg-card`/`bg-popover`) + Border. Basis-`DialogContent`/`AlertDialogContent`
  sitzen auf `bg-popover` statt `bg-background`, damit auch schlichte Dialoge abheben.

## 1.1.0

### Minor Changes

- 613732f: ThemeToggle: System-Mode ergänzt. Der Binary-Toggle (Light ↔ Dark) wird zum
  Segmented Control mit drei Zuständen Light / Dark / System. "System" folgt der
  OS-Preference und setzt beim Consumer `enableSystem` am `ThemeProvider` voraus.

  SegmentedSwitch: `label` ist jetzt optional (icon-only-Segmente via `ariaLabel`).
