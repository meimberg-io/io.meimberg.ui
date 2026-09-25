// Deutsches Sprachpaket für @meimberg/ui.
//
//   import {de} from '@meimberg/ui/i18n/de'
//   <UiProviders {...de}>…</UiProviders>
//
// Jede Komponente mit UI-Text liefert ihre deutschen Labels in einer eigenen
// Datei in diesem Ordner; `UiMessages` erzwingt Vollständigkeit.

import {de as dateLocale} from 'date-fns/locale'
import type {UiMessages} from '../messages'
import {appShell} from './appShell'
import {breadcrumb} from './breadcrumb'
import {breadcrumbs} from './breadcrumbs'
import {comingSoon} from './comingSoon'
import {comingSoonCard} from './comingSoonCard'
import {datePicker} from './datePicker'
import {dialog} from './dialog'
import {editableInlineHeading} from './editableInlineHeading'
import {editableSection} from './editableSection'
import {filterBar} from './filterBar'
import {filterChip} from './filterChip'
import {formActions} from './formActions'
import {formDialog} from './formDialog'
import {iconPicker} from './iconPicker'
import {iconUploadCropDialog} from './iconUploadCropDialog'
import {itemActionsMenu} from './itemActionsMenu'
import {kpiTile} from './kpiTile'
import {markdownEditor} from './markdownEditor'
import {richSelect} from './richSelect'
import {routeErrorState} from './routeErrorState'
import {searchInput} from './searchInput'
import {selectedItemsBar} from './selectedItemsBar'
import {sheet} from './sheet'
import {sidebar} from './sidebar'
import {subNavLayout} from './subNavLayout'
import {themeToggle} from './themeToggle'
import {userMenu} from './userMenu'
import {weightDots} from './weightDots'

export const deMessages: UiMessages = {
  appShell,
  breadcrumb,
  breadcrumbs,
  comingSoon,
  comingSoonCard,
  datePicker,
  dialog,
  editableInlineHeading,
  editableSection,
  filterBar,
  filterChip,
  formActions,
  formDialog,
  iconPicker,
  iconUploadCropDialog,
  itemActionsMenu,
  kpiTile,
  markdownEditor,
  richSelect,
  routeErrorState,
  searchInput,
  selectedItemsBar,
  sheet,
  sidebar,
  subNavLayout,
  themeToggle,
  userMenu,
  weightDots,
}

export const de = {
  locale: 'de-DE',
  dateLocale,
  messages: deMessages,
}
