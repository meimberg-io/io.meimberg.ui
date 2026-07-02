/**
 * Semantische Action-Icons für die Button-Bibliothek.
 *
 * Aufrufstellen importieren ausschließlich aus dieser Datei (keine direkten
 * `lucide-react`-Imports für diese semantischen Aktionen). Das hält die
 * Icon-Sprache konsistent: ein Save-Button trägt überall denselben Check.
 *
 * Aktion              | Icon
 * ------------------- | -------------
 * SaveIcon            | Check
 * CancelIcon          | X
 * DeleteIcon          | Trash2
 * EditIcon            | Pencil
 * AddIcon             | Plus
 * CloseIcon           | X
 * OpenExternalIcon    | ExternalLink
 */
export {
  Check as SaveIcon,
  X as CancelIcon,
  Trash2 as DeleteIcon,
  Pencil as EditIcon,
  Plus as AddIcon,
  X as CloseIcon,
  ExternalLink as OpenExternalIcon,
} from 'lucide-react'
