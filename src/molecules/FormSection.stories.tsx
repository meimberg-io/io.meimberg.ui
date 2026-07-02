import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormSection} from './FormSection'
import {FormField} from './FormField'
import {FormRow} from './FormRow'
import {TextField} from '../atoms/TextField'

const meta: Meta<typeof FormSection> = {
  title: 'Molecules/FormSection',
  component: FormSection,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FormSection>

export const Default: Story = {
  args: {
    title: 'Stammdaten',
    children: (
      <FormField label="Name">
        <TextField placeholder="Pulse" />
      </FormField>
    ),
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Anpassen',
    description: 'optional',
    children: (
      <FormRow cols={2}>
        <FormField label="Short-Label">
          <TextField placeholder="PUL" />
        </FormField>
        <FormField label="Sort-Key">
          <TextField placeholder="100" />
        </FormField>
      </FormRow>
    ),
  },
}

export const MultipleFields: Story = {
  args: {
    title: 'Quelle',
    children: (
      <>
        <FormField label="Account">
          <TextField placeholder="oli@meimberg.io" />
        </FormField>
        <FormField label="Resource" hint="(optional)">
          <TextField placeholder="INBOX" />
        </FormField>
        <FormField label="Filter" description="Wird auf den Sync angewendet">
          <TextField placeholder="status = open" />
        </FormField>
      </>
    ),
  },
}
