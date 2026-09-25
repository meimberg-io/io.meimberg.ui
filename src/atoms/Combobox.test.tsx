import {describe, expect, it, vi} from 'vitest'
import {screen, within} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {deMessages} from '../i18n/de'
import {Dialog, DialogContent, DialogTitle} from '../ui/dialog'
import {FormDialog} from '../organisms/FormDialog'
import {Combobox, type ComboboxItem} from './Combobox'

const items: ComboboxItem[] = [
  {id: 'a', label: 'Alpha', sub: 'First letter'},
  {id: 'b', label: 'Bravo', disabled: true},
  {id: 'c', label: 'Charlie'},
  {id: 'd', label: 'Delta'},
]

function activeOption(owner: HTMLElement): HTMLElement | null {
  const id = owner.getAttribute('aria-activedescendant')
  return id ? document.getElementById(id) : null
}

describe('Combobox', () => {
  it('renders the trigger as a combobox with listbox popup and the default placeholder', () => {
    renderWithProviders(<Combobox items={items} value={null} onChange={() => {}} data-testid="picker" />)
    const trigger = screen.getByTestId('picker')
    expect(trigger).toHaveAttribute('role', 'combobox')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveClass('field-shell')
    expect(trigger).toHaveTextContent('Select…')
  })

  it('renders the selected item via renderSelected', () => {
    renderWithProviders(
      <Combobox items={items} value="c" onChange={() => {}} renderSelected={item => <b>Picked {item.label}</b>} />,
    )
    expect(screen.getByRole('combobox')).toHaveTextContent('Picked Charlie')
  })

  it('opens with the listbox focused and navigates with arrows, Home/End, skipping disabled items', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<Combobox items={items} value={null} onChange={onChange} />)
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    const listbox = screen.getByRole('listbox')
    expect(listbox).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', listbox.id)
    expect(activeOption(listbox)).toHaveTextContent('Alpha')

    await user.keyboard('{ArrowDown}')
    expect(activeOption(listbox)).toHaveTextContent('Charlie')
    await user.keyboard('{ArrowUp}')
    expect(activeOption(listbox)).toHaveTextContent('Alpha')
    await user.keyboard('{ArrowUp}')
    expect(activeOption(listbox)).toHaveTextContent('Alpha')
    await user.keyboard('{End}')
    expect(activeOption(listbox)).toHaveTextContent('Delta')
    await user.keyboard('{ArrowDown}')
    expect(activeOption(listbox)).toHaveTextContent('Delta')
    await user.keyboard('{Home}')
    expect(activeOption(listbox)).toHaveTextContent('Alpha')

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('c', items[2])
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('starts on the selected item and opens from the trigger with ArrowDown', async () => {
    const {user} = renderWithProviders(<Combobox items={items} value="d" onChange={() => {}} />)
    screen.getByRole('combobox').focus()
    await user.keyboard('{ArrowDown}')
    const listbox = screen.getByRole('listbox')
    expect(activeOption(listbox)).toHaveTextContent('Delta')
    expect(screen.getByRole('option', {name: 'Delta'})).toHaveAttribute('aria-selected', 'true')
  })

  it('closes on Escape and Tab and returns focus to the trigger', async () => {
    const {user} = renderWithProviders(<Combobox items={items} value={null} onChange={() => {}} />)
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.keyboard('{Tab}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('ignores clicks on disabled items and selects enabled ones', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<Combobox items={items} value={null} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', {name: 'Bravo'}))
    expect(onChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('option', {name: /Alpha/}))
    expect(onChange).toHaveBeenCalledWith('a', items[0])
  })

  it('focuses the search input when searchable, filters and resets the query on close', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<Combobox items={items} value={null} onChange={onChange} searchable />)
    await user.click(screen.getByRole('combobox'))
    const input = screen.getByPlaceholderText('Search…')
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id)

    await user.type(input, 'del')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(activeOption(input)).toHaveTextContent('Delta')

    await user.clear(input)
    await user.type(input, 'zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-activedescendant')

    await user.keyboard('{Escape}')
    await user.click(screen.getAllByRole('combobox')[0])
    expect(screen.getByPlaceholderText('Search…')).toHaveValue('')
    expect(screen.getAllByRole('option')).toHaveLength(items.length)
  })

  it('uses a custom filterItem', async () => {
    const {user} = renderWithProviders(
      <Combobox items={items} value={null} onChange={() => {}} searchable filterItem={(item, q) => item.id === q} />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByPlaceholderText('Search…'), 'c')
    expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['Charlie'])
  })

  it('generates unique listbox and option ids per instance', async () => {
    const {user} = renderWithProviders(
      <>
        <Combobox items={items} value={null} onChange={() => {}} data-testid="one" />
        <Combobox items={items} value={null} onChange={() => {}} data-testid="two" />
      </>,
    )
    const one = screen.getByTestId('one').getAttribute('aria-controls')
    const two = screen.getByTestId('two').getAttribute('aria-controls')
    expect(one).toBeTruthy()
    expect(one).not.toEqual(two)

    await user.click(screen.getByTestId('one'))
    const firstOption = screen.getAllByRole('option')[0].id
    await user.keyboard('{Escape}')
    await user.click(screen.getByTestId('two'))
    expect(screen.getAllByRole('option')[0].id).not.toEqual(firstOption)
  })

  it('prefers props over labels and labels over defaults', async () => {
    const {user, rerender} = renderWithProviders(
      <Combobox items={[]} value={null} onChange={() => {}} labels={{placeholder: 'Choose', noOptions: 'Nothing here'}} />,
    )
    expect(screen.getByRole('combobox')).toHaveTextContent('Choose')
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    rerender(<Combobox items={[]} value={null} onChange={() => {}} placeholder="Pick one" labels={{placeholder: 'Choose'}} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one')
  })

  it('renders German labels from the app-wide messages', async () => {
    const {user} = renderWithProviders(<Combobox items={[]} value={null} onChange={() => {}} searchable />, {
      messages: deMessages,
    })
    expect(screen.getByRole('combobox')).toHaveTextContent('Wählen…')
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Suchen…')).toBeInTheDocument()
    expect(screen.getByText('Keine Optionen')).toBeInTheDocument()
  })

  it('works inside a Radix dialog', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(
      <Dialog open>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Edit</DialogTitle>
          <Combobox items={items} value={null} onChange={onChange} searchable />
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByPlaceholderText('Search…')).toHaveFocus()
    await user.click(screen.getByRole('option', {name: /Charlie/}))
    expect(onChange).toHaveBeenCalledWith('c', items[2])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('stacks above FormDialog and keeps the dialog open on select and Escape', async () => {
    const onChange = vi.fn()
    const onOpenChange = vi.fn()
    const {user} = renderWithProviders(
      <FormDialog open onOpenChange={onOpenChange} title="Create item">
        <Combobox items={items} value={null} onChange={onChange} data-testid="in-dialog" />
      </FormDialog>,
    )
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByTestId('in-dialog'))
    const content = document.querySelector('[data-slot="combobox-content"]')
    // Dialog-Overlay und -Content sitzen auf z-50.
    expect(content).toHaveClass('z-60')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()

    await user.click(within(dialog).getByTestId('in-dialog'))
    await user.click(screen.getByRole('option', {name: 'Delta'}))
    expect(onChange).toHaveBeenCalledWith('d', items[3])
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
