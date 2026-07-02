// PUL-455 (Mobile-Standard, Welle 0): Foundations/Responsive — Breakpoints +
// Tap-Target-Token als Cheatsheet. Quelle der Regeln: docs/frontend/guidelines.md
// § Responsive / Mobile. Tailwind-Default-Breakpoints, Mobile = Basis, Desktop ab
// `md:`, kleinste Zielbreite 360 px, kein Tablet-Tier.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Responsive',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Breakpoint {
  /** Tailwind-Prefix (leer = Mobile-Basis). */
  prefix: string
  /** min-width in px (0 = Basis). */
  px: number
  note: string
}

const BREAKPOINTS: Breakpoint[] = [
  {prefix: '(Basis)', px: 0, note: 'Mobile-first — kein Prefix. Zielbreite ab 360 px.'},
  {prefix: 'sm:', px: 640, note: 'Große Phones / kleine Tablets.'},
  {prefix: 'md:', px: 768, note: 'Desktop-Layout greift ab hier (= useIsMobile-Grenze).'},
  {prefix: 'lg:', px: 1024, note: 'Breiter Desktop.'},
  {prefix: 'xl:', px: 1280, note: 'Sehr breite Viewports.'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Responsive / Mobile"
        lead="Tailwind-Default-Breakpoints, ein Fluss von 360 px bis Desktop — kein eigenes Tablet-Tier. Mobile ist die Basis (kein Prefix), Desktop-Layout greift ab md:. Verbindliche Layout-Muster (Drawer-Nav, Tabellen→Cards, Dialog→Bottom-Sheet, Toolbar-Umbruch, Grid-Collapse) siehe guidelines.md § Responsive / Mobile."
      />

      <h3 style={{fontSize: 13, fontWeight: 600, margin: '8px 0 12px'}}>Breakpoints</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {BREAKPOINTS.map(b => (
          <div key={b.prefix} style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{minWidth: 80, fontFamily: 'monospace', fontSize: 13, fontWeight: 600}}>
              {b.prefix}
            </div>
            <div style={{minWidth: 70, fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
              {b.px === 0 ? '0px' : `≥ ${b.px}px`}
            </div>
            <div
              style={{
                background: 'hsl(var(--primary))',
                height: 14,
                width: `${Math.max(b.px / 1280 * 240, 8)}px`,
                borderRadius: 4,
              }}
            />
            <div style={{fontSize: 13, color: 'hsl(var(--foreground))'}}>{b.note}</div>
          </div>
        ))}
      </div>

      <h3 style={{fontSize: 13, fontWeight: 600, margin: '32px 0 12px'}}>Tap-Target</h3>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            border: '1.5px dashed hsl(var(--primary))',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            fontSize: 11,
            color: 'hsl(var(--primary))',
          }}
        >
          44
        </div>
        <div style={{fontSize: 13, color: 'hsl(var(--foreground))', lineHeight: '20px'}}>
          <code style={{fontFamily: 'monospace', fontSize: 12}}>--spacing-tap</code> = 44 px
          (WCAG-Mindest-Trefferfläche). Erzeugt <code style={{fontFamily: 'monospace', fontSize: 12}}>min-h-tap</code> /{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-tap</code> /{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>size-tap</code>. Verwendung NUR über die{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>pointer-coarse:</code>-Variant — Touch hebt die
          Trefferfläche an, Desktop-Dichte bleibt unverändert.
        </div>
      </div>

      <div style={{marginTop: 40, padding: 16, background: 'hsl(var(--surface-2))', borderRadius: 8, fontSize: 13, lineHeight: '20px'}}>
        <strong>Konvention:</strong> Fixe Breiten (<code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-[…px]</code> /{' '}
        <code style={{fontFamily: 'monospace', fontSize: 12}}>w-[…px]</code> / inline <code style={{fontFamily: 'monospace', fontSize: 12}}>minWidth</code>)
        an Layout-Stellen außerhalb der Atoms sind der häufigste Mobile-Bruch. Default ist flexible Breite
        (<code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-0</code> + flex/grid + truncate). Der Drift-Schutz-Lint
        (PUL-461) flaggt Verstöße.
      </div>
    </div>
  ),
}
