import React from 'react'
import IconComp from '../icon/IconComp'
import { useTheme } from '../../providers/ThemeProvider'

const sizeMap = {
  sm: { padding: '6px 10px', fontSize: 13, height: 32 },
  md: { padding: '8px 12px', fontSize: 14, height: 40 },
  lg: { padding: '10px 16px', fontSize: 16, height: 48 },
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  icon,
  leftIcon,
  rightIcon,
  iconOnly = false,
  noAnimation = false,
  style,
  className,
  ariaLabel,
  loading = false,
  ...rest
}) => {
  const { theme } = useTheme()

  const bg = (theme && theme.button && theme.button[variant]) || theme?.base?.primary || '#0D6EFD'
  const fg = (theme && theme.button && theme.button[`${variant}_foreground`]) || '#fff'
  const outline = (theme && theme.button && theme.button[`${variant}_outline`]) || 'transparent'

  const sz = sizeMap[size] || sizeMap.md

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: children && (leftIcon || rightIcon || icon) ? 8 : 0,
    padding: sz.padding,
    fontSize: sz.fontSize,
    height: sz.height,
    borderRadius: 8,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    boxSizing: 'border-box',
    transition: 'background 120ms, box-shadow 120ms, opacity 120ms',
  }

  const transitionStyle = noAnimation ? { transition: 'none' } : {}

  let variantStyle = {}
  if (variant === 'ghost' || variant === 'outline') {
    variantStyle = {
      background: 'transparent',
      color: fg || theme?.base?.foreground,
      border: `1px solid ${outline}`,
    }
  } else {
    variantStyle = {
      background: bg,
      color: fg,
    }
  }

  const iconOnlyStyle = iconOnly
    ? {
        width: sz.height,
        minWidth: sz.height,
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {}

  return (
    <button
      type={type}
      onClick={!loading
        ? (e) => {
            try {
              window.dispatchEvent(new CustomEvent('app.button.click', { detail: { ariaLabel, type, icon, children } }))
            } catch {}
            if (onClick) onClick(e)
          }
        : undefined}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={className}
      style={{ ...baseStyle, ...variantStyle, ...iconOnlyStyle, ...transitionStyle, ...style }}
      {...rest}
    >
      {leftIcon ? (
        typeof leftIcon === 'string' ? (
          <IconComp name={leftIcon} size={16} animateMode={noAnimation ? 'none' : undefined} />
        ) : (
          leftIcon
        )
      ) : null}

      {icon && iconOnly ? (
        typeof icon === 'string' ? (
          <IconComp name={icon} size={16} animateMode={noAnimation ? 'none' : undefined} />
        ) : (
          icon
        )
      ) : null}

      {!iconOnly && icon ? (
        typeof icon === 'string' ? (
          <IconComp name={icon} size={16} animateMode={noAnimation ? 'none' : undefined} />
        ) : (
          icon
        )
      ) : null}

      {!iconOnly ? children : null}

      {rightIcon && !loading ? (
        typeof rightIcon === 'string' ? (
          <IconComp name={rightIcon} size={16} animateMode={noAnimation ? 'none' : undefined} />
        ) : (
          rightIcon
        )
      ) : null}

      {loading && (
        <div style={{ marginLeft: children ? 8 : 0, display: 'flex', alignItems: 'center' }}>
          <IconComp name="Loader" size={16} animate="spin" animateMode="infinite" />
        </div>
      )}
    </button>
  )
}

export default Button
