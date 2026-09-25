// FormRow collapses to one column below `md` (CSS, viewport-based). Set the
// Storybook viewport below 768px to see it in the multi-column stories.

import type {Meta, StoryObj} from '@storybook/react-vite'
import {FormRow} from './FormRow'
import {FormField} from './FormField'
import {TextField} from '../atoms/TextField'

const meta: Meta<typeof FormRow> = {
  title: 'Molecules/FormRow',
  component: FormRow,
  parameters: {layout: 'padded'},
}
export default meta

type Story = StoryObj<typeof FormRow>

export const SingleColumn: Story = {
  args: {
    cols: 1,
    children: (
      <>
        <FormField label="Name">
          <TextField placeholder="Jane Doe" />
        </FormField>
        <FormField label="Description">
          <TextField as="textarea" rows={2} placeholder="…" />
        </FormField>
      </>
    ),
  },
}

export const TwoColumns: Story = {
  args: {
    cols: 2,
    children: (
      <>
        <FormField label="First name">
          <TextField placeholder="Jane" />
        </FormField>
        <FormField label="Last name">
          <TextField placeholder="Doe" />
        </FormField>
      </>
    ),
  },
}

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    children: (
      <>
        <FormField label="Day">
          <TextField placeholder="01" />
        </FormField>
        <FormField label="Month">
          <TextField placeholder="05" />
        </FormField>
        <FormField label="Year">
          <TextField placeholder="2026" />
        </FormField>
      </>
    ),
  },
}

export const CustomTemplate: Story = {
  args: {
    cols: '1fr 240px',
    children: (
      <>
        <FormField label="Short label">
          <TextField placeholder="Backlog" />
        </FormField>
        <FormField label="Sort key">
          <TextField placeholder="100" />
        </FormField>
      </>
    ),
  },
}
