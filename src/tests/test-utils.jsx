import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../providers/ThemeProvider'

export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )
  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
