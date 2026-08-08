/* eslint-disable no-unused-vars */
import axios from 'axios'

function getBaseURL() {
  const port = import.meta.env.VITE_API_PORT || '5091'
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:${port}/api`
    }
  }
  return import.meta.env.VITE_API_BASE || `http://localhost:${port}/api`
}

const client = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem('authToken')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore in non-browser env
  }
  return cfg
})

let isRefreshing = false
let refreshQueue = []

function processQueue(error, token = null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  refreshQueue = []
}

client.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config
    if (err.response && err.response.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          refreshQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return client(original)
          })
          .catch((e) => Promise.reject(e))
      }

      original._retry = true
      isRefreshing = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('no refresh token')
        const { data } = await axios.post(`${client.defaults.baseURL}/auth/refresh`, { refreshToken })
        const newToken = data?.data?.token
        if (newToken) {
          localStorage.setItem('authToken', newToken)
          client.defaults.headers.common.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          original.headers.Authorization = `Bearer ${newToken}`
          return client(original)
        }
        throw new Error('no token in refresh response')
      } catch (e) {
        processQueue(e, null)
       
        try {
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          delete client.defaults.headers.common.Authorization
        } catch (_) { /* ignore */ }
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    try {
      const msg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || 'API request failed'
      if (typeof window !== 'undefined' && window && window.dispatchEvent) {
        try {
          window.dispatchEvent(new CustomEvent('api.error', { detail: { message: msg, status: err.response && err.response.status, url: original && original.url } }))
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // noop
    }
    return Promise.reject(err)
  },
)

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('authToken', token)
    client.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('authToken')
    delete client.defaults.headers.common.Authorization
  }
}

export default client
