import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconByKey} from './IconByKey'
import {Mail, PenLine, Globe, Zap} from './icons'

const meta: Meta<typeof IconByKey> = {
  title: 'Atoms/IconByKey',
  component: IconByKey,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

const REGISTRY = {email: Mail, manual: PenLine, web: Globe}

export const Resolved: Story = {
  render: () => (
    <div className='flex gap-4'>
      <IconByKey registry={REGISTRY} id='email' className='size-6' />
      <IconByKey registry={REGISTRY} id='manual' className='size-6' />
      <IconByKey registry={REGISTRY} id='web' className='size-6' />
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <IconByKey registry={REGISTRY} id='unknown-key' fallback={Zap} className='size-6' />
  ),
}
