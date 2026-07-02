// DS-Storybook (@meimberg/ui) — bewusst schlank: nur generische Primitives +
// Foundations, keine Domain. Daher KEINE @/-Aliase, keine next-/server-only-
// Stubs, kein process.env-Polyfill (anders als das App-Storybook). Tailwind v4
// läuft über die postcss.config.mjs im Package-Root.
import type {StorybookConfig} from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen',
  },
}

export default config
