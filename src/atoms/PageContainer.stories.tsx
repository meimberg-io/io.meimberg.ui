import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageContainer} from './PageContainer'

const meta: Meta<typeof PageContainer> = {
  title: 'Atoms/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PageContainer>

function DemoBody() {
  return (
    <div className="rounded-md border border-dashed border-border bg-card/40 p-4">
      <div className="heading-3 text-foreground mb-1">Demo-Page</div>
      <p className="body-sm text-muted-foreground">
        Diese gestrichelte Card markiert den Inhaltsbereich. Außen sieht man,
        wie viel Padding der <code>PageContainer</code> mitbringt — am
        Smartphone weniger als am Desktop.
      </p>
    </div>
  )
}

export const Padded: Story = {
  args: {
    children: <DemoBody />,
  },
}

export const Unpadded: Story = {
  args: {
    padded: false,
    children: (
      <div className="px-8 py-7">
        <DemoBody />
      </div>
    ),
  },
}
