/* eslint-disable no-unused-vars */
import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'

export default function BarChart({ data = [], showLegend = true, customLegend = null }) {
  const { theme } = useTheme()
  const primary = theme?.brand?.primary || '#0d6efd'
  const primarySoft = theme?.brand?.primarySoft || 'rgba(13,110,253,0.15)'
  const success = theme?.base?.success || '#198754'
  const mutedBg = theme?.card?.line || 'rgba(0,0,0,0.06)'

  const max = Math.max(1, ...data.map((d) => Math.max(d.cost || 0, d.allocated || 0, d.expended || 0)))

  const legend = customLegend || [
    { label: 'Allocated', color: primary },
    { label: 'Estimated', color: primarySoft },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showLegend && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
          {legend.map((item, idx) => (
            <LegendItem key={idx} color={item.color} label={item.label} />
          ))}
        </div>
      )}

      {data.map((d, i) => {
        const costPct = Math.round(((d.cost || 0) / max) * 100)
        const allocPct = Math.round(((d.allocated || 0) / max) * 100)
        const expPct = Math.round(((d.expended || 0) / max) * 100)
        
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0', borderBottom: i < data.length - 1 ? `1px solid ${mutedBg}` : 'none' }}>
            {d.label !== 'Financials' && <div style={{ fontSize: 14, fontWeight: 600, color: theme?.text?.primary }}>{d.label}</div>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <BarItem label="Estimated" value={d.cost} percent={costPct} color={primarySoft} theme={theme} />
              <BarItem label="Allocated" value={d.allocated} percent={allocPct} color={primary} theme={theme} />
              <BarItem label="Expended" value={d.expended} percent={expPct} color={success} theme={theme} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BarItem({ label, value, percent, color, theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme?.text?.muted || '#888' }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>LKR {Math.round(value || 0).toLocaleString()}</span>
      </div>
      <div style={{ height: 8, background: theme?.card?.line || 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${percent}%`, 
            background: color, 
            borderRadius: 4,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} 
        />
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: color,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      />
      <div style={{ color: 'var(--muted, #666)' }}>{label}</div>
    </div>
  )
}
