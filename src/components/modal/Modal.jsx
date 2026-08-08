import React, { useEffect, useRef } from 'react'
import useWindowSize from '../../hooks/useWindowSize'
import { useTheme } from '../../providers/ThemeProvider'
import Button from '../button/Button'

const Modal = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '50%',
  closable = true,
  ariaLabel,
}) => {
  const { theme } = useTheme()
  const overlayRef = useRef(null)
  const { width: windowWidth } = useWindowSize()
  
  const _baseBg = theme?.base?.background || '#fff'
  const hexToRgb = (h) => {
    try {
      const hex = h.replace('#', '')
      const bigint = parseInt(
        hex.length === 3
          ? hex
              .split('')
              .map((c) => c + c)
              .join('')
          : hex,
        16,
      )
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return { r, g, b }
    } catch {
      return null
    }
  }
  const rgb = hexToRgb(String(_baseBg))
  const isDarkBg = rgb ? rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 < 128 : false
  const borderFallback = isDarkBg ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.08)'
  const borderColor = theme?.modal?.border || theme?.input?.border || borderFallback

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const calcWidth = () => {
    if (typeof width === 'number') return width
    if (windowWidth <= 440) return '96%'
    if (windowWidth <= 640) return '92%'
    return width
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: theme?.modal?.overlay || theme?.base?.overlay1 || 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: windowWidth <= 440 ? 8 : 24,
    boxSizing: 'border-box',
  }

  const panelStyle = {
    width: calcWidth(),
    maxWidth: '100%',
    background: theme?.modal?.background || theme?.base?.background || '#fff',
    color: theme?.modal?.color || theme?.base?.foreground || '#000',
    borderRadius: 10,
    border: `1px solid ${borderColor}`,
    boxShadow: theme?.modal?.boxShadow || (isDarkBg ? '0 6px 18px rgba(0,0,0,0.6)' : '0 8px 28px rgba(2,6,23,0.08)'),
    overflow: 'hidden',
    boxSizing: 'border-box',
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: windowWidth <= 440 ? '12px 14px' : '18px 20px',
    borderBottom: `1px solid ${borderColor}`,
  }

  const bodyStyle = {
    padding: windowWidth <= 440 ? 14 : 20,
    maxHeight: '80vh',
    overflow: 'auto',
  }

  const footerStyle = {
    padding: '12px 20px',
    borderTop: `1px solid ${borderColor}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && onClose) onClose()
  }

  return (
    <div ref={overlayRef} style={overlayStyle} onMouseDown={handleOverlayClick} role="presentation">
      <div role="dialog" aria-modal="true" aria-label={ariaLabel || title || 'Modal'} style={panelStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
            {subtitle ? (
              <div
                style={{
                  fontSize: 13,
                  marginTop: 6,
                  color: theme?.modal?.subtitle || theme?.input?.place_holder || theme?.base?.foreground || '#666',
                  opacity: 0.85,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
          {closable ? (
            <Button
              onClick={() => onClose && onClose()}
              ariaLabel="Close"
              icon="X"
              iconOnly
              variant="ghost"
              size="sm"
              style={{ padding: 6 }}
            />
          ) : null}
        </div>

        <div style={bodyStyle}>{children}</div>

        {footer ? <div style={footerStyle}>{footer}</div> : null}
      </div>
    </div>
  )
}

export default Modal
