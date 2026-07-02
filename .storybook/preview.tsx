// DS-Storybook Preview. Lädt das DS-Stylesheet (Tailwind + Tokens) und den
// Theme-Class-Switch (light/dark analog Pulse). KEINE Pulse-Provider — das
// DS-Storybook zeigt generische Primitives ohne Domain-Kontext.
import type {Preview} from '@storybook/react-vite'
import {withThemeByClassName} from '@storybook/addon-themes'

import '../src/styles.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {disable: true},
    a11y: {
      element: '#storybook-root',
      manual: false,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {light: 'light', dark: 'dark'},
      defaultTheme: 'light',
    }),
  ],
}

export default preview
