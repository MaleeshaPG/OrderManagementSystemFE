import React from 'react'
import Modal from '../components/modal/Modal'
import Button from '../components/button/Button'

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, submitting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm delete" subtitle="This action cannot be undone.">
      <div>Are you sure you want to delete <strong>{itemName}</strong>?</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={submitting}>Delete</Button>
      </div>
    </Modal>
  )
}
