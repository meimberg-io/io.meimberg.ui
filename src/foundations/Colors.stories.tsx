// Foundations/Colors — the colour tokens of @meimberg/ui/tokens
// (src/tokens/theme.css). Values are read live from the CSS variables, so the
// page follows the active theme (light/dark) and any brand override.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader, Section, Swatch} from './_Swatch'

const meta = {
  title: 'Foundations/Colors',
  parameters: {layout: 'padded'},
} satisfies Meta

export default meta

type Story = StoryObj

export const All: Story = {
  render: () => (
    <div style={{maxWidth: 1100}}>
      <PageHeader
        title="Colors"
        lead="Neutral default palette: slate greys with a blue primary. Tokens are HSL channels without hsl() and are defined for :root (light) and .dark. To apply a brand, override the tokens after importing @meimberg/ui/tokens — the primary colour lives in --primary, --ring, --sidebar-primary and --sidebar-ring."
      />

      <Section
        title="Core"
        hint="shadcn-compatible base tokens. Tailwind: bg-background, text-foreground, bg-card, bg-primary, …"
      >
        <Swatch token="--background" purpose="Page background" />
        <Swatch token="--foreground" purpose="Body text" />
        <Swatch token="--card" purpose="Card / surface background" fgToken="--card-foreground" />
        <Swatch token="--popover" purpose="Popovers and floating surfaces" fgToken="--popover-foreground" />
        <Swatch token="--primary" purpose="Primary actions, links, active states" fgToken="--primary-foreground" />
        <Swatch token="--secondary" purpose="Secondary (muted) actions" fgToken="--secondary-foreground" />
        <Swatch token="--muted" purpose="Muted areas, skeleton base" fgToken="--muted-foreground" />
        <Swatch token="--accent" purpose="Hover tint" fgToken="--accent-foreground" />
        <Swatch token="--destructive" purpose="Destructive actions (delete, data loss)" fgToken="--destructive-foreground" />
        <Swatch token="--border" purpose="Default border" />
        <Swatch token="--input" purpose="Input border" />
        <Swatch token="--ring" purpose="Focus ring (keyboard focus)" />
      </Section>

      <Section
        title="Status"
        hint="Status semantics, each with a foreground token for text on the filled colour. Tailwind: bg-success / text-success-foreground, bg-warning / …, bg-info / …"
      >
        <Swatch token="--success" purpose="Success, confirmations" fgToken="--success-foreground" />
        <Swatch token="--warning" purpose="Non-blocking warnings" fgToken="--warning-foreground" />
        <Swatch token="--info" purpose="Informational highlights" fgToken="--info-foreground" />
      </Section>

      <Section
        title="Surfaces"
        hint="surface-0..3 stack from the page background (0) to raised or inset areas (3). Tailwind: bg-surface-0/-1/-2/-3."
      >
        <Swatch token="--surface-0" purpose="Page background" />
        <Swatch token="--surface-1" purpose="Default card background" />
        <Swatch token="--surface-2" purpose="Subtle inset (e.g. segmented switch track)" />
        <Swatch token="--surface-3" purpose="Stronger inset, skeleton highlight" />
      </Section>

      <Section
        title="Sidebar"
        hint="Separate tokens for the app sidebar so it can be tinted independently. Tailwind: bg-sidebar, text-sidebar-foreground, …"
      >
        <Swatch token="--sidebar-background" purpose="Sidebar background" fgToken="--sidebar-foreground" />
        <Swatch token="--sidebar-primary" purpose="Active item text" fgToken="--sidebar-primary-foreground" />
        <Swatch token="--sidebar-accent" purpose="Hovered / active item background" fgToken="--sidebar-accent-foreground" />
        <Swatch token="--sidebar-border" purpose="Sidebar borders" />
        <Swatch token="--sidebar-ring" purpose="Focus ring inside the sidebar" />
      </Section>
    </div>
  ),
}
