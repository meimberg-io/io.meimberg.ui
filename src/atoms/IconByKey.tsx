// PUL-462 (Schritt 7): IconByKey — generischer Key→Icon-Registry-Lookup.
//
// Schlägt in einer `Record<string, IconComponent>`-Registry per `id` die
// zu rendernde Icon-Komponente nach (optionaler `fallback`) und reicht alle
// übrigen Props an sie weiter. Die konkrete Registry (Provider-Marken,
// Channel-Icons, …) ist Pulse-Domain und bleibt im jeweiligen Wrapper.
//
// Konsumenten: ProviderGlyph (Brand-SVGs, Props {size,variant,label,className})
// und ChannelIcon (Lucide-Map, Prop {className}).

import type {ComponentType} from 'react'

type MinIconProps = {className?: string}

export type IconByKeyProps<P extends MinIconProps = MinIconProps> = {
  /** Key→Icon-Komponenten-Registry. */
  registry: Record<string, ComponentType<P>>
  /** Nachzuschlagender Key. */
  id: string
  /** Fallback-Icon, wenn `id` nicht in der Registry liegt. */
  fallback?: ComponentType<P>
} & P

export function IconByKey<P extends MinIconProps = MinIconProps>({
  registry,
  id,
  fallback,
  ...iconProps
}: IconByKeyProps<P>) {
  const Cmp = registry[id] ?? fallback
  if (!Cmp) return null
  return <Cmp {...(iconProps as unknown as P)} />
}
