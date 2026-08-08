import { describe, it, expect } from 'vitest'
import { render, screen } from '../test-utils'
import Card from '../../components/card/Card'

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card Body Content</Card>)
    expect(screen.getByText('Card Body Content')).toBeInTheDocument()
  })

  it('renders title and subtitle when supplied', () => {
    render(<Card title="Test Title" subtitle="Test Subtitle">Content</Card>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('renders actions and footer when supplied', () => {
    render(
      <Card
        title="Header"
        actions={<button>Action Button</button>}
        footer={<div>Footer Content</div>}
      >
        Body
      </Card>
    )
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })
})
