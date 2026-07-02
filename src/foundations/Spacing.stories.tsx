// PUL-412 (G0): Foundations/Spacing — Tailwind-v4-Spacing-Scale als Cheatsheet.
// Tailwind v4 berechnet alle Spacing-Werte über `--spacing: 0.25rem` (Default,
// in Pulse unverändert): `gap-1` = 4 px, `gap-2` = 8 px, … = N × 4 px. Die
// Foundations-Page zeigt die geläufigen Steps mit visueller Box, damit
// Page-Composer die Größenwirkung sofort sehen.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Spacing',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Step {
  /** Tailwind-Step-Index (z. B. `2` für `gap-2`). */
  step: number
  /** Hinweis, wofür der Step typisch ist. */
  note: string
}

const STEPS: Step[] = [
  {step: 0.5, note: 'Hairline-Trennung (selten — meist Border statt Spacing)'},
  {step: 1, note: 'Inner-Pill-Gap (Icon ↔ Text in Tag-Pills)'},
  {step: 1.5, note: 'Form-Field-Stack (zwischen Label und Control)'},
  {step: 2, note: 'Standard-Padding klein (Buttons, Pills, kompakte Cards)'},
  {step: 3, note: 'Padding-Default (Cards, Section-Inner)'},
  {step: 4, note: 'Page-Section-Innenabstand'},
  {step: 6, note: 'Page-Section-Außenabstand (vertikale Trennung großer Blöcke)'},
  {step: 8, note: 'Page-Hero / Large-Spacing'},
  {step: 12, note: 'Page-Container-Top-/Bottom-Padding'},
]

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Spacing"
        lead="Tailwind v4 Spacing-Scale. Basiseinheit ist 0.25rem (4 px). gap-N / p-N / m-N rechnen N × 4 px. Layout-Tailwind (gap/space/items/justify/Margins) ist überall erlaubt — siehe guidelines.md § Style-Linie."
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
        <strong>Konvention:</strong> Spacing-Steps größer als 12 (= 48 px) sind in Pulse selten —
        die meisten Page-Layouts arbeiten mit gap-2 bis gap-6. Größere Werte (gap-16, gap-24)
        sind ein Signal, dass das Layout selbst überdacht werden sollte (Page-Section-Aufteilung
        statt Mega-Margins).
      </div>
    </div>
  ),
}
