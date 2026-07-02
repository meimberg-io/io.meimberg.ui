// PUL-456: FormRow kollabiert auf `< md` automatisch auf eine Spalte (CSS,
// viewport-basiert). Die mehrspaltigen Stories unten zeigen das, wenn die
// Storybook-Viewport-Breite unter 768px gestellt wird (Viewport-Toolbar).

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
          <TextField placeholder="Pulse" />
        </FormField>
        <FormField label="Beschreibung">
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
        <FormField label="Vorname">
          <TextField placeholder="Oliver" />
        </FormField>
        <FormField label="Nachname">
          <TextField placeholder="Meimberg" />
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
        <FormField label="Tag">
          <TextField placeholder="01" />
        </FormField>
        <FormField label="Monat">
          <TextField placeholder="05" />
        </FormField>
        <FormField label="Jahr">
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
        <FormField label="Short-Label">
          <TextField placeholder="Pulse-Backlog" />
        </FormField>
        <FormField label="Sort-Key">
          <TextField placeholder="100" />
        </FormField>
      </>
    ),
  },
}
