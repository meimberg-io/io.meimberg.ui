// Gesamt-Typ aller Komponenten-Labels. Jede Komponente mit UI-Text trägt hier
// ihren Schlüssel ein; das deutsche Paket (`./de`) muss jeden Schlüssel
// vollständig liefern — der Typ-Check hält es dadurch aktuell.

import type {AppShellLabels} from '../organisms/AppShell'
import type {BreadcrumbLabels} from '../ui/breadcrumb'
import type {BreadcrumbsLabels} from '../organisms/Breadcrumbs'
import type {ComingSoonLabels} from '../atoms/ComingSoon'
import type {ComingSoonCardLabels} from '../ui/coming-soon'
import type {DatePickerLabels} from '../atoms/DatePicker'
import type {DialogLabels} from '../ui/dialog'
import type {EditableInlineHeadingLabels} from '../atoms/EditableInlineHeading'
import type {EditableSectionLabels} from '../atoms/EditableSection'
import type {FilterBarLabels} from '../organisms/FilterBar'
import type {FilterChipLabels} from '../atoms/FilterChip'
import type {FormActionsLabels} from '../ui/form-actions'
import type {FormDialogLabels} from '../organisms/FormDialog'
import type {IconPickerLabels} from '../ui/icon-picker'
import type {IconUploadCropDialogLabels} from '../organisms/IconUploadCropDialog'
import type {ItemActionsMenuLabels} from '../molecules/ItemActionsMenu'
import type {KpiTileLabels} from '../molecules/KpiTile'
import type {MarkdownEditorLabels} from '../organisms/markdown-editor'
import type {RichSelectLabels} from '../atoms/RichSelect'
import type {RouteErrorStateLabels} from '../organisms/route-error-state'
import type {SearchInputLabels} from '../atoms/SearchInput'
import type {SelectedItemsBarLabels} from '../molecules/SelectedItemsBar'
import type {SheetLabels} from '../ui/sheet'
import type {SidebarLabels} from '../ui/sidebar'
import type {SubNavLayoutLabels} from '../organisms/SubNavLayout'
import type {ThemeToggleLabels} from '../atoms/ThemeToggle'
import type {UserMenuLabels} from '../organisms/UserMenu'
import type {WeightDotsLabels} from '../atoms/WeightDots'

export interface UiMessages {
  appShell: AppShellLabels
  breadcrumb: BreadcrumbLabels
  breadcrumbs: BreadcrumbsLabels
  comingSoon: ComingSoonLabels
  comingSoonCard: ComingSoonCardLabels
  datePicker: DatePickerLabels
  dialog: DialogLabels
  editableInlineHeading: EditableInlineHeadingLabels
  editableSection: EditableSectionLabels
  filterBar: FilterBarLabels
  filterChip: FilterChipLabels
  formActions: FormActionsLabels
  formDialog: FormDialogLabels
  iconPicker: IconPickerLabels
  iconUploadCropDialog: IconUploadCropDialogLabels
  itemActionsMenu: ItemActionsMenuLabels
  kpiTile: KpiTileLabels
  markdownEditor: MarkdownEditorLabels
  richSelect: RichSelectLabels
  routeErrorState: RouteErrorStateLabels
  searchInput: SearchInputLabels
  selectedItemsBar: SelectedItemsBarLabels
  sheet: SheetLabels
  sidebar: SidebarLabels
  subNavLayout: SubNavLayoutLabels
  themeToggle: ThemeToggleLabels
  userMenu: UserMenuLabels
  weightDots: WeightDotsLabels
}
