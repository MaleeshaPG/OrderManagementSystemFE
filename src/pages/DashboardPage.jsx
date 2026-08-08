import React from 'react'
import { useApiResource } from '../hooks/useApiResource'
import { useTheme } from '../providers/ThemeProvider'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import IconComp from '../components/icon/IconComp'
import Tag from '../components/tag/Tag'


function StatCard({ label, value, icon, color, loading, error }) {
  const { theme } = useTheme()
  const cardBg = theme?.card?.background ?? theme?.base?.background ?? '#fff'
  const cardBorder = theme?.card?.line ?? 'rgba(0,0,0,0.06)'
  const fg = theme?.text?.primary ?? theme?.base?.foreground ?? '#111'
  const muted = theme?.text?.muted ?? '#888'

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color + '1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconComp name={icon} size={22} style={{ color }} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: muted, marginBottom: 4, fontWeight: 500 }}>{label}</div>
        {loading ? (
          <div style={{ fontSize: 13, color: muted }}>Loading…</div>
        ) : error ? (
          <div style={{ fontSize: 12, color: '#dc3545' }}>Error</div>
        ) : (
          <div style={{ fontSize: 28, fontWeight: 700, color: fg, lineHeight: 1 }}>{value}</div>
        )}
      </div>
    </div>
  )
}


function SectionTitle({ children }) {
  const { theme } = useTheme()
  const fg = theme?.text?.primary ?? theme?.base?.foreground ?? '#111'
  return (
    <h2 style={{ fontSize: 15, fontWeight: 600, color: fg, margin: 0, marginBottom: 12 }}>
      {children}
    </h2>
  )
}

function Panel({ children, style }) {
  const { theme } = useTheme()
  const cardBg = theme?.card?.background ?? theme?.base?.background ?? '#fff'
  const cardBorder = theme?.card?.line ?? 'rgba(0,0,0,0.06)'
  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 12,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value} items</div>
    </div>
  )
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const fg = theme?.text?.primary ?? theme?.base?.foreground ?? '#111'
  const muted = theme?.text?.muted ?? '#888'
  const primary = theme?.base?.primary ?? '#0D6EFD'
  const cardBorder = theme?.card?.line ?? 'rgba(0,0,0,0.06)'

  const { data: employees, loading: empLoading, error: empError } = useApiResource('/employee', [])
  const { data: items, loading: itemLoading, error: itemError } = useApiResource('/item', [])
  const { data: departments, loading: deptLoading, error: deptError } = useApiResource('/department', [])
  const { data: suppliers, loading: suppLoading, error: suppError } = useApiResource('/supplier', [])
  const { data: subdepartments } = useApiResource('/subdepartment', [])

  const empCount = Array.isArray(employees) ? employees.length : 0
  const itemCount = Array.isArray(items) ? items.length : 0
  const deptCount = Array.isArray(departments) ? departments.length : 0
  const suppCount = Array.isArray(suppliers) ? suppliers.length : 0

  const activeEmpCount = Array.isArray(employees)
    ? employees.filter((e) => Number(e.Status ?? e.status) === 0).length
    : 0

  const subdeptMap = React.useMemo(() => {
    if (!Array.isArray(subdepartments) || !Array.isArray(items)) return []
    const counts = {}
    items.forEach((item) => {
      const sdId = item.SubDepartmentID ?? item.subDepartmentID
      if (sdId != null) counts[sdId] = (counts[sdId] || 0) + 1
    })
    return subdepartments
      .map((sd) => ({
        name: (sd.SubDepartmentName ?? sd.subDepartmentName ?? `SD ${sd.SubDepartmentID}`).slice(0, 16),
        count: counts[sd.SubDepartmentID ?? sd.subDepartmentID] || 0,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [subdepartments, items])

  const recentEmployees = React.useMemo(() => {
    if (!Array.isArray(employees)) return []
    return [...employees].reverse().slice(0, 5)
  }, [employees])

  const BAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: fg, margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: muted, margin: '4px 0 0' }}>
          Overview of your Order Management System
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <StatCard label="Total Employees" value={empCount} icon="Users" color="#6366f1" loading={empLoading} error={empError} />
        <StatCard label="Active Employees" value={activeEmpCount} icon="UserCheck" color="#10b981" loading={empLoading} error={empError} />
        <StatCard label="Total Items" value={itemCount} icon="Package" color="#f59e0b" loading={itemLoading} error={itemError} />
        <StatCard label="Departments" value={deptCount} icon="Building2" color="#3b82f6" loading={deptLoading} error={deptError} />
        <StatCard label="Suppliers" value={suppCount} icon="Truck" color="#ec4899" loading={suppLoading} error={suppError} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <Panel>
          <SectionTitle>Items by Sub-Department</SectionTitle>
          {itemLoading ? (
            <div style={{ fontSize: 13, color: muted, padding: '24px 0', textAlign: 'center' }}>
              Loading chart data…
            </div>
          ) : subdeptMap.length === 0 ? (
            <div style={{ fontSize: 13, color: muted, padding: '24px 0', textAlign: 'center' }}>
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={subdeptMap} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: muted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {subdeptMap.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel>
          <SectionTitle>Recent Employees</SectionTitle>
          {empLoading ? (
            <div style={{ fontSize: 13, color: muted, padding: '24px 0', textAlign: 'center' }}>
              Loading…
            </div>
          ) : recentEmployees.length === 0 ? (
            <div style={{ fontSize: 13, color: muted, padding: '24px 0', textAlign: 'center' }}>
              No employees found
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '4px 8px',
                        fontWeight: 600,
                        color: muted,
                        borderBottom: `1px solid ${cardBorder}`,
                        paddingBottom: 8,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp, idx) => {
                  const fullName = emp.FullName ?? `${emp.FirstName ?? ''} ${emp.LastName ?? ''}`.trim()
                  const name = (fullName || emp.Email) ?? '—'
                  const email = emp.Email ?? emp.email ?? '—'
                  const isInactive = Number(emp.Status) === 1
                  return (
                    <tr key={emp.EmployeeID ?? idx}>
                      <td
                        style={{
                          padding: '10px 8px',
                          color: fg,
                          borderBottom: `1px solid ${cardBorder}`,
                          fontWeight: 500,
                          maxWidth: 160,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {name}
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          color: muted,
                          borderBottom: `1px solid ${cardBorder}`,
                          maxWidth: 180,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {email}
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: `1px solid ${cardBorder}` }}>
                        <Tag variant={isInactive ? 'warning' : 'success'} outline>
                          {isInactive ? 'Inactive' : 'Active'}
                        </Tag>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

    
    </div>
  )
}
