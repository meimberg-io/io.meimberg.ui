import type {Meta, StoryObj} from '@storybook/react-vite'
import {Badge, BadgeDot} from './Badge'
import {ExternalLink, FileText, Globe} from './icons'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  args: {children: 'Badge'},
  argTypes: {
    tone: {control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'info', 'destructive']},
    variant: {control: 'inline-radio', options: ['solid', 'soft', 'outline', 'plain']},
    shape: {control: 'inline-radio', options: ['pill', 'rounded']},
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}

const TONES = ['neutral', 'primary', 'success', 'warning', 'info', 'destructive'] as const
const VARIANTS = ['solid', 'soft', 'outline', 'plain'] as const

export const ToneVariantMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(4,auto)] gap-3 items-center justify-items-start">
      <span />
      {VARIANTS.map(variant => (
        <span key={variant} className="caption text-muted-foreground">{variant}</span>
      ))}
      {TONES.map(tone => (
        <div key={tone} className="contents">
          <span className="caption text-muted-foreground">{tone}</span>
          {VARIANTS.map(variant => (
            <Badge key={variant} tone={tone} variant={variant}>{tone}</Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge>pill</Badge>
      <Badge shape="rounded" leading={<FileText size={12} />}>rounded</Badge>
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge compact>5</Badge>
      <Badge compact>12</Badge>
      <Badge compact tone="primary">128</Badge>
    </div>
  ),
}

export const LeadingAndTrailing: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge variant="outline" tone="success" leading={<BadgeDot />}>Active</Badge>
      <Badge variant="outline" tone="warning" leading={<BadgeDot />}>Paused</Badge>
      <Badge leading={<Globe size={12} />} trailing={<ExternalLink size={12} />}>repository</Badge>
    </div>
  ),
}

export const IconOnly: Story = {
  args: {iconOnly: true, leading: <Globe size={12} />, children: 'Repository'},
}

export const AsLink: Story = {
  args: {
    href: 'https://example.com',
    variant: 'outline',
    leading: <Globe size={12} />,
    trailing: <ExternalLink size={12} />,
    children: 'example.com',
  },
}
