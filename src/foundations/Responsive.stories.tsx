// Foundations/Responsive — breakpoints and the tap target token. Tailwind
// default breakpoints, mobile is the base, desktop layout from `md:`,
// smallest target width 360 px, no separate tablet tier.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Responsive',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Breakpoint {
  /** Tailwind prefix (empty = mobile base). */
  prefix: string
  /** min-width in px (0 = base). */
  px: number
  note: string
}

const BREAKPOINTS: Breakpoint[] = [
  {prefix: '(base)', px: 0, note: 'Mobile first — no prefix. Target width from 360 px.'},
  {prefix: 'sm:', px: 640, note: 'Large phones / small tablets.'},
  {prefix: 'md:', px: 768, note: 'Desktop layout starts here (= useIsMobile threshold).'},
  {prefix: 'lg:', px: 1024, note: 'Wide desktop.'},
  {prefix: 'xl:', px: 1280, note: 'Very wide viewports.'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Responsive / Mobile"
        lead="Tailwind default breakpoints, one flow from 360 px to desktop — no separate tablet tier. Mobile is the base (no prefix), the desktop layout starts at md:. Components follow the same patterns: drawer navigation, tables → cards (DataTable), dialogs → bottom sheets (FormDialog), wrapping toolbars, collapsing grids."
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

      <h3 style={{fontSize: 13, fontWeight: 600, margin: '32px 0 12px'}}>Tap target</h3>
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
          (WCAG minimum target size). Generates <code style={{fontFamily: 'monospace', fontSize: 12}}>min-h-tap</code> /{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-tap</code> /{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>size-tap</code>. Use it ONLY with the{' '}
          <code style={{fontFamily: 'monospace', fontSize: 12}}>pointer-coarse:</code> variant — touch devices get the
          larger target, desktop density stays unchanged.
        </div>
      </div>

      <div style={{marginTop: 40, padding: 16, background: 'hsl(var(--surface-2))', borderRadius: 8, fontSize: 13, lineHeight: '20px'}}>
        <strong>Convention:</strong> fixed widths (<code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-[…px]</code> /{' '}
        <code style={{fontFamily: 'monospace', fontSize: 12}}>w-[…px]</code> / inline <code style={{fontFamily: 'monospace', fontSize: 12}}>minWidth</code>)
        in layouts outside the atoms are the most common mobile breakage. Default to flexible widths
        (<code style={{fontFamily: 'monospace', fontSize: 12}}>min-w-0</code> + flex/grid + truncate).
      </div>
    </div>
  ),
}
