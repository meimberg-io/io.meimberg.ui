import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Field} from './field'
import {Input} from './input'
import {Textarea} from './textarea'

describe('Field — label↔input wiring', () => {
  it('connects label and input so getByLabelText finds the input', () => {
    render(
      <Field label="Title">
        <Input defaultValue="hello" />
      </Field>,
    )
    expect(screen.getByLabelText('Title')).toHaveValue('hello')
  })

  it('connects label and textarea', () => {
    render(
      <Field label="Body">
        <Textarea defaultValue="prose" />
      </Field>,
    )
    expect(screen.getByLabelText('Body')).toHaveValue('prose')
  })

  it('focuses the input when the label is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Field label="Title">
        <Input />
      </Field>,
    )
    await user.click(screen.getByText('Title'))
    expect(screen.getByLabelText('Title')).toHaveFocus()
  })

  it('preserves an explicit child id when the consumer sets one', () => {
    render(
      <Field label="Custom" htmlFor="my-input">
        <Input id="my-input" />
      </Field>,
    )
    expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'my-input')
  })

  it('renders a description below the input', () => {
    render(
      <Field label="API Token" description="Paste your token here.">
        <Input />
      </Field>,
    )
    expect(screen.getByText('Paste your token here.')).toBeInTheDocument()
  })

  it('renders an error in place of the description when present', () => {
    render(
      <Field label="Email" description="We never share." error="Invalid format">
        <Input />
      </Field>,
    )
    expect(screen.getByText('Invalid format')).toBeInTheDocument()
    expect(screen.queryByText('We never share.')).not.toBeInTheDocument()
  })

  it('supports decorated label content (asterisk, hint span)', () => {
    render(
      <Field
        label={
          <>
            Title<span data-testid="req">*</span>
          </>
        }
      >
        <Input />
      </Field>,
    )
    expect(screen.getByTestId('req')).toBeInTheDocument()
    // Label still labels the input — useful for getByLabelText with regex.
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument()
  })
})
