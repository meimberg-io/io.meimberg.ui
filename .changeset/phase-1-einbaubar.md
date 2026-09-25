---
'@meimberg/ui': minor
---

Einbaubar in neue Apps (Konsolidierung Phase 1).

- `@meimberg/ui/tokens` bringt `@source` auf die Package-Quelle mit. Consumer brauchen keinen eigenen `@source`-Pfad in ihre `node_modules` mehr (bisher fehlten ohne ihn alle Utility-Klassen, die nur im DS vorkommen).
- Neue Utility `hover-reveal` in `@meimberg/ui/tokens`: blendet Aktionen per Hover/Fokus im `group`-Container ein, auf Geräten ohne Hover dauerhaft sichtbar.
- Fix `CardActions`: nutzt `hover-reveal` statt eines Viewport-Gates (`md:opacity-0`). Auf dem iPad (breiter als `md`, kein Hover) waren die Aktionen bisher unsichtbar.
- Peer-Dependencies: `next-themes`, `sonner`, `tailwindcss@^4`, `tw-animate-css` sowie optional `@tailwindcss/typography` (MarkdownRenderer/-Editor). **Migration:** Die App installiert `next-themes` und `sonner` selbst, falls noch nicht vorhanden. So gibt es genau eine Instanz von Theme-Context und Toast-Store.
- README-Setup neu geschrieben, lauffähige Vorlage unter `examples/next-starter/`, CI baut Checks, Storybook und die Vorlage.
