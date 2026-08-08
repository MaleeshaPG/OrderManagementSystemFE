import React from 'react'
import { AuthProvider, useAuth } from './providers/AuthProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { NotificationProvider } from './providers/NotificationProvider'
import { InAppNotificationProvider } from './providers/InAppNotificationProvider'
import AppLayout from './layout/AppLayout'
import LoginPage from './pages/LoginPage'

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Loading...</div>
  }

  return isAuthenticated ? <AppLayout /> : <LoginPage />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <InAppNotificationProvider>
            <AppContent />
          </InAppNotificationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
