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
    label: 'Service',
    children: <span className="body">Cloud Storage</span>,
  },
}

export const WithBadge: Story = {
  args: {
    label: 'Status',
    align: 'center',
    children: (
      <Badge variant="outline" className="caption border-success/30 text-success">
        Connected
      </Badge>
    ),
  },
}

export const LongValue: Story = {
  args: {
    label: 'Identifier',
    children: (
      <span className="body font-mono break-all">
        jane.doe@example.com
      </span>
    ),
  },
}

export const MultilineValue: Story = {
  args: {
    label: 'Last error',
    children: (
      <pre className="caption text-destructive whitespace-pre-wrap break-all bg-destructive/5 p-2 rounded">
        {'storage upload 403\nAccessDenied: Access is denied.'}
      </pre>
    ),
  },
}

export const Stack: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <DetailField label="Service">
        <span className="body">Cloud Storage</span>
      </DetailField>
      <DetailField label="Identifier">
        <span className="body font-mono break-all">jane.doe@example.com</span>
      </DetailField>
      <DetailField label="Status" align="center">
        <Badge variant="outline" className="caption border-success/30 text-success">
          Connected
        </Badge>
      </DetailField>
    </div>
  ),
}
