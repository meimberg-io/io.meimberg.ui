// Lucide-Icon-Re-Export für die @meimberg/ui-Atoms.
//
// Bewusst eine **eigene Datei** (nicht in Icon.tsx integriert und nicht im
// Root-Barrel), weil Lucide einige Namen exportiert, die mit unseren Atoms
// kollidieren würden (z. B. `Pill`, `Tag`, `Donut`). Durch die Trennung gehen
// Atom-Imports über `@meimberg/ui`, Lucide-Icons über
// `@meimberg/ui/atoms/icons`.
//
// Call-Sites:
//   import { Icon } from '@meimberg/ui'
//   import { Folder, Star } from '@meimberg/ui/atoms/icons'
//   <Icon icon={Folder} size="md" />
//
// Tree-shaking durch Webpack/Next entfernt ungenutzte Icons am Build.
//
// Die App-ESLint-Config (`no-restricted-imports` gegen `lucide-react`)
// erzwingt, dass App-Code Icons nur über dieses Barrel bezieht.
export * from 'lucide-react'

// Semantische Action-Icons. Ein Save-Button trägt überall denselben Check;
// Aufrufstellen nutzen für diese Aktionen die Aliase statt des Lucide-Namens.
// Die expliziten Exporte haben Vorrang vor gleichnamigen Lucide-Aliasen aus
// dem Stern-Export (z. B. `SaveIcon` = Check statt Diskette).
//
// Aktion              | Icon
// ------------------- | -------------
// SaveIcon            | Check
// CancelIcon          | X
// DeleteIcon          | Trash2
// EditIcon            | Pencil
// AddIcon             | Plus
// CloseIcon           | X
// OpenExternalIcon    | ExternalLink
export {
  Check as SaveIcon,
  X as CancelIcon,
  Trash2 as DeleteIcon,
  Pencil as EditIcon,
  Plus as AddIcon,
  X as CloseIcon,
  ExternalLink as OpenExternalIcon,
} from 'lucide-react'
