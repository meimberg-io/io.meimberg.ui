import {afterEach, describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Avatar} from './Avatar'

// jsdom lädt keine Bilder — Radix' Avatar fragt `new window.Image()` nach
// `complete`/`naturalWidth`. Der Stub simuliert „geladen" bzw. „kaputt".
function stubImage(loaded: boolean) {
  class FakeImage {
    complete = true
    naturalWidth = loaded ? 1 : 0
    src = ''
    crossOrigin: string | null = null
    referrerPolicy = ''
    addEventListener() {}
    removeEventListener() {}
  }
  vi.stubGlobal('Image', FakeImage)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Avatar', () => {
  it('renders initials when no src is given', () => {
    render(<Avatar initials="MB" label="Meimberg" />)
    expect(screen.getByText('MB')).toBeInTheDocument()
    expect(screen.getByRole('img', {name: 'Meimberg'})).toHaveAttribute('title', 'Meimberg')
  })

  it('shows the image once it has loaded', () => {
    stubImage(true)
    const {container} = render(<Avatar src="https://example.com/x.png" initials="OR" label="Org" />)
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/x.png')
    expect(screen.queryByText('OR')).not.toBeInTheDocument()
  })

  it('falls back to initials when the image fails to load', () => {
    stubImage(false)
    const {container} = render(<Avatar src="https://example.com/broken.png" initials="OR" label="Org" />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('OR')).toBeInTheDocument()
  })

  it('derives a stable hash color from colorSeed with tone=auto', () => {
    const {rerender} = render(<Avatar initials="A" colorSeed="same" />)
    const first = screen.getByText('A').style.backgroundColor
    rerender(<Avatar initials="B" colorSeed="same" />)
    const second = screen.getByText('B').style.backgroundColor
    expect(first).not.toBe('')
    expect(first).toBe(second)
  })

  it('uses token colors instead of the hash color for tone=primary and tone=neutral', () => {
    const {rerender} = render(<Avatar initials="P" tone="primary" />)
    expect(screen.getByText('P')).toHaveClass('bg-primary/15', 'text-primary')
    expect(screen.getByText('P').style.backgroundColor).toBe('')
    rerender(<Avatar initials="N" tone="neutral" />)
    expect(screen.getByText('N')).toHaveClass('bg-muted', 'text-muted-foreground')
  })

  it('supports shape=circle and the size scale incl. 2xl', () => {
    render(<Avatar initials="C" label="Circle" shape="circle" size="2xl" />)
    const root = screen.getByRole('img', {name: 'Circle'})
    expect(root).toHaveClass('rounded-full', 'size-20')
    expect(root).not.toHaveClass('rounded-md')
  })

  it('defaults to rounded md', () => {
    render(<Avatar initials="D" label="Default" />)
    expect(screen.getByRole('img', {name: 'Default'})).toHaveClass('rounded-md', 'size-8')
  })

  it('omits the tooltip with showTitle=false and merges className', () => {
    render(<Avatar initials="T" label="No title" showTitle={false} className="ring-2" />)
    const root = screen.getByRole('img', {name: 'No title'})
    expect(root).not.toHaveAttribute('title')
    expect(root).toHaveClass('ring-2')
  })
})
