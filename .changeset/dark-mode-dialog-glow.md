---
"@meimberg/ui": patch
---

Dark-Mode: invertierten Glow an Dialogen/Cards entfernt. Die `--elev-*`-Schatten
waren im Dark-Mode `foreground`-basiert (= nahezu weiß) und ergaben einen hellen
Halo statt eines Schattens. Jetzt schwarz-basiert; Elevation trägt die hellere
Surface (`bg-card`/`bg-popover`) + Border. Basis-`DialogContent`/`AlertDialogContent`
sitzen auf `bg-popover` statt `bg-background`, damit auch schlichte Dialoge abheben.
