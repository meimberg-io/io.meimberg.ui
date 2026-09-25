'use client'

// Per-Icon lazy-loaded Lucide-Renderer.
//
// Das eager importierte `icons`-Registry-Objekt aus `lucide-react` würde den
// gesamten Iconsatz (~135 kB gzip) in jedes Bundle ziehen, das ein einzelnes
// Icon per Name rendert. Diese Version nutzt `lucide-react/dynamicIconImports`
// (per-Icon-Code-Split): die Karte selbst ist ~11 kB gzip, das tatsächliche Icon-SVG wird erst beim
// Render in einem eigenen Mini-Chunk nachgeladen. React 19's `use(promise)`
// rendert in der Suspense-Phase einen Platzhalter in passender Größe; der
// Promise-Cache stellt sicher, dass derselbe Icon-Name nicht erneut
// importiert wird.

import { Suspense, use, type ComponentType } from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn } from '../lib/cn'

type IconLoaderMap = Record<string, () => Promise<{ default: ComponentType<{ className?: string }> }>>

const loaderMap = dynamicIconImports as unknown as IconLoaderMap
const promiseCache = new Map<string, Promise<{ default: ComponentType<{ className?: string }> }>>()

function loadIcon(name: string) {
  const cached = promiseCache.get(name)
  if (cached) return cached
  const loader = loaderMap[name]
  if (!loader) return null
  const promise = loader()
  promiseCache.set(name, promise)
  return promise
}

function LucideIconInner({ name, className }: { name: string; className?: string }) {
  const promise = loadIcon(name)
  if (!promise) return null
  const { default: Icon } = use(promise)
  return <Icon className={className} />
}

interface Props {
  name: string | null | undefined
  className?: string
}

/** Render-Helper: zeigt das Lucide-Icon zu einem kebab-case-Namen.
 *  Gibt null zurück, wenn `name` null oder unbekannt ist. Lädt das Icon
 *  per-Name lazy — der initiale Render zeigt einen Platzhalter in
 *  16x16 (`size-4`), bis das Icon geladen ist. */
export function LucideIcon({ name, className }: Props) {
  if (!name) return null
  if (!(name in loaderMap)) return null
  return (
    <Suspense fallback={<span className={cn('size-4 inline-block', className)} aria-hidden />}>
      <LucideIconInner name={name} className={cn('size-4', className)} />
    </Suspense>
  )
}
