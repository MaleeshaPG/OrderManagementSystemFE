/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'
import { useTheme } from '../../providers/ThemeProvider'
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const PieChart = ({ data = [], height = 220, innerRadius = 0, outerRadius = '72%', showLegend = true }) => {
  const { theme } = useTheme()

  const palette = [
    theme?.piechart?.primary_area,
    theme?.piechart?.secondary_area,
    theme?.piechart?.warning_area,
    theme?.piechart?.success_area,
    theme?.piechart?.danger_area,
    theme?.piechart?.info_area,
    theme?.piechart?.light_area,
    theme?.piechart?.dark_area,
  ].filter(Boolean)

  const defaultColor = theme?.button?.primary || theme?.chart?.primary_line || '#0D6EFD'

  const normalized = useMemo(() => {
    if (!data) return []
    let arr = []
    if (Array.isArray(data)) {
      arr = data.map((d, i) => ({
        key: d.key ?? d.name ?? `s${i}`,
        label: d.label ?? d.name ?? d.key ?? `Slice ${i + 1}`,
        value: Number(d.value ?? d.y ?? d.v ?? 0),
        color: d.color,
      }))
    } else {
      arr = Object.entries(data).map(([k, v], _i) => ({
        key: k,
        label: typeof v === 'object' ? (v.label ?? k) : k,
        value: typeof v === 'object' ? Number(v.value ?? v.y ?? 0) : Number(v),
        color: typeof v === 'object' ? v.color : undefined,
      }))
    }

    return arr.map((entry, idx) => ({
      ...entry,
      color: entry.color || palette[idx % palette.length] || defaultColor,
    }))
  }, [data, palette, defaultColor])

  const tooltipFormatter = (value, name) => [value, name]

  const renderLabel = (props) => {
    const RAD = Math.PI / 180
    const { cx, cy, midAngle, outerRadius, payload } = props
    const rad = Number(outerRadius) || outerRadius
    const sx = cx + rad * Math.cos(-midAngle * RAD)
    const sy = cy + rad * Math.sin(-midAngle * RAD)
    const mx = cx + (rad + 12) * Math.cos(-midAngle * RAD)
    const my = cy + (rad + 12) * Math.sin(-midAngle * RAD)
    const ex = mx + (mx > cx ? 20 : -20)
    const ey = my
    const textAnchor = mx > cx ? 'start' : 'end'
    const labelText = `${payload.label}: ${payload.value}`

    return (
      <g>
        <path d={`M ${sx},${sy} L ${mx},${my} L ${ex},${ey}`} stroke={payload.color} fill="none" strokeWidth={1.25} />
        <circle cx={ex + (mx > cx ? 6 : -6)} cy={ey} r={4} fill={payload.color} />
        <text x={ex + (mx > cx ? 12 : -12)} y={ey + 4} textAnchor={textAnchor} fill={payload.color} fontSize={13}>
          {labelText}
        </text>
      </g>
    )
  }

  return (
    <div style={{ width: '100%', height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={normalized}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            stroke="none"
            labelLine={false}
            label={renderLabel}
            tabIndex={-1}
          >
            {normalized.map((entry, idx) => (
              <Cell key={`cell-${entry.key}-${idx}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip formatter={tooltipFormatter} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ color: theme?.base?.foreground, paddingTop: 12 }}
            />
          )}
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChart
