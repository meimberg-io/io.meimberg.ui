// Foundations/Radius — border radius scale. Every step derives from
// `--radius` (src/tokens/theme.css), so changing that one token rescales
// the whole UI.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Radius',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Step {
  className: string
  cssVar: string
  computed: string
  purpose: string
}

const STEPS: Step[] = [
  {className: 'rounded-none', cssVar: '0', computed: '0', purpose: 'Hard edges (header strips, table cells).'},
  {className: 'rounded-sm', cssVar: '--radius-sm', computed: 'calc(var(--radius) - 4px) = 4px', purpose: 'Small tags, badges, counters.'},
  {className: 'rounded-md', cssVar: '--radius-md', computed: 'calc(var(--radius) - 2px) = 6px', purpose: 'Buttons, pills, compact controls.'},
  {className: 'rounded-lg', cssVar: '--radius-lg', computed: 'var(--radius) = 8px', purpose: 'Cards, inputs (field-shell), standard containers.'},
  {className: 'rounded-xl', cssVar: '--radius-xl', computed: 'calc(var(--radius) + 4px) = 12px', purpose: 'Floating elements (popovers, icon tiles).'},
  {className: 'rounded-2xl', cssVar: '--radius-2xl', computed: 'calc(var(--radius) + 8px) = 16px', purpose: 'Large hero cards, bottom sheets.'},
  {className: 'rounded-full', cssVar: '9999px', computed: '9999px', purpose: 'Pills, avatars, switches, circular buttons.'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Radius"
        lead="Border radius scale. The base is --radius: 0.5rem (8 px); sm/md/lg/xl/2xl are derived from it via calc(), and the form dialog shell uses --radius + 6px. Changing --radius shifts every step proportionally — set it once, globally, as part of a brand."
      />

      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {STEPS.map(s => (
          <div
            key={s.className}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 1fr 260px',
              gap: 16,
              alignItems: 'center',
              padding: 12,
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              background: 'hsl(var(--card))',
            }}
          >
            <code style={{fontSize: 13, fontWeight: 600, color: 'hsl(var(--primary))'}}>
              {s.className}
            </code>
            <div
              className={s.className}
              style={{
                width: 56,
                height: 56,
                background: 'hsl(var(--surface-3))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <div style={{fontSize: 13, color: 'hsl(var(--foreground))'}}>{s.purpose}</div>
            <div style={{fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
              {s.cssVar} → {s.computed}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}
