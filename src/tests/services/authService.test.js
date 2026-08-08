import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../../services/authService'

vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

import client from '../../api/client'

beforeEach(() => {
  vi.clearAllMocks()
})


describe('authService › login', () => {
  it('returns user data on successful login', async () => {
    const mockUser = { id: 1, username: 'admin', token: 'jwt-abc' }
    client.post.mockResolvedValueOnce({
      data: { success: true, data: mockUser },
    })

    const result = await login('admin', 'password')

    expect(client.post).toHaveBeenCalledOnce()
    expect(client.post).toHaveBeenCalledWith('/auth/login', {
      usernameOrEmail: 'admin',
      password: 'password',
    })
    expect(result).toEqual(mockUser)
  })

  it('throws an error when success is false', async () => {
    client.post.mockResolvedValueOnce({
      data: { success: false, message: 'Invalid credentials' },
    })

    await expect(login('admin', 'wrong')).rejects.toThrow('Invalid credentials')
  })

  it('throws a fallback error when message is missing', async () => {
    client.post.mockResolvedValueOnce({
      data: { success: false },
    })

    await expect(login('admin', 'wrong')).rejects.toThrow('Login failed')
  })

  it('re-throws network errors', async () => {
    client.post.mockRejectedValueOnce(new Error('Network Error'))

    await expect(login('admin', 'password')).rejects.toThrow('Network Error')
  })
})
