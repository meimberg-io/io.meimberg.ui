import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {SelectableTile} from './SelectableTile'
import {Cloud, Zap, Star} from '../atoms/icons'

const meta: Meta<typeof SelectableTile> = {
  title: 'Molecules/SelectableTile',
  component: SelectableTile,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({initial = false}: {initial?: boolean}) {
  const [active, setActive] = useState(initial)
  return (
    <div style={{width: 180}}>
      <SelectableTile
        label="Cloud"
        glyph={<Cloud className="size-5" aria-hidden />}
        glyphBackground="hsl(220 100% 96%)"
        glyphColor="hsl(220 100% 40%)"
        active={active}
        onClick={() => setActive(v => !v)}
      />
    </div>
  )
}

export const Inactive: Story = {
  render: () => <Demo />,
}

export const Active: Story = {
  render: () => <Demo initial />,
}

export const Disabled: Story = {
  render: () => (
    <div style={{width: 180}}>
      <SelectableTile
        label="Coming soon"
        glyph={<Star className="size-5" aria-hidden />}
        active={false}
        onClick={() => {}}
        disabled
        title="Not available yet"
      />
    </div>
  ),
}

export const WithoutBrandColor: Story = {
  render: () => (
    <div style={{width: 180}}>
      <SelectableTile
        label="Automation"
        glyph={<Zap className="size-5" aria-hidden />}
        active={false}
        onClick={() => {}}
      />
    </div>
  ),
}
