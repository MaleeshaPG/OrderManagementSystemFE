import React from 'react'
import Grid from './Grid'
import { useTheme } from '../providers/ThemeProvider'
import useWindowSize from '../hooks/useWindowSize'
import TopBar from '../components/topbar/TopBar'
import { InAppNotificationProvider } from '../providers/InAppNotificationProvider'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import DepartmentPage from '../pages/DepartmentPage'
import EmployeePage from '../pages/EmployeePage'
import SubDepartmentPage from '../pages/SubDepartmentPage'
import ItemPage from '../pages/ItemPage'
import SupplierPage from '../pages/SupplierPage'
import StorePage from '../pages/StorePage'

const AppLayout = () => {
  const { theme } = useTheme()
  const { width } = useWindowSize()

  return (
    <InAppNotificationProvider>
      <div style={{ backgroundColor: theme.base?.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ flex: 1, minHeight: 0 }}>
          <Grid style={{ minHeight: '100%' }}>
            <div style={{ gridColumn: '1 / -1', padding: width <= 640 ? 12 : width <= 1024 ? 16 : 24, minHeight: '100%' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/departments" element={<DepartmentPage />} />
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/subdepartments" element={<SubDepartmentPage />} />
                <Route path="/items" element={<ItemPage />} />
                <Route path="/suppliers" element={<SupplierPage />} />
                <Route path="/stores" element={<StorePage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Grid>
        </div>
      </div>
    </InAppNotificationProvider>
  )
}

export default AppLayout
