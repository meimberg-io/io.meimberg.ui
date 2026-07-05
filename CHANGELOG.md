# @meimberg/ui

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
