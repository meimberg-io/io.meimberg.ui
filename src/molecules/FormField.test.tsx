import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {FormField} from './FormField'
import {TextField} from '../atoms/TextField'
import {Input} from '../ui/input'
import {Textarea} from '../ui/textarea'

describe('FormField', () => {
  it('renders label and slot', () => {
    render(
      <FormField label="Name">
        <TextField defaultValue="hi" />
      </FormField>,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('hi')).toBeInTheDocument()
  })

  it('connects label and a DS control via context', () => {
    render(
      <FormField label="Title">
        <TextField defaultValue="x" />
      </FormField>,
    )
    expect(screen.getByLabelText('Title')).toHaveValue('x')
  })

  it('injects the field id into a raw <input> without id (cloneElement fallback)', () => {
    render(
      <FormField label="Raw input">
        <input defaultValue="raw" />
      </FormField>,
    )
    expect(screen.getByLabelText('Raw input')).toHaveValue('raw')
  })

  it('injects the field id into a raw <textarea> without id', () => {
    render(
      <FormField label="Body">
        <textarea defaultValue="prose" />
      </FormField>,
    )
    expect(screen.getByLabelText('Body')).toHaveValue('prose')
  })

  it('injects the field id into vendor ui/input and ui/textarea', () => {
    render(
      <>
        <FormField label="Vendor input">
          <Input defaultValue="a" />
        </FormField>
        <FormField label="Vendor textarea">
          <Textarea defaultValue="b" />
        </FormField>
      </>,
    )
    expect(screen.getByLabelText('Vendor input')).toHaveValue('a')
    expect(screen.getByLabelText('Vendor textarea')).toHaveValue('b')
  })

  it('focuses the control when the label is clicked', async () => {
    const user = userEvent.setup()
    render(
      <FormField label="Focus me">
        <input />
      </FormField>,
    )
    await user.click(screen.getByText('Focus me'))
    expect(screen.getByLabelText('Focus me')).toHaveFocus()
  })

  it('keeps an explicit child id and points the label at it', () => {
    render(
      <FormField label="Custom">
        <input id="my-input" />
      </FormField>,
    )
    expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'my-input')
  })

  it('uses htmlFor for nested controls', () => {
    render(
      <FormField label="Nested" htmlFor="nested-input">
        <div className="relative">
          <input id="nested-input" />
        </div>
      </FormField>,
    )
    expect(screen.getByLabelText('Nested')).toHaveAttribute('id', 'nested-input')
  })

  it('does not clone when there are several children', () => {
    render(
      <FormField label="Multi">
        <input />
        <span>suffix</span>
      </FormField>,
    )
    expect(screen.getByRole('textbox')).not.toHaveAttribute('id')
  })

  it('marks the label as required via .form-field-required without polluting the name', () => {
    const {container} = render(
      <FormField label="Title" required>
        <TextField />
      </FormField>,
    )
    expect(container.querySelector('label.form-field-required')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('renders hint, description and error', () => {
    render(
      <FormField label="X" hint="(optional)" description="Helps." error="Required">
        <TextField />
      </FormField>,
    )
    expect(screen.getByText('(optional)')).toBeInTheDocument()
    expect(screen.getByText('Helps.')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('supports decorated label content', () => {
    render(
      <FormField label={<>Title<span data-testid="req">*</span></>}>
        <input />
      </FormField>,
    )
    expect(screen.getByTestId('req')).toBeInTheDocument()
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument()
  })
})
