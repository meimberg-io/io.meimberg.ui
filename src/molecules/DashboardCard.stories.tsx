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

// Neutral placeholder body: the filled block makes the card padding visible.
// No header markup on purpose — the card only provides frame + padding; the
// title comes from <SectionCardHeader> (see story "In context").
const Filler = ({label}: {label: string}) => (
  <div className="bg-muted/40 rounded-md py-10 text-center body-sm text-muted-foreground">
    {label}
  </div>
)

export const Dashboard: Story = {
  name: 'padding="dashboard" (Default, p-5)',
  args: {
    children: <Filler label="Card body · p-5" />,
    style: {width: 360},
  },
}

export const Compact: Story = {
  name: 'padding="compact" (p-4)',
  args: {
    padding: 'compact',
    interactive: true,
    className: 'group relative overflow-hidden',
    children: <Filler label="Card body · p-4" />,
    style: {width: 320},
  },
}

export const NoneItemContainer: Story = {
  name: 'padding="none" (item list container)',
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
  name: 'Padding variants side by side',
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
          none · padding inside
        </div>
      </DashboardCard>
    </div>
  ),
}

// Realistic composition: DashboardCard as frame with the real
// SectionCardHeader inside (no inline <h2>, so the story cannot drift from
// the library).
export const InContext: Story = {
  name: 'In context (with SectionCardHeader)',
  render: () => (
    <DashboardCard style={{width: 360}}>
      <SectionCardHeader
        title="Current tasks"
        subtitle="5 open · 2 overdue"
        action={
          <a href="#" className="caption text-primary hover:underline">
            View all →
          </a>
        }
      />
      <Filler label="Section body" />
    </DashboardCard>
  ),
}
