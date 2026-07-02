import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardActions } from './card-actions'

describe('CardActions', () => {
  it('click on card body invokes the card onClick', async () => {
    const onCardClick = vi.fn()
    const onActionClick = vi.fn()
    render(
      <div data-testid='card' onClick={onCardClick}>
        Card body
        <CardActions>
          <button onClick={onActionClick}>Action</button>
        </CardActions>
      </div>,
    )
    await userEvent.click(screen.getByTestId('card'))
    expect(onCardClick).toHaveBeenCalledOnce()
    expect(onActionClick).not.toHaveBeenCalled()
  })

  it('click on action button does NOT bubble to card, action handler fires', async () => {
    const onCardClick = vi.fn()
    const onActionClick = vi.fn()
    render(
      <div onClick={onCardClick}>
        Card body
        <CardActions>
          <button onClick={onActionClick}>Action</button>
        </CardActions>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Action' }))
    expect(onActionClick).toHaveBeenCalledOnce()
    expect(onCardClick).not.toHaveBeenCalled()
  })

  it('permanent prop removes opacity-0 hover-gating', () => {
    const { rerender, container } = render(
      <CardActions>
        <button onClick={() => {}}>A</button>
      </CardActions>,
    )
    expect(container.firstChild).toHaveClass('md:opacity-0')

    rerender(
      <CardActions permanent>
        <button onClick={() => {}}>A</button>
      </CardActions>,
    )
    expect(container.firstChild).not.toHaveClass('md:opacity-0')
    expect(container.firstChild).toHaveClass('opacity-100')
  })
})
