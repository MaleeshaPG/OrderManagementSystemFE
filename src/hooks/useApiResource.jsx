import { useCallback, useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import { normalizeKeys } from '../utils/normalizeKeys'

export function useApiResource(endpoint, initialData = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await client.get(endpoint)
      const rawData = response.data?.data ?? response.data ?? []
      setData(Array.isArray(rawData) ? normalizeKeys(rawData) : normalizeKeys([rawData])[0])
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch resource')
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return useMemo(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh],
  )
}
