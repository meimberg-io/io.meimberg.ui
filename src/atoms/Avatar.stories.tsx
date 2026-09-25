import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar, type AvatarSize, type AvatarTone} from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {layout: 'centered'},
  args: {initials: 'AC', colorSeed: 'acme', label: 'Acme Inc.'},
}
export default meta

type Story = StoryObj<typeof meta>

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
const TONES: AvatarTone[] = ['auto', 'primary', 'neutral']

export const Default: Story = {}

export const Sizes: Story = {
  render: args => (
    <div className="flex items-end gap-3">
      {SIZES.map(size => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Tones: Story = {
  render: args => (
    <div className="flex gap-3">
      {TONES.map(tone => (
        <Avatar key={tone} {...args} size="lg" tone={tone} />
      ))}
    </div>
  ),
}

export const Circle: Story = {
  args: {shape: 'circle', tone: 'primary', size: 'md', initials: 'JD', label: 'Jane Doe'},
}

export const HashColors: Story = {
  render: () => (
    <div className="flex gap-3">
      {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(name => (
        <Avatar key={name} initials={name.slice(0, 2).toUpperCase()} colorSeed={name} label={name} />
      ))}
    </div>
  ),
}

export const Image: Story = {
  args: {src: 'https://avatars.githubusercontent.com/u/9919?s=160', label: 'GitHub', initials: 'GH', size: 'xl'},
}

export const BrokenImageFallback: Story = {
  args: {src: 'https://example.invalid/missing.png', label: 'Missing image', initials: 'MI', size: 'xl'},
}
