import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {RichSelect, type RichSelectItem} from './RichSelect'

const items: RichSelectItem[] = [
  {id: 'a', label: 'Alpha', sub: 'First letter'},
  {id: 'b', label: 'Bravo'},
  {id: 'c', label: 'Charlie'},
]

describe('RichSelect', () => {
  it('renders the placeholder when nothing is selected', () => {
    render(
      <RichSelect items={items} selected={null} onSelect={() => {}} placeholder="Wählen…" />,
    )
    expect(screen.getByText('Wählen…')).toBeInTheDocument()
  })

  it('renders the selected label in the trigger', () => {
    render(<RichSelect items={items} selected={items[0]} onSelect={() => {}} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('opens the menu on click and shows items with sub-text', async () => {
    const user = userEvent.setup()
    render(<RichSelect items={items} selected={null} onSelect={() => {}} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('First letter')).toBeInTheDocument()
  })

  it('fires onSelect with the picked item and closes', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<RichSelect items={items} selected={null} onSelect={onSelect} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('Bravo'))
    expect(onSelect).toHaveBeenCalledWith(items[1])
    // After select the menu is removed from the DOM.
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not open when disabled', async () => {
    const user = userEvent.setup()
    render(<RichSelect items={items} selected={null} onSelect={() => {}} disabled />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  describe('searchable mode (PUL-397)', () => {
    it('renders a searchbox at the top of the popover when searchable', async () => {
      const user = userEvent.setup()
      render(<RichSelect items={items} selected={null} onSelect={() => {}} searchable />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    it('filters items by substring on label and sub', async () => {
      const user = userEvent.setup()
      render(<RichSelect items={items} selected={null} onSelect={() => {}} searchable />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByRole('searchbox'), 'first')
      // "Alpha" matches via sub="First letter"; Bravo and Charlie don't.
      expect(screen.getByText('Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Bravo')).not.toBeInTheDocument()
      expect(screen.queryByText('Charlie')).not.toBeInTheDocument()
    })

    it('shows "Nichts gefunden" when no items match', async () => {
      const user = userEvent.setup()
      render(<RichSelect items={items} selected={null} onSelect={() => {}} searchable />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByRole('searchbox'), 'zzz')
      expect(screen.getByText('Nichts gefunden')).toBeInTheDocument()
    })

    it('resets the query when the popover closes', async () => {
      const user = userEvent.setup()
      render(<RichSelect items={items} selected={null} onSelect={() => {}} searchable />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByRole('searchbox'), 'alp')
      // Close via Escape; reopen and the searchbox should be empty again.
      await user.keyboard('{Escape}')
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('searchbox')).toHaveValue('')
    })

    it('respects a custom filterItem', async () => {
      const user = userEvent.setup()
      // Custom-Filter matched nur, wenn `id === query`.
      render(
        <RichSelect
          items={items}
          selected={null}
          onSelect={() => {}}
          searchable
          filterItem={(item, q) => item.id === q}
        />,
      )
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByRole('searchbox'), 'b')
      expect(screen.getByText('Bravo')).toBeInTheDocument()
      expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    })
  })
})
