import client from '../api/client'

export async function createSupplier(payload) {
  const { data } = await client.post('/supplier', payload)
  if (!data?.success) throw new Error(data?.message || 'Create supplier failed')
  return data.data
}

export async function updateSupplier(id, payload) {
  const { data } = await client.put(`/supplier/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update supplier failed')
  return data.data
}

export async function deleteSupplier(id) {
  const { data } = await client.delete(`/supplier/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete supplier failed')
  return data.data
}

export default { createSupplier }
