import client from '../api/client'

export async function createSubDepartment(payload) {
  const { data } = await client.post('/subdepartment', payload)
  if (!data?.success) throw new Error(data?.message || 'Create sub-department failed')
  return data.data
}

export async function updateSubDepartment(id, payload) {
  const { data } = await client.put(`/subdepartment/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update sub-department failed')
  return data.data
}

export async function deleteSubDepartment(id) {
  const { data } = await client.delete(`/subdepartment/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete sub-department failed')
  return data.data
}

export default { createSubDepartment }
