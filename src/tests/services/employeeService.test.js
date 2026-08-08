import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEmployee, updateEmployee, deleteEmployee } from '../../services/employeeService'

vi.mock('../../api/client', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

import client from '../../api/client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('employeeService › createEmployee', () => {
  const payload = { FirstName: 'Jane', LastName: 'Doe', Email: 'jane@example.com', Status: 0 }

  it('resolves with the created employee on success', async () => {
    const created = { EmployeeID: 42, ...payload }
    client.post.mockResolvedValueOnce({ data: { success: true, data: created } })

    const result = await createEmployee(payload)

    expect(client.post).toHaveBeenCalledWith('/employee', payload)
    expect(result).toEqual(created)
  })

  it('throws when the API returns success: false', async () => {
    client.post.mockResolvedValueOnce({
      data: { success: false, message: 'Duplicate email' },
    })

    await expect(createEmployee(payload)).rejects.toThrow('Duplicate email')
  })

  it('throws a fallback message when no error message is provided', async () => {
    client.post.mockResolvedValueOnce({ data: { success: false } })

    await expect(createEmployee(payload)).rejects.toThrow('Create employee failed')
  })
})

describe('employeeService › updateEmployee', () => {
  const id = 5
  const payload = { FirstName: 'John', LastName: 'Smith', Email: 'john@example.com', Status: 0 }

  it('resolves with the updated employee on success', async () => {
    const updated = { EmployeeID: id, ...payload }
    client.put.mockResolvedValueOnce({ data: { success: true, data: updated } })

    const result = await updateEmployee(id, payload)

    expect(client.put).toHaveBeenCalledWith(`/employee/${id}`, payload)
    expect(result).toEqual(updated)
  })

  it('throws when the API returns success: false', async () => {
    client.put.mockResolvedValueOnce({
      data: { success: false, message: 'Employee not found' },
    })

    await expect(updateEmployee(id, payload)).rejects.toThrow('Employee not found')
  })
})


describe('employeeService › deleteEmployee', () => {
  const id = 7

  it('resolves on successful deletion', async () => {
    client.delete.mockResolvedValueOnce({ data: { success: true, data: null } })

    const result = await deleteEmployee(id)

    expect(client.delete).toHaveBeenCalledWith(`/employee/${id}`)
    expect(result).toBeNull()
  })

  it('throws when the API returns success: false', async () => {
    client.delete.mockResolvedValueOnce({
      data: { success: false, message: 'Cannot delete' },
    })

    await expect(deleteEmployee(id)).rejects.toThrow('Cannot delete')
  })
})
