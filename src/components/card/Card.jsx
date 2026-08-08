import React from 'react'
import { useTheme } from '../../providers/ThemeProvider.jsx'

const Card = ({ title, subtitle, children, footer, actions, className = '', style = {}, elevation = 1, ...rest }) => {
  const { theme } = useTheme()
  const cardTokens = theme?.card || {}

  const background = cardTokens.background || '#ffffff'
  const color = cardTokens.foreground || '#000000'
  const borderColor = cardTokens.border || 'transparent'
  const lineColor = cardTokens.line || 'rgba(0,0,0,0.06)'

  const boxShadow = elevation > 0 ? `0 ${elevation * 4}px ${elevation * 8}px rgba(2,6,23,0.06)` : 'none'

  const baseStyle = {
    background,
    color,
    border: `1px solid ${borderColor}`,
    borderRadius: 8,
    padding: 16,
    boxShadow,
    ...style,
  }

  return (
    <div className={`card ${className}`} style={baseStyle} {...rest}>
      {(title || subtitle || actions) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && <div style={{ marginTop: 12, borderTop: `1px solid ${lineColor}`, paddingTop: 8 }}>{footer}</div>}
    </div>
  )
}

export default Card
