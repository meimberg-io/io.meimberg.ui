import type {Meta, StoryObj} from '@storybook/react-vite'
import type {ReactNode} from 'react'
import {SectionCardHeader} from './SectionCardHeader'

const meta: Meta<typeof SectionCardHeader> = {
  title: 'Molecules/SectionCardHeader',
  component: SectionCardHeader,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof SectionCardHeader>

// Isolierte Darstellung: nur die Header-Komponente, in einer reinen
// Breiten-Box (damit der `action`-Slot sein `justify-between`-Layout zeigt).
// Bewusst KEINE DashboardCard drumherum — das wäre eine andere Komponente.
// Wie der Header in einer Karte sitzt, zeigt die DashboardCard-Story
// „In context".
const Frame = ({children}: {children: ReactNode}) => (
  <div style={{width: 480}}>{children}</div>
)

// Neutraler Platzhalter, der den Body unterhalb des Headers andeutet und so
// den `mb-3`-Abstand der Komponente sichtbar macht.
const PlaceholderBody = () => (
  <p className="body-sm text-muted-foreground">Body-Content folgt unterhalb …</p>
)

export const TitleOnly: Story = {
  name: 'Title only',
  render: () => (
    <Frame>
      <SectionCardHeader title="Aktuelle Tasks" />
      <PlaceholderBody />
    </Frame>
  ),
}

export const WithSubtitle: Story = {
  name: 'Title + Subtitle',
  render: () => (
    <Frame>
      <SectionCardHeader title="Aktuelle Tasks" subtitle="5 offene · 2 überfällig" />
      <PlaceholderBody />
    </Frame>
  ),
}

export const WithAction: Story = {
  name: 'Title + Subtitle + Action-Link',
  render: () => (
    <Frame>
      <SectionCardHeader
        title="Aktuelle Tasks"
        subtitle="5 offene · 2 überfällig"
        action={
          <a href="#" className="caption text-primary hover:underline">
            Alle anzeigen →
          </a>
        }
      />
      <PlaceholderBody />
    </Frame>
  ),
}

// ContextMissionsGrid-Variante: embedded Section ohne eigene Card,
// kompakterer Title + Inline-Count + Action-Link.
export const BaseSizeWithCount: Story = {
  name: 'titleSize="base" + Inline-Count + Action',
  render: () => (
    <Frame>
      <SectionCardHeader
        titleSize="base"
        title={
          <>
            Missions{' '}
            <span className="caption text-muted-foreground tabular-nums">(12)</span>
          </>
        }
        action={
          <a href="#" className="caption text-primary hover:underline">
            + Neue Mission
          </a>
        }
      />
      <PlaceholderBody />
    </Frame>
  ),
}
