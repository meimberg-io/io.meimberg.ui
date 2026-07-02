// PUL-353 DoD #13 · Demo-Form-Spike.
//
// Stichprobe: ein vollständiger 2-Section-Dialog (Stammdaten + Routing) lässt
// sich in unter 30 Zeilen Pattern-Code bauen — KEINE Layout-Entscheidungen
// im Call-Site. Nur Felder benennen, Primitives komponieren.
//
// Wenn das hier mehr als 30 Pattern-Zeilen braucht, ist das Form-System
// undicht — Pattern erweitern (siehe forms.md „Erweiterungen-Log").

import {describe, expect, it, vi} from 'vitest'
import {useState} from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  FormDialog,
  FormField,
  FormRow,
  FormSection,
  TextField,
} from '../index'

function DemoForm({onSubmit}: {onSubmit: (name: string) => void}) {
  // ── 30-LOC-Form-Body (gezählt: Sections + Fields + Submit-Wiring) ──
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      caption="Demo"
      title="Neuer Eintrag"
      submitLabel="Anlegen"
      submitVariant="success"
      submitDisabled={!name.trim()}
      onSubmit={() => onSubmit(name)}
    >
      <FormSection title="Stammdaten">
        <FormField label="Name" required>
          <TextField value={name} onChange={e => setName(e.target.value)} />
        </FormField>
        <FormField label="Email">
          <TextField value={email} onChange={e => setEmail(e.target.value)} />
        </FormField>
      </FormSection>
      <FormSection title="Rolle">
        <FormRow cols={1}>
          <FormField label="Rolle">
            <TextField value={role} onChange={e => setRole(e.target.value)} />
          </FormField>
        </FormRow>
      </FormSection>
    </FormDialog>
  )
}

describe('Demo-Form-Spike (PUL-353 DoD #13)', () => {
  it('renders all three label-input pairs and they are getByLabelText-addressable', () => {
    render(<DemoForm onSubmit={() => {}} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Rolle')).toBeInTheDocument()
  })

  it('disables Submit when required field is empty, enables when filled', async () => {
    const user = userEvent.setup()
    render(<DemoForm onSubmit={() => {}} />)
    const submit = screen.getByRole('button', {name: /Anlegen/})
    expect(submit).toBeDisabled()
    await user.type(screen.getByLabelText('Name'), 'Foo')
    expect(submit).toBeEnabled()
  })

  it('fires onSubmit with the form value', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<DemoForm onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText('Name'), 'Test')
    await user.click(screen.getByRole('button', {name: /Anlegen/}))
    expect(onSubmit).toHaveBeenCalledWith('Test')
  })

  it('renders standard Cancel button (default label "Abbrechen")', () => {
    render(<DemoForm onSubmit={() => {}} />)
    expect(screen.getByRole('button', {name: 'Abbrechen'})).toBeInTheDocument()
  })

  it('renders the section headers in the dlg-section style', () => {
    render(<DemoForm onSubmit={() => {}} />)
    // FormDialog rendert via Portal → `document.querySelectorAll`, nicht
    // `container`.
    const sections = document.querySelectorAll('.dlg-section')
    expect(sections.length).toBe(2)
    expect(sections[0].textContent).toContain('Stammdaten')
    expect(sections[1].textContent).toContain('Rolle')
  })
})
