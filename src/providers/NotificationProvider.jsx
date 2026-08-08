/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from 'react'
import MessagePop from '../components/message-box/MessageBox'

const NotificationContext = createContext(null)

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

let _id = 0

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const show = useCallback((type, message, duration = 3000) => {
    const id = ++_id
    setNotifications((prev) => [...prev, { id, type, message, duration }])
    return id
  }, [])

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const api = {
    success: (message, duration) => show('success', message, duration),
    error: (message, duration) => show('error', message, duration),
    warning: (message, duration) => show('warning', message, duration),
    info: (message, duration) => show('info', message, duration),
    show,
    remove,
  }

  return (
    <NotificationContext.Provider value={api}>
      {children}
      {notifications.map((n) => (
        <MessagePop
          key={n.id}
          type={n.type}
          message={n.message}
          duration={n.duration}
          onClose={() => remove(n.id)}
          onComplete={() => remove(n.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}
