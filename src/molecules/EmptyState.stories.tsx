import type {Meta, StoryObj} from '@storybook/react-vite'
import {EmptyState} from './EmptyState'
import {Inbox, Search, FolderKanban, Zap} from '../atoms/icons'

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: {layout: 'fullscreen'},
  args: {
    icon: Inbox,
    title: 'Posteingang ist leer',
    description: 'Sobald neue Inbox-Items reinkommen, tauchen sie hier auf.',
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    icon: FolderKanban,
    title: 'Noch keine Missions',
    description: 'Lege deine erste Mission an, um Tasks zu bündeln.',
    actionLabel: 'Mission anlegen',
    onAction: () => {},
  },
}

export const SearchNoResults: Story = {
  args: {
    icon: Search,
    title: 'Keine Treffer',
    description: 'Versuche es mit einem anderen Suchbegriff oder lösche Filter.',
  },
}

export const SignalsEmpty: Story = {
  args: {
    icon: Zap,
    title: 'Noch keine Signale',
    description: 'Markiere Inbox-Items als Signal, um sie für Routing vorzubereiten.',
    actionLabel: 'Signal anlegen',
    onAction: () => {},
  },
}

export const Dashed: Story = {
  name: 'Dashed (gefilterter Listen-Empty)',
  args: {
    tone: 'dashed',
    icon: Search,
    title: 'Keine Treffer',
    description: 'Mit den aktiven Filtern bleibt nichts übrig. Filter zurücksetzen.',
  },
}

export const DashedWithLinkAction: Story = {
  name: 'Dashed + Link-Action',
  args: {
    tone: 'dashed',
    icon: FolderKanban,
    title: 'Keine Missions',
    description: 'Lege die erste Mission in diesem Kontext an.',
    action: (
      <a href="#" className="text-sm font-medium text-primary hover:underline cursor-pointer">
        Erste Mission anlegen
      </a>
    ),
  },
}
