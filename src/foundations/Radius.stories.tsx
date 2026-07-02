// PUL-412 (G0): Foundations/Radius — Border-Radius-Scale als Cheatsheet.
// Quelle: app/src/app/globals.css `@theme inline` Z. 307–309 +
// `--radius: 0.5rem` in :root (Z. 68). Tailwind v4 leitet --radius-sm/-md/-lg
// per calc() davon ab.

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
  {className: 'rounded-none', cssVar: '0', computed: '0', purpose: 'Hard-Edge (Header-Strip, Table-Cells).'},
  {className: 'rounded-sm', cssVar: '--radius-sm', computed: 'calc(0.5rem - 4px) = 4px', purpose: 'Kleine Tags, Badges, Counter.'},
  {className: 'rounded-md', cssVar: '--radius-md', computed: 'calc(0.5rem - 2px) = 6px', purpose: 'Inputs, Buttons, Pills (Default-Trigger).'},
  {className: 'rounded-lg', cssVar: '--radius-lg / --radius', computed: '0.5rem = 8px', purpose: 'Cards, Form-Sections, Standard-Container.'},
  {className: 'rounded-xl', cssVar: '(static)', computed: '12px', purpose: 'Floating-Elements (Popover, Dialog-Inner-Shell).'},
  {className: 'rounded-2xl', cssVar: '(static)', computed: '16px', purpose: 'Selten — große Hero-Cards / Promo-Surfaces.'},
  {className: 'rounded-full', cssVar: '9999px', computed: '9999px', purpose: 'Pills, Avatars, Switch, Circle-Buttons.'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Radius"
        lead="Border-Radius-Scale. Pulse setzt --radius: 0.5rem (8 px) als Basis, Tailwind v4 leitet --radius-sm/-md/-lg per calc() davon ab. Größere Werte (xl/2xl) sind statisch (12 / 16 px). Konsequenz einer --radius-Änderung: alle md/lg-basierten Komponenten verschieben sich proportional — also bewusst global einsetzen."
      />

      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {STEPS.map(s => (
          <div
            key={s.className}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 1fr 220px',
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
