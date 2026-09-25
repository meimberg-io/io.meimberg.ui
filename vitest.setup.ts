import '@testing-library/jest-dom/vitest'

// jsdom-Polyfills für Browser-APIs, auf die Radix-UI-Primitives (Tooltip,
// Popover) und der TipTap/ProseMirror-Editor angewiesen sind.
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
    Element.prototype.setPointerCapture = () => {}
    Element.prototype.releasePointerCapture = () => {}
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }
  // ProseMirror misst beim Scrollen zur Selektion über Range-Rects; jsdom
  // implementiert die Layout-APIs auf Range nicht.
  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () => ({length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator]}) as unknown as DOMRectList
    Range.prototype.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0)
  }
}
