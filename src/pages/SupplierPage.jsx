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
import { createSupplier, updateSupplier, deleteSupplier } from '../services/supplierService'
import { statusFilterOptions, statusFormOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'
import SupplierModal from '../modals/SupplierModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'

const supplierColumns = (onEdit, onDelete) => [
  { key: 'supplierId', label: 'ID', render: (r) => r.SupplierID ?? r.supplierID ?? r.id ?? '' },
  { key: 'name', label: 'Supplier', render: (r) => r.SupplierName ?? r.supplierName ?? r.name ?? '' },
  { key: 'tel', label: 'Phone', render: (r) => r.TelNo ?? r.telNo ?? '' },
  { key: 'email', label: 'Email', render: (r) => r.Email ?? r.email ?? '' },
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
  { key: 'actions', label: 'Actions', align: 'right', render: (row) => (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={() => onEdit(row)} icon="Edit" ariaLabel="Edit" />
      <Button variant="ghost" onClick={() => onDelete(row)} icon="Trash" ariaLabel="Delete" />
    </div>
  )},
]

export default function SupplierPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: suppliers, loading, error, refresh } = useApiResource('/supplier', [])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const filteredSuppliers = useMemo(() => {
    const list = Array.isArray(suppliers) ? suppliers : []
    return list.filter((item) => {
      const name = (item.SupplierName ?? item.supplierName ?? item.name ?? '').toLowerCase()
      const searchMatch = name.includes(search.toLowerCase()) || (String(item.TelNo ?? item.Email ?? '').toLowerCase().includes(search.toLowerCase()))
      return searchMatch
    })
  }, [suppliers, search])

  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      await createSupplier(formData)
      setOpen(false)
      refresh()
      notification.success('Supplier created successfully.')
      return true
    } catch (e) {
      notification.error(e.message || 'Failed to create supplier.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
      return false
    } finally { setSubmitting(false) }
  }

  const handleEditSave = async (updated) => {
    setSubmitting(true)
    try {
      await updateSupplier(updated.SupplierID ?? updated.id, { SupplierName: updated.SupplierName, Address: updated.Address, TelNo: updated.TelNo, Email: updated.Email, Status: Number(updated.Status) })
      setEditOpen(false)
      setEditing(null)
      refresh()
      notification.success('Supplier updated successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to update supplier.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteSupplier(deleting.SupplierID ?? deleting.id)
      setDeleteConfirmOpen(false)
      setDeleting(null)
      refresh()
      notification.success('Supplier deleted successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to delete supplier.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Suppliers" subtitle="Manage product suppliers." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%', maxWidth: 720 }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supplier or contact" />
            <Select value={statusFilter} onChange={setStatusFilter} options={statusFilterOptions} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Supplier</Button>
        </div>
        {loading && <div>Loading suppliers...</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Table columns={supplierColumns((r) => { setEditing({ ...r }); setEditOpen(true) }, (r) => { setDeleting({ ...r }); setDeleteConfirmOpen(true) })} data={filteredSuppliers} />
      </Card>

      <SupplierModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleCreate} 
        submitting={submitting} 
      />

      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.SupplierName}` : 'Edit Supplier'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Supplier name" value={editing.SupplierName ?? ''} onChange={(e) => setEditing({ ...editing, SupplierName: e.target.value })} />
            <Input label="Address" value={editing.Address ?? ''} onChange={(e) => setEditing({ ...editing, Address: e.target.value })} />
            <Input label="Phone" value={editing.TelNo ?? ''} onChange={(e) => setEditing({ ...editing, TelNo: e.target.value })} />
            <Input label="Email" value={editing.Email ?? ''} onChange={(e) => setEditing({ ...editing, Email: e.target.value })} />
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
        itemName={deleting?.SupplierName} 
        submitting={submitting} 
      />
    </div>
  )
}
