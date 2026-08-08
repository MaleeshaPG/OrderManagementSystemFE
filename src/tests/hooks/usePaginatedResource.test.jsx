import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import usePaginatedResource from '../../hooks/usePaginatedResource'

vi.mock('../../api/client', () => ({
  default: { get: vi.fn() },
}))

vi.mock('../../utils/normalizeKeys', () => ({
  normalizeKeys: (items) => items,
}))

import client from '../../api/client'

beforeEach(() => {
  vi.clearAllMocks()
})


describe('usePaginatedResource', () => {
  it('starts with loading: true and empty data', () => {
    client.get.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => usePaginatedResource('/employee'))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('populates data and total on a successful response', async () => {
    const mockItems = [
      { EmployeeID: 1, FirstName: 'Alice' },
      { EmployeeID: 2, FirstName: 'Bob' },
    ]
    client.get.mockResolvedValueOnce({
      data: { items: mockItems, totalCount: 2 },
    })

    const { result } = renderHook(() => usePaginatedResource('/employee'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(mockItems)
    expect(result.current.total).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it('handles the alternative data/total field names', async () => {
    const mockItems = [{ EmployeeID: 3, FirstName: 'Carol' }]
    client.get.mockResolvedValueOnce({
      data: { data: mockItems, total: 50 },
    })

    const { result } = renderHook(() => usePaginatedResource('/employee'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual(mockItems)
    expect(result.current.total).toBe(50)
  })

  it('sets error when the request rejects', async () => {
    client.get.mockRejectedValueOnce(new Error('Network failure'))

    const { result } = renderHook(() => usePaginatedResource('/employee'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network failure')
    expect(result.current.data).toEqual([])
  })

  it('re-fetches when refresh() is called', async () => {
    client.get.mockResolvedValueOnce({ data: { items: [], totalCount: 0 } })
    client.get.mockResolvedValueOnce({
      data: { items: [{ EmployeeID: 99 }], totalCount: 1 },
    })

    const { result } = renderHook(() => usePaginatedResource('/employee'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.refresh()
    })

    await waitFor(() => expect(result.current.total).toBe(1))

    expect(client.get).toHaveBeenCalledTimes(2)
  })
})
