import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import Input from '../../components/input/Input'


vi.mock('../../components/icon/IconComp', () => ({
  default: ({ name }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

describe('Input', () => {
  it('renders the label text', () => {
    render(<Input label="Email address" value="" onChange={() => {}} />)
    expect(screen.getByText('Email address')).toBeInTheDocument()
  })

  it('associates the label with the input for accessibility', () => {
    render(<Input label="Username" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('calls onChange when the user types', () => {
    const handleChange = vi.fn()
    render(<Input label="Search" value="" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: 'hello' },
    })
    expect(handleChange).toHaveBeenCalledOnce()
  })

  it('renders the placeholder text', () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  it('shows an error icon when the error prop is set', () => {
    render(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        error="This field is required"
      />,
    )
    expect(screen.getByTestId('icon-AlertTriangle')).toBeInTheDocument()
  })

  it('shows the error message text below the field', () => {
    render(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email format"
      />,
    )
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
  })

  it('renders a textarea when type="textarea"', () => {
    render(<Input label="Notes" value="" onChange={() => {}} type="textarea" />)
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement)
  })
})
