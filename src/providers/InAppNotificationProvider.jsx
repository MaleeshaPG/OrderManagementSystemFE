/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const InAppNotificationContext = createContext(null)

export function useInAppNotifications() {
  const ctx = useContext(InAppNotificationContext)
  if (!ctx) throw new Error('useInAppNotifications must be used within InAppNotificationProvider')
  return ctx
}

const STORAGE_KEY = 'inAppNotifications'

export function InAppNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch {
      // ignore storage failures
    }
  }, [notifications])

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [
      ...prev,
      {
        id: notification.id ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: notification.title || 'Notification',
        description: notification.description || notification.message || '',
        type: notification.type || 'info',
        unread: notification.unread !== false,
        createdAt: notification.createdAt || new Date().toISOString(),
        ...notification,
      },
    ])
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)))
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const refresh = useCallback(() => Promise.resolve(), [])

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications])

  const api = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    removeNotification,
    refresh,
  }

  return <InAppNotificationContext.Provider value={api}>{children}</InAppNotificationContext.Provider>
}
