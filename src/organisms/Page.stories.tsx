import type {Meta, StoryObj} from '@storybook/react-vite'
import {Page} from './Page'
import {SubNavLayout} from './SubNavLayout'
import {Avatar} from '../atoms/Avatar'
import {Badge} from '../atoms/Badge'
import {Button} from '../atoms/Button'
import {PageContainer} from '../atoms/PageContainer'
import {DashboardCard} from '../molecules/DashboardCard'
import {Bell, Plus, Settings, User} from '../atoms/icons'

const meta: Meta<typeof Page> = {
  title: 'Organisms/Page',
  component: Page,
  parameters: {layout: 'fullscreen'},
}
export default meta

type Story = StoryObj<typeof Page>

export const Default: Story = {
  render: () => (
    <Page
      title="Projects"
      description="Overview of your active projects."
      actions={<Button icon={Plus}>New project</Button>}
    >
      <DashboardCard>Page content</DashboardCard>
    </Page>
  ),
}

export const WithLeadingAndMeta: Story = {
  render: () => (
    <Page
      title="Ada Lovelace"
      description="Analytical Engine team"
      leading={<Avatar initials="AL" label="Ada Lovelace" size="xl" />}
      meta={<><Badge tone="success" variant="soft">Active</Badge><Badge variant="outline">Admin</Badge></>}
      actions={<><Button variant="outline">Message</Button><Button>Edit profile</Button></>}
    >
      <DashboardCard>Profile details</DashboardCard>
    </Page>
  ),
}

// A settings shell already provides the container: the page renders its
// header and content without a second PageContainer.
export const NotContained: Story = {
  render: () => (
    <PageContainer>
      <SubNavLayout
        currentPath="/settings/profile"
        items={[
          {label: 'Profile', href: '/settings/profile', icon: <User className="size-4" />},
          {label: 'Notifications', href: '/settings/notifications', icon: <Bell className="size-4" />},
          {label: 'General', href: '/settings/general', icon: <Settings className="size-4" />},
        ]}
      >
        <Page title="Profile" description="How others see you." contained={false}>
          <DashboardCard>Profile form</DashboardCard>
        </Page>
      </SubNavLayout>
    </PageContainer>
  ),
}
