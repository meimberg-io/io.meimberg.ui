# @meimberg/ui

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
