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
import { createStore, updateStore, deleteStore } from '../services/storeService'
import { storeRegionOptions, statusFormOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'
import StoreModal from '../modals/StoreModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'

const storeColumns = (onEdit, onDelete) => [
  { key: 'storeId', label: 'ID', render: (r) => r.StoreID ?? r.storeID ?? r.id ?? '' },
  { key: 'name', label: 'Store', render: (r) => r.StoreName ?? r.storeName ?? r.name ?? '' },
  { key: 'address', label: 'Address', render: (r) => r.Address ?? r.address ?? '' },
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

export default function StorePage() {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const { data: stores, loading, error, refresh } = useApiResource('/store', [])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const filteredStores = useMemo(() => {
    const list = Array.isArray(stores) ? stores : []
    return list.filter((item) => {
      const name = (item.StoreName ?? item.storeName ?? item.name ?? '').toLowerCase()
      const regionMatch = regionFilter === 'all' 
      const searchMatch = name.includes(search.toLowerCase()) || (String(item.TelNo ?? item.Email ?? '').toLowerCase().includes(search.toLowerCase()))
      return searchMatch && regionMatch
    })
  }, [stores, search, regionFilter])

  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      await createStore(formData)
      setOpen(false)
      refresh()
      notification.success('Store created successfully.')
      return true
    } catch (e) {
      notification.error(e.message || 'Failed to create store.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
      return false
    } finally { setSubmitting(false) }
  }

  const handleEditSave = async (updated) => {
    setSubmitting(true)
    try {
      await updateStore(updated.StoreID ?? updated.id, { StoreName: updated.StoreName, Address: updated.Address, TelNo: updated.TelNo, Email: updated.Email, Status: Number(updated.Status) })
      setEditOpen(false)
      setEditing(null)
      refresh()
      notification.success('Store updated successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to update store.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteStore(deleting.StoreID ?? deleting.id)
      setDeleteConfirmOpen(false)
      setDeleting(null)
      refresh()
      notification.success('Store deleted successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to delete store.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Stores" subtitle="Manage store locations and managers." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%', maxWidth: 720 }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search store" />
            <Select value={regionFilter} onChange={setRegionFilter} options={storeRegionOptions} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Store</Button>
        </div>
        {loading && <div>Loading stores...</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Table columns={storeColumns((r) => { setEditing({ ...r }); setEditOpen(true) }, (r) => { setDeleting({ ...r }); setDeleteConfirmOpen(true) })} data={filteredStores} />
      </Card>

      <StoreModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleCreate} 
        submitting={submitting} 
      />

      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.StoreName}` : 'Edit Store'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Store name" value={editing.StoreName ?? ''} onChange={(e) => setEditing({ ...editing, StoreName: e.target.value })} />
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
        itemName={deleting?.StoreName} 
        submitting={submitting} 
      />
    </div>
  )
}

