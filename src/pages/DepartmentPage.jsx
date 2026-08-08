import React, { useMemo, useState } from 'react'
import PageHeader from '../components/pageheader/PageHeader'
import Card from '../components/card/Card'
import Input from '../components/input/Input'
import Button from '../components/button/Button'
import Select from '../components/select/Select'
import Table from '../components/table/Table'
import { useApiResource } from '../hooks/useApiResource'
import { useNotification } from '../providers/NotificationProvider'
import Modal from '../components/modal/Modal'
import SideSheet from '../components/sidesheet/SideSheet'
import { createDepartment, updateDepartment, deleteDepartment } from '../services/departmentService'
import { statusFilterOptions, departmentStatusFormOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'

const departmentColumns = (onEdit, onDelete) => [
  { key: 'DepartmentID', label: 'ID' },
  { key: 'DepartmentName', label: 'Department' },
  {
    key: 'Status',
    label: 'Status',
    render: (row) => {
      const isDeleted = Number(row.Status) === 1
      return (
        <Tag variant={isDeleted ? 'danger' : 'success'} outline>
          {isDeleted ? 'Deleted' : 'Active'}
        </Tag>
      )
    }
  },
  { key: 'CreatedDate', label: 'Created' },
  {
    key: 'actions',
    label: 'Actions',
    align: 'right',
    render: (row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={() => onEdit(row)} icon="Edit" ariaLabel="Edit" />
        <Button variant="ghost" onClick={() => onDelete(row)} icon="Trash" ariaLabel="Delete" />
      </div>
    ),
  },
]

// const sampleDepartments = [
//   { id: 1, name: 'Sales', manager: 'Nimal Perera', status: 'Active' },
//   { id: 2, name: 'Procurement', manager: 'Anusha Silva', status: 'Active' },
//   { id: 3, name: 'Operations', manager: 'Saman Kumara', status: 'Inactive' },
// ]

export default function DepartmentPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: departments, loading, error, refresh } = useApiResource('/department', [])
  const [open, setOpen] = useState(false)
  const [deptName, setDeptName] = useState('')
  const [deptStatus, setDeptStatus] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const filteredDepartments = useMemo(() => {
    const list = Array.isArray(departments) ? departments : []
    return list.filter((item) => {
      const name = (item.DepartmentName ?? '').toString().toLowerCase()
      const status = (item.Status ?? '').toString().toLowerCase()
      const searchMatch = name.includes(search.toLowerCase())
      const statusMatch = statusFilter === 'all' || status === statusFilter
      return searchMatch && statusMatch
    })
  }, [departments, search, statusFilter])

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      await createDepartment({ DepartmentName: deptName, Status: Number(deptStatus) })
      setOpen(false)
      setDeptName('')
      setDeptStatus(0)
      refresh()
      notification.success('Department created successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to create department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditOpen = (item) => {
    setEditing({ ...item })
    setEditOpen(true)
  }

  const handleEditSave = async (updated) => {
    setSubmitting(true)
    try {
      await updateDepartment(updated.DepartmentID, { DepartmentName: updated.DepartmentName, Status: Number(updated.Status) })
      setEditOpen(false)
      setEditing(null)
      refresh()
      notification.success('Department updated successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to update department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (item) => {
    setDeleting({ ...item })
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteDepartment(deleting.DepartmentID)
      setDeleteConfirmOpen(false)
      setDeleting(null)
      refresh()
      notification.success('Department deleted successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to delete department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Departments" subtitle="Manage department groups and owners." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%', maxWidth: 720 }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search departments" />
            <Select value={statusFilter} onChange={setStatusFilter} options={statusFilterOptions} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Department</Button>
        </div>
        {loading && <div>Loading departments...</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Table columns={departmentColumns(handleEditOpen, handleDelete)} data={filteredDepartments} rowKey="DepartmentID" />
      </Card>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Department" subtitle="Create a new department">
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Department name" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
          <label style={{ fontSize: 13 }}>Status</label>
          <Select options={departmentStatusFormOptions} value={deptStatus} onChange={(v) => setDeptStatus(Number(v))} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} disabled={submitting || !deptName}>Create</Button>
        </div>
      </Modal>

      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.DepartmentName}` : 'Edit Department'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Department name" value={editing.DepartmentName} onChange={(e) => setEditing({ ...editing, DepartmentName: e.target.value })} />
            <label style={{ fontSize: 13 }}>Status</label>
            <Select options={departmentStatusFormOptions} value={editing.Status} onChange={(v) => setEditing({ ...editing, Status: Number(v) })} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleEditSave(editing)} disabled={submitting}>Save</Button>
            </div>
          </div>
        ) : null}
      </SideSheet>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm delete" subtitle="This action cannot be undone.">
        <div>Are you sure you want to delete <strong>{deleting?.DepartmentName}</strong>?</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={submitting}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
