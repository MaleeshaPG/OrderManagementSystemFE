import React, { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { useTheme } from '../providers/ThemeProvider'
import { login as loginApi } from '../services/authService'
import Card from '../components/card/Card'
import Input from '../components/input/Input'
import Button from '../components/button/Button'
import ErrorMessage from '../components/common/ErrorMessage'

const LoginPage = () => {
  const { login } = useAuth()
  const { theme } = useTheme()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginApi(usernameOrEmail, password)
      login(result.user, result.accessToken, result.refreshToken)
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to login. Please check your credentials.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const baseBg = theme?.base?.background || '#021721'
  const baseFg = theme?.base?.foreground || '#eaf6ff'
  const accent = theme?.base?.primary || '#0D6EFD'
  const infoAccent = theme?.base?.info || '#0DCAF0'
  const mutedText = theme?.text?.muted || 'rgba(255,255,255,0.65)'
  const cardBg = theme?.card?.background || '#051821'
  const cardBorder = theme?.card?.border || 'rgba(255,255,255,0.08)'
  const cardShadow = theme?.modal?.boxShadow || '0 40px 90px rgba(0,0,0,0.32)'
  const inputBg = theme?.input?.background || '#051821'
  const inputFg = theme?.input?.foreground || '#eaf6ff'
  const inputBorder = theme?.input?.border || 'rgba(255,255,255,0.12)'
  const focusRing = theme?.input?.focus_ring || '#0b84ff'
  const gradientOverlay = `radial-gradient(circle at top left, ${accent}22, transparent 24%), radial-gradient(circle at bottom right, ${infoAccent}1a, transparent 26%)`
  const buttonShadow = theme?.button?.primary ? `0 18px 35px ${accent}33` : '0 18px 35px rgba(0,0,0,0.12)'

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: baseBg,
        color: baseFg,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: gradientOverlay,
          pointerEvents: 'none',
        }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: 460,
          position: 'relative',
          zIndex: 1,
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          padding: '36px 34px',
          borderRadius: 24,
        }}
      >
        <div style={{ marginBottom: 30, color: baseFg }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: 0.68,
              marginBottom: 10,
              color: mutedText,
            }}
          >
            Order Management
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>Welcome back</div>
              <div style={{ marginTop: 8, color: mutedText }}>
                Sign in to continue to your dashboard.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
          <Input
            label="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="admin or your email"
            inputStyle={{ color: inputFg, background: inputBg }}
            labelStyle={{ color: mutedText }}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            inputStyle={{ color: inputFg, background: inputBg }}
            labelStyle={{ color: mutedText }}
          />

          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <div style={{ minHeight: 22 }} />
          )}

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            style={{ width: '100%', padding: '14px 20px', fontSize: 15 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
