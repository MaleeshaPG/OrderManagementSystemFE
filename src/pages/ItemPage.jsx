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
import { createItem, updateItem, deleteItem } from '../services/itemService'
import { baseUnitOptions, unitOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'
import ItemModal from '../modals/ItemModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'

const itemColumns = (onEdit, onDelete) => [
  { key: 'itemId', label: 'ID', render: (r) => r.ItemID ?? r.itemID ?? r.id ?? '' },
  { key: 'name', label: 'Item', render: (r) => r.ItemName ?? r.itemName ?? r.name ?? '' },
  { key: 'subDepartmentId', label: 'SubDepartment', render: (r) => r.SubDepartmentID ?? r.subDepartmentID ?? '' },
  { key: 'price', label: 'Price', render: (r) => typeof r.SellingPrice === 'number' ? `$${r.SellingPrice.toFixed(2)}` : r.SellingPrice ?? '' },
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

export default function ItemPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { data: items, loading, error, refresh } = useApiResource('/item', [])
  const { data: subdepartments } = useApiResource('/subdepartment', [])
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : []
    return list.filter((item) => {
      const name = (item.ItemName ?? item.itemName ?? item.name ?? '').toLowerCase()
      const searchMatch = name.includes(search.toLowerCase())
      return searchMatch
    })
  }, [items, search])

  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      await createItem(formData)
      setOpen(false)
      refresh()
      notification.success('Item created successfully.')
      return true
    } catch (e) {
      notification.error(e.message || 'Failed to create item.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
      return false
    } finally { setSubmitting(false) }
  }

  const handleEditSave = async (updated) => {
    setSubmitting(true)
    try {
      await updateItem(updated.ItemID ?? updated.id, {
        ItemName: updated.ItemName,
        SellingPrice: Number(updated.SellingPrice) || 0,
        BaseUnit: Number(updated.BaseUnit),
        Unit: Number(updated.Unit),
        BaseUnitToUnitConversion: Number(updated.BaseUnitToUnitConversion) || 1,
        SubDepartmentID: Number(updated.SubDepartmentID) || 0,
        OrderGroupID: Number(updated.OrderGroupID) || 0,
        Status: Number(updated.Status) || 0,
      })
      setEditOpen(false)
      setEditing(null)
      refresh()
      notification.success('Item updated successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to update item.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteItem(deleting.ItemID ?? deleting.id)
      setDeleteConfirmOpen(false)
      setDeleting(null)
      refresh()
      notification.success('Item deleted successfully.')
    } catch (e) {
      notification.error(e.message || 'Failed to delete item.')
      window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Items" subtitle="Manage item catalog and pricing." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: '1 1 300px', width: '100%', maxWidth: 720, minWidth: 0, boxSizing: 'border-box' }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search item name" />
            <Select value={categoryFilter} onChange={setCategoryFilter} options={[]} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Item</Button>
        </div>
        {loading && <div>Loading items...</div>}
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Table columns={itemColumns((r) => { setEditing({ ...r }); setEditOpen(true) }, (r) => { setDeleting({ ...r }); setDeleteConfirmOpen(true) })} data={filteredItems} />
      </Card>

      <ItemModal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        onSubmit={handleCreate} 
        submitting={submitting}
        subdepartments={subdepartments}
      />

      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.ItemName}` : 'Edit Item'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Item name" value={editing.ItemName ?? ''} onChange={(e) => setEditing({ ...editing, ItemName: e.target.value })} />
            <Input label="Selling price" value={editing.SellingPrice ?? ''} onChange={(e) => setEditing({ ...editing, SellingPrice: e.target.value })} />
            <label style={{ fontSize: 13 }}>Base unit</label>
            <Select options={baseUnitOptions} value={editing.BaseUnit} onChange={(v) => setEditing({ ...editing, BaseUnit: Number(v) })} />
            <label style={{ fontSize: 13 }}>Unit</label>
            <Select options={unitOptions} value={editing.Unit} onChange={(v) => setEditing({ ...editing, Unit: Number(v) })} />
            <Input label="BaseUnit to Unit conversion" value={editing.BaseUnitToUnitConversion ?? 1} onChange={(e) => setEditing({ ...editing, BaseUnitToUnitConversion: e.target.value })} />
            <label style={{ fontSize: 13 }}>Sub-department</label>
            <Select options={(Array.isArray(subdepartments) ? subdepartments : []).map(s => ({ value: s.SubDepartmentID, label: s.SubDepartmentName }))} value={editing.SubDepartmentID ?? ''} onChange={(v) => setEditing({ ...editing, SubDepartmentID: Number(v) })} />
            <Input label="Order group ID" value={editing.OrderGroupID ?? 0} onChange={(e) => setEditing({ ...editing, OrderGroupID: Number(e.target.value) })} />

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
        itemName={deleting?.ItemName} 
        submitting={submitting} 
      />
    </div>
  )
}

