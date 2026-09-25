// DS-Storybook Preview. Lädt das DS-Stylesheet (Tailwind + Tokens), den
// Theme-Class-Switch (hell/dunkel plus eine Demo-Marke, die zeigt, dass
// Komponenten einem Marken-Override folgen) und einen Sprach-Umschalter.
import type {Decorator, Preview} from '@storybook/react-vite'
import {withThemeByClassName} from '@storybook/addon-themes'
import {UiI18nProvider} from '../src/i18n/context'
import {de} from '../src/i18n/de'

import './preview.css'

const withLocale: Decorator = (Story, context) =>
  context.globals.locale === 'de' ? (
    <UiI18nProvider {...de}>
      <Story />
    </UiI18nProvider>
  ) : (
    <Story />
  )

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
  globalTypes: {
    locale: {
      description: 'Sprache der Komponenten-Labels',
      toolbar: {
        title: 'Sprache',
        icon: 'globe',
        items: [
          {value: 'en', title: 'English'},
          {value: 'de', title: 'Deutsch'},
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {locale: 'en'},
  decorators: [
    withLocale,
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
        'demo brand': 'theme-demo',
        'demo brand dark': 'theme-demo dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
