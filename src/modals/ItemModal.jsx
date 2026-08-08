import React, { useState } from 'react'
import Modal from '../components/modal/Modal'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import Button from '../components/button/Button'
import { baseUnitOptions, unitOptions } from '../utils/enums'

export default function ItemModal({ isOpen, onClose, onSubmit, submitting, subdepartments = [] }) {
  const [itemName, setItemName] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [baseUnit, setBaseUnit] = useState(11)
  const [unit, setUnit] = useState(0)
  const [conversion, setConversion] = useState(1)
  const [subDeptId, setSubDeptId] = useState(null)
  const [orderGroupId, setOrderGroupId] = useState(0)

  const handleCreate = async () => {
    const success = await onSubmit({
      ItemName: itemName,
      BaseUnit: Number(baseUnit),
      Unit: Number(unit),
      SellingPrice: Number(sellingPrice) || 0,
      BaseUnitToUnitConversion: Number(conversion) || 1,
      Status: 0,
      SubDepartmentID: Number(subDeptId) || 0,
      OrderGroupID: Number(orderGroupId) || 0,
    })
    if (success) {
      setItemName('')
      setSellingPrice('')
      setSubDeptId(null)
      setOrderGroupId(0)
    }
  }

  const subDeptOptions = (Array.isArray(subdepartments) ? subdepartments : []).map(s => ({
    value: s.SubDepartmentID,
    label: s.SubDepartmentName,
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Item" subtitle="Create a new item">
      <div style={{ display: 'grid', gap: 12 }}>
        <Input label="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <Input label="Selling price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
        <label style={{ fontSize: 13 }}>Base unit</label>
        <Select options={baseUnitOptions} value={baseUnit} onChange={(v) => setBaseUnit(Number(v))} />
        <label style={{ fontSize: 13 }}>Unit</label>
        <Select options={unitOptions} value={unit} onChange={(v) => setUnit(Number(v))} />
        <Input label="BaseUnit to Unit conversion" value={conversion} onChange={(e) => setConversion(e.target.value)} />
        <label style={{ fontSize: 13 }}>Sub-department</label>
        <Select options={subDeptOptions} value={subDeptId} onChange={(v) => setSubDeptId(Number(v))} />
        <Input label="Order group ID" value={orderGroupId} onChange={(e) => setOrderGroupId(Number(e.target.value))} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleCreate} disabled={submitting || !itemName}>Create</Button>
      </div>
    </Modal>
  )
}
