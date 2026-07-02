import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

// DS-Package Tests — jsdom + testing-library. Kein @/-Alias, kein server-only-
// Stub (generische Primitives koppeln nicht an App/Domain).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/storybook-static/**'],
  },
})
