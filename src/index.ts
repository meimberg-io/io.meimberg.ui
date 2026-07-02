// @meimberg/ui — Root-Barrel.
//
// Layer (PUL-464): ui/ (Vendor-Primitives, Subpath @meimberg/ui/ui/*) ·
// atoms/ (ein Element: Controls + Anzeige + Layout-Primitives) · molecules/
// (Kompositionen aus 2+ Elementen) · organisms/ (App-Gerüst + große
// Kompositionen/Modals/Heavy).
//
// Lucide-Icons sind bewusst NICHT hier, sondern im separaten Barrel
// `@meimberg/ui/atoms/icons` (Namens-Kollisionen: Pill/Tag/Donut).
// Schwere Bundles (markdown-editor = TipTap) sind NICHT hier, nur via Subpath.
export { cn } from './lib/cn'
export { useIsMobile } from './hooks/use-mobile'
export { formatAbsoluteDate } from './lib/datetime'
export { usePopoverPosition } from './hooks/use-popover-position'

// Provider-Contract (Contexts, die @meimberg/ui voraussetzt).
export { UiProviders } from './providers'
export type { UiProvidersProps } from './providers'

// Toast: der <Toaster> (sonner) kuratiert aus dem Root-Barrel. Die `toast()`-
// Funktion selbst kommt direkt aus `sonner` (Peer) — siehe README § Toast.
export { Toaster, toast } from './ui/sonner'

// ── atoms/ — ein Element ──────────────────────────────────────────────────
export * from './atoms/Avatar'
export * from './atoms/Chip'
export * from './atoms/ComingSoon'
export * from './atoms/CounterPill'
export * from './atoms/DatePicker'
export * from './atoms/Donut'
export * from './atoms/Dropdown'
export * from './atoms/EditableInlineHeading'
export * from './atoms/EditableSection'
export * from './atoms/FilterChip'
export * from './atoms/Icon'
export * from './atoms/IconBadge'
export * from './atoms/IconByKey'
export * from './atoms/InfoBanner'
export * from './atoms/MetaPill'
export * from './atoms/PageContainer'
export * from './atoms/Pill'
export * from './atoms/RichSelect'
export * from './atoms/ScrollableContent'
export * from './atoms/SearchInput'
export * from './atoms/SegControl'
export * from './atoms/SegmentedSwitch'
export * from './atoms/SelectField'
export * from './atoms/Sparkline'
export * from './atoms/TextField'
export * from './atoms/ThemeToggle'
export * from './atoms/WeightDots'

// ── molecules/ — Kompositionen ────────────────────────────────────────────
export * from './molecules/DashboardCard'
export * from './molecules/EmptyState'
export * from './molecules/FormField'
export * from './molecules/FormHelpText'
export * from './molecules/FormRow'
export * from './molecules/FormSection'
export * from './molecules/ItemActionsMenu'
export * from './molecules/KpiTile'
export * from './molecules/PageHeader'
export * from './molecules/SectionCardHeader'
export * from './molecules/SelectableTile'
export * from './molecules/SelectedItemsBar'
export * from './molecules/TileGrid'

// ── organisms/ — App-Gerüst + große Kompositionen ─────────────────────────
export * from './organisms/AppShell'
export * from './organisms/AppSidebar'
export * from './organisms/Breadcrumbs'
export * from './organisms/UserMenu'
export * from './organisms/DataTable'
export * from './organisms/FilterBar'
export * from './organisms/FormDialog'
export * from './organisms/SubNavLayout'
export * from './organisms/IconUploadCropDialog'
export * from './organisms/detail-dialog-wrapper'
export * from './organisms/route-error-state'
