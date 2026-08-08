import React, { useMemo, useState } from 'react'
import PageHeader from '../components/pageheader/PageHeader'
import Card from '../components/card/Card'
import Input from '../components/input/Input'
import Button from '../components/button/Button'
import Select from '../components/select/Select'
import Table from '../components/table/Table'
import { useApiResource } from '../hooks/useApiResource'
import { useNotification } from '../providers/NotificationProvider'
import SideSheet from '../components/sidesheet/SideSheet'
import { createSubDepartment, updateSubDepartment, deleteSubDepartment } from '../services/subDepartmentService'
import { statusFormOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'
import SubDepartmentModal from '../modals/SubDepartmentModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'

const subdepartmentColumns = (onEdit, onDelete) => [
  { key: 'subDepartmentId', label: 'ID', render: (r) => r.SubDepartmentID ?? r.subDepartmentID ?? r.id ?? '' },
  { key: 'name', label: 'Sub-department', render: (r) => r.SubDepartmentName ?? r.subDepartmentName ?? r.name ?? '' },
  { key: 'departmentId', label: 'Department ID', render: (r) => r.DepartmentID ?? r.departmentID ?? '' },
  {
    key: 'status',
    label: 'Status',
    render: (r) => {
      const isInactive = Number(r.Status) === 1
      return (
        <Tag variant={isInactive ? 'warning' : 'success'} outline>
          {isInactive ? 'Inactive' : 'Active'}
        </Tag>
      )
    }
  },
  {
    key: 'actions', label: 'Actions', align: 'right', render: (row) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={() => onEdit(row)} icon="Edit" ariaLabel="Edit" />
        <Button variant="ghost" onClick={() => onDelete(row)} icon="Trash" ariaLabel="Delete" />
      </div>
    ),
  },
]

export default function SubDepartmentPage() {
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const { data: subdepartments, loading, error, refresh } = useApiResource('/subdepartment', [])
  const { data: departments } = useApiResource('/department', [])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const deptOptions = useMemo(() => {
    const list = Array.isArray(departments) ? departments : []
    return [{ value: 'all', label: 'All departments' }, ...list.map((d) => ({ value: String(d.DepartmentID), label: d.DepartmentName }))]
  }, [departments])

  const filteredSubdepartments = useMemo(() => {
    const list = Array.isArray(subdepartments) ? subdepartments : []
    return list.filter((item) => {
      const name = (item.SubDepartmentName ?? item.subDepartmentName ?? item.name ?? '').toLowerCase()
      const deptId = String(item.DepartmentID ?? item.departmentID ?? '')
      const searchMatch = name.includes(search.toLowerCase())
      const deptMatch = departmentFilter === 'all' || deptId === departmentFilter
      return searchMatch && deptMatch
    })
  }, [subdepartments, search, departmentFilter])

  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      await createSubDepartment(formData)
      setOpen(false)
      refresh()
      notification.success('Sub-department created successfully.')
      return true
    } catch (e) {
      notification.error(e.message || 'Failed to create sub-department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
      return false
    } finally { setSubmitting(false) }
  }

  const handleEditSave = async (updated) => {
    setSubmitting(true)
    try {
      await updateSubDepartment(updated.SubDepartmentID ?? updated.id, { SubDepartmentName: updated.SubDepartmentName, DepartmentID: Number(updated.DepartmentID), Status: Number(updated.Status) })
      setEditOpen(false)
      setEditing(null)
      refresh()
      notification.success('Sub-department updated successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to update sub-department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteSubDepartment(deleting.SubDepartmentID ?? deleting.id)
      setDeleteConfirmOpen(false)
      setDeleting(null)
      refresh()
      notification.success('Sub-department deleted successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to delete sub-department.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Sub-departments" subtitle="Manage sub-departments within primary department groups." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: '1 1 300px', width: '100%', maxWidth: 720, minWidth: 0, boxSizing: 'border-box' }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sub-departments" />
            <Select value={departmentFilter} onChange={setDepartmentFilter} options={deptOptions} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Sub-department</Button>
        </div>
        {loading && <div>Loading sub-departments...</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Table columns={subdepartmentColumns((r) => { setEditing({ ...r }); setEditOpen(true) }, (r) => { setDeleting({ ...r }); setDeleteConfirmOpen(true) })} data={filteredSubdepartments} />
      </Card>

      <SubDepartmentModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleCreate} 
        submitting={submitting}
        departments={departments}
      />

      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.SubDepartmentName}` : 'Edit Sub-department'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Sub-department name" value={editing.SubDepartmentName ?? ''} onChange={(e) => setEditing({ ...editing, SubDepartmentName: e.target.value })} />
            <label style={{ fontSize: 13 }}>Department</label>
            <Select options={deptOptions.filter(d => d.value !== 'all')} value={editing.DepartmentID ?? ''} onChange={(v) => setEditing({ ...editing, DepartmentID: Number(v) })} />
            <label style={{ fontSize: 13 }}>Status</label>
            <Select options={statusFormOptions} value={editing.Status ?? 0} onChange={(v) => setEditing({ ...editing, Status: Number(v) })} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleEditSave(editing)} disabled={submitting}>Save</Button>
            </div>
          </div>
        ) : null}
      </SideSheet>

      <DeleteConfirmModal 
        isOpen={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)} 
        onConfirm={confirmDelete} 
        itemName={deleting?.SubDepartmentName} 
        submitting={submitting} 
      />
    </div>
  )
}
