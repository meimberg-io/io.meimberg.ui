import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {MetaPill} from './MetaPill'

describe('MetaPill', () => {
  it('renders its content', () => {
    render(<MetaPill>3 Items</MetaPill>)
    expect(screen.getByText('3 Items')).toBeInTheDocument()
  })
})
