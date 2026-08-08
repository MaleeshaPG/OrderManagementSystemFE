/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import IconComp from '../icon/IconComp'
import useWindowSize from '../../hooks/useWindowSize'
import Button from '../button/Button'

export default function Sidebar({
  items = [],
  children,
  header,
  footer,
  defaultCollapsed = false,
  collapsedWidth = 48,
  width = 340,
  breakpoint = 640,
  className = '',
  onToggle,
}) {
  const { theme } = useTheme()
  const { width: w } = useWindowSize()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    if (w <= breakpoint) {
      setCollapsed(true)
    } else {
      setCollapsed(defaultCollapsed)
    }
  }, [w, breakpoint, defaultCollapsed])

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c
      if (onToggle) onToggle(next)
      return next
    })
  }

  const fg = theme?.text?.primary ?? theme?.base?.foreground
  const bg = theme?.panel?.background ?? theme?.base?.background
  const border = theme?.card?.line ?? theme?.base?.border ?? 'rgba(0,0,0,0.06)'

  const containerStyle = {
    width: collapsed ? collapsedWidth : width,
    minWidth: collapsed ? collapsedWidth : width,
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: bg,
    color: fg,
    borderRight: `1px solid ${border}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 180ms ease',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }

  const headerStyle = {
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  }

  const listStyle = {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    overflow: 'auto',
  }

  const itemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 8,
    cursor: 'pointer',
    background: active ? theme?.card?.selected || 'rgba(0,0,0,0.04)' : 'transparent',
    color: fg,
    textAlign: 'left',
  })

  const toggleBtnStyle = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    color: fg,
  }

  return (
    <aside className={className} style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
          {theme?.logo && <img src={theme.logo} alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />}

          {!collapsed && header && <strong style={{ whiteSpace: 'nowrap' }}>{header}</strong>}
        </div>

        <Button
          ariaLabel="Toggle sidebar"
          onClick={toggle}
          variant="ghost"
          icon={collapsed ? 'ChevronRight' : 'ChevronLeft'}
          iconOnly
          size="sm"
          style={{ ...toggleBtnStyle, color: fg }}
        />
      </div>

      <div style={listStyle}>
        {items.map((it) => (
          <div
            key={it.key}
            onClick={() => it.onClick && it.onClick(it)}
            title={collapsed ? it.label : undefined}
            style={itemStyle(it.active)}
          >
            {it.icon ? (
              typeof it.icon === 'string' ? (
                <IconComp name={it.icon} size={18} />
              ) : (
                it.icon
              )
            ) : (
              <div style={{ width: 18 }} />
            )}

            {!collapsed && <div style={{ flex: 1 }}>{it.label}</div>}
          </div>
        ))}

        {!collapsed && children}
      </div>

      <div style={{ marginTop: 'auto', padding: 8 }}>{!collapsed && footer}</div>
    </aside>
  )
}
