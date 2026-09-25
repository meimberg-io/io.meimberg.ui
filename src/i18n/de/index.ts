// Deutsches Sprachpaket für @meimberg/ui.
//
//   import {de} from '@meimberg/ui/i18n/de'
//   <UiProviders {...de}>…</UiProviders>
//
// Jede Komponente mit UI-Text liefert ihre deutschen Labels in einer eigenen
// Datei in diesem Ordner und trägt sie im Bereichs-File (`./areas/*.ts`) ein;
// `UiMessages` erzwingt Vollständigkeit.

import {de as dateLocale} from 'date-fns/locale'
import type {UiMessages} from '../messages'
import {coreMessages} from './areas/core'
import {selectsMessages} from './areas/selects'
import {badgesMessages} from './areas/badges'
import {formsMessages} from './areas/forms'
import {layoutMessages} from './areas/layout'

export const deMessages: UiMessages = {
  ...coreMessages,
  ...selectsMessages,
  ...badgesMessages,
  ...formsMessages,
  ...layoutMessages,
}

export const de = {
  locale: 'de-DE',
  dateLocale,
  messages: deMessages,
}
