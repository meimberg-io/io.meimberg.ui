import type {Meta, StoryObj} from '@storybook/react-vite'
import {CardActions} from './CardActions'
import {IconButton} from '../atoms/IconButton'
import {DeleteIcon, EditIcon} from '../atoms/icons'

const meta: Meta<typeof CardActions> = {
  title: 'Molecules/CardActions',
  component: CardActions,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof CardActions>

function DemoCard({permanent}: {permanent?: boolean}) {
  return (
    <div className="hover-card relative w-72 rounded-lg border border-border bg-card p-4">
      <p className="body font-medium">Quarterly report</p>
      <p className="caption text-muted-foreground">Hover the card to reveal the actions.</p>
      <CardActions permanent={permanent}>
        <IconButton aria-label="Edit" onClick={() => {}}><EditIcon /></IconButton>
        <IconButton tone="destructive" aria-label="Delete" onClick={() => {}}><DeleteIcon /></IconButton>
      </CardActions>
    </div>
  )
}

export const HoverReveal: Story = {
  render: () => <DemoCard />,
}

export const Permanent: Story = {
  render: () => <DemoCard permanent />,
}
