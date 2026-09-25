// Foundations/Spacing — the Tailwind v4 spacing scale. Tailwind derives every
// step from `--spacing: 0.25rem` (unchanged here): `gap-1` = 4 px, `gap-2` =
// 8 px, … = N × 4 px. The page shows the common steps as boxes so the visual
// effect is obvious at a glance.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Spacing',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Step {
  /** Tailwind step index (e.g. `2` for `gap-2`). */
  step: number
  /** What the step is typically used for. */
  note: string
}

const STEPS: Step[] = [
  {step: 0.5, note: 'Hairline separation (rare — usually a border instead)'},
  {step: 1, note: 'Gap inside pills (icon ↔ text)'},
  {step: 1.5, note: 'Form field stack (between label and control)'},
  {step: 2, note: 'Small padding (buttons, pills, compact cards)'},
  {step: 3, note: 'Default padding (cards, section content)'},
  {step: 4, note: 'Page section inner spacing'},
  {step: 6, note: 'Space between page sections (vertical separation of large blocks)'},
  {step: 8, note: 'Page hero / large spacing'},
  {step: 12, note: 'Page container top/bottom padding'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Spacing"
        lead="Tailwind v4 spacing scale. The base unit is 0.25rem (4 px); gap-N / p-N / m-N compute N × 4 px."
      />

      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {STEPS.map(s => (
          <div key={s.step} style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{minWidth: 80, fontFamily: 'monospace', fontSize: 13, fontWeight: 600}}>
              gap-{s.step}
            </div>
            <div style={{minWidth: 60, fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
              {s.step * 4}px
            </div>
            <div
              style={{
                background: 'hsl(var(--primary))',
                height: 24,
                width: `${s.step * 4 * 4}px`,
                maxWidth: 240,
                borderRadius: 4,
              }}
            />
            <div style={{fontSize: 13, color: 'hsl(var(--foreground))'}}>{s.note}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop: 40, padding: 16, background: 'hsl(var(--surface-2))', borderRadius: 8, fontSize: 13, lineHeight: '20px'}}>
        <strong>Convention:</strong> steps above 12 (= 48 px) are rare — most page layouts use
        gap-2 to gap-6. Larger values (gap-16, gap-24) are a signal to rethink the layout itself
        (split into page sections instead of huge margins).
      </div>
    </div>
  ),
}
