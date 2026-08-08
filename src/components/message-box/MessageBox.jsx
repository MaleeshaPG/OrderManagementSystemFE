import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'

export default function MessagePop({
  type = 'success',
  message = '',
  onClose = () => {},
  duration = 3000,
  onComplete = () => {},
}) {
  const { theme } = useTheme()
  const [animate, setAnimate] = useState(false)

  const base = theme?.base || {}
  const modal = theme?.modal || {}
  const text = theme?.text || {}

  const colorMap = {
    success: base.success || '#198754',
    error: base.danger || '#DC3545',
    warning: base.warning || '#FFC107',
    info: base.info || '#0DCAF0',
  }

  const titleMap = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  }

  const color = colorMap[type] || colorMap.info

  useEffect(() => {
    const animateTimer = setTimeout(() => setAnimate(true), 10)
    const closeTimer = setTimeout(() => {
      onClose()
      onComplete()
    }, duration)

    return () => {
      clearTimeout(animateTimer)
      clearTimeout(closeTimer)
    }
  }, [duration, onClose, onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: modal.overlay || 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          overflow: 'hidden',
          textAlign: 'center',
          background: modal.background || base.background || '#fff',
          borderRadius: 12,
          border: `1px solid ${modal.border || 'transparent'}`,
          boxShadow: modal.boxShadow || '0 8px 28px rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: text.muted || '#999',
            display: 'inline-flex',
            padding: 2,
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '24px 24px 20px',
          }}
        >
          {type === 'success' && <CheckCircle size={40} color={color} />}
          {type === 'error' && <XCircle size={40} color={color} />}
          {type === 'warning' && <AlertTriangle size={40} color={color} />}
          {type === 'info' && <Info size={40} color={color} />}

          <h3 style={{ fontSize: 18, fontWeight: 600, color, margin: 0 }}>{titleMap[type]}</h3>
          <p style={{ fontSize: 14, color: text.muted || '#666', margin: 0 }}>{message}</p>
        </div>

        <div style={{ width: '100%', height: 4, background: `${color}20` }}>
          <div
            style={{
              height: 4,
              background: color,
              width: animate ? '100%' : '0%',
              transition: `width ${duration}ms linear`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
