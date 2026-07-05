import type {Meta, StoryObj} from '@storybook/react-vite'
import {DetailField} from './DetailField'
import {Badge} from '../ui/badge'

const meta: Meta<typeof DetailField> = {
  title: 'Molecules/DetailField',
  component: DetailField,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof DetailField>

export const Default: Story = {
  args: {
    label: 'Provider',
    children: <span className="body">Microsoft 365</span>,
  },
}

export const WithBadge: Story = {
  args: {
    label: 'Status',
    align: 'center',
    children: (
      <Badge variant="outline" className="caption border-success/30 text-success">
        Verbunden
      </Badge>
    ),
  },
}

export const LongValue: Story = {
  args: {
    label: 'Identifier',
    children: (
      <span className="body font-mono break-all">
        oliver.meimberg@form4.de
      </span>
    ),
  },
}

export const MultilineValue: Story = {
  args: {
    label: 'Last error',
    children: (
      <pre className="caption text-destructive whitespace-pre-wrap break-all bg-destructive/5 p-2 rounded">
        {'microsoft_graph move-to-archive 403\nErrorAccessDenied: Access is denied.'}
      </pre>
    ),
  },
}

export const Stack: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <DetailField label="Provider">
        <span className="body">Microsoft 365</span>
      </DetailField>
      <DetailField label="Identifier">
        <span className="body font-mono break-all">oliver.meimberg@form4.de</span>
      </DetailField>
      <DetailField label="Status" align="center">
        <Badge variant="outline" className="caption border-success/30 text-success">
          Verbunden
        </Badge>
      </DetailField>
    </div>
  ),
}
