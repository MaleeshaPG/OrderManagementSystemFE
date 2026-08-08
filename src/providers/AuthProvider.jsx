import { createContext, useContext, useState, useEffect } from 'react'
import { setAuthToken } from '../api/client'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
        setAuthToken(token)
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, token, refreshToken) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setAuthToken(token)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    setAuthToken(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
