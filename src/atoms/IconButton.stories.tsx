import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton} from './IconButton'
import {DeleteIcon, EditIcon, RefreshCw, SaveIcon} from './icons'

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  args: {'aria-label': 'Edit', children: <EditIcon />},
  argTypes: {
    variant: {control: 'inline-radio', options: ['quiet', 'ghost']},
    tone: {control: 'inline-radio', options: ['neutral', 'primary', 'success', 'destructive']},
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

const TONES = ['neutral', 'primary', 'success', 'destructive'] as const

export const VariantsAndTones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['quiet', 'ghost'] as const).map(variant => (
        <div key={variant} className="flex items-center gap-2">
          <span className="caption text-muted-foreground w-12">{variant}</span>
          {TONES.map(tone => (
            <IconButton key={tone} variant={variant} tone={tone} aria-label={`${variant} ${tone}`}>
              <EditIcon />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton size="xs" aria-label="xs"><DeleteIcon /></IconButton>
      <IconButton size="sm" aria-label="sm"><DeleteIcon /></IconButton>
      <IconButton size="md" aria-label="md"><DeleteIcon /></IconButton>
      <IconButton size="lg" aria-label="lg"><DeleteIcon /></IconButton>
    </div>
  ),
}

export const Busy: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton variant="ghost" tone="primary" busy aria-label="Syncing"><RefreshCw /></IconButton>
      <IconButton tone="success" busy aria-label="Saving"><SaveIcon /></IconButton>
    </div>
  ),
}

export const Disabled: Story = {
  args: {disabled: true},
}
