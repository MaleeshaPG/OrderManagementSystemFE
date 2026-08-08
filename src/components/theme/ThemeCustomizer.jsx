import React, { useState } from 'react'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import Card from '../card/Card.jsx'
import Tag from '../tag/Tag.jsx'
import Button from '../button/Button'

const flattenColors = (obj, prefix = []) => {
  let out = []
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const val = obj[key]
      const path = [...prefix, key]
      if (typeof val === 'string') {
        out.push({ path, value: val })
      } else if (typeof val === 'object' && val !== null) {
        out = out.concat(flattenColors(val, path))
      }
    })
  }
  return out
}

const setAtPath = (obj, path, value) => {
  if (path.length === 1) {
    obj[path[0]] = value
    return
  }
  const [head, ...rest] = path
  if (!obj[head] || typeof obj[head] !== 'object') obj[head] = {}
  setAtPath(obj[head], rest, value)
}

const ThemeCustomizer = ({ onClose }) => {
  const { themeName, theme, customOverrides, setCustomThemeForCurrent, resetCustomThemeForCurrent } = useTheme()

  const [override, setOverride] = useState(() => customOverrides[themeName] || {})

  const entries = flattenColors(theme)

  const handleChange = (path, newValue) => {
    const newOverride = { ...override }
    setAtPath(newOverride, path, newValue)
    setOverride(newOverride)
    setCustomThemeForCurrent(newOverride)
  }

  const handleReset = () => {
    resetCustomThemeForCurrent()
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Customize palette ({themeName})</h2>
      <Button onClick={handleReset} variant="outline" style={{ marginBottom: 12 }}>
        Reset to {themeName} defaults
      </Button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {entries.map(({ path, value }) => {
          const label = path.join('.')
          const isHex = /^#([0-9a-fA-F]{3,8})$/.test(value)
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ width: '140px', fontSize: 12 }}>{label}</label>
              {isHex ? (
                <input type="color" value={value} onChange={(e) => handleChange(path, e.target.value)} />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(path, e.target.value)}
                  style={{ width: '120px' }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Preview</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Tag variant="primary">Tag</Tag>
          <Card>Card preview</Card>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  )
}

export default ThemeCustomizer
