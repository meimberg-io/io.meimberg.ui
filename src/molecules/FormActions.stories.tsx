import type {Meta, StoryObj} from '@storybook/react-vite'
import {CancelButton, FormActions, SaveButton} from './FormActions'

const meta: Meta<typeof FormActions> = {
  title: 'Molecules/FormActions',
  component: FormActions,
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj<typeof FormActions>

export const Default: Story = {
  render: () => (
    <FormActions>
      <CancelButton />
      <SaveButton />
    </FormActions>
  ),
}

export const Busy: Story = {
  render: () => (
    <FormActions>
      <CancelButton />
      <SaveButton busy />
    </FormActions>
  ),
}

export const CustomLabels: Story = {
  render: () => (
    <FormActions>
      <CancelButton>Discard</CancelButton>
      <SaveButton>Create</SaveButton>
    </FormActions>
  ),
}
