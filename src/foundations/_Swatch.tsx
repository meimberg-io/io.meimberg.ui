// PUL-412 (G0): Geteilte Swatch-Komponente für Foundations/Colors. Nicht in
// /components/atoms/, weil ausschließlich von Foundations-Stories konsumiert
// und kein App-UI-Wert. Unterstrich-Präfix signalisiert „Internal zur
// Foundations-Sektion".

import type {CSSProperties} from 'react'

export interface SwatchProps {
  /** Tailwind-Klasse oder Inline-Style. Wird als Background gerendert. */
  bg: string
  /** Token-Name, z. B. `--p1`. */
  token: string
  /** HSL-Komponenten, z. B. `0 78% 55%`. */
  hsl: string
  /** Kurze „wann nutzen?"-Beschreibung. */
  purpose: string
  /** Optional: Text-Token-Pendant (z. B. `--p1-fg`) für Kontrast-Preview. */
  fgToken?: string
  /** Optional: Inline-Style-Override (für Token, die noch keine Tailwind-Klasse haben). */
  style?: CSSProperties
}

export function Swatch({bg, token, hsl, purpose, fgToken, style}: SwatchProps) {
  return (
    <div style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
      <div
        className={bg.startsWith('--') ? undefined : bg}
        style={{
          width: 64,
          height: 64,
          borderRadius: 8,
          border: '1px solid hsl(var(--border))',
          flexShrink: 0,
          ...(bg.startsWith('--') ? {background: `hsl(var(${bg}))`} : null),
          ...style,
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0}}>
        <div style={{fontFamily: 'monospace', fontSize: 13, fontWeight: 600}}>{token}</div>
        <div style={{fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
          hsl({hsl})
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
  children: React.ReactNode
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

export function PageHeader({title, lead}: {title: string; lead: string}) {
  return (
    <header style={{marginBottom: 32, maxWidth: 760}}>
      <h1 style={{fontSize: 24, fontWeight: 600, marginBottom: 8}}>{title}</h1>
      <p style={{fontSize: 15, lineHeight: '22px', color: 'hsl(var(--foreground))'}}>{lead}</p>
    </header>
  )
}
