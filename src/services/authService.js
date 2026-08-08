import client from '../api/client'

export async function login(usernameOrEmail, password) {
  const { data } = await client.post('/auth/login', {
    usernameOrEmail,
    password,
  })

  if (!data?.success) {
    throw new Error(data?.message || 'Login failed')
  }

  return data.data
}
