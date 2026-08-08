import client from '../api/client'

export async function createStore(payload) {
  const { data } = await client.post('/store', payload)
  if (!data?.success) throw new Error(data?.message || 'Create store failed')
  return data.data
}

export async function updateStore(id, payload) {
  const { data } = await client.put(`/store/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update store failed')
  return data.data
}

export async function deleteStore(id) {
  const { data } = await client.delete(`/store/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete store failed')
  return data.data
}

export default { createStore }
