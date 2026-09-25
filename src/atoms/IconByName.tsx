'use client'

// IconByName — rendert ein Lucide-Icon zu einem kebab-case-Namen
// (z. B. 'flask-conical'), etwa für in Daten gespeicherte Icon-Namen.
//
// Das eager importierte `icons`-Registry-Objekt aus `lucide-react` würde den
// gesamten Iconsatz (~135 kB gzip) in jedes Bundle ziehen. Diese Komponente
// nutzt `lucide-react/dynamicIconImports` (per-Icon-Code-Split): die Karte
// selbst ist ~11 kB gzip, das SVG wird erst beim Render in einem eigenen
// Mini-Chunk nachgeladen. React 19's `use(promise)` rendert in der
// Suspense-Phase einen Platzhalter in passender Größe; der Promise-Cache
// verhindert, dass derselbe Name erneut importiert wird.

import {Suspense, use} from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import {cn} from '../lib/cn'
import type {IconComponent} from '../lib/variants'
import {ICON_PIXELS, type IconSize} from './Icon'

const PLACEHOLDER_CLASS: Record<IconSize, string> = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

type IconLoaderMap = Record<string, () => Promise<{default: IconComponent}>>

const loaderMap = dynamicIconImports as unknown as IconLoaderMap
const promiseCache = new Map<string, Promise<{default: IconComponent}>>()

function loadIcon(name: string) {
  const cached = promiseCache.get(name)
  if (cached) return cached
  const loader = loaderMap[name]
  if (!loader) return null
  const promise = loader()
  promiseCache.set(name, promise)
  return promise
}

function IconByNameInner({name, px, className}: {name: string; px: number; className?: string}) {
  const promise = loadIcon(name)
  if (!promise) return null
  const {default: Cmp} = use(promise)
  return <Cmp width={px} height={px} aria-hidden className={className} />
}

export interface IconByNameProps {
  /** kebab-case-Name des Lucide-Icons. `null`/unbekannt → rendert nichts. */
  name: string | null | undefined
  /** Größe auf der `Icon`-Skala. Default `md` (16 px). */
  size?: IconSize
  className?: string
}

/** Lucide-Icon per Name, lazy geladen. Bis das Icon da ist, hält ein Platzhalter die Größe. */
export function IconByName({name, size = 'md', className}: IconByNameProps) {
  if (!name) return null
  if (!(name in loaderMap)) return null
  return (
    <Suspense
      fallback={<span className={cn('inline-block shrink-0', PLACEHOLDER_CLASS[size], className)} aria-hidden />}
    >
      <IconByNameInner name={name} px={ICON_PIXELS[size]} className={className} />
    </Suspense>
  )
}
