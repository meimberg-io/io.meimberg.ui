import type {Meta, StoryObj} from '@storybook/react-vite'
import {ScrollableContent} from './ScrollableContent'

const meta: Meta<typeof ScrollableContent> = {
  title: 'Atoms/ScrollableContent',
  component: ScrollableContent,
}

export default meta
type Story = StoryObj<typeof ScrollableContent>

export const Short: Story = {
  render: () => (
    <ScrollableContent>
      <p className="body text-foreground">
        Kurzer Content — kein Scrollen nötig, der Container wächst mit dem Inhalt
        bis zur max-Höhe.
      </p>
    </ScrollableContent>
  ),
}

export const Overflowing: Story = {
  name: 'Overflowing (scrollt bei max-h-96)',
  render: () => (
    <ScrollableContent>
      <div className="space-y-3 body text-foreground">
        {Array.from({length: 24}, (_, i) => (
          <p key={i}>
            Absatz {i + 1} — langer Content, der die max-Höhe überschreitet und
            den vertikalen Scroll auslöst.
          </p>
        ))}
      </div>
    </ScrollableContent>
  ),
}
