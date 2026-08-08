/* eslint-disable no-unused-vars */
import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'

const ProgressBar = ({
  value = 0,
  variant = 'primary',
  height = 12,
  label,
  showPercentage = true,
  striped = false,
  animated = false,
  style = {},
  ariaLabel,
}) => {
  const { theme } = useTheme()
  const v = Math.max(0, Math.min(100, Number(value) || 0))

  const fillColor =
    theme?.progressbar?.[`${variant}_fill`] ||
    theme?.progressbar?.[`${variant}_lable`] ||
    theme?.button?.[variant] ||
    theme?.base?.primary ||
    '#0D6EFD'

  const borderRadius = Math.max(2, Math.floor(height / 2))

  const trackInnerStyle = {
    flex: 1,
    height,
    borderRadius: Math.max(1, borderRadius - 2),
    overflow: 'hidden',
    position: 'relative',
    background: 'transparent',
  }

  const stripeBg = striped
    ? `repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 10px, rgba(0,0,0,0.03) 10px 20px)`
    : undefined

  const fillerStyle = {
    width: `${v}%`,
    height: '100%',
    backgroundColor: fillColor,
    transition: animated ? 'width 400ms ease' : 'width 160ms ease',
    display: 'block',
    ...(striped ? { backgroundImage: stripeBg, backgroundBlendMode: 'overlay' } : {}),
  }

  const textStyle = {
    minWidth: 40,
    fontSize: 12,
    color: theme?.base?.foreground,
  }

  return (
    <div aria-label={ariaLabel}>
      {(label || showPercentage) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          {label ? (
            <div style={{ fontSize: 13, color: theme?.base?.foreground, textAlign: 'left' }}>{label}</div>
          ) : (
            <div />
          )}
          {showPercentage ? <div style={{ ...textStyle, textAlign: 'right' }}>{v}%</div> : null}
        </div>
      )}
      <div style={trackInnerStyle} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
        <div style={fillerStyle} />
      </div>
    </div>
  )
}

export default ProgressBar
