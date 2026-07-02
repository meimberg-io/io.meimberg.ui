// PUL-412 (G0): Foundations/Typography — Pulse-Typografie-Rollen als Cheatsheet.
// Quelle: app/src/app/globals.css Z. 352–357. Verbindlich (MIPUL-244):
// Tailwind text-xs/sm/base/lg/xl darf NICHT direkt verwendet werden — die
// Rollen sind bewusst ohne `text-`-Präfix, damit tailwind-merge sie nicht
// als font-size-Gruppe dedupt und die Rolle verliert.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './_Swatch'

const meta = {
  title: 'Foundations/Typography',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

interface Role {
  className: string
  spec: string
  purpose: string
}

const ROLES: Role[] = [
  {className: 'heading-1', spec: '24 / 32 / 600', purpose: 'Page-Title (h1), z. B. „Inbox", „Garden".'},
  {className: 'heading-2', spec: '20 / 28 / 600', purpose: 'Section-Title innerhalb einer Page; Dialog-Title.'},
  {className: 'heading-3', spec: '17 / 24 / 600', purpose: 'Sub-Section-Title, Card-Title.'},
  {className: 'body', spec: '15 / 22 / 400', purpose: 'Standard-Body-Text. Default für Item-Title in Listen.'},
  {className: 'body-sm', spec: '13 / 20 / 400', purpose: 'Kompakter Body — Form-Help-Text, Subline-Default.'},
  {className: 'caption', spec: '12 / 16 / 400', purpose: 'Meta-Text, Sublines, Counters, Mikro-Hinweise.'},
]

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog 0123456789'

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Typography"
        lead="Pulse-Typografie-Rollen aus globals.css (MIPUL-244). Verbindlich — Tailwind text-xs/sm/base/lg/xl ist für Domain-Text VERBOTEN, damit tailwind-merge nicht zwei Rollen als font-size-Klassen dedupt. Layout-Schrift (z. B. font-mono für Code-Snippets in Foundations selbst) bleibt erlaubt."
      />

      <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        {ROLES.map(r => (
          <div
            key={r.className}
            style={{
              padding: 16,
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              background: 'hsl(var(--card))',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 8}}>
              <code style={{fontSize: 13, fontWeight: 600, color: 'hsl(var(--primary))'}}>
                .{r.className}
              </code>
              <span style={{fontFamily: 'monospace', fontSize: 11, color: 'hsl(var(--muted-foreground))'}}>
                size / line-height / weight: {r.spec}
              </span>
            </div>
            <div className={r.className} style={{marginBottom: 8}}>{SAMPLE_TEXT}</div>
            <div style={{fontSize: 12, color: 'hsl(var(--muted-foreground))'}}>{r.purpose}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop: 32, padding: 16, background: 'hsl(var(--surface-2))', borderRadius: 8, fontSize: 13, lineHeight: '20px'}}>
        <strong>Anti-Pattern:</strong> <code>text-sm</code>, <code>text-base</code>, <code>text-lg</code>,{' '}
        <code>font-medium</code>, <code>font-semibold</code> direkt in Page-/Feature-Code.
        Wenn das vorkommt, gibt es entweder eine passende Rolle, die genutzt werden sollte,
        oder die Rolle fehlt und wird in <code>globals.css</code> ergänzt + hier dokumentiert
        (Foundations-Page-Update im selben Changeset, siehe guidelines.md § Foundations-Pages).
      </div>
    </div>
  ),
}
