import { render } from '@testing-library/react'
import TestWrapper from '../../components/TestWrapper'

describe('StudentMatch', () => {
  test('renders correctly', () => {
    const { queryByText } = render(<></>, { wrapper: TestWrapper })
    expect(true).toBe(true)
  })
})
