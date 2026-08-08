import React from 'react'

const toPascal = (s = '') =>
  s
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('')

export const getLucideIcon = (iconName) => {
  const normalized = toPascal(String(iconName || ''))
  return React.lazy(() =>
    import('lucide-react').then((module) => {
      const candidates = [normalized, String(iconName), String(iconName).toLowerCase(), String(iconName).toUpperCase()]
      let Icon = null
      for (const c of candidates) {
        if (module[c]) {
          Icon = module[c]
          break
        }
      }

      if (!Icon) {
        Icon = module['Square'] || module['HelpCircle'] || Object.values(module).find(Boolean)
        console.warn(`Icon ${iconName} not found in lucide-react — using fallback`)
      }

      return { default: Icon }
    }),
  )
}
