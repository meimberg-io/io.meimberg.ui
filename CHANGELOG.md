# @meimberg/ui

## 1.1.0

### Minor Changes

- 613732f: ThemeToggle: System-Mode ergänzt. Der Binary-Toggle (Light ↔ Dark) wird zum
  Segmented Control mit drei Zuständen Light / Dark / System. "System" folgt der
  OS-Preference und setzt beim Consumer `enableSystem` am `ThemeProvider` voraus.

  SegmentedSwitch: `label` ist jetzt optional (icon-only-Segmente via `ariaLabel`).
