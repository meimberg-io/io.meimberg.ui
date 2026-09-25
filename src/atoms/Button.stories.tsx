import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from './Button'
import {AddIcon, Loader2, RefreshCw, SaveIcon} from './icons'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  args: {children: 'Button'},
  argTypes: {
    variant: {control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'link']},
    tone: {control: 'inline-radio', options: ['primary', 'neutral', 'success', 'destructive']},
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}

const VARIANTS = ['solid', 'outline', 'ghost', 'link'] as const
const TONES = ['primary', 'neutral', 'success', 'destructive'] as const

export const VariantsAndTones: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3 items-center justify-items-start">
      {VARIANTS.map(variant =>
        TONES.map(tone => (
          <Button key={`${variant}-${tone}`} variant={variant} tone={tone}>
            {variant} / {tone}
          </Button>
        )),
      )}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs" icon={AddIcon}>xs · 26</Button>
      <Button size="sm" icon={AddIcon}>sm · 32</Button>
      <Button size="md" icon={AddIcon}>md · 36</Button>
      <Button size="lg" icon={AddIcon}>lg · 40</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button icon={AddIcon}>New item</Button>
      <Button tone="success" icon={SaveIcon}>Save</Button>
      <Button variant="outline" icon={RefreshCw}>Refresh</Button>
    </div>
  ),
}

export const Busy: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button busy icon={RefreshCw}>Syncing</Button>
      <Button tone="success" busy icon={Loader2}>Saving</Button>
      <Button variant="outline" busy icon={RefreshCw}>Refreshing</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {disabled: true, children: 'Disabled'},
}

export const AsChild: Story = {
  render: () => (
    <Button asChild variant="outline" icon={AddIcon}>
      <a href="#new">Link styled as button</a>
    </Button>
  ),
}
