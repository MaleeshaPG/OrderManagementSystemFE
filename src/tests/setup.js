import '@testing-library/jest-dom'

// Mock window.matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })

  // Mock ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  // Mock requestAnimationFrame
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback) => setTimeout(callback, 0)
    window.cancelAnimationFrame = (id) => clearTimeout(id)
  }
}
