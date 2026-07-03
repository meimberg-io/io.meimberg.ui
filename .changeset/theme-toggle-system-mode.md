---
'@meimberg/ui': minor
---

ThemeToggle: System-Mode ergänzt. Der Binary-Toggle (Light ↔ Dark) wird zum
Segmented Control mit drei Zuständen Light / Dark / System. "System" folgt der
OS-Preference und setzt beim Consumer `enableSystem` am `ThemeProvider` voraus.

SegmentedSwitch: `label` ist jetzt optional (icon-only-Segmente via `ariaLabel`).
