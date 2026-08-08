import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import Table from '../../components/table/Table'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

const data = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
]

describe('Table', () => {
  it('renders column headers and row data', () => {
    render(<Table columns={columns} data={data} showPagination={false} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('triggers onRowClick when a row is clicked', () => {
    const handleRowClick = vi.fn()
    render(<Table columns={columns} data={data} onRowClick={handleRowClick} showPagination={false} />)
    fireEvent.click(screen.getByText('Alice'))
    expect(handleRowClick).toHaveBeenCalledWith(data[0])
  })
})
