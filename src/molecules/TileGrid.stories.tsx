// Below `md` the grid always renders two columns (cols=3/4 → 2) so tiles are
// not squeezed on narrow viewports. Visible below 768px in the Storybook
// viewport toolbar.

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

type Source =
  | 'cloud'
  | 'automation'
  | 'documents'
  | 'web'
  | 'apps'
  | 'email'
  | 'tasks'
  | 'favorites'

const SOURCES: ReadonlyArray<TileDef<Source>> = [
  {
    id: 'cloud',
    label: 'Cloud',
    glyph: <Cloud className="size-5" aria-hidden />,
    glyphBackground: 'hsl(220 100% 96%)',
    glyphColor: 'hsl(220 100% 40%)',
  },
  {
    id: 'automation',
    label: 'Automation',
    glyph: <Zap className="size-5" aria-hidden />,
    glyphBackground: 'hsl(252 96% 96%)',
    glyphColor: 'hsl(252 96% 50%)',
  },
  {
    id: 'documents',
    label: 'Documents',
    glyph: <FileText className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 0% 95%)',
  },
  {
    id: 'web',
    label: 'Web',
    glyph: <Globe className="size-5" aria-hidden />,
    glyphBackground: 'hsl(208 100% 95%)',
    glyphColor: 'hsl(208 100% 40%)',
  },
  {
    id: 'apps',
    label: 'Apps',
    glyph: <Grid3x3 className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 0% 95%)',
  },
  {
    id: 'email',
    label: 'Email',
    glyph: <Mail className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 80% 96%)',
    glyphColor: 'hsl(0 80% 45%)',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    glyph: <CheckSquare className="size-5" aria-hidden />,
    glyphBackground: 'hsl(0 75% 95%)',
    glyphColor: 'hsl(0 75% 45%)',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    glyph: <Star className="size-5" aria-hidden />,
    disabled: true,
    title: 'Coming soon',
  },
]

function Demo({cols, initial = null}: {cols?: 2 | 3 | 4; initial?: Source | null}) {
  const [value, setValue] = useState<Source | null>(initial)
  return (
    <div style={{width: 560}}>
      <TileGrid<Source>
        value={value}
        options={SOURCES}
        onChange={setValue}
        cols={cols}
      />
    </div>
  )
}

export const ThreeColumns: Story = {
  render: () => <Demo cols={3} initial="cloud" />,
}

export const TwoColumns: Story = {
  render: () => <Demo cols={2} initial="automation" />,
}

export const FourColumns: Story = {
  render: () => <Demo cols={4} initial="documents" />,
}

export const Empty: Story = {
  render: () => <Demo cols={3} initial={null} />,
}
