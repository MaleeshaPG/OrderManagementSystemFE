import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import Modal from '../../components/modal/Modal'

vi.mock('../../components/icon/IconComp', () => ({
  default: ({ name }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} title="Modal Title">Modal Content</Modal>)
    expect(screen.queryByText('Modal Title')).not.toBeInTheDocument()
  })

  it('renders title, subtitle, and body when isOpen is true', () => {
    render(
      <Modal isOpen={true} title="Modal Title" subtitle="Modal Subtitle">
        Modal Body Content
      </Modal>
    )
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Modal Body Content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<Modal isOpen={true} title="Modal Title" onClose={handleClose}>Body</Modal>)
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(<Modal isOpen={true} title="Modal Title" onClose={handleClose}>Body</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledOnce()
  })
})
