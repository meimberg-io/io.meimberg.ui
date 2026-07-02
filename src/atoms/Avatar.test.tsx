import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Avatar} from './Avatar'

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar initials='MB' label='meimberg' />)
    expect(screen.getByText('MB')).toBeInTheDocument()
  })

  it('renders an image when src is set', () => {
    render(<Avatar src='https://example.com/x.png' label='Org' />)
    const img = screen.getByRole('img', {name: 'Org'})
    expect(img).toHaveAttribute('src', 'https://example.com/x.png')
  })

  it('derives a stable background color from colorSeed', () => {
    const {container, rerender} = render(<Avatar initials='A' colorSeed='same' />)
    const first = (container.firstChild as HTMLElement).style.backgroundColor
    rerender(<Avatar initials='B' colorSeed='same' />)
    const second = (container.firstChild as HTMLElement).style.backgroundColor
    expect(first).toBe(second)
    expect(first).not.toBe('')
  })
})
