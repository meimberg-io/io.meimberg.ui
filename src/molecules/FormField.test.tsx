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
      <FormField label="Titel">
        <TextField defaultValue="x" />
      </FormField>,
    )
    expect(screen.getByLabelText('Titel')).toHaveValue('x')
  })

  it('marks the label as required via .form-field-required (CSS `::after` Asterisk)', () => {
    const {container} = render(
      <FormField label="Pflichtfeld" required>
        <TextField />
      </FormField>,
    )
    expect(container.querySelector('label.form-field-required')).toBeInTheDocument()
  })

  it('keeps the accessible name = label even with required asterisk', () => {
    // Spec: das aria-hidden Asterisk darf den accessible Name nicht
    // verschmutzen — getByLabelText('Titel') matched weiterhin exakt.
    render(
      <FormField label="Titel" required>
        <TextField />
      </FormField>,
    )
    expect(screen.getByLabelText('Titel')).toBeInTheDocument()
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
      <FormField label="X" error="Pflichtfeld">
        <TextField />
      </FormField>,
    )
    expect(screen.getByText('Pflichtfeld')).toBeInTheDocument()
  })
})
