import React, { useState } from 'react'
import Modal from '../components/modal/Modal'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import Button from '../components/button/Button'
import { statusFormOptions } from '../utils/enums'

export default function SubDepartmentModal({ isOpen, onClose, onSubmit, submitting, departments = [] }) {
  const [subName, setSubName] = useState('')
  const [deptId, setDeptId] = useState('')
  const [subStatus, setSubStatus] = useState(0)

  const handleCreate = async () => {
    const success = await onSubmit({
      SubDepartmentName: subName,
      DepartmentID: Number(deptId) || 0,
      Status: Number(subStatus),
    })
    if (success) {
      setSubName('')
      setDeptId('')
      setSubStatus(0)
    }
  }

  const deptOptions = (Array.isArray(departments) ? departments : []).map(d => ({
    value: d.DepartmentID,
    label: d.DepartmentName,
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Sub-department" subtitle="Create a new sub-department">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Sub-department name" value={subName} onChange={(e) => setSubName(e.target.value)} />
        <label style={{ fontSize: 13 }}>Department</label>
        <Select options={deptOptions} value={deptId} onChange={(v) => setDeptId(Number(v))} />
        <label style={{ fontSize: 13 }}>Status</label>
        <Select options={statusFormOptions} value={subStatus} onChange={(v) => setSubStatus(Number(v))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleCreate} disabled={submitting || !subName || !deptId}>Create</Button>
      </div>
    </Modal>
  )
}
