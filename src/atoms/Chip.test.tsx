import {fireEvent, render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {Chip} from './Chip'
import {Inbox} from './icons'

describe('Chip atom', () => {
  it('renders as a button with children', () => {
    const {getByRole, getByText} = render(<Chip>Heute</Chip>)
    expect(getByRole('button')).toBeTruthy()
    expect(getByText('Heute')).toBeTruthy()
  })

  it('default type is button (not submit)', () => {
    const {getByRole} = render(<Chip>x</Chip>)
    expect(getByRole('button').getAttribute('type')).toBe('button')
  })

  it('carries cursor-pointer in the component itself', () => {
    const {getByRole} = render(<Chip>x</Chip>)
    expect(getByRole('button').className).toContain('cursor-pointer')
  })

  it('sets aria-pressed=false by default', () => {
    const {getByRole} = render(<Chip>x</Chip>)
    expect(getByRole('button').getAttribute('aria-pressed')).toBe('false')
  })

  it('sets aria-pressed=true when active', () => {
    const {getByRole} = render(<Chip active>x</Chip>)
    expect(getByRole('button').getAttribute('aria-pressed')).toBe('true')
  })

  it('active state applies primary-border highlight', () => {
    const {getByRole} = render(<Chip active>x</Chip>)
    expect(getByRole('button').className).toContain('border-primary')
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    const {getByRole} = render(<Chip onClick={onClick}>x</Chip>)
    fireEvent.click(getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders count when given', () => {
    const {getByText} = render(<Chip count={42}>x</Chip>)
    expect(getByText('42')).toBeTruthy()
  })

  it('does not render count slot when undefined', () => {
    const {queryByText} = render(<Chip>x</Chip>)
    expect(queryByText('0')).toBeNull()
  })

  it('renders count=0 explicitly (falsy but valid)', () => {
    const {getByText} = render(<Chip count={0}>x</Chip>)
    expect(getByText('0')).toBeTruthy()
  })

  it('renders leading icon when given', () => {
    const {container} = render(<Chip icon={Inbox}>x</Chip>)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
