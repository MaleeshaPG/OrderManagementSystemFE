/* eslint-disable no-unused-vars */
import React from 'react'
import { useTheme } from '../../providers/ThemeProvider'

export default function DonutChart({ value = 0, total = 1, size = 96, stroke = 12, showLegend = true }) {
  const { theme } = useTheme()
  const primary = theme?.brand?.primary || '#0d6efd'
  const muted = theme?.card?.mutedBg || 'rgba(0,0,0,0.06)'

  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.round((value / Math.max(1, total)) * 100))
  const dash = (pct / 100) * circumference

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke={muted} strokeWidth={stroke} />
          <circle
            r={radius}
            fill="none"
            stroke={primary}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${Math.max(1, circumference - dash)}`}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
          <text x="0" y="4" textAnchor="middle" style={{ fontSize: 14, fontWeight: 700 }}>
            {pct}%
          </text>
        </g>
      </svg>

      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 12, color: '#666' }}>{`${pct}% allocated`}</div>
          <div
            style={{ fontSize: 12, color: '#666' }}
          >{`LKR ${value.toLocaleString()} of LKR ${total.toLocaleString()}`}</div>
        </div>
      )}
    </div>
  )
}
