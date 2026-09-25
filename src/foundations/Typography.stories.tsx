// Foundations/Typography — typographic roles. Size and line height come from
// the `--type-*` variables in src/tokens/theme.css; the roles are `@utility`
// classes, so variants work (`max-sm:body-sm`). They deliberately have no
// `text-` prefix so tailwind-merge doesn't dedupe them against colour classes.

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
  /** Prefix of the size/leading variables, e.g. `--type-body`. */
  varPrefix: string
  spec: string
  purpose: string
}

const ROLES: Role[] = [
  {className: 'heading-1', varPrefix: '--type-heading-1', spec: '24 / 32 / 600', purpose: 'Page title (h1).'},
  {className: 'heading-2', varPrefix: '--type-heading-2', spec: '20 / 28 / 600', purpose: 'Section title within a page; dialog title.'},
  {className: 'heading-3', varPrefix: '--type-heading-3', spec: '17 / 24 / 600', purpose: 'Sub-section title, card title.'},
  {className: 'body', varPrefix: '--type-body', spec: '15 / 22 / 400', purpose: 'Default body text, list item titles.'},
  {className: 'body-sm', varPrefix: '--type-body-sm', spec: '13 / 20 / 400', purpose: 'Compact body — help text, sublines, inputs.'},
  {className: 'caption', varPrefix: '--type-caption', spec: '12 / 16 / 400', purpose: 'Meta text, counters, small hints.'},
]

const SAMPLE_TEXT = 'The quick brown fox jumps over the lazy dog 0123456789'

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 900}}>
      <PageHeader
        title="Typography"
        lead="Typographic roles. Use these instead of Tailwind text-xs/sm/base/lg/xl. Each role reads its size and line height from --type-<role>-size / --type-<role>-leading, so a brand can retune the scale by overriding those variables."
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
                {r.varPrefix}-size / -leading · default {r.spec}
              </span>
            </div>
            <div className={r.className} style={{marginBottom: 8}}>{SAMPLE_TEXT}</div>
            <div style={{fontSize: 12, color: 'hsl(var(--muted-foreground))'}}>{r.purpose}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop: 32, padding: 16, background: 'hsl(var(--surface-2))', borderRadius: 8, fontSize: 13, lineHeight: '20px'}}>
        <strong>Anti-pattern:</strong> <code>text-sm</code>, <code>text-base</code>, <code>text-lg</code>{' '}
        directly in page or feature code. Either an existing role fits, or the role is missing and
        should be added to the tokens and documented here.
      </div>
    </div>
  ),
}
