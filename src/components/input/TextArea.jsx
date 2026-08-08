import React, { useState } from 'react'
import { useTheme } from '../../providers/ThemeProvider'

const TextArea = ({ value, onChange, placeholder, style = {}, rows = 4, disabled = false }) => {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)

  const focusColor = theme?.input?.focus_ring || theme?.button?.primary_outline || theme?.base?.primary || '#0D6EFD'

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'stretch',
    gap: 8,
    background: theme?.input?.background || '#fff',
    border: `1px solid ${focused ? focusColor : theme?.input?.border || '#ccc'}`,
    padding: '6px 8px',
    borderRadius: 8,
    boxSizing: 'border-box',
    boxShadow: focused ? `0 0 0 4px ${focusColor}33` : 'none',
    transition: 'box-shadow 150ms, border-color 150ms',
    width: '100%',
  }

  const textareaStyle = {
    background: 'transparent',
    color: theme?.input?.foreground || '#000',
    border: 'none',
    padding: '6px 6px',
    borderRadius: 6,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '1rem',
    resize: 'vertical',
  }

  return (
    <div style={{ ...wrapperStyle, ...style }}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={textareaStyle}
      />
    </div>
  )
}

export default TextArea
