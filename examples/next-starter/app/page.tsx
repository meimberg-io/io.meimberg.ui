'use client'

import { Button, EmptyState, FormField, FormSection, PageContainer, PageHeader, TextField, toast } from '@meimberg/ui'
import { useState } from 'react'

export default function HomePage() {
  const [name, setName] = useState('')

  return (
    <PageContainer>
      <PageHeader title="Home" description="Ein paar Komponenten aus @meimberg/ui." />
      <FormSection title="Formular">
        <FormField label="Name">
          <TextField value={name} onChange={e => setName(e.target.value)} placeholder="Ada" />
        </FormField>
        <Button size="lg" onClick={() => toast.success(`Hallo ${name || 'Welt'}`)}>Toast zeigen</Button>
      </FormSection>
      <EmptyState title="Noch nichts da" description="So sieht ein Leerzustand aus." />
    </PageContainer>
  )
}
