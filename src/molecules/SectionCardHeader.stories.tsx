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

// Header in isolation inside a fixed-width box (so the `action` slot shows its
// `justify-between` layout). No DashboardCard around it on purpose — the
// DashboardCard story "In context" shows the combination.
const Frame = ({children}: {children: ReactNode}) => (
  <div style={{width: 480}}>{children}</div>
)

// Neutral placeholder below the header that makes the `mb-3` spacing visible.
const PlaceholderBody = () => (
  <p className="body-sm text-muted-foreground">Body content follows below …</p>
)

export const TitleOnly: Story = {
  name: 'Title only',
  render: () => (
    <Frame>
      <SectionCardHeader title="Current tasks" />
      <PlaceholderBody />
    </Frame>
  ),
}

export const WithSubtitle: Story = {
  name: 'Title + subtitle',
  render: () => (
    <Frame>
      <SectionCardHeader title="Current tasks" subtitle="5 open · 2 overdue" />
      <PlaceholderBody />
    </Frame>
  ),
}

export const WithAction: Story = {
  name: 'Title + subtitle + action link',
  render: () => (
    <Frame>
      <SectionCardHeader
        title="Current tasks"
        subtitle="5 open · 2 overdue"
        action={
          <a href="#" className="caption text-primary hover:underline">
            View all →
          </a>
        }
      />
      <PlaceholderBody />
    </Frame>
  ),
}

// Embedded section without its own card: compact title + inline count + action link.
export const BaseSizeWithCount: Story = {
  name: 'titleSize="base" + inline count + action',
  render: () => (
    <Frame>
      <SectionCardHeader
        titleSize="base"
        title={
          <>
            Projects{' '}
            <span className="caption text-muted-foreground tabular-nums">(12)</span>
          </>
        }
        action={
          <a href="#" className="caption text-primary hover:underline">
            + New project
          </a>
        }
      />
      <PlaceholderBody />
    </Frame>
  ),
}
