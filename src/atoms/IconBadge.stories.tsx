import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconBadge, IconBadgeDot} from './IconBadge'
import {Icon} from './Icon'
import {Sparkles, ArrowUpRight} from './icons'

const meta: Meta<typeof IconBadge> = {
  title: 'Atoms/IconBadge',
  component: IconBadge,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

export const Outline: Story = {
  render: () => (
    <IconBadge leading={<Icon icon={Sparkles} size='xs' />}>Label</IconBadge>
  ),
}

export const WithDot: Story = {
  render: () => (
    <IconBadge className='text-primary bg-primary/15' leading={<IconBadgeDot />}>
      Active
    </IconBadge>
  ),
}

export const Plain: Story = {
  render: () => (
    <IconBadge variant='plain' leading={<Icon icon={Sparkles} size='sm' />}>
      Account name
    </IconBadge>
  ),
}

export const Chip: Story = {
  render: () => (
    <IconBadge variant='chip' leading={<Icon icon={Sparkles} size='xs' />}>
      Project
    </IconBadge>
  ),
}

export const ChipLink: Story = {
  render: () => (
    <IconBadge
      variant='chip'
      href='https://example.com'
      leading={<Icon icon={Sparkles} size='xs' />}
      trailing={<Icon icon={ArrowUpRight} size='xs' className='opacity-60' />}
    >
      Open in app
    </IconBadge>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <IconBadge variant='plain' iconOnly leading={<Icon icon={Sparkles} size='sm' />}>
      Icon only (label as tooltip)
    </IconBadge>
  ),
}
