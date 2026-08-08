import React, { useMemo, useState } from 'react'
import PageHeader from '../components/pageheader/PageHeader'
import Card from '../components/card/Card'
import Input from '../components/input/Input'
import Button from '../components/button/Button'
import Select from '../components/select/Select'
import Table from '../components/table/Table'
import usePaginatedResource from '../hooks/usePaginatedResource'
import { useNotification } from '../providers/NotificationProvider'
import Modal from '../components/modal/Modal'
import SideSheet from '../components/sidesheet/SideSheet'
import { createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService'
import { statusFilterOptions, statusFormOptions } from '../utils/enums'
import Tag from '../components/tag/Tag'

const employeeColumns = (onEdit, onDelete) => [
  {
    key: 'employeeId',
    label: 'ID',
    render: (r) => r.EmployeeID ?? r.employeeID ?? r.id ?? '',
  },
  {
    key: 'fullName',
    label: 'Employee',
    render: (r) => {
      if (!r) return ''
      const full = r.FullName ?? r.fullName ?? r.fullname ?? r.full_name ?? r.name ?? r.Name
      if (full && String(full).trim()) return String(full).trim()
      const first = r.FirstName ?? r.firstName ?? r.firstname ?? r.first ?? ''
      const last = r.LastName ?? r.lastName ?? r.lastname ?? r.last ?? ''
      const joined = `${first} ${last}`.trim()
      if (joined) return joined
      return r.Email ?? r.email ?? ''
    },
  },
  { key: 'tel', label: 'Phone', render: (r) => r.TelNo ?? r.telNo ?? r.tel ?? '' },
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

export default function EmployeePage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const paginated = usePaginatedResource('/employee', 1, 10)
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [telNo, setTelNo] = useState('')
  const [email, setEmail] = useState('')
  const [empStatus, setEmpStatus] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const notification = useNotification()

  const filteredEmployees = useMemo(() => {
    const list = Array.isArray(paginated.data) ? paginated.data : []
    return list.filter((item) => {
      const name = (item.FullName ?? `${item.FirstName ?? ''} ${item.LastName ?? ''}`).toLowerCase()
      const emailVal = (item.Email ?? item.email ?? '').toLowerCase()
      const status = (String(item.Status ?? '')).toLowerCase()
      const searchMatch = name.includes(search.toLowerCase()) || emailVal.includes(search.toLowerCase())
      const statusMatch = statusFilter === 'all' || status === statusFilter
      return searchMatch && statusMatch
    })
  }, [paginated.data, search, statusFilter])

  return (
    <div style={{ minHeight: '100%', display: 'grid', gap: 20 }}>
      <PageHeader title="Employees" subtitle="View and manage employee records." />
      <Card style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: '1 1 300px', width: '100%', maxWidth: 720, minWidth: 0, boxSizing: 'border-box' }}>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees or email" />
            <Select value={statusFilter} onChange={setStatusFilter} options={statusFilterOptions} />
          </div>
          <Button variant="primary" onClick={() => setOpen(true)}>Add Employee</Button>
        </div>
        {paginated.loading && <div>Loading employees...</div>}
        {paginated.error && <div style={{ color: 'var(--danger)' }}>{paginated.error}</div>}
        <Table
          columns={employeeColumns((r) => { setEditing({ ...r }); setEditOpen(true) }, (r) => { setDeleting({ ...r }); setDeleteConfirmOpen(true) })}
          data={filteredEmployees}
          serverSide
          serverPage={paginated.page}
          serverPageSize={paginated.pageSize}
          serverTotal={paginated.total}
          onPageChange={(p) => paginated.setPage(p)}
          onPageSizeChange={(s) => paginated.setPageSize(s)}
        />
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Employee" subtitle="Create a new employee">
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Phone" value={telNo} onChange={(e) => setTelNo(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label style={{ fontSize: 13 }}>Status</label>
           <Select options={statusFormOptions} value={empStatus} onChange={(v) => setEmpStatus(Number(v))} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={async () => {
            setSubmitting(true)
            try {
              await createEmployee({ FirstName: firstName, LastName: lastName, TelNo: telNo, Email: email, Status: Number(empStatus) })
              setOpen(false)
              setFirstName('')
              setLastName('')
              setTelNo('')
              setEmail('')
              setEmpStatus(0)
              paginated.refresh()
              notification.success('Employee created successfully.')
            } catch (e) {
              notification.error(e.message || 'Failed to create employee.')
              window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
            } finally { setSubmitting(false) }
          }} disabled={submitting || !firstName || !lastName || !email}>Create</Button>
        </div>
      </Modal>
      <SideSheet open={editOpen} onClose={() => setEditOpen(false)} title={editing ? `Edit ${editing.FullName ?? editing.Email}` : 'Edit Employee'}>
        {editing ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="First name" value={editing.FirstName ?? ''} onChange={(e) => setEditing({ ...editing, FirstName: e.target.value })} />
            <Input label="Last name" value={editing.LastName ?? ''} onChange={(e) => setEditing({ ...editing, LastName: e.target.value })} />
            <Input label="Phone" value={editing.TelNo ?? ''} onChange={(e) => setEditing({ ...editing, TelNo: e.target.value })} />
            <Input label="Email" value={editing.Email ?? ''} onChange={(e) => setEditing({ ...editing, Email: e.target.value })} />
            <label style={{ fontSize: 13 }}>Status</label>
             <Select options={statusFormOptions} value={editing.Status ?? 0} onChange={(v) => setEditing({ ...editing, Status: Number(v) })} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={async () => {
                setSubmitting(true)
                try {
                  await updateEmployee(editing.EmployeeID ?? editing.employeeID ?? editing.id, {
                    FirstName: editing.FirstName,
                    LastName: editing.LastName,
                    TelNo: editing.TelNo,
                    Email: editing.Email,
                    Status: Number(editing.Status),
                  })
                  setEditOpen(false)
                  setEditing(null)
                  paginated.refresh()
                  notification.success('Employee updated successfully.')
                } catch (e) {
                  notification.error(e.message || 'Failed to update employee.')
                  window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
                } finally { setSubmitting(false) }
              }} disabled={submitting}>Save</Button>
            </div>
          </div>
        ) : null}
      </SideSheet>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm delete" subtitle="This action cannot be undone.">
        <div>Are you sure you want to delete <strong>{deleting?.FullName ?? deleting?.Email}</strong>?</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={async () => {
            setSubmitting(true)
            try {
              await deleteEmployee(deleting.EmployeeID ?? deleting.employeeID ?? deleting.id)
              setDeleteConfirmOpen(false)
              setDeleting(null)
              paginated.refresh()
            } catch (e) {
              window.dispatchEvent(new CustomEvent('api.error', { detail: { message: e.message } }))
            } finally { setSubmitting(false) }
          }} disabled={submitting}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
