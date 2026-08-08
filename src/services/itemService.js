import client from '../api/client'

export async function createItem(payload) {
  const { data } = await client.post('/item', payload)
  if (!data?.success) throw new Error(data?.message || 'Create item failed')
  return data.data
}

export async function updateItem(id, payload) {
  const { data } = await client.put(`/item/${id}`, payload)
  if (!data?.success) throw new Error(data?.message || 'Update item failed')
  return data.data
}

export async function deleteItem(id) {
  const { data } = await client.delete(`/item/${id}`)
  if (!data?.success) throw new Error(data?.message || 'Delete item failed')
  return data.data
}

export default { createItem }
