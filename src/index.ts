// @meimberg/ui — Root-Barrel.
//
// Layer: ui/ (Vendor-Primitives, Subpath @meimberg/ui/ui/*) ·
// atoms/ (ein Element: Controls + Anzeige + Layout-Primitives) · molecules/
// (Kompositionen aus 2+ Elementen) · organisms/ (App-Gerüst + große
// Kompositionen/Modals/Heavy).
//
// Die Exporte sind nach Bereichen in `./exports/*` gebündelt; neue
// Komponenten tragen sich im Barrel ihres Bereichs ein, nicht hier.
//
// Lucide-Icons sind bewusst NICHT hier, sondern im separaten Barrel
// `@meimberg/ui/atoms/icons` (Namens-Kollisionen: Pill/Tag/Donut).
// Schwere Bundles (markdown-editor = TipTap) sind NICHT hier, nur via Subpath.
export * from './exports/core'
export * from './exports/selects'
export * from './exports/badges'
export * from './exports/forms'
export * from './exports/layout'
