import React, { useState } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import IconComp from '../icon/IconComp'

/**
 *   <Tabs
 *     tabs={[
 *       { key: 'overview', label: 'Overview', icon: 'Info', content: <OverviewTab /> },
 *       { key: 'funds',    label: 'Funds',    icon: 'Wallet', count: 3, content: <FundsTab /> },
 *     ]}
 *     defaultTab="overview"
 *   />
 */
export default function Tabs({ tabs = [], defaultTab, activeTab: controlledTab, onChange, style }) {
  const { theme } = useTheme()
  const lineColor = theme?.card?.line ?? theme?.modal?.line ?? 'rgba(0,0,0,0.06)'
  const fg = theme?.text?.primary ?? theme?.base?.foreground ?? '#ccc'
  const accent = theme?.base?.primary ?? '#3b82f6'
  const muted = theme?.text?.muted ?? fg

  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.key)
  const isControlled = controlledTab !== undefined
  const activeKey = isControlled ? controlledTab : internalTab

  const handleChange = (key) => {
    if (!isControlled) setInternalTab(key)
    onChange?.(key)
  }

  const activeContent = tabs.find((t) => t.key === activeKey)?.content ?? null

  return (
    <div style={style}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${lineColor}`, marginBottom: 16 }}>
        {tabs.map((t) => {
          const active = t.key === activeKey
          return (
              <button
                key={t.key}
                onClick={() => handleChange(t.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  color: active ? accent : muted,
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                {t.icon && <IconComp name={t.icon} size={15} />}
                {t.label}
                {t.count != null && <span style={{ opacity: 0.7 }}>({t.count})</span>}
              </button>
          )
        })}
      </div>
      
      {activeContent}
    </div>
  )
}
