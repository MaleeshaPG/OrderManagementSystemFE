import { useTheme } from '../../providers/ThemeProvider.jsx'

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`
  const cleaned = hex.replace('#', '')
  const bigint = parseInt(
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned,
    16,
  )
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexDarken(hex, amount = 0.15) {
  if (!hex) return hex
  const cleaned = hex.replace('#', '')
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned
  const bigint = parseInt(full, 16)
  let r = (bigint >> 16) & 255
  let g = (bigint >> 8) & 255
  let b = bigint & 255
  r = Math.max(0, Math.min(255, Math.round(r * (1 - amount))))
  g = Math.max(0, Math.min(255, Math.round(g * (1 - amount))))
  b = Math.max(0, Math.min(255, Math.round(b * (1 - amount))))
  const toHex = (v) => v.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const Tag = ({ variant = 'primary', outline = false, children, className = '', style = {}, alpha = 0.18, ...rest }) => {
  const { theme } = useTheme()

  const tagTokens = theme?.tag || {}

  const rawBg = tagTokens[variant]
  const background = outline ? 'transparent' : rawBg ? hexToRgba(rawBg, alpha) : 'transparent'

  const borderColor = tagTokens[variant + (outline ? '_outline' : '')] || tagTokens[variant] || 'transparent'

  const explicitForeground = tagTokens[`${variant}`]

  function getContrastColor(hex) {
    if (!hex) return '#000000'
    const cleaned = hex.replace('#', '')
    const full =
      cleaned.length === 3
        ? cleaned
            .split('')
            .map((c) => c + c)
            .join('')
        : cleaned
    const bigint = parseInt(full, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    const [R, G, B] = [r, g, b].map((c) => {
      const s = c / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    })
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    return L > 0.55 ? '#000000' : '#FFFFFF'
  }

  const color =
    explicitForeground || (outline ? tagTokens[variant] || '#000000' : rawBg ? getContrastColor(rawBg) : '#000000')
  const filledBorder = rawBg && !outline ? hexDarken(rawBg, 0.08) : borderColor
  const border = outline ? `1px solid ${borderColor}` : `1px solid ${filledBorder}`

  const baseStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '.75rem',
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: '3px',
    background,
    color,
    border,
    ...style,
  }

  return (
    <span className={`tag ${className}`} style={baseStyle} {...rest}>
      {children}
    </span>
  )
}

export default Tag
