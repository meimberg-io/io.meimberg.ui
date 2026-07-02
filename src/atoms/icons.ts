// PUL-318 / PUL-462: Lucide-Icon-Re-Export für die @meimberg/ui-Atoms.
//
// Bewusst eine **eigene Datei** (nicht in Icon.tsx integriert und nicht im
// Root-Barrel), weil Lucide einige Namen exportiert, die mit unseren Atoms
// kollidieren würden (z. B. `Pill`, `Tag`, `Donut`). Durch die Trennung gehen
// Atom-Imports über `@meimberg/ui`, Lucide-Icons über
// `@meimberg/ui/atoms/icons`.
//
// Call-Sites:
//   import { Icon } from '@meimberg/ui'
//   import { Inbox, Radio } from '@meimberg/ui/atoms/icons'
//   <Icon icon={Inbox} size="md" />
//
// Tree-shaking durch Webpack/Next entfernt ungenutzte Icons am Build.
//
// Die App-ESLint-Config (`no-restricted-imports` gegen `lucide-react`)
// erzwingt, dass App-Code Icons nur über dieses Barrel bezieht.
export * from 'lucide-react'
