import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {SelectableTile} from './SelectableTile'

describe('SelectableTile', () => {
  it('renders label and fires onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SelectableTile
        label="Notion"
        glyph={<span>N</span>}
        active={false}
        onClick={onClick}
      />,
    )
    await user.click(screen.getByRole('button', {name: /notion/i}))
    expect(onClick).toHaveBeenCalled()
  })

  it('exposes data-on=true when active', () => {
    const {container} = render(
      <SelectableTile label="X" glyph={<span>X</span>} active onClick={() => {}} />,
    )
    expect(container.querySelector('[data-on="true"]')).toBeInTheDocument()
  })

  it('is disabled when disabled=true', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SelectableTile
        label="X"
        glyph={<span>X</span>}
        active={false}
        disabled
        onClick={onClick}
      />,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('merges className, passes data-*/aria-* through and exposes aria-pressed', () => {
    render(
      <SelectableTile
        label="Cloud"
        glyph={<span>C</span>}
        active
        onClick={() => {}}
        className="col-span-2"
        data-testid="tile-cloud"
        aria-describedby="hint"
      />,
    )
    const tile = screen.getByTestId('tile-cloud')
    expect(tile).toHaveClass('col-span-2', 'group')
    expect(tile).toHaveAttribute('aria-describedby', 'hint')
    expect(tile).toHaveAttribute('aria-pressed', 'true')
  })
})
