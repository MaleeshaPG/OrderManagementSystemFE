import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'

export default function ErrorMessage({ message, children }) {
  const { theme } = useTheme()
  const fg = theme?.text?.danger ?? theme?.colors?.danger ?? '#842029'
  const tagBg = theme?.tag?.bg ?? theme?.tag?.background ?? theme?.states?.danger ?? '#f8d7da'
  const border = theme?.tag?.line ?? theme?.states?.danger ?? '#f5c2c7'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        background: tagBg,
        color: fg,
        border: `1px solid ${border}`,
      }}
      role="alert"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill={fg} d="M11.001 10h2v5h-2zm0-4h2v2h-2z" />
        <path
          fill={fg}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </svg>

      <div style={{ fontSize: 14, lineHeight: '1.2' }}>
        {children ?? (message ? `Error: ${message}` : 'An error occurred')}
      </div>
    </div>
  )
}
