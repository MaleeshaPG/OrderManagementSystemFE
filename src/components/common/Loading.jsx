import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'

export default function Loading({ text = 'Loading…' }) {
  const { theme } = useTheme()
  const fg = theme?.text?.primary ?? theme?.base?.foreground ?? '#000'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: fg }}>
      <svg width="18" height="18" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={fg}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <div style={{ fontSize: 14 }}>{text}</div>
    </div>
  )
}
