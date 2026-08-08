import { useCallback, useEffect, useRef, useState } from 'react'
import client from '../api/client'
import { normalizeKeys } from '../utils/normalizeKeys'

export default function usePaginatedResource(path, initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialSize)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh = useCallback(() => {
    setRefreshCounter((c) => c + 1)
  }, [])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    client
      .get(path, { params: { page, pageSize } })
      .then((res) => {
        if (!mounted) return
        const body = res.data
        const rawItems = body?.items ?? body?.data ?? (Array.isArray(body) ? body : [])
        const items = Array.isArray(rawItems) ? normalizeKeys(rawItems) : normalizeKeys([rawItems])[0]
        const totalCount = body?.totalCount ?? body?.total ?? (Array.isArray(rawItems) ? rawItems.length : 0)
        setData(items)
        setTotal(totalCount)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message || 'Request failed')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [path, page, pageSize, refreshCounter])

  return { data, total, loading, error, page, pageSize, setPage, setPageSize, refresh }
}
