// PUL-412 (G0) / PUL-462: Foundations/Colors — die NEUTRALEN Design-Tokens des
// @meimberg/ui/tokens-Presets (Surfaces, Status, shadcn-Vendor). Quelle der
// Wahrheit: packages/tokens/theme.css. HSL-Werte hier duplizieren wir bewusst
// neben den CSS-Vars, damit die Foundations-Page den Wert offline les- und
// überprüfbar macht — Token-Änderungen im selben Changeset nachziehen.
//
// PUL-462 Schritt 11: die Pulse-DOMÄNEN-Tokens (Prio/Vocab/Stage/Top-Mission)
// sind KEINE geteilten Foundations mehr — sie kodieren Pulse-Fachlichkeit,
// leben in der App (app/src/app/globals.css) und werden im App-Storybook unter
// „Foundations/Colors (Pulse-Domain)" dokumentiert.

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
        lead="Neutrale Design-Tokens des @meimberg/ui/tokens-Presets — produktunabhängig, von jeder konsumierenden App teilbar. Pulse-fachliche Farb-Tokens (Prio, Vokabular, Stage-Lifecycle, Top-Mission) sind bewusst NICHT hier, sondern in der App (siehe App-Storybook)."
      />

      <Section
        title="Surfaces"
        hint="Surface-0..3 stapeln sich von der Page-Background (0) bis zu erhöhten Cards/Popovers (3). Tailwind: bg-surface-0/-1/-2/-3."
      >
        <Swatch token="--surface-0" hsl="200 20% 98%" purpose="Page-Background" bg="--surface-0" />
        <Swatch token="--surface-1" hsl="0 0% 100%" purpose="Card-Background (Default)" bg="--surface-1" />
        <Swatch token="--surface-2" hsl="200 15% 95%" purpose="Subtle-Inset (z. B. Segmented-Switch-Track)" bg="--surface-2" />
        <Swatch token="--surface-3" hsl="200 15% 90%" purpose="Stronger-Inset / Skeleton-Highlight" bg="--surface-3" />
      </Section>

      <Section
        title="Status"
        hint="Neutrale Status-Semantik für Success / Warning / Info. Produktunabhängig verwendbar (Tailwind: bg-success/-warning/-info)."
      >
        <Swatch token="--success" hsl="160 55% 38%" purpose="Success-Aktion (Speichern, OK-Confirm)" bg="--success" fgToken="--success-foreground" />
        <Swatch token="--warning" hsl="45 75% 50%" purpose="Warnung (nicht-blockierende Hinweise)" bg="--warning" />
        <Swatch token="--info" hsl="195 60% 42%" purpose="Info / neutrale Hervorhebung" bg="--info" />
      </Section>

      <Section
        title="Vendor (shadcn) — frei verwendbar"
        hint="shadcn-Defaults, leicht gestimmt. Diese Tokens sind NICHT Atoms-exklusiv — Layer-/Page-Code darf bg-primary/bg-card/bg-muted/bg-destructive frei verwenden."
      >
        <Swatch token="--background" hsl="200 20% 98%" purpose="Page-Body-Background" bg="--background" />
        <Swatch token="--foreground" hsl="200 15% 12%" purpose="Body-Text" bg="--foreground" />
        <Swatch token="--card" hsl="0 0% 100%" purpose="Card-/Surface-Background" bg="--card" fgToken="--card-foreground" />
        <Swatch token="--popover" hsl="0 0% 100%" purpose="Popover/Floating-Background" bg="--popover" />
        <Swatch token="--primary" hsl="195 60% 42%" purpose="Primary (Cyan)" bg="--primary" fgToken="--primary-foreground" />
        <Swatch token="--secondary" hsl="200 15% 94%" purpose="Secondary-Aktion (gedämpft)" bg="--secondary" />
        <Swatch token="--muted" hsl="200 15% 94%" purpose="Muted-Fläche (Skeleton-Base)" bg="--muted" fgToken="--muted-foreground" />
        <Swatch token="--accent" hsl="200 15% 94%" purpose="Accent-Hover-Tint" bg="--accent" />
        <Swatch token="--destructive" hsl="345 65% 50%" purpose="Destructive (Löschen, Cancel mit Datenverlust)" bg="--destructive" fgToken="--destructive-foreground" />
        <Swatch token="--border" hsl="200 15% 88%" purpose="Default-Border" bg="--border" />
        <Swatch token="--ring" hsl="195 60% 42%" purpose="Focus-Ring (Tastatur-Fokus)" bg="--ring" />
      </Section>
    </div>
  ),
}
