// Gemeinsames Vitest-Setup für @meimberg/ui und Consumer-Apps:
// jest-dom-Matcher plus jsdom-Polyfills für Browser-APIs, auf die next-themes,
// Radix-UI-Primitives (Tooltip, Popover, Select) und der TipTap/ProseMirror-
// Editor angewiesen sind.
//
// Idempotent: polyfillt nur, was die Umgebung nicht selbst mitbringt — ein
// zweiter Import oder eine neuere jsdom-Version überschreibt nichts.
//
// Verwendung (vitest.config.ts der App):
//   test: {environment: 'jsdom', setupFiles: ['./vitest.setup.ts']}
//   // vitest.setup.ts
//   import '@meimberg/ui/testing/setup'

import '@testing-library/jest-dom/vitest'

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {}
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {}
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }
  // ProseMirror misst beim Scrollen zur Selektion über Range-Rects; jsdom
  // implementiert die Layout-APIs auf Range nicht.
  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () =>
      ({length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator]}) as unknown as DOMRectList
  }
  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0)
  }
}
