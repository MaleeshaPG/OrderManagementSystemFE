import client from '../api/client'

export async function createDepartment(payload) {
  const { data } = await client.post('/department', payload)
  if (!data?.success) throw new Error(data?.message || 'Create department failed')
  return data.data
}

export async function updateDepartment(id, payload) {
  const { data } = await client.put(`/department/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update department failed')
  return data.data
}

export async function deleteDepartment(id) {
  const { data } = await client.delete(`/department/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete department failed')
  return data.data
}

export default { createDepartment }
