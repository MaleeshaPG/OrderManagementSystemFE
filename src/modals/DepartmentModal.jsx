import React, { useState } from 'react'
import Modal from '../components/modal/Modal'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import Button from '../components/button/Button'
import { departmentStatusFormOptions } from '../utils/enums'

export default function DepartmentModal({ isOpen, onClose, onSubmit, submitting }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState(0)

  const handleCreate = async () => {
    const success = await onSubmit({ DepartmentName: name, Status: Number(status) })
    if (success) {
      setName('')
      setStatus(0)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Department" subtitle="Create a new department">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Department name" value={name} onChange={(e) => setName(e.target.value)} />
        <label style={{ fontSize: 13 }}>Status</label>
        <Select options={departmentStatusFormOptions} value={status} onChange={(v) => setStatus(Number(v))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleCreate} disabled={submitting || !name}>Create</Button>
      </div>
    </Modal>
  )
}
