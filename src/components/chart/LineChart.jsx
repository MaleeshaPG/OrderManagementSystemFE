/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

const LineChart = ({ datasets = [], height = 220, showLegend = true }) => {
  const { theme } = useTheme()

  const data = useMemo(() => {
    const xs = Array.from(new Set(datasets.flatMap((d) => d.data.map((p) => p.x))))
    const sorted = xs.sort()
    return sorted.map((x) => {
      const row = { x }
      datasets.forEach((ds) => {
        const pt = ds.data.find((p) => p.x === x)
        row[ds.key] = pt ? Number(pt.y) : null
      })
      return row
    })
  }, [datasets])

  const defaultColor = theme?.button?.primary || '#0D6EFD'
  const strokeWidth = 2.5

  const tooltipFormatter = (value, name, props) => {
    return [value, name]
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
          <CartesianGrid stroke={theme?.card?.line || 'rgba(0,0,0,0.06)'} strokeDasharray="3 6" />
          <XAxis dataKey="x" stroke={theme?.base?.foreground || '#333'} />
          <YAxis stroke={theme?.base?.foreground || '#333'} />
          <Tooltip formatter={tooltipFormatter} />
          {showLegend && <Legend />}

          {datasets.map((ds) => (
            <Line
              key={ds.key}
              type="monotone"
              dataKey={ds.key}
              name={ds.label}
              stroke={ds.color || ds.fill || defaultColor}
              strokeWidth={strokeWidth}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={true}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChart
