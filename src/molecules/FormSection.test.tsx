import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {FormSection} from './FormSection'

describe('FormSection', () => {
  it('renders title in dlg-section header and the body', () => {
    const {container} = render(
      <FormSection title="Provider">
        <div data-testid="body">hi</div>
      </FormSection>,
    )
    const header = container.querySelector('.dlg-section')
    expect(header?.textContent).toContain('Provider')
    expect(screen.getByTestId('body')).toBeInTheDocument()
  })

  it('renders an optional description next to the title', () => {
    render(
      <FormSection title="X" description="optional">
        <div />
      </FormSection>,
    )
    expect(screen.getByText('optional')).toBeInTheDocument()
  })
})
