// Gesamt-Typ aller Komponenten-Labels. Jede Komponente mit UI-Text trägt
// ihren Schlüssel im Interface ihres Bereichs ein (`./areas/*.ts`); das
// deutsche Paket (`./de`) muss jeden Schlüssel vollständig liefern — der
// Typ-Check hält es dadurch aktuell.

import type {CoreMessages} from './areas/core'
import type {SelectsMessages} from './areas/selects'
import type {BadgesMessages} from './areas/badges'
import type {FormsMessages} from './areas/forms'
import type {LayoutMessages} from './areas/layout'

export interface UiMessages extends CoreMessages, SelectsMessages, BadgesMessages, FormsMessages, LayoutMessages {}
