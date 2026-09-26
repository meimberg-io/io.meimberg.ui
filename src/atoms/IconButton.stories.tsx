import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton, type IconButtonTone, type IconButtonVariant} from './IconButton'
import {DeleteIcon, EditIcon, ExternalLink, Flag, MoreHorizontal, RefreshCw, SaveIcon, Star} from './icons'

const VARIANTS: IconButtonVariant[] = ['quiet', 'ghost', 'outline', 'solid']
const TONES: IconButtonTone[] = ['neutral', 'primary', 'success', 'warning', 'destructive']

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  args: {'aria-label': 'Edit', children: <EditIcon />},
  argTypes: {
    variant: {control: 'inline-radio', options: VARIANTS},
    tone: {control: 'inline-radio', options: TONES},
    size: {control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg']},
    shape: {control: 'inline-radio', options: ['rounded', 'circle']},
    pressed: {control: 'boolean'},
  },
}
export default meta

type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

export const VariantsAndTones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map(variant => (
        <div key={variant} className="flex items-center gap-2">
          <span className="caption text-muted-foreground w-14">{variant}</span>
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

export const PressedStates: Story = {
  name: 'Pressed (static)',
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map(variant => (
        <div key={variant} className="flex items-center gap-2">
          <span className="caption text-muted-foreground w-14">{variant}</span>
          {TONES.map(tone => (
            <IconButton key={tone} variant={variant} tone={tone} pressed aria-label={`${variant} ${tone} pressed`}>
              <Star />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
}

function ToggleDemo() {
  const [starred, setStarred] = useState(false)
  const [flagged, setFlagged] = useState(true)
  return (
    <div className="flex items-center gap-2">
      <IconButton tone="warning" pressed={starred} onClick={() => setStarred(v => !v)} aria-label="Star">
        <Star className={starred ? 'fill-current' : undefined} />
      </IconButton>
      <IconButton tone="destructive" pressed={flagged} onClick={() => setFlagged(v => !v)} aria-label="Flag">
        <Flag />
      </IconButton>
      <IconButton variant="outline" tone="primary" pressed={starred} onClick={() => setStarred(v => !v)} aria-label="Star (outline)">
        <Star />
      </IconButton>
    </div>
  )
}

export const Toggle: Story = {
  render: () => <ToggleDemo />,
}

export const AsChildLink: Story = {
  name: 'asChild (link)',
  render: () => (
    <IconButton asChild variant="outline" aria-label="Open docs">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        <ExternalLink />
      </a>
    </IconButton>
  ),
}

export const Circle: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton shape="circle" aria-label="More"><MoreHorizontal /></IconButton>
      <IconButton shape="circle" variant="outline" aria-label="Edit"><EditIcon /></IconButton>
      <IconButton shape="circle" variant="solid" tone="primary" size="lg" aria-label="Save"><SaveIcon /></IconButton>
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
      <IconButton variant="outline" busy aria-label="Refreshing"><RefreshCw /></IconButton>
      <IconButton variant="solid" tone="primary" busy aria-label="Refreshing (solid)"><RefreshCw /></IconButton>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {VARIANTS.map(variant => (
        <IconButton key={variant} variant={variant} tone="primary" disabled aria-label={`${variant} disabled`}>
          <EditIcon />
        </IconButton>
      ))}
    </div>
  ),
}
