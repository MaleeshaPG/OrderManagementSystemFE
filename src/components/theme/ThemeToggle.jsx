import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import Button from '../button/Button'

const ThemeToggle = () => {
  const { themeName, toggleTheme } = useTheme()
  const isDark = themeName === 'dark'

  const pillStyle = {
    width: 56,
    height: 34,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    boxSizing: 'border-box',
    background: isDark ? 'linear-gradient(90deg,#333,#111)' : 'linear-gradient(90deg,#ffd966,#ff8a00)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'background 240ms ease',
  }

  const knobSize = 26
  const track = 56 - 8 - knobSize
  const knobStyle = {
    width: knobSize,
    height: knobSize,
    borderRadius: '50%',
    background: isDark ? '#111' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDark ? '#ffd966' : '#ffb703',
    fontSize: 14,
    transform: `translateX(${isDark ? 0 : track}px)`,
    transition: 'transform 260ms cubic-bezier(.2,.9,.3,1), background 200ms',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  }

  return (
    <Button ariaLabel="Toggle theme" title="Toggle theme" onClick={toggleTheme} variant="ghost" size="sm" style={{ padding: 0 }}>
      <div style={pillStyle}>
        <div style={knobStyle}>{isDark ? '🌙' : '☀️'}</div>
      </div>
    </Button>
  )
}

export default ThemeToggle
