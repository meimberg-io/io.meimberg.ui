import type {Meta, StoryObj} from '@storybook/react-vite'
import {DashboardCard} from './DashboardCard'
import {SectionCardHeader} from './SectionCardHeader'

const meta: Meta<typeof DashboardCard> = {
  title: 'Molecules/DashboardCard',
  component: DashboardCard,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof DashboardCard>

// Neutraler Platzhalter-Body: der gefüllte Block macht das Card-Padding
// sichtbar (Abstand Block ↔ Card-Rand). Bewusst KEIN Header-Markup — die
// Karte liefert nur Rahmen + Padding, nicht den Titel. Den liefert
// <SectionCardHeader>; Zusammenspiel zeigt die Story „In context".
const Filler = ({label}: {label: string}) => (
  <div className="bg-muted/40 rounded-md py-10 text-center body-sm text-muted-foreground">
    {label}
  </div>
)

export const Dashboard: Story = {
  name: 'padding="dashboard" (Default, p-5)',
  args: {
    children: <Filler label="Card-Body · p-5" />,
    style: {width: 360},
  },
}

export const Compact: Story = {
  name: 'padding="compact" (p-4)',
  args: {
    padding: 'compact',
    className: 'group relative hover-card cursor-pointer overflow-hidden',
    children: <Filler label="Card-Body · p-4" />,
    style: {width: 320},
  },
}

export const NoneItemContainer: Story = {
  name: 'padding="none" (Item-Listen-Container)',
  render: () => (
    <DashboardCard padding="none" className="overflow-hidden" style={{width: 360}}>
      <div className="px-4 py-3 border-b border-border">
        <div className="body-sm text-foreground">Item 1</div>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <div className="body-sm text-foreground">Item 2</div>
      </div>
      <div className="px-4 py-3">
        <div className="body-sm text-foreground">Item 3</div>
      </div>
    </DashboardCard>
  ),
}

export const AllSideBySide: Story = {
  name: 'Padding-Variants nebeneinander',
  render: () => (
    <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
      <DashboardCard style={{width: 240}}>
        <Filler label="dashboard · p-5" />
      </DashboardCard>
      <DashboardCard padding="compact" style={{width: 240}}>
        <Filler label="compact · p-4" />
      </DashboardCard>
      <DashboardCard padding="none" style={{width: 240}} className="overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 body-sm text-muted-foreground">
          none · Padding intern
        </div>
      </DashboardCard>
    </div>
  ),
}

// Realistische Komposition: DashboardCard als Rahmen, die ECHTE
// SectionCardHeader als Kopfzeile darin (kein Inline-<h2>, damit die Story
// nicht von der Library driftet). Dies ist die einzige Story hier, die
// bewusst eine zweite Library-Komponente zeigt.
export const InContext: Story = {
  name: 'In context (mit SectionCardHeader)',
  render: () => (
    <DashboardCard style={{width: 360}}>
      <SectionCardHeader
        title="Aktuelle Tasks"
        subtitle="5 offene · 2 überfällig"
        action={
          <a href="#" className="caption text-primary hover:underline">
            Alle anzeigen →
          </a>
        }
      />
      <Filler label="Section-Body" />
    </DashboardCard>
  ),
}
