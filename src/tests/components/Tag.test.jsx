import { describe, it, expect } from 'vitest'
import { render, screen } from '../test-utils'
import Tag from '../../components/tag/Tag'

describe('Tag', () => {
  it('renders the children text', () => {
    render(<Tag>Active</Tag>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders as a <span> element', () => {
    render(<Tag>Label</Tag>)
    const el = screen.getByText('Label')
    expect(el.tagName).toBe('SPAN')
  })

  it('applies the "tag" class', () => {
    render(<Tag>Test</Tag>)
    expect(screen.getByText('Test')).toHaveClass('tag')
  })

  it('renders "Active" with success variant', () => {
    render(<Tag variant="success" outline>Active</Tag>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders "Inactive" with warning variant', () => {
    render(<Tag variant="warning" outline>Inactive</Tag>)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('renders with danger variant', () => {
    render(<Tag variant="danger">Deleted</Tag>)
    expect(screen.getByText('Deleted')).toBeInTheDocument()
  })

  it('forwards additional props to the span', () => {
    render(<Tag data-testid="my-tag">Test</Tag>)
    expect(screen.getByTestId('my-tag')).toBeInTheDocument()
  })

  it('applies custom style via the style prop', () => {
    render(<Tag style={{ fontSize: '20px' }}>Big</Tag>)
    const el = screen.getByText('Big')
    // Inline styles are applied directly on the element
    expect(el.style.fontSize).toBe('20px')
  })
})
