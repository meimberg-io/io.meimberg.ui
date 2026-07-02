import type {Meta, StoryObj} from '@storybook/react-vite'
import {CounterPill} from './CounterPill'

const meta: Meta<typeof CounterPill> = {
  title: 'Atoms/CounterPill',
  component: CounterPill,
}

export default meta
type Story = StoryObj<typeof CounterPill>

export const Default: Story = {
  args: {
    children: 12,
  },
}

export const Primary: Story = {
  args: {
    tone: 'primary',
    children: '5 ungelesen',
  },
}

export const Compact: Story = {
  args: {
    size: 'compact',
    children: 3,
  },
}

export const CompactSingleDigit: Story = {
  name: 'Compact (single digit — min-width stable)',
  args: {
    size: 'compact',
    children: 1,
  },
}

export const SideBySide: Story = {
  name: 'Tone + size variants side-by-side',
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{fontFamily: 'monospace', fontSize: 11, minWidth: 200}}>
          tone=&quot;muted&quot; size=&quot;default&quot;
        </span>
        <CounterPill>12</CounterPill>
        <CounterPill>1</CounterPill>
        <CounterPill>247</CounterPill>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{fontFamily: 'monospace', fontSize: 11, minWidth: 200}}>
          tone=&quot;muted&quot; size=&quot;compact&quot;
        </span>
        <CounterPill size="compact">12</CounterPill>
        <CounterPill size="compact">1</CounterPill>
        <CounterPill size="compact">99</CounterPill>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{fontFamily: 'monospace', fontSize: 11, minWidth: 200}}>
          tone=&quot;primary&quot; size=&quot;default&quot;
        </span>
        <CounterPill tone="primary">3</CounterPill>
        <CounterPill tone="primary">3 ungelesen</CounterPill>
      </div>
    </div>
  ),
}
