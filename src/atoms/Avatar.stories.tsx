import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar, type AvatarSize} from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

export const Initials: Story = {
  render: () => (
    <div className='flex items-end gap-3'>
      {SIZES.map(size => (
        <Avatar key={size} initials='MB' colorSeed='meimberg' label='meimberg' size={size} />
      ))}
    </div>
  ),
}

export const HashColors: Story = {
  render: () => (
    <div className='flex gap-3'>
      {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(name => (
        <Avatar key={name} initials={name.slice(0, 2).toUpperCase()} colorSeed={name} label={name} />
      ))}
    </div>
  ),
}

export const Image: Story = {
  render: () => (
    <Avatar
      src='https://avatars.githubusercontent.com/u/9919?s=80'
      label='GitHub'
      size='lg'
    />
  ),
}
