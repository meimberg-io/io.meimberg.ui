import type {Meta, StoryObj} from '@storybook/react-vite'
import {Breadcrumbs} from './Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Organisms/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

export const RootOnly: Story = {
  render: () => <Breadcrumbs rootLabel="Home" items={[]} />,
}

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumbs rootLabel="Home" items={[{label: 'Settings', href: '/settings'}, {label: 'Team'}]} />
  ),
}

export const WithoutRoot: Story = {
  render: () => (
    <Breadcrumbs items={[{label: 'Projects', href: '/projects'}, {label: 'Q3 Roadmap'}]} />
  ),
}
