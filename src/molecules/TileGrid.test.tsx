import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {TileGrid, type TileDef} from './TileGrid'

type P = 'a' | 'b' | 'c'
const OPTIONS: ReadonlyArray<TileDef<P>> = [
  {id: 'a', label: 'Alpha', glyph: <span>A</span>},
  {id: 'b', label: 'Beta', glyph: <span>B</span>},
  {id: 'c', label: 'Gamma', glyph: <span>C</span>, disabled: true, title: 'In Vorbereitung'},
]

describe('TileGrid', () => {
  it('renders all options as buttons', () => {
    render(<TileGrid<P> value={null} options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('button', {name: /alpha/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /beta/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /gamma/i})).toBeInTheDocument()
  })

  it('marks the active option via data-on', () => {
    render(<TileGrid<P> value="b" options={OPTIONS} onChange={() => {}} />)
    expect(screen.getByRole('button', {name: /alpha/i})).toHaveAttribute('data-on', 'false')
    expect(screen.getByRole('button', {name: /beta/i})).toHaveAttribute('data-on', 'true')
  })

  it('fires onChange with the clicked option id', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TileGrid<P> value={null} options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('button', {name: /alpha/i}))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('does not fire onChange for disabled tiles', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TileGrid<P> value={null} options={OPTIONS} onChange={onChange} />)
    await user.click(screen.getByRole('button', {name: /gamma/i}))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies the configured column count on desktop, 2 cols on mobile', () => {
    const {container} = render(
      <TileGrid<P> value={null} options={OPTIONS} onChange={() => {}} cols={4} />,
    )
    // PUL-456: < md immer 2-spaltig, konfigurierte Spaltenzahl ab md.
    expect(container.firstChild).toHaveClass('grid-cols-2')
    expect(container.firstChild).toHaveClass('md:grid-cols-4')
  })
})
