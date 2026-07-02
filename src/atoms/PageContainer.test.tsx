import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {PageContainer} from './PageContainer'

describe('<PageContainer>', () => {
  it('rendert Default-Geometrie und responsive Padding', () => {
    const {container} = render(
      <PageContainer>
        <div data-testid="child" />
      </PageContainer>,
    )
    const wrapper = container.firstElementChild!
    expect(wrapper.className).toContain('max-w-[1440px]')
    expect(wrapper.className).toContain('mx-auto')
    expect(wrapper.className).toContain('w-full')
    expect(wrapper.className).toContain('animate-fade-in')
    expect(wrapper.className).toContain('px-4')
    expect(wrapper.className).toContain('md:px-8')
    expect(wrapper.className).toContain('py-6')
    expect(wrapper.className).toContain('md:py-7')
  })

  it('lässt Padding weg bei padded={false}', () => {
    const {container} = render(
      <PageContainer padded={false}>
        <div />
      </PageContainer>,
    )
    const wrapper = container.firstElementChild!
    expect(wrapper.className).toContain('max-w-[1440px]')
    expect(wrapper.className).not.toContain('px-4')
    expect(wrapper.className).not.toContain('md:px-8')
    expect(wrapper.className).not.toContain('py-6')
    expect(wrapper.className).not.toContain('md:py-7')
  })

  it('merged eingehende className', () => {
    const {container} = render(
      <PageContainer className="custom-class">
        <div />
      </PageContainer>,
    )
    expect(container.firstElementChild!.className).toContain('custom-class')
  })
})
