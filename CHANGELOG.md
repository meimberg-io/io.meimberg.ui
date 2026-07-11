# @meimberg/ui

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
