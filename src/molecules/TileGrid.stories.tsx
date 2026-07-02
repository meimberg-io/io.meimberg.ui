// PUL-456: Auf `< md` rendert das Grid immer 2-spaltig (cols=3/4 → 2), damit die
// Tiles auf schmalen Viewports nicht zerquetscht werden. In der Storybook-
// Viewport-Toolbar unter 768px sichtbar.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {TileGrid, type TileDef} from './TileGrid'
import {Cloud, Zap, FileText, Globe, Grid3x3, Mail, CheckSquare, Star} from '../atoms/icons'

const meta: Meta<typeof TileGrid> = {
  title: 'Molecules/TileGrid',
  component: TileGrid,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof meta>

type Provider =
  | 'jira'
  | 'linear'
  | 'notion'
  | 'raindrop'
  | 'microsoft_graph'
  | 'gmail'
  | 'todoist'
  | 'hubspot'

const PROVIDERS: ReadonlyArray<TileDef<Provider>> = [
  {
    id: 'jira',
    label: 'Jira',
    glyph: <Cloud className="size-5" aria-hidden />,
    glyphBackground: 'hsl(220 100% 96%)',
    glyphColor: 'hsl(220 100% 40%)',
  },
  {
    id: 'linear',
    label: 'Linear',
    glyph: <Zap className="size-5" aria-hidden />,
    glyphBackground: 'hsl(252 96% 96%)',
    glyphColor: 'hsl(252 96% 50%)',
  },
  {
    id: 'notion',
    label: 'Notion',
    glyph: <FileText className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 0% 95%)',
  },
  {
    id: 'raindrop',
    label: 'Raindrop',
    glyph: <Globe className="size-5" aria-hidden />,
    glyphBackground: 'hsl(208 100% 95%)',
    glyphColor: 'hsl(208 100% 40%)',
  },
  {
    id: 'microsoft_graph',
    label: 'Microsoft 365',
    glyph: <Grid3x3 className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 0% 95%)',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    glyph: <Mail className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 80% 96%)',
    glyphColor: 'hsl(0 80% 45%)',
  },
  {
    id: 'todoist',
    label: 'Todoist',
    glyph: <CheckSquare className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 75% 95%)',
    glyphColor: 'hsl(0 75% 45%)',
  },
  {
    id: 'hubspot',
    label: 'HubSpot',
    glyph: <Star className="size-5" aria-hidden />,
    disabled: true,
    title: 'In Vorbereitung',
  },
]

function Demo({cols, initial = null}: {cols?: 2 | 3 | 4; initial?: Provider | null}) {
  const [value, setValue] = useState<Provider | null>(initial)
  return (
    <div style={{width: 560}}>
      <TileGrid<Provider>
        value={value}
        options={PROVIDERS}
        onChange={setValue}
        cols={cols}
      />
    </div>
  )
}

export const ThreeColumns: Story = {
  render: () => <Demo cols={3} initial="jira" />,
}

export const TwoColumns: Story = {
  render: () => <Demo cols={2} initial="linear" />,
}

export const FourColumns: Story = {
  render: () => <Demo cols={4} initial="notion" />,
}

export const Empty: Story = {
  render: () => <Demo cols={3} initial={null} />,
}
