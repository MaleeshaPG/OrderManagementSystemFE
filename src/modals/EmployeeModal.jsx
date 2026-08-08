import React, { useState } from 'react'
import Modal from '../components/modal/Modal'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import Button from '../components/button/Button'
import { statusFormOptions } from '../utils/enums'

export default function EmployeeModal({ isOpen, onClose, onSubmit, submitting }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [telNo, setTelNo] = useState('')
  const [email, setEmail] = useState('')
  const [empStatus, setEmpStatus] = useState(0)

  const handleCreate = async () => {
    const success = await onSubmit({
      FirstName: firstName,
      LastName: lastName,
      TelNo: telNo,
      Email: email,
      Status: Number(empStatus),
    })
    if (success) {
      setFirstName('')
      setLastName('')
      setTelNo('')
      setEmail('')
      setEmpStatus(0)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Employee" subtitle="Create a new employee">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <Input label="Phone" value={telNo} onChange={(e) => setTelNo(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label style={{ fontSize: 13 }}>Status</label>
        <Select options={statusFormOptions} value={empStatus} onChange={(v) => setEmpStatus(Number(v))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleCreate} disabled={submitting || !firstName || !lastName || !email}>Create</Button>
      </div>
    </Modal>
  )
}
