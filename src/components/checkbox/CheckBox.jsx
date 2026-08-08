import React, { useState } from 'react'
import { useTheme } from '../../providers/ThemeProvider'

const CheckBox = ({
  checked = false,
  onChange,
  label,
  id,
  name,
  variant = 'primary',
  disabled = false,
  style = {},
}) => {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)

  const colors = theme?.checkbox || {}
  const boxBg = colors[`${variant}_box_background`] || colors.primary_box_background || 'transparent'
  const labelColor = colors[`${variant}_lable`] || colors.primary_lable || theme?.base?.foreground || '#000'
  const outline = colors[`${variant}_outline`] || colors.primary_outline || theme?.input?.border || 'rgba(0,0,0,0.12)'
  const focusColor = theme?.input?.focus_ring || theme?.button?.primary_outline || theme?.base?.primary || '#0D6EFD'

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: theme?.base?.foreground,
    opacity: disabled ? 0.6 : 1,
    ...style,
  }

  const boxStyle = {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: `1.5px solid ${checked ? outline : theme?.base?.border || 'rgba(0,0,0,0.12)'}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    transition: 'all .12s ease',
    background: checked ? boxBg : 'transparent',
    boxShadow: focused ? `0 0 0 4px ${focusColor}33` : 'none',
  }

  const iconStyle = {
    width: 12,
    height: 12,
    fill: labelColor,
    display: checked ? 'block' : 'none',
  }

  const labelStyle = {
    fontSize: 14,
    lineHeight: 1,
    color: theme?.base?.foreground,
  }

  const inputStyle = {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    margin: 0,
  }

  return (
    <label style={wrapperStyle} htmlFor={id} aria-disabled={disabled}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />

      <span style={boxStyle} aria-hidden>
        <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden>
          <path d="M20.285 6.708a1 1 0 00-1.414-1.416L9 15.164l-3.87-3.87a1 1 0 10-1.414 1.414l4.578 4.578a1 1 0 001.414 0L20.285 6.708z" />
        </svg>
      </span>

      {label ? <span style={labelStyle}>{label}</span> : null}
    </label>
  )
}

export default CheckBox
