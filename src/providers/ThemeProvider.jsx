import { createContext, useContext, useEffect, useState } from 'react'
import tokens from '../tokens/theme_tokens'

const ThemeContext = createContext()

const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v)
const mergeDeep = (target, source) => {
  if (!isObject(target) || !isObject(source)) {
    return source === undefined ? target : source
  }
  const out = { ...target }
  Object.keys(source).forEach((key) => {
    if (isObject(source[key])) {
      out[key] = mergeDeep(target[key] || {}, source[key])
    } else {
      out[key] = source[key]
    }
  })
  return out
}

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark')

  const [customOverrides, setCustomOverrides] = useState(() => {
    try {
      const stored = localStorage.getItem('customThemeOverrides')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem('customThemeOverrides', JSON.stringify(customOverrides))
  }, [customOverrides])

  const theme = mergeDeep(tokens[themeName] || {}, customOverrides[themeName] || {})

  useEffect(() => {
    const root = window.document.documentElement
    if (themeName === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', themeName)
  }, [themeName])

  useEffect(() => {
    const root = window.document.documentElement
    const t = theme || {}
    const set = (name, value) => {
      if (value !== undefined) root.style.setProperty(name, value)
    }
    set('--app-bg', t?.base?.background)
    set('--app-fg', t?.base?.foreground)
    set('--scrollbar-track', t?.input?.static_area || t?.card?.line || '#f1f3f5')
    set('--scrollbar-thumb', t?.input?.foreground || t?.base?.foreground || '#000')
    set('--scrollbar-thumb-hover', t?.input?.focus_ring || t?.button?.primary || '#666')
    set('--scrollbar-thumb-opacity', '0.12')
    set('--scrollbar-thumb-hover-opacity', '0.20')
    set('--scrollbar-radius', '8px')
    set('--scrollbar-size', '8px')
  }, [theme])

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setCustomThemeForCurrent = (overrideObj) => {
    setCustomOverrides((prev) => ({ ...prev, [themeName]: overrideObj }))
  }

  const resetCustomThemeForCurrent = () => {
    setCustomOverrides((prev) => {
      const n = { ...prev }
      delete n[themeName]
      return n
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme,
        toggleTheme,
        customOverrides,
        setCustomThemeForCurrent,
        resetCustomThemeForCurrent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
