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
    <Breadcrumbs rootLabel="Home" items={[{label: 'Einstellungen', href: '/settings'}, {label: 'Konten'}]} />
  ),
}

export const WithoutRoot: Story = {
  render: () => (
    <Breadcrumbs items={[{label: 'Missions', href: '/missions'}, {label: 'Q3 Roadmap'}]} />
  ),
}
