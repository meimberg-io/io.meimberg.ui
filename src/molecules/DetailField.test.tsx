import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {DetailField} from './DetailField'

describe('DetailField', () => {
  it('renders label + value slot', () => {
    render(
      <DetailField label="Provider">
        <span>Microsoft 365</span>
      </DetailField>,
    )
    expect(screen.getByText('Provider')).toBeInTheDocument()
    expect(screen.getByText('Microsoft 365')).toBeInTheDocument()
  })

  it('uses items-start by default (multiline-safe)', () => {
    const {container} = render(
      <DetailField label="Error">
        <span>x</span>
      </DetailField>,
    )
    expect(container.firstElementChild?.className).toContain('items-start')
  })

  it('uses items-center when align="center"', () => {
    const {container} = render(
      <DetailField label="Status" align="center">
        <span>ok</span>
      </DetailField>,
    )
    expect(container.firstElementChild?.className).toContain('items-center')
  })
})
