import React, { useState } from 'react'
import Modal from '../components/modal/Modal'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import Button from '../components/button/Button'
import { statusFormOptions } from '../utils/enums'

export default function SupplierModal({ isOpen, onClose, onSubmit, submitting }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [supStatus, setSupStatus] = useState(0)

  const handleCreate = async () => {
    const success = await onSubmit({
      SupplierName: name,
      Address: address,
      TelNo: tel,
      Email: email,
      Status: Number(supStatus),
    })
    if (success) {
      setName('')
      setAddress('')
      setTel('')
      setEmail('')
      setSupStatus(0)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Supplier" subtitle="Create a new supplier">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Supplier name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Phone" value={tel} onChange={(e) => setTel(e.target.value)} />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label style={{ fontSize: 13 }}>Status</label>
        <Select options={statusFormOptions} value={supStatus} onChange={(v) => setSupStatus(Number(v))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleCreate} disabled={submitting || !name}>Create</Button>
      </div>
    </Modal>
  )
}
