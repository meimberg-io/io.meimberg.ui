// Shared swatch helpers for the Foundations stories. Not a library component —
// the underscore prefix marks it as internal to the Foundations section.

import {useSyncExternalStore, type CSSProperties, type ReactNode} from 'react'

// Re-read token values when the theme class on <html> changes (dark mode).
function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {attributes: true, attributeFilter: ['class', 'style']})
  return () => observer.disconnect()
}

/** Current value of a CSS custom property on the document root. */
function useTokenValue(token: string): string {
  return useSyncExternalStore(
    subscribeToTheme,
    () => getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
    () => '',
  )
}

export interface SwatchProps {
  /** Token name, e.g. `--primary`. Rendered as background and read live. */
  token: string
  /** Short "when to use" description. */
  purpose: string
  /** Optional matching text token (e.g. `--primary-foreground`) for a contrast preview. */
  fgToken?: string
  /** Optional inline style override. */
  style?: CSSProperties
}

export function Swatch({token, purpose, fgToken, style}: SwatchProps) {
  const value = useTokenValue(token)
  return (
    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 8,
          border: '1px solid hsl(var(--border))',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          background: `hsl(var(${token}))`,
          color: fgToken ? `hsl(var(${fgToken}))` : undefined,
          ...style,
        }}
      >
        {fgToken ? 'Aa' : null}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0}}>
        <div style={{fontFamily: 'monospace', fontSize: 13, fontWeight: 600}}>{token}</div>
        <div style={{fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
          {value ? `hsl(${value})` : '—'}
          {fgToken ? ` · fg: ${fgToken}` : ''}
        </div>
        <div style={{fontSize: 13, color: 'hsl(var(--foreground))'}}>{purpose}</div>
      </div>
    </div>
  )
}

export interface SectionProps {
  title: string
  hint?: string
  children: ReactNode
}

export function Section({title, hint, children}: SectionProps) {
  return (
    <section style={{marginBottom: 32}}>
      <h2 style={{fontSize: 17, fontWeight: 600, marginBottom: 4}}>{title}</h2>
      {hint ? (
        <p style={{fontSize: 13, color: 'hsl(var(--muted-foreground))', marginBottom: 16}}>{hint}</p>
      ) : (
        <div style={{height: 12}} />
      )}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16}}>
        {children}
      </div>
    </section>
  )
}

export function PageHeader({title, lead}: {title: string; lead: ReactNode}) {
  return (
    <header style={{marginBottom: 32, maxWidth: 760}}>
      <h1 style={{fontSize: 24, fontWeight: 600, marginBottom: 8}}>{title}</h1>
      <p style={{fontSize: 15, lineHeight: '22px', color: 'hsl(var(--foreground))'}}>{lead}</p>
    </header>
  )
}
