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
    title: 'General',
    children: (
      <FormField label="Name">
        <TextField placeholder="Jane Doe" />
      </FormField>
    ),
  },
}

export const WithDescription: Story = {
  args: {
    title: 'Customize',
    description: 'optional',
    children: (
      <FormRow cols={2}>
        <FormField label="Short label">
          <TextField placeholder="ABC" />
        </FormField>
        <FormField label="Sort key">
          <TextField placeholder="100" />
        </FormField>
      </FormRow>
    ),
  },
}

export const MultipleFields: Story = {
  args: {
    title: 'Source',
    children: (
      <>
        <FormField label="Account">
          <TextField placeholder="jane.doe@example.com" />
        </FormField>
        <FormField label="Folder" hint="(optional)">
          <TextField placeholder="Archive" />
        </FormField>
        <FormField label="Filter" description="Applied on every sync">
          <TextField placeholder="status = open" />
        </FormField>
      </>
    ),
  },
}
