/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../providers/ThemeProvider'
import IconComp from '../icon/IconComp.jsx'
import Button from '../button/Button'

const SideSheet = ({ open, onClose, width = '35vw', title, children }) => {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(open)
  const [slideIn, setSlideIn] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSlideIn(true))
      })
    } else {
      setSlideIn(false)
      const t = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible) return null

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          opacity: slideIn ? 1 : 0,
          transition: 'opacity 300ms ease',
          zIndex: 10000,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width,
          backgroundColor: theme.panel?.background,
          color: theme.text.primary,
          boxShadow: `-10px 0 40px ${theme?.base?.primary ?? '#0d6efd'}1A, -4px 0 16px rgba(0,0,0,0.2)`,
          transform: slideIn ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '16px' }}>{title}</span>
          <Button onClick={onClose} variant="ghost" icon="X" iconOnly size="sm" ariaLabel="Close" style={{ padding: 4 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
      </div>
    </>,
    document.body,
  )
}

export default SideSheet
