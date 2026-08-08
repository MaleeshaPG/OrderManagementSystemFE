import client from '../api/client'

export async function createEmployee(payload) {
  const { data } = await client.post('/employee', payload)
  if (!data?.success) throw new Error(data?.message || 'Create employee failed')
  return data.data
}

export async function updateEmployee(id, payload) {
  const { data } = await client.put(`/employee/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update employee failed')
  return data.data
}

export async function deleteEmployee(id) {
  const { data } = await client.delete(`/employee/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete employee failed')
  return data.data
}

export default { createEmployee }
