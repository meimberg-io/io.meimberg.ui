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
        Short content — no scrolling needed, the container grows with its content
        up to the max height.
      </p>
    </ScrollableContent>
  ),
}

export const Overflowing: Story = {
  name: 'Overflowing (scrolls at max-h-96)',
  render: () => (
    <ScrollableContent>
      <div className="space-y-3 body text-foreground">
        {Array.from({length: 24}, (_, i) => (
          <p key={i}>
            Paragraph {i + 1} — long content that exceeds the max height and
            triggers vertical scrolling.
          </p>
        ))}
      </div>
    </ScrollableContent>
  ),
}
