import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders} from '../test/render'
import {FormField} from '../molecules/FormField'
import {Select} from './Select'

const OPTIONS = [
  {value: 'open', label: 'Open'},
  {value: 'done', label: 'Done', meta: 'D'},
  {value: 'blocked', label: 'Blocked', disabled: true},
] as const

type Status = (typeof OPTIONS)[number]['value']

describe('Select', () => {
  it('renders the field look at lg by default and takes the id from FormField', () => {
    renderWithProviders(
      <FormField label="Status">
        <Select<Status> value={null} onChange={() => {}} options={OPTIONS} placeholder="Pick a status" />
      </FormField>,
    )
    const trigger = screen.getByRole('combobox', {name: 'Status'})
    expect(trigger).toHaveClass('field-shell', 'focus-ring', 'h-10')
    expect(trigger).toHaveTextContent('Pick a status')
  })

  it('maps size onto the control scale for both variants', () => {
    const {rerender} = renderWithProviders(
      <Select<Status> value="open" onChange={() => {}} options={OPTIONS} size="sm" />,
    )
    expect(screen.getByRole('combobox')).toHaveClass('h-8')
    rerender(<Select<Status> variant="pill" value="open" onChange={() => {}} options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toHaveClass('h-6.5')
    rerender(<Select<Status> variant="pill" size="md" value="open" onChange={() => {}} options={OPTIONS} />)
    expect(screen.getByRole('combobox')).toHaveClass('h-9')
  })

  it('hides the pill label below the compactBelow breakpoint', () => {
    const {container} = renderWithProviders(
      <Select<Status> variant="pill" compactBelow="md" value="open" onChange={() => {}} options={OPTIONS} />,
    )
    const label = container.querySelector('[data-slot="select-label"]')
    expect(label).toHaveClass('hidden', 'md:inline-flex')
  })

  it('prefixes the pill aria-label with clearLabel and passes rest props to the trigger', () => {
    renderWithProviders(
      <Select<Status>
        variant="pill"
        value="open"
        onChange={() => {}}
        options={OPTIONS}
        clearLabel="All statuses"
        data-testid="status-filter"
      />,
    )
    const trigger = screen.getByTestId('status-filter')
    expect(trigger).toHaveAttribute('role', 'combobox')
    expect(trigger).toHaveAttribute('aria-label', 'All statuses: Open')
  })

  it('shows the clearLabel without a selection and emits null from the clear row', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(
      <Select<Status> variant="pill" value="open" onChange={onChange} options={OPTIONS} clearLabel="All statuses" />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', {name: 'All statuses'}))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('emits the picked value and renders meta and disabled rows', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<Select<Status> value={null} onChange={onChange} options={OPTIONS} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', {name: /Blocked/})).toHaveAttribute('data-disabled')
    expect(screen.getByText('D')).toBeInTheDocument()
    await user.click(screen.getByRole('option', {name: /Done/}))
    expect(onChange).toHaveBeenCalledWith('done')
  })

  it('selects via keyboard', async () => {
    const onChange = vi.fn()
    const {user} = renderWithProviders(<Select<Status> value="open" onChange={onChange} options={OPTIONS} />)
    screen.getByRole('combobox').focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('done')
  })

  it('composes the compound parts with a border-flush trigger icon sized by the trigger', async () => {
    const onValueChange = vi.fn()
    const {user, container} = renderWithProviders(
      <Select.Root value={null} onValueChange={onValueChange}>
        <Select.Trigger variant="pill" size="sm" leading={<Select.TriggerIcon tone="primary">F</Select.TriggerIcon>}>
          All folders
        </Select.Trigger>
        <Select.Content>
          <Select.GroupLabel>Folders</Select.GroupLabel>
          <Select.ClearItem>All folders</Select.ClearItem>
          <Select.Separator />
          <Select.Item value="docs">Documents</Select.Item>
        </Select.Content>
      </Select.Root>,
    )
    const icon = container.querySelector('[data-slot="select-trigger-icon"]')
    expect(icon).toHaveClass('size-7.5', 'text-primary')
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByText('Folders')).toBeInTheDocument()
    await user.click(screen.getByRole('option', {name: 'Documents'}))
    expect(onValueChange).toHaveBeenCalledWith('docs')
  })

  it('names the icon trigger via its tooltip', () => {
    renderWithProviders(
      <Select.Root value="a" onValueChange={() => {}}>
        <Select.IconTrigger tooltip="Switch workspace">W</Select.IconTrigger>
        <Select.Content>
          <Select.Item value="a">Alpha</Select.Item>
        </Select.Content>
      </Select.Root>,
    )
    expect(screen.getByRole('combobox', {name: 'Switch workspace'})).toBeInTheDocument()
  })
})
