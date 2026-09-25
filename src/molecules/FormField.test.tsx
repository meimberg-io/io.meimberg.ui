import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {FormField} from './FormField'
import {TextField} from '../atoms/TextField'

describe('FormField', () => {
  it('renders label + slot and wires htmlFor via useId', () => {
    render(
      <FormField label="Name">
        <TextField defaultValue="hi" />
      </FormField>,
    )
    // Label-Text + Input sind beide gerendert.
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('hi')).toBeInTheDocument()
  })

  it('connects label and input via useFormFieldId context so getByLabelText finds the input', () => {
    render(
      <FormField label="Title">
        <TextField defaultValue="x" />
      </FormField>,
    )
    expect(screen.getByLabelText('Title')).toHaveValue('x')
  })

  it('marks the label as required via .form-field-required (CSS `::after` Asterisk)', () => {
    const {container} = render(
      <FormField label="Required field" required>
        <TextField />
      </FormField>,
    )
    expect(container.querySelector('label.form-field-required')).toBeInTheDocument()
  })

  it('keeps the accessible name = label even with required asterisk', () => {
    // The asterisk must not pollute the accessible name.
    render(
      <FormField label="Title" required>
        <TextField />
      </FormField>,
    )
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('renders a hint next to the label', () => {
    render(
      <FormField label="X" hint="(optional)">
        <TextField />
      </FormField>,
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('renders an error message under the field', () => {
    render(
      <FormField label="X" error="Required">
        <TextField />
      </FormField>,
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
