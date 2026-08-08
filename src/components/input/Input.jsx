import React, { useState, useId } from 'react'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import IconComp from '../icon/IconComp'

const IconButton = ({ children, onClick, ariaLabel, style, title }) => {
  const [trigger, setTrigger] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = (e) => {
    if (onClick) onClick(e)
    setTrigger((t) => t + 1)
  }

  let child = children
  if (React.isValidElement(children)) {
    if (typeof children.type === 'string') {
      const inner = children.props && children.props.children
      if (React.isValidElement(inner) && typeof inner.type !== 'string') {
        const newInner = React.cloneElement(inner, { animateTrigger: trigger })
        child = React.cloneElement(children, { children: newInner })
      } else {
        try {
          child = React.cloneElement(children, { 'data-animate-trigger': String(trigger) })
        } catch {
          child = children
        }
      }
    } else {
      child = React.cloneElement(children, { animateTrigger: trigger })
    }
  }

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    ...style,
  }

  const tooltipStyle = {
    position: 'absolute',
    top: -36,
    right: '50%',
    transform: 'translateX(50%)',
    background: 'rgba(0,0,0,0.85)',
    color: '#fff',
    padding: '4px 6px',
    borderRadius: 6,
    fontSize: 12,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 9999,
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      aria-label={ariaLabel}
      style={btnStyle}
    >
      {child}
      {title && showTooltip ? (
        <div role="tooltip" style={tooltipStyle}>
          {title}
        </div>
      ) : null}
    </button>
  )
}

const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  style,
  inputStyle: customInputStyle,
  label,
  labelStyle,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  leftAriaLabel,
  rightAriaLabel,
  leftVariant,
  rightVariant,
  leftAnimate = 'spin-hover',
  rightAnimate = 'spin-hover',
  leftAnimateMode, //'infinite'|'once'|'hover'
  rightAnimateMode,
  error,
  reserveLabel = false,
  hideError = false,
  reserveErrorSpace = false,
  ...rest
}) => {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)
  const uid = useId()
  const errorId = `${uid}-error`

  const labelId = `${uid}-label`

  const focusColor = theme?.input?.focus_ring || theme?.button?.primary_outline || theme?.base?.primary || '#0D6EFD'

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'stretch',
    gap: 8,
    background: theme?.input?.background || '#fff',
    border: `1px solid ${
      error ? theme?.input?.error_border || '#dc3545' : focused ? focusColor : theme?.input?.border || '#ccc'
    }`,
    padding: '6px 8px',
    borderRadius: 8,
    boxSizing: 'border-box',
    boxShadow: focused ? `0 0 0 4px ${focusColor}33` : 'none',
    transition: 'box-shadow 150ms, border-color 150ms',
    width: '100%',
    minHeight: 32,
  }

  const inputStyle = {
    background: 'transparent',
    color: theme?.input?.foreground || '#000',
    border: 'none',
    padding: '2px 6px',
    height: '100%',
    borderRadius: 6,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '1rem',
  }

  const staticAreaStyle = {
    background: theme?.input?.static_area || 'transparent',
    color: theme?.input?.foreground || '#000',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    padding: 2,
    minWidth: 28,
    height: '100%',
    boxSizing: 'border-box',
  }

  const outerStyle = { display: 'flex', flexDirection: 'column', width: '100%', padding: 2, alignSelf: 'end', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }
  const shouldShowLabel = Boolean(label) || reserveLabel
  const shouldShowErrorArea = !hideError && (Boolean(error) || reserveErrorSpace)

  return (
    <div style={{ ...outerStyle, ...style }}>
      {shouldShowLabel ? (
        <div style={{ minHeight: 16, marginBottom: 4 }}>
          <label
            id={labelId}
            htmlFor={uid}
            aria-hidden={label ? undefined : true}
            style={{
              display: 'block',
              fontSize: '0.875rem',
              lineHeight: '1rem',
              color: theme?.input?.label || theme?.base?.foreground || '#333',
              ...labelStyle,
            }}
          >
            {label || '\u00A0'}
          </label>
        </div>
      ) : null}
      <div style={wrapperStyle}>
        {leftIcon ? (
          <IconButton onClick={onLeftClick} ariaLabel={leftAriaLabel} style={staticAreaStyle}>
            {typeof leftIcon === 'string'
              ? (() => {
                  const parts = String(leftAnimate).split('-')
                  const type = parts[0] || 'spin'
                  const mode = leftAnimateMode || parts[1] || 'hover'
                  return <IconComp name={leftIcon} size={18} variant={leftVariant} animate={type} animateMode={mode} />
                })()
              : leftIcon}
          </IconButton>
        ) : null}

        {type === 'textarea' ? (
          <textarea
            id={uid}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rest.rows || 3}
            style={{ ...inputStyle, padding: '6px 6px', minHeight: 60, height: 'auto' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...rest}
          />
        ) : (
          <input
            id={uid}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            style={inputStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...rest}
          />
        )}
        {error ? (
          <IconButton
            onClick={onRightClick}
            ariaLabel={rightAriaLabel || 'Error'}
            style={staticAreaStyle}
            title={typeof error === 'string' ? error : 'Error'}
          >
            <IconComp
              name={typeof theme?.icon?.error_name === 'string' ? theme.icon.error_name : 'AlertTriangle'}
              size={18}
              variant={theme?.input?.error_foreground || theme?.input?.error_icon || 'error'}
            />
          </IconButton>
        ) : rightIcon ? (
          <IconButton onClick={onRightClick} ariaLabel={rightAriaLabel} style={staticAreaStyle}>
            {typeof rightIcon === 'string'
              ? (() => {
                  const parts = String(rightAnimate).split('-')
                  const type = parts[0] || 'spin'
                  const mode = rightAnimateMode || parts[1] || 'hover'
                  return (
                    <IconComp name={rightIcon} size={18} variant={rightVariant} animate={type} animateMode={mode} />
                  )
                })()
              : rightIcon}
          </IconButton>
        ) : null}
      </div>

      {shouldShowErrorArea ? (
        <div
          id={errorId}
          aria-hidden={error ? undefined : true}
          style={{
            minHeight: 18,
            color: theme?.input?.error_foreground || '#dc3545',
            fontSize: '0.75rem',
            marginTop: 2,
            marginLeft: 5,
          }}
        >
          {error ? (typeof error === 'string' ? error : 'Error') : '\u00A0'}
        </div>
      ) : null}
    </div>
  )
}

export default Input
