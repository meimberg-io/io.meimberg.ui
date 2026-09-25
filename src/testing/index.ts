// Test-Helper für Apps auf @meimberg/ui. Braucht die optionalen Peers
// vitest, @testing-library/react, @testing-library/jest-dom,
// @testing-library/user-event und jsdom. Das jsdom-Setup liegt separat unter
// `@meimberg/ui/testing/setup` (Vitest `setupFiles`).

export {renderWithUi, type RenderWithUiOptions, type RenderWithUiResult, type UiProvidersConfig} from './render'
