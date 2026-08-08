import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import Button from '../../components/button/Button'

vi.mock('../../components/icon/IconComp', () => ({
  default: ({ name }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('is disabled and shows a loader when loading=true', () => {
    render(<Button loading>Submitting</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(screen.getByTestId('icon-Loader')).toBeInTheDocument()
  })

  it('renders with an aria-label when ariaLabel is supplied', () => {
    render(<Button ariaLabel="Delete item" icon="Trash" iconOnly />)
    expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument()
  })

  it('applies the correct type attribute', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
