import type {Meta, StoryObj} from '@storybook/react-vite'
import {KpiTile} from './KpiTile'
import {Inbox, ListTodo, Radio} from '../atoms/icons'

const meta: Meta<typeof KpiTile> = {
  title: 'Molecules/KpiTile',
  component: KpiTile,
  args: {
    label: 'Completed this week',
    value: 23,
    sublabel: 'of 31',
    sparklineValues: [3, 5, 2, 7, 4, 8, 6, 9],
    delta: {value: 4, direction: 'up', isPositive: true},
    tone: 'neutral',
    variant: 'default',
  },
  argTypes: {
    tone: {control: 'inline-radio', options: ['neutral', 'success', 'warn', 'danger']},
    variant: {control: 'inline-radio', options: ['default', 'emphasis', 'muted']},
  },
  decorators: [
    Story => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof KpiTile>

export const Default: Story = {}

export const WithIcon: Story = {
  args: {
    label: 'Projects',
    value: 4,
    sublabel: 'linked',
    icon: <Inbox width={12} height={12} />,
    sparklineValues: undefined,
    delta: undefined,
  },
}

export const WithSparklineAndDelta: Story = {
  args: {
    label: 'Active',
    value: 17,
    sublabel: 'running',
    sparklineValues: [2, 4, 3, 6, 5, 7, 8, 10],
    delta: {value: 3, direction: 'up', isPositive: true},
  },
}

export const ToneNeutral: Story = {
  args: {tone: 'neutral', label: 'Neutral'},
}

export const ToneSuccess: Story = {
  args: {
    tone: 'success',
    label: 'Done',
    value: 42,
    delta: {value: 6, direction: 'up', isPositive: true},
  },
}

export const ToneWarn: Story = {
  args: {
    tone: 'warn',
    label: 'Due soon',
    value: 9,
    delta: {value: 2, direction: 'up', isPositive: false},
  },
}

export const ToneDanger: Story = {
  args: {
    tone: 'danger',
    label: 'Overdue',
    value: 5,
    delta: {value: 3, direction: 'up', isPositive: false},
  },
}

export const VariantDefault: Story = {
  args: {variant: 'default', label: 'Default'},
}

export const VariantEmphasis: Story = {
  args: {
    variant: 'emphasis',
    tone: 'success',
    label: 'Active',
    value: 17,
    sublabel: 'running',
  },
}

export const VariantMuted: Story = {
  args: {
    variant: 'muted',
    label: 'Done',
    value: 12,
    sublabel: 'projects',
    sparklineValues: [1, 2, 3, 4],
  },
}

export const HeroKpi: Story = {
  name: 'Combo: Icon + Sparkline + Delta + emphasis',
  args: {
    label: 'Open tasks',
    value: 23,
    sublabel: 'open',
    tone: 'warn',
    variant: 'emphasis',
    icon: <ListTodo width={12} height={12} />,
    sparklineValues: [10, 12, 9, 14, 16, 18, 20, 23],
    delta: {value: 5, direction: 'up', isPositive: false},
  },
}

export const Flat: Story = {
  args: {
    label: 'Messages',
    value: 7,
    delta: {value: 0, direction: 'flat'},
  },
}

export const NoSparkline: Story = {
  args: {
    label: 'Alerts',
    value: 12,
    sparklineValues: [],
    icon: <Radio width={12} height={12} />,
    delta: undefined,
  },
}

export const CustomComparison: Story = {
  name: 'Custom comparison label',
  args: {
    label: 'Revenue',
    value: '€12.4k',
    delta: {value: 8, direction: 'up'},
    labels: {comparison: 'vs. last month'},
  },
}
