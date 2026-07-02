import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {FormRow} from './FormRow'

describe('FormRow', () => {
  it('renders single-column as flex stack by default', () => {
    const {container} = render(
      <FormRow>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </FormRow>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex')
    expect(wrapper).toHaveClass('flex-col')
    expect(wrapper).toHaveClass('gap-3')
  })

  it('renders numeric cols via form-row-grid + --form-row-cols repeat(N, minmax(0, 1fr))', () => {
    const {container} = render(
      <FormRow cols={2}>
        <div>A</div>
        <div>B</div>
      </FormRow>,
    )
    const wrapper = container.firstChild as HTMLElement
    // PUL-456: mehrspaltig → form-row-grid (1 Spalte < md, Template ab md aus --form-row-cols).
    expect(wrapper).toHaveClass('form-row-grid')
    expect(wrapper.style.getPropertyValue('--form-row-cols')).toBe('repeat(2, minmax(0, 1fr))')
  })

  it('renders string cols as raw --form-row-cols template', () => {
    const {container} = render(
      <FormRow cols="1fr 240px">
        <div>A</div>
        <div>B</div>
      </FormRow>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('form-row-grid')
    expect(wrapper.style.getPropertyValue('--form-row-cols')).toBe('1fr 240px')
  })

  it('applies the configured gap', () => {
    const {container} = render(
      <FormRow cols={2} gap={4}>
        <div>A</div>
        <div>B</div>
      </FormRow>,
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })
})
